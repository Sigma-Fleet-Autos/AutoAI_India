import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import '../styles/experience-home.css';

// Individually sourced, free-to-use photographs. Copyright licensing is documented
// in docs/PREVIEW_VEHICLE_ASSETS.md; visible brand and plate clearance is pending.
const PHOTOS = Object.freeze({
  hero: 'https://images.unsplash.com/photo-1668248835473-c2f28c752663?auto=format&fit=crop&w=2400&q=88',
  detail: 'https://images.unsplash.com/photo-1652946950814-25f52bb0ebfc?auto=format&fit=crop&w=2000&q=85',
  suv: 'https://images.unsplash.com/photo-1723306975792-f5a053a59dd3?auto=format&fit=crop&w=1100&q=82',
  sedan: 'https://images.unsplash.com/photo-1623994518372-2211dc3afb29?auto=format&fit=crop&w=1100&q=82',
  hatchback: 'https://images.unsplash.com/photo-1650029380425-7fbfbd9b2b68?auto=format&fit=crop&w=1100&q=82',
});

const BODY_STYLES = [
  { title: 'SUV', eyebrow: '01 / ADVENTURE', image: PHOTOS.suv, description: 'Mahindra Thar · Built for adventure.' },
  { title: 'Sedan', eyebrow: '02 / PRECISION', image: PHOTOS.sedan, description: 'BMW 2 Series Gran Coupé · Precision in motion.' },
  { title: 'Hatchback', eyebrow: '03 / EVERYDAY', image: PHOTOS.hatchback, description: 'Hyundai i20 · Made for the city.' },
];

function useMotionReveal(root) {
  useEffect(() => {
    const host = root.current;
    if (!host) return undefined;
    const nodes = host.querySelectorAll('[data-xp-reveal]');
    if (!window.IntersectionObserver) {
      nodes.forEach((node) => node.classList.add('xp-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add('xp-visible');
        observer.unobserve(target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -3% 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [root]);
}

function ExperienceNav() {
  const [open, setOpen] = useState(false);
  return <header className="xp-nav">
    <Link to="/" className="xp-logo" aria-label="AutoAI India home">AUTOAI<span>INDIA</span></Link>
    <nav className={`xp-links${open ? ' xp-links-open' : ''}`} aria-label="Main navigation">
      <Link to="/cars" onClick={() => setOpen(false)}>Discover</Link>
      <Link to="/compare" onClick={() => setOpen(false)}>Compare</Link>
      <Link to="/recommend" onClick={() => setOpen(false)}>AI Advisor</Link>
      <Link to="/about" onClick={() => setOpen(false)}>About</Link>
    </nav>
    <Link className="xp-nav-cta" to="/recommend">Find your drive <ArrowUpRight size={16} /></Link>
    <button className="xp-menu" type="button" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}>{open ? <X size={24}/> : <Menu size={24}/>}</button>
  </header>;
}

function Reveal({ children, className = '' }) {
  return <div data-xp-reveal className={`xp-reveal ${className}`}>{children}</div>;
}

export default function ExperienceHome() {
  const root = useRef(null);
  useMotionReveal(root);
  return <div ref={root} className="xp-root" data-testid="experience-home">
    <ExperienceNav />
    <main>
      <section className="xp-hero" aria-labelledby="xp-title" data-testid="hero-section">
        <div className="xp-hero-photo">
          <img src={PHOTOS.hero} alt="Mercedes-Benz EQS luxury electric sedan at an Indian automotive event" fetchPriority="high" decoding="async"/>
          <span className="xp-hero-image-caption">AUTOAI INDIA / THE ART OF DRIVING</span>
          <a href="#xp-intro" className="xp-image-scroll" aria-label="Scroll to the next chapter"><ArrowDown size={21}/></a>
        </div>
        <div className="xp-hero-copy">
          <div className="xp-hero-heading">
            <span className="xp-eyebrow">AN INDEPENDENT AUTOMOTIVE EXPERIENCE</span>
            <h1 id="xp-title">Drive <em>different.</em></h1>
          </div>
          <div className="xp-hero-description">
            <p>Discover extraordinary cars. Compare with clarity. Choose with confidence.</p>
            <Link className="xp-inline-link" to="/cars">Explore the collection <ArrowUpRight size={19}/></Link>
          </div>
        </div>
      </section>

      <section className="xp-intro" id="xp-intro" aria-labelledby="xp-intro-title">
        <Reveal className="xp-intro-layout">
          <div className="xp-intro-index"><span>01 — THE PHILOSOPHY</span><span>BEYOND THE EXPECTED</span></div>
          <div className="xp-intro-copy">
            <h2 id="xp-intro-title">A car is more<br/>than a <em>machine.</em></h2>
            <p>It is the way the road feels. The details you notice. The confidence behind every choice. Discover the cars worth your attention.</p>
            <Link className="xp-inline-link" to="/recommend">Find your perfect match <ArrowUpRight size={19}/></Link>
          </div>
        </Reveal>
      </section>

      <section className="xp-detail" aria-labelledby="xp-detail-title">
        <div className="xp-detail-photo"><img src={PHOTOS.detail} alt="Audi sedan photographed on a wet road in Kolkata" loading="lazy" decoding="async"/></div>
        <Reveal className="xp-detail-copy">
          <span className="xp-eyebrow">02 — INTELLIGENT COMPARISON</span>
          <h2 id="xp-detail-title">Every detail.<br/><em>Considered.</em></h2>
          <p>Design and engineering are only the beginning. Compare performance, practicality and ownership on your terms.</p>
          <Link className="xp-inline-link" to="/compare">Compare vehicles <ArrowUpRight size={19}/></Link>
        </Reveal>
      </section>

      <section className="xp-collection" aria-labelledby="xp-collection-title" data-testid="features-section">
        <Reveal className="xp-collection-heading">
          <div><span className="xp-eyebrow">03 — THE COLLECTION</span><h2 id="xp-collection-title">Find your<br/><em>kind of drive.</em></h2></div>
          <p>Three ways to move. One way to choose with confidence.</p>
        </Reveal>
        <div className="xp-category-grid">
          {BODY_STYLES.map(({ title, eyebrow, image, description }) => <Reveal className="xp-category-item" key={title}>
            <Link to="/cars" className="xp-category-link" aria-label={`Explore ${title} cars`}>
              <span className="xp-category-image"><img src={image} alt={description} loading="lazy" decoding="async"/></span>
              <span className="xp-category-label"><span><small>{eyebrow}</small><strong>{title}</strong><span className="xp-category-description">{description}</span></span><ArrowUpRight size={23} aria-hidden="true"/></span>
            </Link>
          </Reveal>)}
        </div>
        <Link className="xp-collection-all" to="/cars">Explore all cars <ArrowRight size={19}/></Link>
      </section>

      <section className="xp-end" aria-labelledby="xp-end-title">
        <Reveal className="xp-end-inner"><span className="xp-eyebrow">04 — YOUR NEXT CHAPTER</span><h2 id="xp-end-title">Your next drive<br/>starts <em>here.</em></h2><p>Independent insights for an extraordinary decision.</p><Link to="/recommend" className="xp-end-button">Discover your car <ArrowUpRight size={19}/></Link></Reveal>
      </section>
    </main>
    <footer className="xp-footer"><Link to="/" className="xp-logo">AUTOAI<span>INDIA</span></Link><p>Intelligence for every drive.</p><nav aria-label="Footer navigation"><Link to="/cars">Cars</Link><Link to="/compare">Compare</Link><Link to="/about">About</Link></nav><small>© {new Date().getFullYear()} AutoAI India</small></footer>
  </div>;
}
