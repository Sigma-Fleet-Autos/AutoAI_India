import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BrainCircuit, Calculator, GitCompareArrows, ShieldCheck, Sparkles, Menu, X } from "lucide-react";
import { api, formatINR } from "../lib/api";
import CarVisual from "../components/CarVisual";
import "../styles/home-cinematic.css";

const HERO_IMAGE = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=85";
const CATEGORY_IMAGES = [
  { label: "SUV", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=850&q=80" },
  { label: "Sedan", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=850&q=80" },
  { label: "Hatchback", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=850&q=80" },
  { label: "Electric", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=850&q=80" },
];

export function CinematicHeader() {
 const [menuOpen, setMenuOpen] = useState(false);
 return <header className="cin-header"><div className="cin-container cin-header-inner"><Link to="/" className="cin-brand"><span className="cin-brand-name">AutoAI <small>INDIA</small></span></Link><nav className={`cin-main-nav${menuOpen ? " cin-main-nav-open" : ""}`} aria-label="Primary navigation"><Link to="/cars">Cars</Link><Link to="/compare">Compare</Link><Link to="/recommend">Recommend</Link><Link to="/emi">Ownership</Link></nav><div className="cin-header-actions"><Link className="cin-header-cta" to="/recommend">Get started <ArrowUpRight size={15}/></Link></div><button className="cin-mobile-toggle" type="button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23}/> : <Menu size={23}/>}</button></div></header>;
}

function SectionHeading({ eyebrow, title, description }) {
  return <div className="cin-section-heading"><span className="cin-eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

export default function Home() {
  const [cars, setCars] = useState([]);
  const [carsStatus, setCarsStatus] = useState("loading");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    api.get("/cars").then(({ data }) => {
      if (!active) return;
      setCars(Array.isArray(data) ? data.slice(0, 6) : []);
      setCarsStatus("ready");
    }).catch(() => { if (active) setCarsStatus("error"); });
    return () => { active = false; };
  }, [retryKey]);

  return <div className="cin-home" id="home-content">
    <CinematicHeader />
    <section className="cin-hero" aria-labelledby="cin-hero-title" data-testid="hero-section">
      <div className="cin-hero-image" style={{ backgroundImage: `url("${HERO_IMAGE}")` }} role="img" aria-label="Performance sedan photographed on an open road" />
      <div className="cin-hero-shade" />
      <div className="cin-hero-content cin-container">
        <span className="cin-eyebrow">A NEW STANDARD IN CAR BUYING</span>
        <h1 id="cin-hero-title">The True Verdict<br />for <strong>Every Car</strong><br />in India.</h1>
        <p>Independent insights. Intelligent comparisons. Confident decisions.<br/>Discover the right car for the roads ahead.</p>
        <div className="cin-actions">
          <Link className="cin-btn cin-btn-light" to="/cars" data-testid="hero-cta-cars">Explore cars <ArrowRight size={18}/></Link>
          <Link className="cin-btn cin-btn-outline" to="/recommend" data-testid="hero-cta-recommend">Ask AutoAI <ArrowUpRight size={18}/></Link>
        </div>
      </div>
      
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
      <div className="cin-editorial-photo" role="img" aria-label="Performance car photographed in natural evening light" />
      <div className="cin-editorial-content"><span className="cin-eyebrow">02 / THE CLARITY TO CHOOSE</span><h2>Every detail.<br />Side by side.</h2><p>Compare specifications, safety, practicality and ownership costs. Understand the trade-offs before you commit.</p><Link className="cin-btn cin-btn-light" to="/compare" data-testid="hero-cta-compare">Compare cars <ArrowRight size={18}/></Link></div>
    </div></section>

    <section className="cin-section cin-container" data-testid="trending-section">
      <SectionHeading eyebrow="03 / VEHICLE DISCOVERY" title="Cars worth considering." description="Explore vehicles from the AutoAI India catalogue." />
      {carsStatus === "loading" && <div className="cin-state" role="status">Loading vehicles…</div>}
      {carsStatus === "error" && <div className="cin-state cin-state-recovery" role="status"><div><strong>Our vehicle catalogue could not be loaded.</strong><p>Check back shortly, or retry the connection. You can still explore car comparisons and personalised recommendations.</p></div><div className="cin-state-actions"><button type="button" onClick={() => { setCarsStatus("loading"); setRetryKey(k => k + 1); }}>Retry loading</button><Link to="/compare">Compare cars <ArrowUpRight size={16}/></Link></div></div>}
      {carsStatus === "ready" && (cars.length ? <div className="cin-cars-grid">{cars.map(car => <article className="cin-vehicle" key={car.id} data-testid={`car-card-${car.id}`}><div className="cin-vehicle-photo"><CarVisual car={car} className="w-full h-full" /></div><div className="cin-vehicle-details"><span className="cin-eyebrow">{car.brand} / {car.segment}</span><h3>{car.model}</h3><p>{car.variant}</p><div className="cin-vehicle-bottom"><span>{formatINR(car.price_ex_showroom)} <small>ex-showroom</small></span><Link to={`/showroom/${car.id}`} aria-label={`Explore ${car.brand} ${car.model}`}><ArrowUpRight size={20}/></Link></div></div></article>)}</div> : <div className="cin-state">No vehicles are available yet. <Link to="/cars">Explore all cars</Link>.</div>)}
    </section>

    <section className="cin-advisor" data-testid="advisor-section"><div className="cin-container cin-advisor-inner"><span className="cin-eyebrow">04 / AUTOAI INTELLIGENCE</span><h2>Your next car.<br /><span>A smarter decision.</span></h2><p>Tell AutoAI about your budget, driving habits and priorities. Get tailored suggestions and understand why each car fits.</p><Link className="cin-btn cin-btn-light" to="/recommend">Get AI recommendations <ArrowRight size={18}/></Link></div></section>
    <section className="cin-promise cin-container"><ShieldCheck size={24}/><p>Recommendations are decision-support tools. Confirm specifications, prices and availability with current sources before purchasing.</p></section>
    <footer className="cin-footer"><div className="cin-container cin-footer-inner"><div><strong>AutoAI <small>INDIA</small></strong><p>Intelligence for every drive.</p></div><nav aria-label="Footer navigation"><Link to="/cars">Cars</Link><Link to="/compare">Compare</Link><Link to="/recommend">AI advisor</Link><Link to="/about">About</Link></nav><span>© {new Date().getFullYear()} AutoAI India</span></div></footer>
  </div>;
}
