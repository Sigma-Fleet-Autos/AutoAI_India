import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Menu, Pause, Play, X } from 'lucide-react';
import '../styles/experience-home.css';

// Preview-only editorial photography; rights and visible branding require clearance.
// Each photograph is unique. These images do not constitute verified inventory.
const PHOTOS = Object.freeze({
  hero: 'https://images.unsplash.com/photo-1668248835473-c2f28c752663?auto=format&fit=crop&w=2400&q=88',
  detail: 'https://images.unsplash.com/photo-1652946950814-25f52bb0ebfc?auto=format&fit=crop&w=2000&q=85',
  suv: 'https://images.unsplash.com/photo-1723306975792-f5a053a59dd3?auto=format&fit=crop&w=1100&q=82',
  sedan: 'https://images.unsplash.com/photo-1623994518372-2211dc3afb29?auto=format&fit=crop&w=1100&q=82',
  hatchback: 'https://images.unsplash.com/photo-1650029380425-7fbfbd9b2b68?auto=format&fit=crop&w=1100&q=82',
});

const HERO_SLIDES = Object.freeze([
  {
    image: PHOTOS.hero,
    alt: 'Luxury electric sedan photographed at an automotive event',
    kicker: 'THE ART OF THE DRIVE',
    title: 'Beyond the ordinary.',
    description: 'Explore extraordinary cars. Understand every detail. Find the one that moves you.',
  },
  {
    image: PHOTOS.detail,
    alt: 'Premium sedan photographed in an atmospheric street scene',
    kicker: 'THE POWER OF CLARITY',
    title: 'Every detail. Considered.',
    description: 'Compare design, performance, safety and the true cost of ownership.',
  },
  {
    image: PHOTOS.suv,
    alt: 'Premium SUV in a distinct editorial photograph',
    kicker: 'FIND YOUR DIRECTION',
    title: 'Discover your drive.',
    description: 'Explore the shapes that define Indian roads and find your next car.',
  },
]);

const COLLECTION = Object.freeze([
  { title: 'SUV', number: '01', image: PHOTOS.suv, caption: 'Explore a different perspective.', segment: 'SUV', alt: 'Premium SUV in a distinct editorial photograph' },
  { title: 'Sedan', number: '02', image: PHOTOS.sedan, caption: 'The art of arriving.', segment: 'Sedan', alt: 'Premium sedan in a distinct editorial photograph' },
  { title: 'Hatchback', number: '03', image: PHOTOS.hatchback, caption: 'Everyday, elevated.', segment: 'Hatchback', alt: 'Premium hatchback in a distinct editorial photograph' },
]);

function useReveal(root) {
  useEffect(() => {
    const host = root.current;
    if (!host) return undefined;
    const sections = host.querySelectorAll('[data-xp-reveal]');
    if (typeof IntersectionObserver === 'undefined') {
      sections.forEach((section) => section.classList.add('xp-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        target.classList.add('xp-visible');
        observer.unobserve(target);
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [root]);
}

function ExperienceNav() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onEscape = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open]);

  return <header className="xp-nav">
    <Link to="/" className="xp-logo" aria-label="AutoAI India — home">AUTOAI<span>INDIA</span></Link>
    <button ref={menuButton} className="xp-menu" type="button" aria-controls="xp-primary-menu" aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen((value) => !value)}>{open ? <X size={23} /> : <Menu size={23} />}</button>
    <nav id="xp-primary-menu" className={`xp-links${open ? ' xp-links-open' : ''}`} aria-label="Primary navigation">
      <Link to="/cars" onClick={() => setOpen(false)}>Discover</Link>
      <Link to="/compare" onClick={() => setOpen(false)}>Compare</Link>
      <Link to="/recommend" onClick={() => setOpen(false)}>AI Advisor</Link>
      <Link to="/about" onClick={() => setOpen(false)}>Our story</Link>
    </nav>
    <Link className="xp-nav-cta" to="/recommend">Find your drive <ArrowUpRight size={16} aria-hidden="true" /></Link>
  </header>;
}

function Reveal({ children, className = '' }) {
  return <div data-xp-reveal className={`xp-reveal ${className}`}>{children}</div>;
}

