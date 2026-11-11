import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatINR } from "../lib/api";
import CarVisual from "../components/CarVisual";
import PageIntro, { FormMessage } from "../components/experience/PageIntro";
import Reveal from "../components/experience/Reveal";
import useApiAction from "../hooks/useApiAction";
const samples = [
  ["Hyundai Creta", "Kia Seltos"],
  ["Tata Nexon", "Maruti Brezza"],
  ["Mahindra Thar", "Mahindra Scorpio-N"],
  ["Toyota Innova Hycross", "Kia Carens"],
];
export default function Compare() {
  const [carA, setCarA] = useState(""),
    [carB, setCarB] = useState(""),
    [need, setNeed] = useState("daily family driving in a metro city");
  const action = useApiAction();
  const run = (e) => {
    e.preventDefault();
    action.submit("/ai/compare", {
      car_a: carA.trim(),
      car_b: carB.trim(),
      user_need: need.trim(),
    });
  };
  const result = action.data;
  return (
    <div
      className="aai-service-page aai-container aai-section"
      data-testid="compare-page"
    >
      <PageIntro
        eyebrow="Consider every angle"
        title={
          <>
            Two possibilities.
            <br />
            Your perspective.
          </>
        }
        description="Put your shortlist side by side. Explore the differences through the lens of the way you drive."
        image="/media/editorial-sedan.jpg"
      />
      <section className="aai-workbench">
        <div className="aai-workbench-heading">
          <span className="aai-kicker">Your comparison</span>
          <p>Choose two models and tell us what matters.</p>
        </div>
        <form onSubmit={run} className="aai-form">
          <div className="aai-compare-inputs">
            <label>
              <span className="aai-field-number">01</span>First vehicle
              <input
                required
                maxLength={120}
                value={carA}
                onChange={(e) => setCarA(e.target.value)}
                placeholder="Brand and model"
                data-testid="compare-car-a-input"
              />
            </label>
            <span className="aai-versus" aria-hidden="true">
              &
            </span>
            <label>
              <span className="aai-field-number">02</span>Second vehicle
              <input
                required
                maxLength={120}
                value={carB}
                onChange={(e) => setCarB(e.target.value)}
                placeholder="Brand and model"
                data-testid="compare-car-b-input"
              />
            </label>
          </div>
          <label>
            Your driving priorities
            <textarea
              rows={2}
              maxLength={1000}
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              data-testid="compare-need-input"
            />
          </label>
          <div className="aai-form-submit">
            <p>
              AI guidance is a starting point. Confirm specifications and prices
              with your dealer.
            </p>
            <button
              className="aai-button"
              disabled={action.pending || !carA.trim() || !carB.trim()}
              data-testid="compare-submit-btn"
            >
              {action.pending ? "Comparing…" : "Compare my shortlist"}
              <ArrowUpRight size={18} />
            </button>
          </div>
        </form>
        <FormMessage
          error={action.error}
          pending={action.pending}
          pendingText="Considering your shortlist…"
        />
      </section>
      <div className="aai-suggestions">
        <span>Need a starting point?</span>
        {samples.map((pair, i) => (
          <button
            key={pair[0]}
            data-testid={`sample-compare-${i}`}
            onClick={() => {
              setCarA(pair[0]);
              setCarB(pair[1]);
            }}
          >
            {pair[0]} / {pair[1]}
          </button>
        ))}
      </div>
      {result?.car_a && result?.car_b && result?.analysis && (
        <Comparison result={result} />
      )}
    </div>
  );
}
function Comparison({ result }) {
  const { car_a: a, car_b: b, analysis } = result;
  const winner = String(analysis.winner || "").toLowerCase();
  const isSuggested = (car) =>
    Boolean(car.model && winner.includes(String(car.model).toLowerCase()));
  const rows = [
    [
      "Ex-showroom",
      formatINR(a.price_ex_showroom),
      formatINR(b.price_ex_showroom),
    ],
    ["Powertrain", a.fuel, b.fuel],
    ["Transmission", a.transmission, b.transmission],
    ["Seats", a.seats, b.seats],
    ["Body style", a.segment, b.segment],
  ];
  return (
    <section
      className="aai-comparison-results"
      data-testid="compare-result"
      aria-label="Comparison results"
    >
      <Reveal>
        <div className="aai-verdict">
          <span className="aai-kicker">A closer look at your shortlist</span>
          <h2>{analysis.headline || "Which fits your world?"}</h2>
          {analysis.winner && (
            <p className="aai-verdict-pick">
              AI suggested fit: <strong>{analysis.winner}</strong>
            </p>
          )}
          <p>{analysis.verdict}</p>
          {analysis.best_for && <p>Best suited to: {analysis.best_for}</p>}
        </div>
      </Reveal>
      <div className="aai-compare-cars">
        {[
          [a, analysis.pros_a, analysis.cons_a, "A"],
          [b, analysis.pros_b, analysis.cons_b, "B"],
        ].map(([car, pros, cons, side]) => (
          <article
            className="aai-comparison-car"
            key={side}
            data-testid={`verdict-panel-${side}`}
          >
            <CarVisual car={car} />
            <div className="aai-comparison-car-copy">
              <span className="aai-kicker">
                {car.brand}
                {isSuggested(car) ? " / Suggested fit" : ""}
              </span>
              <h3>{car.model}</h3>
              <p>{car.variant}</p>
              {Array.isArray(pros) && pros.length > 0 && (
                <div>
                  <h4>What stands out</h4>
                  <ul>
                    {pros.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(cons) && cons.length > 0 && (
                <div>
                  <h4>Things to consider</h4>
                  <ul>
                    {cons.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="aai-actions">
                <Link className="aai-button" to={`/showroom/${car.id}`}>
                  Explore model
                </Link>
                <Link
                  className="aai-text-link"
                  to={`/book/${car.id}`}
                  data-testid={`verdict-book-${side}`}
                >
                  Enquire
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="aai-table-scroll">
        <table className="aai-comparison-table">
          <caption>Key specifications from the returned catalogue</caption>
          <thead>
            <tr>
              <th scope="col">The details</th>
              <th scope="col">
                {a.brand} {a.model}
              </th>
              <th scope="col">
                {b.brand} {b.model}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, av, bv]) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                <td>{av ?? "Not provided"}</td>
                <td>{bv ?? "Not provided"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="aai-caption">
        AI output can be incomplete or incorrect. Dealer-confirmed
        specifications and prices take precedence.
      </p>
    </section>
  );
}
