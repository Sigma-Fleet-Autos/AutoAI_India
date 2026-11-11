import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatINR, createIdempotencyKey } from "../lib/api";
import { requestError } from "../lib/requestError";
import useApiAction from "../hooks/useApiAction";
import PageIntro, { FormMessage } from "../components/experience/PageIntro";
import CarVisual from "../components/CarVisual";
const cities = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
];
export default function BookCar() {
  const { carId } = useParams(),
    action = useApiAction();
  const reset = action.reset;
  const [car, setCar] = useState(null),
    [state, setState] = useState("loading"),
    [loadError, setLoadError] = useState(""),
    [attempt, setAttempt] = useState(0);
  const key = useRef(null);
  if (!key.current || key.current.carId !== carId)
    key.current = { carId, value: createIdempotencyKey() };
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Mumbai",
    preferred_date: "",
    test_drive: true,
    needs_loan: false,
    needs_insurance: false,
    exchange_car: "",
    notes: "",
  });
  const update = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  useEffect(() => {
    const c = new AbortController();
    reset();
    setState("loading");
    setCar(null);
    api
      .get(`/cars/${encodeURIComponent(carId)}`, { signal: c.signal })
      .then(({ data }) => {
        setCar(data);
        setState("ready");
      })
      .catch((e) => {
        if (!c.signal.aborted) {
          setLoadError(requestError(e, "This vehicle could not be loaded."));
          setState("error");
        }
      });
    return () => c.abort();
  }, [carId, attempt, reset]);
  const submit = (e) => {
    e.preventDefault();
    action.submit("/bookings", {
      car_id: carId,
      idempotency_key: key.current.value,
      ...form,
    });
  };
  if (state === "loading")
    return (
      <div className="aai-state" role="status">
        Preparing your vehicle enquiry…
      </div>
    );
  if (state === "error")
    return (
      <div className="aai-service-page aai-container aai-section aai-state">
        <h1>Let’s try that again.</h1>
        <p className="aai-error" role="alert">
          {loadError}
        </p>
        <button className="aai-button" onClick={() => setAttempt(attempt + 1)}>
          Retry vehicle
        </button>
        <Link className="aai-text-link" to="/cars">
          Back to the collection
        </Link>
      </div>
    );
  const booking = action.data;
  if (booking)
    return (
      <div
        className="aai-service-page aai-container aai-section"
        data-testid="booking-success-page"
      >
        <PageIntro
          eyebrow="Enquiry received"
          title={
            <>
              The beginning
              <br />
              of your next drive.
            </>
          }
          description="Your request has been received. Your dealer will confirm availability and the next steps."
        />
        <section className="aai-confirmation">
          <h2>{booking.car_name || `${car.brand} ${car.model}`}</h2>
          <p role="status">
            {booking.status || "Awaiting dealer confirmation"}
          </p>
          <dl>
            {[
              ["Reference", booking.id],
              ["Dealer", booking.dealer],
              ["City", booking.city],
              ["Preferred date", booking.preferred_date || "Flexible"],
              ["Test drive requested", booking.test_drive ? "Yes" : "No"],
              [
                "Callback estimate",
                booking.eta_call_minutes != null
                  ? `${booking.eta_call_minutes} minutes`
                  : "Dealer to confirm",
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value || "Not provided"}</dd>
              </div>
            ))}
          </dl>
          <p className="aai-caption">
            An enquiry does not reserve inventory or confirm delivery. No
            vehicle payment is taken on this page.
          </p>
          <div className="aai-actions">
            <Link className="aai-button" to="/my-bookings">
              My bookings
            </Link>
            <Link
              className="aai-text-link"
              to="/cars"
              data-testid="booking-back-to-cars"
            >
              Back to the collection
            </Link>
          </div>
        </section>
      </div>
    );
  return (
    <div
      className="aai-service-page aai-container aai-section"
      data-testid="book-car-page"
    >
      <Link
        className="aai-text-link"
        to={`/showroom/${carId}`}
        data-testid="book-back-link"
      >
        ← Back to model
      </Link>
      <PageIntro
        eyebrow="Meet your next drive"
        title="Make the connection."
        description="Request a test drive or a conversation with a dealer. Choose what works for you."
      />
      <div className="aai-booking-layout">
        <aside className="aai-booking-model">
          <CarVisual car={car} />
          <div>
            <span className="aai-kicker">{car.brand}</span>
            <h2>{car.model}</h2>
            <p>{car.variant}</p>
            <dl>
              {[
                ["Ex-showroom", formatINR(car.price_ex_showroom)],
                ["Powertrain", car.fuel],
                ["Transmission", car.transmission],
                ["Seats", car.seats],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value ?? "Not provided"}</dd>
                </div>
              ))}
            </dl>
            <p className="aai-caption">
              Your dealer will confirm final specifications, city pricing and
              stock availability.
            </p>
          </div>
        </aside>
        <section className="aai-workbench">
          <form className="aai-form" onSubmit={submit}>
            <fieldset>
              <legend>A little about you</legend>
              <div className="aai-form-grid">
                <label>
                  Your name
                  <input
                    required
                    maxLength={100}
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    data-testid="book-name-input"
                  />
                </label>
                <label>
                  Phone number
                  <input
                    required
                    type="tel"
                    maxLength={20}
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    data-testid="book-phone-input"
                  />
                </label>
                <label>
                  Email <span className="aai-optional">Optional</span>
                  <input
                    type="email"
                    maxLength={150}
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    data-testid="book-email-input"
                  />
                </label>
                <label>
                  City
                  <select
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    data-testid="book-city-select"
                  >
                    {cities.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Preferred date <span className="aai-optional">Optional</span>
                  <input
                    type="date"
                    value={form.preferred_date}
                    onChange={(e) => update("preferred_date", e.target.value)}
                    data-testid="book-date-input"
                  />
                </label>
                <label>
                  Exchange vehicle{" "}
                  <span className="aai-optional">Optional</span>
                  <input
                    maxLength={150}
                    value={form.exchange_car}
                    onChange={(e) => update("exchange_car", e.target.value)}
                    placeholder="Year, brand and model"
                    data-testid="book-exchange-input"
                  />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>How can we help?</legend>
              <div className="aai-checkbox-options">
                {[
                  ["test_drive", "Request a test drive", "book-testdrive"],
                  ["needs_loan", "Explore finance options", "book-loan"],
                  [
                    "needs_insurance",
                    "Request an insurance quote",
                    "book-insurance",
                  ],
                ].map(([name, label, tid]) => (
                  <label key={name}>
                    <input
                      type="checkbox"
                      checked={form[name]}
                      onChange={(e) => update(name, e.target.checked)}
                      data-testid={tid}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <label>
                Anything else? <span className="aai-optional">Optional</span>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  data-testid="book-notes-input"
                />
              </label>
            </fieldset>
            <p className="aai-caption">
              By submitting, you ask AutoAI India and the selected dealer to
              contact you about this enquiry.
            </p>
            <button
              className="aai-button"
              disabled={
                action.pending || !form.name.trim() || !form.phone.trim()
              }
              data-testid="book-submit-btn"
            >
              {action.pending
                ? "Sending your enquiry…"
                : "Request dealer contact"}
            </button>
          </form>
          <FormMessage
            error={action.error}
            pending={action.pending}
            pendingText="Sending your enquiry…"
          />
        </section>
      </div>
    </div>
  );
}
