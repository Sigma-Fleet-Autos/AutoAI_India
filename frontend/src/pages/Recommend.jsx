import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatINR } from "../lib/api";
import CarVisual from "../components/CarVisual";
import PageIntro, { FormMessage } from "../components/experience/PageIntro";
import useApiAction from "../hooks/useApiAction";
export default function Recommend() {
  const [budget, setBudget] = useState([800000, 1800000]),
    [fuel, setFuel] = useState("Any"),
    [seats, setSeats] = useState(5),
    [usage, setUsage] = useState("city"),
    [notes, setNotes] = useState("");
  const action = useApiAction();
  const updateBudget = (i, value) => {
    const next = [...budget];
    next[i] = Number(value);
    setBudget(next);
  };
  const validBudget =
    budget[0] >= 400000 && budget[1] <= 5000000 && budget[0] <= budget[1];
  const run = (e) => {
    e.preventDefault();
    if (validBudget)
      action.submit("/ai/recommend", {
        budget_min: budget[0],
        budget_max: budget[1],
        fuel,
        seats,
        usage,
        notes,
      });
  };
  return (
    <div
      className="aai-service-page aai-container aai-section"
      data-testid="recommend-page"
    >
      <PageIntro
        eyebrow="Your personal car advisor"
        title={
          <>
            It starts
            <br />
            with your world.
          </>
        }
        description="The right car is personal. Share your budget, everyday routines and non-negotiables. Let’s narrow the possibilities."
        image="/media/editorial-suv.jpg"
      />
      <div className="aai-advisor-layout">
        <aside className="aai-advisor-note">
          <span className="aai-kicker">Thoughtfully matched</span>
          <h2>
            Less searching.
            <br />
            More discovering.
          </h2>
          <ol>
            <li>
              <span>01</span>Tell us what matters.
            </li>
            <li>
              <span>02</span>Explore your recommendations.
            </li>
            <li>
              <span>03</span>Compare and meet your shortlist.
            </li>
          </ol>
          <p>
            Recommendations use the available catalogue. Confirm specifications
            and final pricing with an authorised dealer.
          </p>
        </aside>
        <section className="aai-workbench">
          <form onSubmit={run} className="aai-form">
            <fieldset>
              <legend>Your budget</legend>
              <p>Ex-showroom range, in rupees.</p>
              <div className="aai-form-grid">
                <label>
                  Minimum budget
                  <input
                    type="number"
                    min={400000}
                    max={5000000}
                    step={50000}
                    value={budget[0]}
                    onChange={(e) => updateBudget(0, e.target.value)}
                    required
                  />
                </label>
                <label>
                  Maximum budget
                  <input
                    type="number"
                    min={400000}
                    max={5000000}
                    step={50000}
                    value={budget[1]}
                    onChange={(e) => updateBudget(1, e.target.value)}
                    required
                  />
                </label>
              </div>
              <div
                className="aai-budget-range"
                data-testid="recommend-budget-slider"
              >
                <label>
                  Adjust minimum
                  <input
                    type="range"
                    min={400000}
                    max={5000000}
                    step={50000}
                    value={budget[0]}
                    onChange={(e) => updateBudget(0, e.target.value)}
                  />
                </label>
                <label>
                  Adjust maximum
                  <input
                    type="range"
                    min={400000}
                    max={5000000}
                    step={50000}
                    value={budget[1]}
                    onChange={(e) => updateBudget(1, e.target.value)}
                  />
                </label>
              </div>
              <output className="aai-budget-display">
                {formatINR(budget[0])} — {formatINR(budget[1])}
              </output>
              {!validBudget && (
                <p role="alert" className="aai-error">
                  Minimum budget must not exceed the maximum.
                </p>
              )}
            </fieldset>
            <fieldset>
              <legend>Your everyday drive</legend>
              <div className="aai-form-grid">
                <label>
                  Powertrain
                  <select
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    data-testid="recommend-fuel-select"
                  >
                    {[
                      "Any",
                      "Petrol",
                      "Diesel",
                      "Petrol Hybrid",
                      "Electric",
                    ].map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Seats needed
                  <select
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    data-testid="recommend-seats-select"
                  >
                    {[4, 5, 6, 7].map((n) => (
                      <option key={n} value={n}>
                        {n}+ seats
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Primary use
                <select
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  data-testid="recommend-usage-select"
                >
                  {["city", "highway", "mixed", "off-road", "family tours"].map(
                    (u) => (
                      <option key={u}>{u}</option>
                    ),
                  )}
                </select>
              </label>
              <label>
                What else matters?{" "}
                <span className="aai-optional">Optional</span>
                <textarea
                  maxLength={1000}
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Boot space, comfort, safety or a must-have feature…"
                  data-testid="recommend-notes-input"
                />
              </label>
            </fieldset>
            <button
              className="aai-button"
              disabled={action.pending || !validBudget}
              data-testid="recommend-submit-btn"
            >
              {action.pending ? "Finding your fit…" : "Discover my shortlist"}
              <ArrowUpRight size={18} />
            </button>
          </form>
          <FormMessage
            error={action.error || action.data?.error}
            pending={action.pending}
            pendingText="Considering your preferences…"
          />
        </section>
      </div>
      {action.data && !action.data.error && (
        <section className="aai-advisor-results" data-testid="recommend-result">
          <span className="aai-kicker">Your possibilities</span>
          <h2>A shortlist shaped by you.</h2>
          <p className="aai-lead">{action.data.summary}</p>
          {!action.data.top_picks?.length ? (
            <p className="aai-state">
              No recommendations were returned. Try widening your budget or
              preferences.
            </p>
          ) : (
            <div className="aai-recommendation-grid">
              {action.data.top_picks.map((pick, i) => (
                <article
                  className="aai-recommendation"
                  key={pick.car?.id || i}
                  data-testid={`pick-${i}`}
                >
                  {pick.car && <CarVisual car={pick.car} />}
                  <div>
                    <span className="aai-kicker">
                      Selection {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3>
                      {pick.car
                        ? `${pick.car.brand} ${pick.car.model}`
                        : "Recommendation"}
                    </h3>
                    {pick.car && (
                      <p>
                        {formatINR(pick.car.price_ex_showroom)} · Ex-showroom
                      </p>
                    )}
                    <p>{pick.why}</p>
                    {pick.watchouts && (
                      <p className="aai-watchout">
                        <strong>Consider</strong>
                        {pick.watchouts}
                      </p>
                    )}
                    {pick.car && (
                      <div className="aai-actions">
                        <Link
                          className="aai-button"
                          to={`/showroom/${pick.car.id}`}
                        >
                          Explore model
                        </Link>
                        <Link
                          className="aai-text-link"
                          to={`/book/${pick.car.id}`}
                          data-testid={`pick-book-${i}`}
                        >
                          Enquire
                          <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
