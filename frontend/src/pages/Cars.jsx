import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import CarCard from "../components/CarCard";
import { Search, ArrowRight, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [q, setQ] = useState("");
  const [segment, setSegment] = useState("All");
  const [fuel, setFuel] = useState("All");
  const [status, setStatus] = useState("loading");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setStatus("loading");
    api.get("/cars", { signal: controller.signal })
      .then(({ data }) => {
        if (!active) return;
        if (!Array.isArray(data)) throw new Error("Invalid catalogue response");
        setCars(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (!active || error?.code === "ERR_CANCELED") return;
        setStatus("error");
      });
    return () => { active = false; controller.abort(); };
  }, [retry]);

  const segments = useMemo(() => ["All", ...new Set(cars.map((car) => car.segment).filter(Boolean))], [cars]);
  const fuels = useMemo(() => ["All", ...new Set(cars.map((car) => car.fuel).filter(Boolean))], [cars]);
  const filtered = useMemo(() => cars.filter((car) => {
    if (segment !== "All" && car.segment !== segment) return false;
    if (fuel !== "All" && car.fuel !== fuel) return false;
    return !q.trim() || `${car.brand || ""} ${car.model || ""}`.toLocaleLowerCase().includes(q.trim().toLocaleLowerCase());
  }), [cars, segment, fuel, q]);

  return (
    <div className="autoai-atelier min-h-screen" data-testid="cars-page">
      <header className="atelier-container pt-16 pb-10 md:pt-24 md:pb-14">
        <p className="atelier-eyebrow mb-5">AutoAI India / Vehicle discovery</p>
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <h1 className="atelier-heading text-6xl md:text-7xl xl:text-8xl">Find the car that moves you.</h1>
          <div className="lg:pb-2">
            <p className="max-w-md leading-7 text-[#555a55]">Explore India's vehicle catalogue. Refine by segment or powertrain, then examine the details before you decide.</p>
            <Link to="/compare" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">Compare vehicles <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </header>

      <section className="border-y border-[#d9dad5] bg-[#eeefea]" aria-label="Filter vehicles">
        <div className="atelier-container grid gap-4 py-6 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <label htmlFor="atelier-car-search" className="mb-2 block text-xs font-semibold">Manufacturer or model</label>
            <Search size={18} aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 text-[#555a55]" />
            <input id="atelier-car-search" type="search" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search vehicles" data-testid="cars-search-input" className="w-full rounded-sm border border-[#c4c7c0] bg-white py-3 pl-12 pr-4 text-[#111412] outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#66816f]" />
          </div>
          <div className="md:col-span-3">
            <label htmlFor="atelier-car-segment" className="mb-2 block text-xs font-semibold">Category</label>
            <select id="atelier-car-segment" value={segment} onChange={(event) => setSegment(event.target.value)} data-testid="cars-segment-filter" className="w-full rounded-sm border border-[#c4c7c0] bg-white px-4 py-3 text-[#111412]">{segments.map((value) => <option key={value} value={value}>{value === "All" ? "All categories" : value}</option>)}</select>
          </div>
          <div className="md:col-span-3">
            <label htmlFor="atelier-car-fuel" className="mb-2 block text-xs font-semibold">Powertrain</label>
            <select id="atelier-car-fuel" value={fuel} onChange={(event) => setFuel(event.target.value)} data-testid="cars-fuel-filter" className="w-full rounded-sm border border-[#c4c7c0] bg-white px-4 py-3 text-[#111412]">{fuels.map((value) => <option key={value} value={value}>{value === "All" ? "All powertrains" : value}</option>)}</select>
          </div>
        </div>
      </section>

      <section className="atelier-container py-10 md:py-16" aria-label="Vehicle results" aria-live="polite">
        {status === "loading" && <div role="status" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((index) => <div key={index} className="h-80 animate-pulse rounded-sm bg-[#deddd7]" aria-hidden="true" />)}<span className="sr-only">Loading vehicles</span></div>}
        {status === "error" && <div role="alert" className="max-w-xl border-t border-[#9b9f98] py-12"><h2 className="atelier-heading text-3xl">The catalogue is temporarily unavailable.</h2><p className="mt-4 text-[#555a55]">We couldn't load verified vehicle information. Please try again.</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="atelier-action mt-6"><RotateCcw size={16} className="mr-2" aria-hidden="true" /> Retry loading</button></div>}
        {status === "ready" && <>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#d9dad5] pb-5"><p className="text-sm font-semibold">{filtered.length} {filtered.length === 1 ? "vehicle" : "vehicles"} found</p><p className="text-xs text-[#555a55]">Specifications and availability depend on verified catalogue data.</p></div>
          {filtered.length > 0 ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map((car) => <CarCard key={car.id} car={car} />)}</div> : <div className="py-16"><h2 className="atelier-heading text-3xl">No vehicles match your search.</h2><p className="mt-4 text-[#555a55]">Try another model, category or powertrain.</p><button type="button" className="atelier-action mt-6" onClick={() => { setQ(""); setSegment("All"); setFuel("All"); }}>Clear filters</button></div>}
        </>}
      </section>
    </div>
  );
}
