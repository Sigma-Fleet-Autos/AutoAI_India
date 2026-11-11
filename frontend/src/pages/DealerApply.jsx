import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import PageIntro, { FormMessage } from "../components/experience/PageIntro";
import useApiAction from "../hooks/useApiAction";
const brands = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata",
  "Mahindra",
  "Kia",
  "Toyota",
  "Honda",
  "MG",
  "Skoda",
  "Volkswagen",
  "Renault",
  "Nissan",
  "Citroen",
  "Jeep",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volvo",
  "MINI",
];
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
export default function DealerApply() {
  const [form, setForm] = useState({
    business_name: "",
    owner_name: "",
    phone: "",
    email: "",
    city: "Mumbai",
    brands: [],
    bid_per_lead: 500,
  });
  const action = useApiAction();
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const toggle = (brand) =>
    setForm((f) => ({
      ...f,
      brands: f.brands.includes(brand)
        ? f.brands.filter((x) => x !== brand)
        : [...f.brands, brand],
    }));
  const submit = (e) => {
    e.preventDefault();
    if (form.brands.length) action.submit("/dealers/apply", form);
  };
  if (action.data)
    return (
      <div
        className="aai-service-page aai-container aai-section"
        data-testid="dealer-apply-success"
      >
        <PageIntro
          eyebrow="Application received"
          title={
            <>
              A new connection.
              <br />A shared ambition.
            </>
          }
          description="Your application has been received for review. Submission does not guarantee approval or activate a partnership."
        />
        <section className="aai-confirmation">
          <h2>{action.data.business_name || form.business_name}</h2>
          <dl>
            <div>
              <dt>Application reference</dt>
              <dd>{action.data.id || "Not provided"}</dd>
            </div>
            <div>
              <dt>City</dt>
              <dd>{action.data.city || form.city}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{action.data.status || "Pending review"}</dd>
            </div>
          </dl>
          <Link className="aai-button" to="/dealer">
            Go to dealer portal
            <ArrowUpRight size={18} />
          </Link>
        </section>
      </div>
    );
  return (
    <div
      className="aai-service-page aai-container aai-section"
      data-testid="dealer-apply-page"
    >
      <PageIntro
        eyebrow="Partner with AutoAI India"
        title={
          <>
            Great journeys.
            <br />
            Built together.
          </>
        }
        description="Connect your dealership with people exploring their next car. Tell us about your business to begin a partnership review."
        image="/media/editorial-sedan.jpg"
      />
      <div className="aai-advisor-layout">
        <aside className="aai-advisor-note">
          <span className="aai-kicker">A considered introduction</span>
          <h2>
            Local expertise.
            <br />
            Shared possibilities.
          </h2>
          <ol>
            <li>
              <span>01</span>Introduce your business.
            </li>
            <li>
              <span>02</span>Complete verification.
            </li>
            <li>
              <span>03</span>Agree terms before activation.
            </li>
          </ol>
          <p>
            Lead pricing, settlement and service commitments depend on the final
            dealership agreement.
          </p>
        </aside>
        <section className="aai-workbench">
          <form className="aai-form" onSubmit={submit}>
            <fieldset>
              <legend>Your dealership</legend>
              <div className="aai-form-grid">
                <label>
                  Business name
                  <input
                    required
                    maxLength={150}
                    value={form.business_name}
                    onChange={(e) => update("business_name", e.target.value)}
                    data-testid="dealer-business-input"
                    autoComplete="organization"
                  />
                </label>
                <label>
                  Contact name
                  <input
                    required
                    maxLength={100}
                    value={form.owner_name}
                    onChange={(e) => update("owner_name", e.target.value)}
                    data-testid="dealer-owner-input"
                    autoComplete="name"
                  />
                </label>
                <label>
                  Phone number
                  <input
                    required
                    type="tel"
                    maxLength={20}
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    data-testid="dealer-phone-input"
                    autoComplete="tel"
                  />
                </label>
                <label>
                  Email <span className="aai-optional">Optional</span>
                  <input
                    type="email"
                    maxLength={150}
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    data-testid="dealer-email-input"
                    autoComplete="email"
                  />
                </label>
                <label>
                  City
                  <select
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    data-testid="dealer-city-select"
                  >
                    {cities.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Proposed bid per lead (₹)
                  <input
                    required
                    type="number"
                    min={100}
                    max={10000}
                    step={50}
                    value={form.bid_per_lead}
                    onChange={(e) =>
                      update("bid_per_lead", Number(e.target.value))
                    }
                    data-testid="dealer-bid-input"
                  />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Brands you represent</legend>
              <p>Select at least one.</p>
              <div className="aai-brand-options">
                {brands.map((b) => (
                  <label key={b}>
                    <input
                      type="checkbox"
                      checked={form.brands.includes(b)}
                      onChange={() => toggle(b)}
                      data-testid={`brand-chip-${b.toLowerCase().replace(/[^a-z]/g, "-")}`}
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="aai-caption">
              Submitting this form allows the team to contact you about your
              application. Commercial terms require a separate agreement.
            </p>
            <button
              className="aai-button"
              disabled={action.pending || !form.brands.length}
              data-testid="dealer-submit-btn"
            >
              {action.pending
                ? "Submitting…"
                : "Submit partnership application"}
              <ArrowUpRight size={18} />
            </button>
          </form>
          <FormMessage
            error={action.error}
            pending={action.pending}
            pendingText="Sending your application…"
          />
        </section>
      </div>
    </div>
  );
}
