import { formatINR } from "../lib/api";
import { Shield, Fuel, Clock, Users, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import CarVisual from "./CarVisual";

export default function CarCard({ car }) {
  const { t } = useI18n();
  const price = car.price_ex_showroom;
  const hasVerifiedPriceValue = typeof price === "number" && Number.isFinite(price) && price > 0;
  return (
    <article
      data-testid={`car-card-${car.id}`}
      className="group relative border border-[#d9dad5] bg-white hover:border-[#777a75] transition-colors duration-300 flex flex-col overflow-hidden"
    >
      {/* car image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e8e9e5]">
        <CarVisual car={car} className="w-full h-full group-hover:scale-[1.025] transition-transform duration-700 ease-out" />

        {/* floating segment tag */}
        <div className="absolute top-3 left-3 bg-white/95 border border-[#d9dad5] px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-mono text-[#414640]">
          {car.segment}
        </div>

        {/* price chip */}
        <div className="absolute bottom-3 right-3 left-3 sm:left-auto bg-white/95 backdrop-blur-md border border-[#d9dad5] px-3 py-1.5 max-w-[calc(100%-1.5rem)]">
          <div className="text-[9px] uppercase tracking-[0.2em] text-[#555a55] font-mono">Ex-showroom · catalogue</div>
          <div className="font-num text-base sm:text-xl text-[#111412] leading-tight mt-0.5 break-words">{hasVerifiedPriceValue ? formatINR(price) : "Price unavailable"}</div>
        </div>
      </div>

      <div className="relative p-5 flex flex-col flex-1 z-[1]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#555a55] font-mono">{car.brand}</div>
            <div className="font-display text-xl font-medium text-[#111412] mt-1 leading-tight">{car.model}</div>
            <div className="text-xs text-[#555a55] mt-1">{car.variant}</div>
          </div>
          <div className="w-8 h-8 border border-[#d9dad5] group-hover:border-[#111412] group-hover:text-[#111412] flex items-center justify-center text-[#555a55] transition-all">
            <ArrowUpRight size={14} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-4 pt-4 border-t border-[#e2e3df]">
          <Stat icon={<Fuel size={12} />} label={car.fuel === "Electric" ? "range" : "kmpl"} value={car.fuel === "Electric" ? "—" : (car.mileage_kmpl ?? "—")} />
          <Stat icon={<Shield size={12} />} label="safety" value={car.safety_rating == null ? "—" : `${car.safety_rating}★`} />
          <Stat icon={<Users size={12} />} label="seats" value={car.seats ?? "—"} />
          <Stat icon={<Clock size={12} />} label="wait wk" value={car.waiting_weeks ?? "—"} />
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link
            to={`/showroom/${car.id}`}
            data-testid={`showroom-btn-${car.id}`}
            className="border border-[#c7c9c3] text-center text-[10px] uppercase tracking-[0.2em] font-bold py-3 min-h-11 flex items-center justify-center text-[#111412] hover:border-[#111412] hover:text-[#111412] transition-all"
          >
            View showroom
          </Link>
          <Link
            to={`/book/${car.id}`}
            data-testid={`book-btn-${car.id}`}
            className="bg-[#111412] text-white text-center text-[10px] uppercase tracking-[0.25em] font-bold py-3 min-h-11 flex items-center justify-center hover:bg-[#303630] transition-all"
          >
            {t("book_now")} →
          </Link>
        </div>
      </div>
    </article>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[#555a55]">
        {icon}
        <span className="text-[9px] uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm font-semibold text-[#111412] mt-0.5 font-mono">{value}</div>
    </div>
  );
}
