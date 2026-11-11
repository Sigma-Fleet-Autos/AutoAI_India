import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, USER_TOKEN_KEY } from "../lib/api";
import { requestError } from "../lib/requestError";
import PageIntro from "../components/experience/PageIntro";
export default function MyBookings() {
  const [bookings, setBookings] = useState([]),
    [state, setState] = useState("loading"),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  const nav = useNavigate();
  const logout = useCallback(() => {
    api.post("/auth/logout", {}).catch(() => {});
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem("autoai_phone");
    nav("/login");
  }, [nav]);
  useEffect(() => {
    if (!localStorage.getItem(USER_TOKEN_KEY)) {
      nav("/login");
      return undefined;
    }
    const c = new AbortController();
    setState("loading");
    api
      .get("/me/bookings", { signal: c.signal })
      .then(({ data }) => {
        setBookings(Array.isArray(data) ? data : []);
        setState("ready");
      })
      .catch((e) => {
        if (c.signal.aborted) return;
        if (e?.response?.status === 401) {
          logout();
          return;
        }
        setError(requestError(e, "Your bookings could not be loaded."));
        setState("error");
      });
    return () => c.abort();
  }, [nav, logout, attempt]);
  return (
    <div
      className="aai-service-page aai-container aai-section"
      data-testid="my-bookings-page"
    >
      <div className="aai-account-heading">
        <PageIntro
          eyebrow="My AutoAI"
          title="Your journeys, together."
          description="Follow your requests and keep the next steps in view."
        />
        <button
          className="aai-text-button"
          onClick={logout}
          data-testid="logout-btn"
        >
          Sign out
        </button>
      </div>
      {state === "loading" ? (
        <p className="aai-state" role="status">
          Finding your bookings…
        </p>
      ) : state === "error" ? (
        <div className="aai-state">
          <p className="aai-error" role="alert">
            {error}
          </p>
          <button
            className="aai-button"
            onClick={() => setAttempt(attempt + 1)}
          >
            Try again
          </button>
        </div>
      ) : !bookings.length ? (
        <section className="aai-workbench aai-state">
          <span className="aai-kicker">A world of possibilities</span>
          <h2>Your next chapter is waiting.</h2>
          <p>You haven’t made any enquiries yet.</p>
          <Link className="aai-button" to="/cars">
            Explore the collection
          </Link>
        </section>
      ) : (
        <div className="aai-booking-list">
          {bookings.map((b, i) => (
            <article
              key={b.id || i}
              className="aai-booking-item"
              data-testid={`my-booking-${String(b.id || i).slice(0, 8)}`}
            >
              <div className="aai-booking-item-header">
                <div>
                  <span className="aai-kicker">
                    Reference {String(b.id || "Not provided").slice(0, 8)}
                  </span>
                  <h2>{b.car_name || "Vehicle enquiry"}</h2>
                </div>
                <span className="aai-booking-status">
                  {b.status || "Awaiting confirmation"}
                </span>
              </div>
              <dl>
                {[
                  ["Dealer", b.dealer],
                  ["City", b.city],
                  ["Preferred date", b.preferred_date || "Flexible"],
                  [
                    "Callback estimate",
                    b.eta_call_minutes != null
                      ? `${b.eta_call_minutes} minutes`
                      : "Dealer to confirm",
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value || "Not provided"}</dd>
                  </div>
                ))}
              </dl>
              {b.car_id && (
                <Link className="aai-text-link" to={`/showroom/${b.car_id}`}>
                  Revisit your model →
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
