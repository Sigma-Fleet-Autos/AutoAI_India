import { Award, MapPin, Mail, Phone, Instagram, Zap, Shield, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="cin-public-page min-h-screen" data-testid="about-page">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex items-center gap-3 mb-4">
          <Award size={16} className="text-[#c1d4d6]" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#c1d4d6] font-bold font-mono">ABOUT / THE FOUNDER</span>
        </div>
        <h1 className="font-display text-5xl lg:text-7xl tracking-tighter font-light max-w-4xl leading-[0.95]">
          Built for drivers.<br /><span className="text-[#c1d4d6]">Driven by clarity.</span>
        </h1>

        {/* Founder card */}
        <div className="mt-14 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="aspect-square border border-[#c1d4d6] bg-gradient-to-br from-[#c1d4d6]/15 via-[#0A0A0A] to-black relative overflow-hidden">
              <div className="absolute inset-0 hero-grid opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-display text-[180px] font-light text-[#c1d4d6] leading-none" data-testid="founder-initials">
                    A
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.4em] text-slate-400 mt-4">Founder · CEO</div>
                </div>
              </div>
              <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-[#c1d4d6] font-bold font-mono">
                AUTOAI INDIA
              </div>
              <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-mono">
                EST. 2026
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-mono mb-2">Owner · Founder</div>
            <h2 className="font-display text-5xl lg:text-6xl tracking-tighter font-light">Abhishek</h2>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed" data-testid="founder-bio">
              Founder of Auto-AI India.
            </p>
            <p className="mt-4 text-slate-400 leading-relaxed max-w-2xl">
              After 8 years on the Indian dealership floor — watching customers overpay, wait endlessly, and trust paid reviews — I built Auto-AI India to put power back in the buyer's hand. This app doesn't take a single rupee from brands. Every verdict is data-first. Every comparison is honest. Every waiting period is real.
            </p>

            {/* Contact card */}
            <div className="mt-8 border border-[#354247] bg-[#12191d] p-6 space-y-3">
              <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-3">CONTACT THE FOUNDER</div>
              <ContactLine icon={<Mail size={14} />} label="Email" value="global@autoaiindia.com" href="mailto:global@autoaiindia.com" />
              <ContactLine icon={<Phone size={14} />} label="Phone" value="+91 9802826200" href="tel:+919802826200" />
              <ContactLine icon={<MapPin size={14} />} label="Based in" value="India" />
              <ContactLine icon={<Instagram size={14} />} label="Instagram" value="@autoai.india" />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to="/compare" className="bg-[#c1d4d6] text-black px-6 py-3.5 text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#d6e2e1]" data-testid="about-cta-compare">
                Try the AI Verdict →
              </Link>
              <Link to="/dealers/apply" className="border border-white/20 px-6 py-3.5 text-xs uppercase tracking-[0.25em] font-bold text-white hover:bg-white/5" data-testid="about-cta-dealer">
                Partner with us
              </Link>
            </div>
          </div>
        </div>

        {/* The pledge */}
        <div className="mt-24 grid md:grid-cols-3 gap-4">
          {[
            { icon: Scale, title: "Zero paid placement", desc: "No brand can buy a better verdict. Our scoring runs on numbers — not invoices." },
            { icon: Shield, title: "No human opinion", desc: "Claude AI analyses safety, mileage, TCO, resale. The data decides. Not the desk." },
            { icon: Zap, title: "Real waiting periods", desc: "We surface what dealers hide: actual wait times, hidden booking fees, and delivery truth." },
          ].map((p, i) => (
            <div key={i} className="border border-[#354247] bg-[#12191d] p-6 hover:border-[#c1d4d6] transition-colors">
              <p.icon size={20} className="text-[#c1d4d6] mb-4" />
              <div className="font-display text-xl font-medium">{p.title}</div>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactLine({ icon, label, value, muted, href }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-[#c1d4d6]">{icon}</span>
        <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold w-24">{label}</span>
      </div>
      {href ? <a href={href} className="text-slate-200 text-sm hover:underline">{value}</a> : <span className={`font-mono text-sm ${muted ? "text-slate-500" : "text-slate-200"}`}>{value}</span>}
    </div>
  );
}
