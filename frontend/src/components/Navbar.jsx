import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageToggle from "./LanguageToggle";
import { useI18n } from "../lib/i18n";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useI18n();
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onEscape = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", key: "nav_home" },
    { to: "/compare", key: "nav_compare" },
    { to: "/recommend", key: "nav_recommend" },
    { to: "/cars", key: "nav_cars" },
    { to: "/emi", key: "nav_emi" },
    { to: "/news", key: "nav_news" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#f5f4f0]/95 backdrop-blur-xl border-b border-[#d9dad5] shadow-sm"
          : "bg-[#f5f4f0]/95 backdrop-blur-xl border-b border-[#d9dad5]"
      }`}
      data-testid="site-navbar"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group min-h-11" data-testid="nav-logo">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative w-9 h-9 border border-[#111412] flex items-center justify-center"
          >
            <span className="text-[#111412] font-semibold text-xs">A·</span>
          </motion.div>
          <div className="font-display uppercase tracking-[0.18em] text-sm font-semibold text-[#111412]">
            Auto<span className="text-[#111412]">·</span>AI
            <span className="ml-1.5 text-[10px] tracking-[0.3em] text-[#555a55] font-mono">IN</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 relative">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.key.replace("nav_", "")}`}
              className={({ isActive }) =>
                `relative px-3.5 py-3 text-[11px] uppercase tracking-[0.22em] font-semibold transition-colors ${
                  isActive ? "text-[#111412]" : "text-[#555a55] hover:text-[#111412]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {t(l.key)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-2 right-2 -bottom-px h-px bg-[#111412]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          <LanguageToggle />
          <Link
            to="/login"
            data-testid="nav-login"
            className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#555a55] border border-[#c7c9c3] px-4 py-2 hover:border-[#111412] hover:text-[#111412] transition-all"
          >
            Login
          </Link>
          <Link
            to="/premium"
            data-testid="nav-premium"
            className="group flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] font-semibold text-[#111412] border border-[#c7c9c3] px-4 py-2 hover:bg-white transition-all"
          >
            <Crown size={12} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />{" "}
            Premium
          </Link>
          <Link
            to="/compare"
            data-testid="cta-compare-top"
            className="bg-[#111412] text-white text-[11px] uppercase tracking-[0.22em] font-bold px-5 py-2.5 hover:bg-[#303630] transition-all"
          >
            {t("cta_true_verdict")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-[#111412] flex items-center justify-center min-w-11 min-h-11 z-[60]"
          onClick={() => setOpen(!open)}
          data-testid="nav-mobile-toggle"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="autoai-mobile-navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="lg:hidden absolute top-3.5 right-16">
        <LanguageToggle compact />
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            id="autoai-mobile-navigation"
            role="navigation"
            aria-label="Mobile navigation"
            className="lg:hidden border-t border-[#d9dad5] bg-[#f5f4f0]/95 backdrop-blur-xl overflow-hidden"
            data-testid="nav-mobile-menu"
          >
            {links.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NavLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-6 py-3.5 text-sm uppercase tracking-[0.22em] border-b border-[#d9dad5] font-semibold ${
                      isActive ? "text-[#111412] bg-white" : "text-[#555a55]"
                    }`
                  }
                >
                  {t(l.key)}
                </NavLink>
              </motion.div>
            ))}
            <div className="p-4 flex gap-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex-1 text-center text-[11px] uppercase tracking-[0.22em] text-[#555a55] border border-[#c7c9c3] py-3"
              >
                Login
              </Link>
              <Link
                to="/premium"
                onClick={() => setOpen(false)}
                className="flex-1 text-center text-[11px] uppercase tracking-[0.22em] font-bold bg-[#111412] text-white py-3"
              >
                Premium
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
