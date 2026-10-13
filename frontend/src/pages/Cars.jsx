import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { api, formatINR } from "../lib/api";
import CarVisual from "../components/CarVisual";
import { CinematicHeader } from "./Home";
import "../styles/home-cinematic.css";

export default function Cars() {
 const [cars,setCars]=useState([]);
 const [status,setStatus]=useState("loading");
 const [retry,setRetry]=useState(0);
 const [params]=useSearchParams();
 const [q,setQ]=useState("");
 const [segment,setSegment]=useState(params.get("segment")||"All");
 const [fuel,setFuel]=useState("All");
 useEffect(()=>{let active=true;api.get("/cars").then(({data})=>{if(!active)return;if(!Array.isArray(data)){setStatus("error");return;}setCars(data);setStatus("ready");}).catch(()=>{if(active)setStatus("error");});return()=>{active=false;};},[retry]);
 const segments=useMemo(()=>["All",...new Set(cars.map(c=>c.segment).filter(Boolean))],[cars]);
 const fuels=useMemo(()=>["All",...new Set(cars.map(c=>c.fuel).filter(Boolean))],[cars]);
 const filtered=cars.filter(c=>(segment==="All"||String(c.segment).toLowerCase()===segment.toLowerCase())&&(fuel==="All"||c.fuel===fuel)&&(!q||(`${c.brand} ${c.model}`).toLowerCase().includes(q.toLowerCase())));
 return <div className="cin-home cin-catalogue" data-testid="cars-page">
  <CinematicHeader/>
  <main className="cin-container cin-section">
   <span className="cin-eyebrow">AUTOAI INDIA / VEHICLE DISCOVERY</span>
   <div className="cin-catalogue-heading"><h1>Discover your <span>next car.</span></h1><p>Explore the Indian automotive market with clarity. Search, filter and compare vehicles without the sales pitch.</p></div>
   <div className="cin-filter-grid">
    <label className="cin-search-field"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search brand or model…" data-testid="cars-search-input" aria-label="Search cars"/></label>
    <select value={segment} onChange={e=>setSegment(e.target.value)} data-testid="cars-segment-filter" aria-label="Filter body style">{!segments.includes(segment)&&<option value={segment}>{segment}</option>}{segments.map(s=><option key={s}>{s}</option>)}</select>
    <select value={fuel} onChange={e=>setFuel(e.target.value)} data-testid="cars-fuel-filter" aria-label="Filter fuel type">{fuels.map(s=><option key={s}>{s}</option>)}</select>
   </div>
   <div className="cin-catalogue-count" role="status">{status==="ready" ? `${filtered.length} vehicles found` : status==="loading" ? "Loading vehicle catalogue…" : "Catalogue connection unavailable"}</div>
   {status==="error"&&<div className="cin-state cin-state-recovery"><div><strong>We couldn't connect to the vehicle catalogue.</strong><p>The service may be temporarily unavailable. Try again, or explore our comparison tools.</p></div><div className="cin-state-actions"><button type="button" onClick={()=>{setStatus("loading");setRetry(k=>k+1);}}>Retry loading</button><Link to="/compare">Compare cars <ArrowUpRight size={16}/></Link></div></div>}
   {status==="ready"&&filtered.length===0&&<div className="cin-state">{cars.length===0?"No vehicles are currently listed.":"No vehicles match your filters."} {cars.length>0&&<button className="cin-reset" onClick={()=>{setQ("");setSegment("All");setFuel("All");}}>Clear filters</button>}</div>}
   {status==="ready"&&filtered.length>0&&<div className="cin-cars-grid">{filtered.map(car=><article className="cin-vehicle" key={car.id} data-testid={`car-card-${car.id}`}><div className="cin-vehicle-photo"><CarVisual car={car} className="w-full h-full" showLabel={false}/></div><div className="cin-vehicle-details"><span className="cin-eyebrow">{car.brand} / {car.segment}</span><h3>{car.model}</h3><p>{car.variant}</p><div className="cin-vehicle-bottom"><span>{formatINR(car.price_ex_showroom)}<small>Ex-showroom</small></span><Link to={`/showroom/${car.id}`} aria-label={`Explore ${car.brand} ${car.model}`}><ArrowUpRight size={20}/></Link></div></div></article>)}</div>}
  </main>
  <footer className="cin-footer"><div className="cin-container cin-footer-inner"><div><strong>AUTOAI INDIA</strong><p>Intelligence for every drive.</p></div><nav><Link to="/">Home</Link><Link to="/compare">Compare</Link><Link to="/recommend">AI advisor</Link></nav><span>© {new Date().getFullYear()} AutoAI India</span></div></footer>
 </div>;
}
