import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight, UserRound, ChevronRight } from "lucide-react";
import { LANGUAGES, useI18n } from "../lib/i18n";
const categories = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Electric",
  "Hybrid",
  "Motorcycle",
];
const groups = {
  Models: categories.map((x) => [x, `/cars?category=${x}`]),
  "Find your drive": [
    ["All vehicles", "/cars"],
    ["AI car advisor", "/recommend"],
    ["Compare vehicles", "/compare"],
  ],
  Ownership: [
    ["Finance calculator", "/emi"],
    ["My bookings", "/my-bookings"],
    ["Premium membership", "/premium"],
  ],
  "Our world": [
    ["About AutoAI India", "/about"],
    ["Automotive journal", "/news"],
    ["Partner with us", "/dealers/apply"],
    ["Dealer portal", "/dealer"],
  ],
};
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState("Models");
  const dialog = useRef(null);
  const trigger = useRef(null);
  const location = useLocation();
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const close = () => {
    dialog.current?.close();
    setOpen(false);
  };
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    dialog.current?.close();
    setOpen(false);
  }, [location.pathname, location.search]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
      trigger.current?.focus();
    };
  }, [open]);
  const transparent = location.pathname === "/" && !scrolled;
  return (
    <>
      <a className="aai-skip" href="#main-content">
        Skip to content
      </a>
      <header
        className={`aai-header ${transparent ? "over-media" : ""}`}
        data-testid="site-navbar"
      >
        <button
          ref={trigger}
          className="aai-menu-trigger"
          aria-label="Menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="aai-navigation"
          onClick={() => {
            dialog.current.showModal();
            setOpen(true);
          }}
          data-testid="nav-mobile-toggle"
        >
          <Menu size={21} />
          <span>Menu</span>
        </button>
        <Link
          to="/"
          className="aai-wordmark"
          data-testid="nav-logo"
          aria-label="AutoAI India home"
        >
          AUTOAI <span>INDIA</span>
        </Link>
        <Link
          to="/login"
          className="aai-account"
          aria-label="My AutoAI account"
          data-testid="nav-login"
        >
          <UserRound size={21} />
          <span>My AutoAI</span>
        </Link>
      </header>
      <dialog
        id="aai-navigation"
        ref={dialog}
        className="aai-navigation"
        aria-label="Main navigation"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="aai-nav-surface">
          <button
            className="aai-nav-close"
            onClick={close}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          <div className="aai-nav-primary">
            <span className="aai-kicker">Discover AutoAI India</span>
            {Object.keys(groups).map((name) => (
              <button
                key={name}
                onClick={() => setSection(name)}
                aria-pressed={section === name}
              >
                {name}
                <ChevronRight size={22} />
              </button>
            ))}
            <div className="aai-nav-language">
              <label>
                Language
                <select
                  aria-label="Choose language"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.native} · {l.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <nav className="aai-nav-secondary" aria-label={section}>
            <span className="aai-kicker">{section}</span>
            {groups[section].map(([label, to]) => (
              <Link key={to} to={to} onClick={close}>
                {label}
                <ArrowUpRight size={22} />
              </Link>
            ))}
            <Link className="aai-nav-all" to="/cars" onClick={close}>
              {t("nav_cars")}
              <ChevronRight size={20} />
            </Link>
          </nav>
        </div>
      </dialog>
    </>
  );
}
