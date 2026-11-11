import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowUp } from "lucide-react";
export default function Footer() {
  return (
    <footer className="aai-footer" data-testid="site-footer">
      <div className="aai-container">
        <div className="aai-footer-top">
          <div>
            <span className="aai-kicker">Your next chapter starts here.</span>
            <h2>Make it a great drive.</h2>
            <Link className="aai-button light" to="/cars">
              Explore the collection <ArrowUpRight size={18} />
            </Link>
          </div>
          <button
            className="aai-top"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? "instant"
                  : "smooth",
              })
            }
            aria-label="Back to top"
          >
            <ArrowUp />
          </button>
        </div>
        <div className="aai-footer-links">
          {[
            [
              "Discover",
              ["All vehicles", "/cars"],
              ["Car advisor", "/recommend"],
              ["Compare", "/compare"],
            ],
            [
              "Ownership",
              ["Finance calculator", "/emi"],
              ["My bookings", "/my-bookings"],
              ["Premium", "/premium"],
            ],
            [
              "AutoAI India",
              ["About us", "/about"],
              ["Journal", "/news"],
              ["Partner with us", "/dealers/apply"],
            ],
            [
              "Your account",
              ["Sign in", "/login"],
              ["Dealer portal", "/dealer"],
            ],
          ].map(([title, ...links]) => (
            <div key={title}>
              <h3>{title}</h3>
              {links.map(([label, to]) => (
                <Link key={to} to={to}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="aai-footer-bottom">
          <Link className="aai-wordmark" to="/">
            AUTOAI <span>INDIA</span>
          </Link>
          <p>© {new Date().getFullYear()} AutoAI India. India / English.</p>
          <p>
            Vehicle specifications and availability require dealer confirmation.
          </p>
        </div>
      </div>
    </footer>
  );
}
