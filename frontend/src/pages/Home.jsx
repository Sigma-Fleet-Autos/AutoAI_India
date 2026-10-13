import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BrainCircuit, Calculator, GitCompareArrows, ShieldCheck, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import CarCard from "../components/CarCard";
import "../styles/home-cinematic.css";

const HERO_IMAGE = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=85";
const CATEGORY_IMAGES = [
  { label: "SUV", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=850&q=80" },
  { label: "Sedan", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=850&q=80" },
  { label: "Hatchback", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=850&q=80" },
  { label: "Electric", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=850&q=80" },
];

function SectionHeading({ eyebrow, title, description }) {
  return <div className="cin-section-heading"><span className="cin-eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

export default function Home() {
  const [cars, setCars] = useState([]);
  const [carsStatus, setCarsStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    api.get("/cars").then(({ data }) => {
      if (!active) return;
      setCars(Array.isArray(data) ? data.slice(0, 6) : []);
      setCarsStatus("ready");
    }).catch(() => { if (active) setCarsStatus("error"); });
    return () => { active = false; };
  }, []);

  return <div className="cin-home" id="home-content">
    <section className="cin-hero" aria-labelledby="cin-hero-title" data-testid="hero-section">
      <div className="cin-hero-image" style={{ backgroundImage: `url("${HERO_IMAGE}")` }} role="img" aria-label="Sports car on a dramatic coastal road" />
      <div className="cin-hero-shade" />
      <div className="cin-hero-content cin-container">
        <span className="cin-eyebrow">AUTOAI INDIA / INTELLIGENT CAR DISCOVERY</span>
        <h1 id="cin-hero-title">THE TRUE VERDICT.<br /><span>EVERY CAR.</span></h1>
        <p>Find the car that fits your life, not somebody else's sales pitch. Discover, compare and decide with clarity.</p>
        <div className="cin-actions">
          <Link className="cin-btn cin-btn-light" to="/cars" data-testid="hero-cta-cars">Explore cars <ArrowRight size={18}/></Link>
          <Link className="cin-btn cin-btn-outline" to="/recommend" data-testid="hero-cta-recommend">Find my perfect car <ArrowUpRight size={18}/></Link>
        </div>
      </div>
      <span className="cin-hero-index">01 / DISCOVER THE DRIVE</span>
    </section>

    <section className="cin-service-band" aria-label="AutoAI services"><div className="cin-container cin-service-grid">
      <Link to="/cars"><BrainCircuit size={21}/><span>AI CAR ANALYSIS</span><ArrowUpRight size={15}/></Link>
      <Link to="/compare"><GitCompareArrows size={21}/><span>SMART COMPARISON</span><ArrowUpRight size={15}/></Link>
      <Link to="/emi"><Calculator size={21}/><span>OWNERSHIP COSTS</span><ArrowUpRight size={15}/></Link>
      <Link to="/recommend"><Sparkles size={21}/><span>PERSONAL AI ADVISOR</span><ArrowUpRight size={15}/></Link>
    </div></section>

    <section className="cin-section cin-container" data-testid="features-section">
      <SectionHeading eyebrow="01 / EXPLORE THE MARKET" title="Find your perfect car." description="Explore body styles and discover the choices that fit your priorities." />
      <div className="cin-category-grid">{CATEGORY_IMAGES.map(({ label, image }) => <Link className="cin-category" key={label} to="/cars" aria-label={`Explore ${label} cars in the catalogue`}>
        <img src={image} alt="" loading="lazy" /><span>{label}</span><ArrowUpRight size={22}/>
      </Link>)}</div>
      <div className="cin-section-action"><Link to="/cars">View all cars <ArrowRight size={17}/></Link></div>
    </section>

    <section className="cin-editorial" data-testid="comparison-section"><div className="cin-container cin-editorial-grid">
      <div className="cin-editorial-photo" role="img" aria-label="Premium car photographed in an architectural setting" />
      <div className="cin-editorial-content"><span className="cin-eyebrow">02 / INTELLIGENT COMPARISON</span><h2>Every detail.<br />Side by side.</h2><p>Compare specifications, safety, practicality and ownership costs. Understand the trade-offs before you commit.</p><Link className="cin-btn cin-btn-light" to="/compare" data-testid="hero-cta-compare">Compare cars <ArrowRight size={18}/></Link></div>
    </div></section>

    <section className="cin-section cin-container" data-testid="trending-section">
      <SectionHeading eyebrow="03 / VEHICLE DISCOVERY" title="Cars worth considering." description="Explore vehicles from the AutoAI India catalogue." />
      {carsStatus === "loading" && <div className="cin-state" role="status">Loading vehicles…</div>}
      {carsStatus === "error" && <div className="cin-state" role="status">Vehicle listings are temporarily unavailable. <Link to="/cars">Browse the catalogue</Link>.</div>}
      {carsStatus === "ready" && (cars.length ? <div className="cin-cars-grid">{cars.map(car => <CarCard key={car.id} car={car} />)}</div> : <div className="cin-state">No vehicles are available yet. <Link to="/cars">Explore all cars</Link>.</div>)}
    </section>

    <section className="cin-advisor" data-testid="advisor-section"><div className="cin-container cin-advisor-inner"><span className="cin-eyebrow">04 / AUTOAI INTELLIGENCE</span><h2>Your next car.<br /><span>A smarter decision.</span></h2><p>Tell AutoAI about your budget, driving habits and priorities. Get tailored suggestions and understand why each car fits.</p><Link className="cin-btn cin-btn-light" to="/recommend">Get AI recommendations <ArrowRight size={18}/></Link><div className="cin-advisor-mark" aria-hidden="true"><BrainCircuit size={170} strokeWidth={0.7}/></div></div></section>
    <section className="cin-promise cin-container"><ShieldCheck size={24}/><p>Recommendations are decision-support tools. Confirm specifications, prices and availability with current sources before purchasing.</p></section>
  </div>;
}
