import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatINR } from "../lib/api";
import { computeEMI, validEMIResponse } from "../lib/financeMath";
import PageIntro from "../components/experience/PageIntro";
export default function EMI() {
  const [principal, setPrincipal] = useState(800000),
    [rate, setRate] = useState(9.5),
    [tenure, setTenure] = useState(60),
    [remote, setRemote] = useState(null),
    [source, setSource] = useState("Local estimate");
  const valid =
    Number.isFinite(principal) &&
    principal >= 100000 &&
    principal <= 5000000 &&
    Number.isFinite(rate) &&
    rate >= 0 &&
    rate <= 25 &&
    Number.isInteger(tenure) &&
    tenure >= 12 &&
    tenure <= 84;
  const result = valid
    ? (remote?.key === `${principal}/${rate}/${tenure}` ? remote.data : null) ||
      computeEMI(principal, rate, tenure)
    : null;
  useEffect(() => {
    setRemote(null);
    setSource("Local estimate");
    if (!valid) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      api
        .post(
          "/emi/calculate",
          { principal, annual_rate: rate, tenure_months: tenure },
          { signal: controller.signal },
        )
        .then(({ data }) => {
          if (
            !controller.signal.aborted &&
            validEMIResponse(data, principal, tenure)
          ) {
            setRemote({ data, key: `${principal}/${rate}/${tenure}` });
            setSource("Service estimate");
          }
        })
        .catch(() => {});
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [principal, rate, tenure, valid]);
  const percentage =
    result && result.total_payment > 0
      ? (100 * result.principal) / result.total_payment
      : 100;
  return (
    <div
      className="aai-service-page aai-container aai-section"
      data-testid="emi-page"
    >
      <PageIntro
        eyebrow="Ownership, considered"
        title={
          <>
            Make room
            <br />
            for your next move.
          </>
        }
        description="Explore what your monthly payments could look like. Adjust the amount, rate and term to find a plan to discuss with your lender."
      />
      <div className="aai-finance-layout">
        <section
          className="aai-workbench aai-form"
          aria-label="Loan assumptions"
        >
          <span className="aai-kicker">Shape your estimate</span>
          <LoanField
            label="Loan amount"
            value={principal}
            onChange={setPrincipal}
            min={100000}
            max={5000000}
            step={10000}
            unit="₹"
            tid="emi-principal-slider"
          />
          <LoanField
            label="Annual interest rate"
            value={rate}
            onChange={setRate}
            min={0}
            max={25}
            step={0.05}
            unit="% p.a."
            tid="emi-rate-slider"
          />
          <LoanField
            label="Loan tenure"
            value={tenure}
            onChange={setTenure}
            min={12}
            max={84}
            step={1}
            unit="months"
            tid="emi-tenure-slider"
          />
          {!valid && (
            <p className="aai-error" role="alert">
              Use a loan of ₹1–50 lakh, an annual rate of 0–25%, and a tenure of
              12–84 whole months.
            </p>
          )}
        </section>
        <section
          className="aai-finance-result"
          aria-label="Estimated loan payments"
        >
          <span className="aai-kicker">Your estimated monthly payment</span>
          <output
            className="aai-monthly-payment"
            data-testid="emi-result"
            aria-live="polite"
          >
            {result ? formatINR(Math.round(result.emi)) : "—"}
          </output>
          <span className="aai-finance-source">Per month · {source}</span>
          <dl>
            <div>
              <dt>Loan principal</dt>
              <dd>{result ? formatINR(result.principal) : "—"}</dd>
            </div>
            <div>
              <dt>Total interest</dt>
              <dd>
                {result ? formatINR(Math.round(result.total_interest)) : "—"}
              </dd>
            </div>
            <div>
              <dt>Total repayment</dt>
              <dd>
                {result ? formatINR(Math.round(result.total_payment)) : "—"}
              </dd>
            </div>
          </dl>
          <div className="aai-repayment-bar" aria-hidden="true">
            <span style={{ width: `${percentage}%` }} />
          </div>
          <p className="aai-repayment-label">
            Principal {percentage.toFixed(0)}%{" "}
            <span>Interest {(100 - percentage).toFixed(0)}%</span>
          </p>
          <p className="aai-caption">
            Illustrative calculation. Processing fees, insurance, taxes and
            lender-specific charges are excluded. This is not a loan offer.
          </p>
        </section>
      </div>
      <div className="aai-finance-next">
        <div>
          <span className="aai-kicker">Ready for the next step?</span>
          <h2>
            Find the drive
            <br />
            worth planning for.
          </h2>
        </div>
        <Link className="aai-button" to="/cars">
          Explore the collection
        </Link>
      </div>
    </div>
  );
}
function LoanField({ label, value, onChange, min, max, step, unit, tid }) {
  return (
    <div className="aai-loan-field">
      <label>
        {label}
        <span className="aai-number-unit">
          <input
            required
            type="number"
            min={min}
            max={max}
            step={step}
            value={Number.isFinite(value) ? value : ""}
            onChange={(e) =>
              onChange(e.target.value === "" ? NaN : Number(e.target.value))
            }
            aria-label={label}
          />
          <span>{unit}</span>
        </span>
      </label>
      <input
        type="range"
        aria-label={`Adjust ${label.toLowerCase()}`}
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : min}
        onChange={(e) => onChange(Number(e.target.value))}
        data-testid={tid}
      />
      <div className="aai-range-limits">
        <span>{min.toLocaleString("en-IN")}</span>
        <span>{max.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