export default function ExperienceHome() {
  const root = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [playing, setPlaying] = useState(false);
  const slide = HERO_SLIDES[activeSlide];

  useEffect(() => {
    if (!playing) return undefined;
    const onTick = () => {
      if (document.visibilityState !== 'hidden') {
        setActiveSlide((index) => (index + 1) % HERO_SLIDES.length);
      }
    };
    const timer = window.setInterval(onTick, 7000);
    return () => window.clearInterval(timer);
  }, [playing]);

  useReveal(root);
  return <div className="xp-root" ref={root} data-testid="experience-home">
    <ExperienceNav />
    <a className="xp-skip" href="#xp-title">Skip to main content</a>
    <main>
      <section className="xp-hero" aria-labelledby="xp-title" data-testid="hero-section">
        <div className="xp-hero-scene">
          <img key={slide.image} className="xp-hero-car" src={slide.image} srcSet={`${slide.image.replace(/w=\d+/, 'w=960')} 960w, ${slide.image.replace(/w=\d+/, 'w=1600')} 1600w, ${slide.image.replace(/w=\d+/, 'w=2400')} 2400w`} sizes="100vw" alt={slide.alt} fetchPriority={activeSlide === 0 ? 'high' : 'auto'} decoding="async" />
          <div className="xp-hero-scene-caption"><span>INDEPENDENT AUTOMOTIVE INTELLIGENCE</span><span>INDIA / 2026</span></div>
          <div className="xp-hero-pagination" role="group" aria-label="Featured automotive stories">
            {HERO_SLIDES.map((item, index) => (
              <button
                type="button"
                key={item.kicker}
                className={`xp-hero-page${index === activeSlide ? ' xp-hero-page-active' : ''}`}
                aria-label={`Show story ${index + 1}: ${item.kicker}`}
                aria-pressed={index === activeSlide}
                onClick={() => { setPlaying(false); setActiveSlide(index); }}
              >
                <span aria-hidden="true" />
              </button>
            ))}
            <button type="button" className="xp-hero-page xp-hero-playback" aria-label={playing ? 'Pause featured stories' : 'Play featured stories'} onClick={() => setPlaying((value) => !value)}>
              {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
        <div className="xp-hero-dock">
          <div className="xp-hero-titles"><span className="xp-kicker"><span className="xp-kicker-mark" />{slide.kicker}</span><h1 id="xp-title" tabIndex={-1}>{slide.title}</h1></div>
          <div className="xp-hero-side"><p>{slide.description}</p><Link to="/cars" className="xp-hero-explore">Explore cars <ArrowUpRight size={20} /></Link></div>
        </div>
        <a className="xp-scroll-cue" href="#xp-philosophy" aria-label="Continue to the next chapter"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={21} /></a>
      </section>

      <section id="xp-philosophy" className="xp-philosophy" aria-labelledby="xp-philosophy-title">
        <Reveal className="xp-philosophy-body">
          <div className="xp-section-index"><span>01 / A NEW PERSPECTIVE</span><span>AUTOAI INDIA</span></div>
          <h2 id="xp-philosophy-title">A car is never<br/>just <em>a car.</em></h2>
          <div className="xp-philosophy-bottom"><p>It is a feeling. A statement. A thousand small decisions that become one extraordinary drive. We bring the detail and intelligence into focus.</p><Link className="xp-text-link" to="/recommend">Discover your match <ArrowUpRight size={19}/></Link></div>
        </Reveal>
      </section>

      <section className="xp-feature" aria-labelledby="xp-feature-title">
        <div className="xp-feature-media"><img src={PHOTOS.detail} alt="Premium sedan photographed in an atmospheric street scene" loading="lazy" decoding="async"/></div>
        <Reveal className="xp-feature-copy"><span className="xp-kicker">02 / THE POWER OF CLARITY</span><h2 id="xp-feature-title">Every detail.<br/><em>Considered.</em></h2><p>Compare design, performance, safety and the true cost of ownership in one considered experience.</p><Link className="xp-text-link" to="/compare">Compare cars <ArrowUpRight size={19}/></Link></Reveal>
      </section>

      <section className="xp-collection" aria-labelledby="xp-collection-title" data-testid="features-section">
        <Reveal className="xp-collection-head"><div><span className="xp-kicker">03 / FIND YOUR DIRECTION</span><h2 id="xp-collection-title">Your kind<br/>of <em>drive.</em></h2></div><p>Explore the shapes that define the Indian road. Every discovery starts somewhere.</p></Reveal>
        <div className="xp-collection-grid">
          {COLLECTION.map((item) => <Reveal className="xp-collection-card" key={item.title}><Link to={`/cars?segment=${encodeURIComponent(item.segment)}`} aria-label={`Explore ${item.title} vehicles`}><span className="xp-card-photo"><img src={item.image} alt={item.alt} loading="lazy" decoding="async" /></span><span className="xp-card-meta"><span className="xp-card-name"><small>{item.number} / COLLECTION</small><strong>{item.title}</strong><span>{item.caption}</span></span><ArrowUpRight size={24} aria-hidden="true"/></span></Link></Reveal>)}
        </div>
        <Link className="xp-collection-more" to="/cars">Explore the full collection <ArrowRight size={20}/></Link>
      </section>

      <section className="xp-finale" aria-labelledby="xp-finale-title"><Reveal className="xp-finale-inner"><span className="xp-kicker">04 / INTELLIGENCE MEETS INSTINCT</span><h2 id="xp-finale-title">The next chapter<br/>is <em>yours.</em></h2><p>Know what matters. Choose with confidence.</p><Link to="/recommend" className="xp-finale-cta">Find your drive <ArrowUpRight size={20}/></Link></Reveal></section>
    </main>
    <footer className="xp-footer"><Link to="/" className="xp-logo">AUTOAI<span>INDIA</span></Link><p>Intelligence for every drive.</p><nav aria-label="Footer navigation"><Link to="/cars">Cars</Link><Link to="/compare">Compare</Link><Link to="/about">About</Link></nav><small>© {new Date().getFullYear()} AutoAI India</small></footer>
  </div>;
}
