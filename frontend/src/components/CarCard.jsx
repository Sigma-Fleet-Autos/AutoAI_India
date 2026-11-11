import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatINR } from "../lib/api";
import { bodyStyle } from "../lib/vehicleMedia";
import CarVisual from "./CarVisual";
export default function CarCard({ car }) {
  return (
    <article className="aai-car" data-testid={`car-card-${car.id}`}>
      <Link
        className="aai-car-visual-link"
        to={`/showroom/${car.id}`}
        aria-label={`Explore ${car.brand} ${car.model}`}
      >
        <CarVisual car={car} />
      </Link>
      <div className="aai-car-body">
        <div className="aai-car-meta">
          <span>{car.brand}</span>
          <span>
            {bodyStyle(car)} · {car.fuel}
          </span>
        </div>
        <h3>
          <Link to={`/showroom/${car.id}`}>
            {car.model}
            <ArrowUpRight size={22} />
          </Link>
        </h3>
        <p>{car.variant}</p>
        <div className="aai-car-price">
          {formatINR(car.price_ex_showroom)}
          <small>Ex-showroom · dealer confirmation required</small>
        </div>
        <div className="aai-actions">
          <Link
            className="aai-button"
            to={`/showroom/${car.id}`}
            data-testid={`showroom-btn-${car.id}`}
          >
            Explore model
          </Link>
          <Link
            className="aai-text-link"
            to={`/book/${car.id}`}
            data-testid={`book-btn-${car.id}`}
          >
            Enquire <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
