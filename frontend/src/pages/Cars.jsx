import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { bodyStyle, matchesCategory } from "../lib/vehicleMedia";
import CarCard from "../components/CarCard";
const categories = [
  "All",
  "SUV",
  "Sedan",
  "Hatchback",
  "MPV",
  "Electric",
  "Hybrid",
  "Motorcycle",
];
export default function Cars() {
  const [params, setParams] = useSearchParams(),
    [cars, setCars] = useState([]),
    [state, setState] = useState("loading"),
    [attempt, setAttempt] = useState(0);
  const q = params.get("q") || "",
    category = params.get("category") || "All",
    fuel = params.get("fuel") || "All",
    sort = params.get("sort") || "name";
  const update = (key, value) =>
    setParams(
      (old) => {
        const next = new URLSearchParams(old);
        if (value && value !== "All") next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    api
      .get("/cars", { signal: controller.signal })
      .then(({ data }) => {
        setCars(Array.isArray(data) ? data : []);
        setState("ready");
      })
      .catch((e) => {
        if (e.code !== "ERR_CANCELED") setState("error");
      });
    return () => controller.abort();
  }, [attempt]);
  const fuels = useMemo(
    () => ["All", ...new Set(cars.map((c) => c.fuel).filter(Boolean))],
    [cars],
  );
  const filtered = useMemo(
    () =>
      cars
        .filter(
          (c) =>
            matchesCategory(c, category) &&
            (fuel === "All" || fuel === c.fuel) &&
            `${c.brand} ${c.model} ${c.variant}`
              .toLowerCase()
              .includes(q.trim().toLowerCase()),
        )
        .sort((a, b) =>
          sort === "price-low"
            ? (a.price_ex_showroom ?? Infinity) -
              (b.price_ex_showroom ?? Infinity)
            : sort === "price-high"
              ? (b.price_ex_showroom ?? -Infinity) -
                (a.price_ex_showroom ?? -Infinity)
              : `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`),
        ),
    [cars, category, fuel, q, sort],
  );
  const grouped = useMemo(
    () =>
      Object.entries(
        filtered.reduce((acc, c) => {
          (acc[bodyStyle(c)] ??= []).push(c);
          return acc;
        }, {}),
      ),
    [filtered],
  );
  return (
    <div
      className="aai-catalogue aai-container aai-section"
      data-testid="cars-page"
    >
      <span className="aai-kicker">Discover your next drive</span>
      <h1>The collection.</h1>
      <p className="aai-lead">
        Different ambitions. One place to explore them.
      </p>
      <div
        className="aai-category-tabs"
        role="group"
        aria-label="Vehicle categories"
      >
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => update("category", c)}
          >
            {c === "All" ? "All vehicles" : c}
          </button>
        ))}
      </div>
      <form className="aai-filters" onSubmit={(e) => e.preventDefault()}>
        <label>
          Search
          <input
            type="search"
            value={q}
            onChange={(e) => update("q", e.target.value)}
            placeholder="Brand or model"
            data-testid="cars-search-input"
          />
        </label>
        <label>
          Body style
          <select
            value={category}
            onChange={(e) => update("category", e.target.value)}
            data-testid="cars-segment-filter"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Powertrain
          <select
            value={fuel}
            onChange={(e) => update("fuel", e.target.value)}
            data-testid="cars-fuel-filter"
          >
            {fuels.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
        <label>
          Sort by
          <select value={sort} onChange={(e) => update("sort", e.target.value)}>
            <option value="name">Model name</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </form>
      <div className="aai-results" role="status" aria-live="polite">
        {state === "loading"
          ? "Loading collection…"
          : `${filtered.length} vehicles`}
        {(q || category !== "All" || fuel !== "All") && (
          <button onClick={() => setParams({})}>Clear filters</button>
        )}
      </div>
      {state === "error" ? (
        <div className="aai-state" role="alert">
          <h2>Let’s try that again.</h2>
          <p>The catalogue could not be loaded.</p>
          <button
            className="aai-button"
            onClick={() => setAttempt(attempt + 1)}
          >
            Retry collection
          </button>
        </div>
      ) : state === "ready" && !filtered.length ? (
        <div className="aai-state">
          <h2>No matching vehicles.</h2>
          <p>Try another category or clear your filters.</p>
        </div>
      ) : (
        grouped.map(([style, vehicles]) => (
          <section
            key={style}
            className="aai-model-group"
            aria-label={`${style} collection`}
          >
            <h2>
              {style}
              <span>{vehicles.length}</span>
            </h2>
            <div className="aai-car-grid">
              {vehicles.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
