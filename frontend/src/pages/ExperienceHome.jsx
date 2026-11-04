import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import '../styles/experience-home.css';

const MEDIA = Object.freeze({
  hero: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=88',
  grandTour: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=2000&q=86',
  suv: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
  sedan: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=85',
  hatchback: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85',
});

const CATEGORIES = [
  { label: 'SUV', image: MEDIA.suv, descriptor: 'Adventure, refined.', index: '01' },
  { label: 'Sedan', image: MEDIA.sedan, descriptor: 'Elegance in motion.', index: '02' },
  { label: 'Hatchback', image: MEDIA.hatchback, descriptor: 'Made for the city.', index: '03' },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener?.('change', sync);
    return () => query.removeEventListener?.('change', sync);
  }, []);
  return reduced;
}

function ExperienceNavigation() {
  const [open, setOpen] = useState(false);
  return <header className="xp-nav">
    <Link className="xp-wordmark" to="/" aria-label="AutoAI India home">AUTOAI<span>INDIA</span></Link>
    <nav className={`xp-nav-links ${open ? 'xp-nav-links-open' : ''}`} aria-label="Main navigation">
      <Link to="/cars" onClick={() => setOpen(false)}>Explore cars</Link>
      <Link to="/compare" onClick={() => setOpen(false)}>Compare</Link>
      <Link to="/recommend" onClick={() => setOpen(false)}>Discover your car</Link>
      <Link to="/about" onClick={() => setOpen(false)}>Our story</Link>
    </nav>
    <Link className="xp-nav-action" to="/recommend">Find your drive <ArrowUpRight size={16}/></Link>
    <button className="xp-menu" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X/> : <Menu/>}</button>
  </header>;
}

function Reveal({ children, className = '', ...props }) {
  return <div className={`xp-reveal ${className}`} data-xp-reveal {...props}>{children}</div>;
}

export default function ExperienceHome() {
  const root = useRef(null);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const nodes = el.querySelectorAll('[data-xp-reveal]');
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((node) => node.classList.add('xp-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { target.classList.add('xp-visible'); observer.unobserve(target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return undefined;
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); if (frame) window.cancelAnimationFrame(frame); };
  }, [reduced]);

  return <div className="xp-root" ref={root} data-testid="experience-home">
    <ExperienceNavigation/>
    <div className="xp-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }}/></div>

    <section className="xp-hero" aria-labelledby="xp-hero-heading" data-testid="hero-section">
      <div className="xp-hero-media" role="img" aria-label="Luxury sports car in an atmospheric landscape" style={{ backgroundImage: `url("${MEDIA.hero}")` }}/>
      <div className="xp-hero-vignette"/>
      <div className="xp-hero-topline"><span>AUTOAI INDIA</span><span>THE ART OF CHOOSING</span></div>
      <div className="xp-hero-bottom">
        <div className="xp-hero-copy"><span className="xp-kicker">AN EXTRAORDINARY WAY TO DISCOVER CARS</span><h1 id="xp-hero-heading">Feel the<br/><em>difference.</em></h1><p>Every great drive starts with a choice. Make yours extraordinary.</p>
          <Link to="/cars" className="xp-pill xp-pill-light">Explore the collection <ArrowUpRight size={18}/></Link>
        </div>
        <a className="xp-scroll-cue" href="#xp-philosophy" aria-label="Scroll to discover more"><span>SCROLL TO EXPLORE</span><ArrowDown size={20}/></a>
      </div>
      <span className="xp-hero-index">01 / 04</span>
    </section>

    <section className="xp-manifesto" id="xp-philosophy" aria-label="Our philosophy">
      <Reveal className="xp-manifesto-inner">
        <span className="xp-kicker">THE EXPERIENCE / 01</span>
        <h2>Not just a car.<br/><span>A feeling.</span></h2>
        <p>Design. Performance. Purpose. Find the car that moves you — with independent insight that brings every detail into focus.</p>
        <Link to="/recommend" className="xp-text-link">Discover your perfect match <ArrowUpRight size={19}/></Link>
      </Reveal>
      <span className="xp-side-note" aria-hidden="true">AUTOAI INDIA / REIMAGINING DISCOVERY</span>
    </section>

    <section className="xp-feature" aria-labelledby="xp-feature-heading">
      <div className="xp-feature-image" role="img" aria-label="Performance vehicle photographed on the road" style={{ backgroundImage: `url("${MEDIA.grandTour}")` }}/>
      <div className="xp-feature-shade"/>
      <Reveal className="xp-feature-content"><span className="xp-kicker">THE CLARITY TO CHOOSE / 02</span><h2 id="xp-feature-heading">Every angle.<br/>Every detail.</h2><p>Compare the cars you love. Discover what matters beyond the first impression.</p><Link className="xp-pill xp-pill-light" to="/compare">Compare cars <ArrowUpRight size={18}/></Link></Reveal>
      <span className="xp-feature-number" aria-hidden="true">02</span>
    </section>

    <section className="xp-categories" aria-labelledby="xp-categories-heading" data-testid="features-section">
      <Reveal className="xp-categories-head"><div><span className="xp-kicker">THE COLLECTION / 03</span><h2 id="xp-categories-heading">Find your<br/><em>kind of drive.</em></h2></div><p>From city streets to open roads. Discover the body style that feels right for you.</p></Reveal>
      <div className="xp-category-grid">
        {CATEGORIES.map((category) => <Reveal className="xp-category-wrap" key={category.label}>
          <Link to="/cars" className="xp-category" aria-label={`Explore ${category.label} cars`}>
            <span className="xp-category-photo"><img src={category.image} alt={`${category.label} car`} loading="lazy" decoding="async"/></span>
            <span className="xp-category-info"><span><small>{category.index} / {category.descriptor}</small><strong>{category.label}</strong></span><ArrowUpRight size={25}/></span>
          </Link>
        </Reveal>)}
      </div>
      <Link to="/cars" className="xp-collection-link">Explore all cars <ArrowRight size={20}/></Link>
    </section>

    <section className="xp-closing" aria-labelledby="xp-closing-heading">
      <Reveal><span className="xp-kicker">YOUR JOURNEY / 04</span><h2 id="xp-closing-heading">The road is yours.</h2><p>Less uncertainty. More confidence. Your next car, chosen with intelligence.</p><Link className="xp-pill xp-pill-dark" to="/recommend">Find my next car <ArrowUpRight size={18}/></Link></Reveal>
    </section>

    <footer className="xp-footer"><Link className="xp-wordmark" to="/">AUTOAI<span>INDIA</span></Link><span>Independent intelligence for every drive.</span><nav aria-label="Footer links"><Link to="/cars">Cars</Link><Link to="/compare">Compare</Link><Link to="/recommend">AI advisor</Link><Link to="/about">About</Link></nav><small>© {new Date().getFullYear()} AutoAI India</small></footer>
  </div>;
}
