import { Link } from "react-router-dom";
import { ArrowRight, Scale, Sparkles, Calculator, Newspaper, Gauge, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import CarCard from "../components/CarCard";
import { useI18n } from "../lib/i18n";

const HERO_CAR =
  "https://images.unsplash.com/photo-1763165561886-a9391b2132c1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzaG93cm9vbSUyMGRhcmt8ZW58MHx8fHwxNzc2Njg1NzQzfDA&ixlib=rb-4.1.0&q=85";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const [cars, setCars] = useState([]);
  const { t } = useI18n();

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    api.get("/cars", { signal: controller.signal })
      .then(({ data }) => { if (active && Array.isArray(data)) setCars(data.slice(0, 6)); })
      .catch(() => {});
    return () => { active = false; controller.abort(); };
  }, []);

  return (
    <div className="bg-[#050505] text-white overflow-hidden">
      <section className="autoai-atelier" aria-labelledby="atelier-discover-title">
        <div className="atelier-container py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,.7fr)] lg:items-end">
            <div>
              <p className="atelier-eyebrow mb-5">AutoAI India · The automotive edit</p>
              <h2 id="atelier-discover-title" className="atelier-heading text-5xl sm:text-6xl lg:text-7xl">
                Every drive begins with a better decision.
              </h2>
            </div>
            <div>
              <p className="mb-7 max-w-md text-base leading-7 text-[#555a55]">
                Explore the cars shaping India. Compare what matters, discover the details,
                and make your next move with greater clarity.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/cars" className="atelier-action">Explore vehicles <ArrowRight className="ml-3" size={16} aria-hidden="true" /></Link>
                <Link to="/compare" className="atelier-action">Compare models</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ============== EDITORIAL HERO ============== */}
      <section className="autoai-atelier relative overflow-hidden border-t border-[#d9dad5]" data-testid="hero-section" aria-labelledby="home-hero-title">
        <div className="atelier-container grid gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
          <div className="relative z-10">
            <p className="atelier-eyebrow mb-6">India's automotive discovery platform · 01 / Discover</p>
            <h1 id="home-hero-title" className="atelier-heading max-w-3xl text-5xl sm:text-6xl lg:text-[5.5rem] leading-[1.02]">
              Your next car. <span className="italic font-normal">A clearer decision.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-8 text-[#555a55]">
              Discover cars sold in India, compare available specifications and plan your budget.
              Confirm current prices, delivery times and availability with your dealer.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/compare" data-testid="hero-cta-compare" className="atelier-action">
                Compare vehicles <ArrowRight size={17} className="ml-3" aria-hidden="true" />
              </Link>
              <Link to="/recommend" data-testid="hero-cta-recommend" className="inline-flex min-h-12 items-center justify-center border border-[#111412] px-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#111412] transition-colors hover:bg-[#e9eae5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111412]">
                Explore recommendations
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#d9dad5] pt-5 text-xs uppercase tracking-[0.12em] text-[#555a55]">
              <span>Vehicle catalogue</span><span>Specifications</span><span>Ownership tools</span>
            </div>
          </div>
          <div className="relative min-h-[340px] overflow-hidden bg-[#d7d8d2] sm:min-h-[480px] lg:min-h-[600px]">
            <img src={HERO_CAR} alt="Automobile photographed in a showroom" className="absolute inset-0 h-full w-full object-cover" loading="eager" fetchPriority="high" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-7 pt-24 text-white">
              <p className="text-xs uppercase tracking-[0.22em]">AutoAI India / The automotive edit</p>
              <p className="mt-2 max-w-xs font-display text-2xl font-light">Explore the details before the drive.</p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#d9dad5]">
          <nav className="atelier-container grid gap-0 sm:grid-cols-3" aria-label="Explore AutoAI tools">
            <Link to="/cars" className="flex min-h-16 items-center justify-between border-b border-[#d9dad5] py-4 text-sm font-medium text-[#111412] hover:underline sm:border-b-0 sm:border-r sm:pr-6">Browse vehicles <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link to="/compare" className="flex min-h-16 items-center justify-between border-b border-[#d9dad5] py-4 text-sm font-medium text-[#111412] hover:underline sm:border-b-0 sm:border-r sm:px-6">Compare models <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link to="/emi" className="flex min-h-16 items-center justify-between py-4 text-sm font-medium text-[#111412] hover:underline sm:pl-6">Estimate EMI <ArrowRight size={16} aria-hidden="true" /></Link>
          </nav>
        </div>
      </section>

      {/* ============== BENTO FEATURES ============== */}
      <section className="autoai-atelier border-t border-[#d9dad5] py-20 md:py-28" data-testid="features-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="atelier-container mb-14"
        >
          <p className="atelier-eyebrow mb-5">02 / The buying toolkit</p>
          <h2 className="atelier-heading max-w-4xl text-4xl md:text-6xl leading-[1.08]">
            Tools for better decisions.
            <br />
            <span className="italic font-normal">Your next move, considered.</span>
          </h2>
        </motion.div>

        <motion.div
          className="atelier-container grid md:grid-cols-12 gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <Feature to="/compare" span="md:col-span-7" icon={<Scale size={22} />} kicker="01 · AI Comparison" title="Two cars enter. One walks out." desc="Compare available vehicle specifications and buying considerations side by side. Verify safety ratings, pricing and delivery information with official sources." />
          <Feature to="/recommend" span="md:col-span-5" icon={<Sparkles size={22} />} kicker="02 · AI Recommender" title="Your budget. Your need. Our verdict." desc="Explore recommendations based on your preferences, then review specifications and trade-offs before deciding." />
          <Feature to="/emi" span="md:col-span-4" icon={<Calculator size={22} />} kicker="03 · EMI Studio" title="Understand the monthly cost." desc="Explore illustrative EMI and interest calculations. Loan approval and final terms depend on the lender." />
          <Feature to="/cars" span="md:col-span-4" icon={<Gauge size={22} />} kicker="04 · Vehicle Catalogue" title="Discover available models." desc="Browse listed vehicles and specifications. Confirm stock, waiting periods and prices with dealers." />
          <Feature to="/news" span="md:col-span-4" icon={<Newspaper size={22} />} kicker="05 · Automotive News" title="Stay informed." desc="Read automotive updates and check manufacturer announcements for current launch and pricing details." />
        </motion.div>
      </section>

      {/* ============== UNBIASED PLEDGE ============== */}
      <section className="relative border-y border-white/5 bg-[#07070A] overflow-hidden" data-testid="pledge-section">
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F59E0B]/8 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 grid md:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="chip mb-5">/// the unbiased pledge</div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight font-light leading-[1.02]">
              Look beyond
              <br />
              the headline.
              <br />
              <span className="text-gradient-amber italic font-semibold">Compare the details.</span>
            </h2>
            <p className="mt-7 text-slate-400 leading-relaxed max-w-md">
              Car buying decisions deserve clear specifications, transparent comparisons and realistic ownership considerations. Check critical details with manufacturers, lenders and dealers before committing.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { t: "Specification-led discovery", d: "Review listed safety, efficiency and ownership information alongside official sources." },
              { t: "Understand trade-offs", d: "Consider practical compromises between features, budget and running costs." },
              { t: "Verify before purchase", d: "Confirm offers, finance terms and vehicle availability with the relevant provider." },
            ].map((x, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="glass border border-white/10 p-6 flex gap-4 hover:border-[#F59E0B]/50 transition-all group"
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-[#F59E0B]/30 bg-[#F59E0B]/5 group-hover:bg-[#F59E0B]/15 transition-colors">
                  <ShieldCheck size={18} className="text-[#F59E0B]" />
                </div>
                <div>
                  <div className="font-display text-lg font-medium">{x.t}</div>
                  <div className="text-sm text-slate-400 mt-1">{x.d}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============== TRENDING CARS ============== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-28" data-testid="trending-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-12 flex-wrap gap-4"
        >
          <div>
            <div className="chip mb-5">/// featured catalogue</div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight font-light">
              Explore <span className="text-[#F59E0B]">featured vehicles</span>
            </h2>
          </div>
          <Link
            to="/cars"
            className="group text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-[#F59E0B] flex items-center gap-2 border border-white/10 hover:border-[#F59E0B]/40 px-4 py-2.5 transition-all"
          >
            See all cars{" "}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {cars.map((c, i) => (
            <motion.div key={c.id} variants={fadeUp} custom={i}>
              <CarCard car={c} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============== CTA FINAL (tracing beam) ============== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="tracing-beam p-12 lg:p-20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F59E0B]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5832B]/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="chip mb-6">/// final word</div>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tighter font-light uppercase max-w-4xl leading-[0.95]">
              Find your next car
              <br />
              with{" "}
              <span className="text-gradient-amber italic font-semibold">clarity.</span>
            </h2>
            <Link
              to="/compare"
              data-testid="footer-cta-compare"
              className="mt-10 btn-shine inline-flex bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black px-8 py-4 font-semibold text-xs uppercase tracking-[0.22em] items-center gap-3 hover:shadow-[0_0_40px_-5px_rgba(245,158,11,0.6)] transition-all"
            >
              Compare Vehicles <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function Feature({ to, span, icon, kicker, title, desc }) {
  return (
    <motion.div variants={fadeUp} className={span}>
      <Link
        to={to}
        data-testid={`feature-${kicker.split("·")[0].trim()}`}
        className="group relative h-full block border border-[#d9dad5] bg-white p-8 text-[#111412] transition-colors hover:border-[#777a75] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111412]"
      >
        <div
          className="hidden"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent 70%)" }}
        />
        <div className="relative z-[1]">
          <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[#c5c8c0] bg-[#f5f4f0] text-[#111412]">
            {icon}
          </div>
          <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#555a55]">
            {kicker}
          </div>
          <div className="font-display text-2xl lg:text-3xl font-medium mb-3 max-w-xs leading-[1.15]">
            {title}
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#555a55]">{desc}</p>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#111412]">
            Enter{" "}
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
