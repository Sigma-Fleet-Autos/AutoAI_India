import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  X,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { api, formatINR } from "../lib/api";
import { licensedPhotos, bodyStyle } from "../lib/vehicleMedia";
import CarVisual from "../components/CarVisual";
export default function Showroom() {
  const { carId } = useParams();
  const [car, setCar] = useState(null),
    [error, setError] = useState(false),
    [index, setIndex] = useState(0),
    [view, setView] = useState("exterior"),
    [attempt, setAttempt] = useState(0);
  const [failedPhotos, setFailedPhotos] = useState([]);
  const gallery = useRef(null),
    start = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const controller = new AbortController();
    setCar(null);
    setError(false);
    setIndex(0);
    setFailedPhotos([]);
    api
      .get(`/cars/${encodeURIComponent(carId)}`, { signal: controller.signal })
      .then(({ data }) => setCar(data))
      .catch((e) => {
        if (e.code !== "ERR_CANCELED") setError(true);
      });
    return () => controller.abort();
  }, [carId, attempt]);
  const photos = licensedPhotos(car).filter(
    (x) =>
      !failedPhotos.includes(x.url) &&
      (view === "interior" ? x.view === "interior" : x.view !== "interior"),
  );
  const image = photos[index] || photos[0];
  const change = (d) =>
    setIndex((i) => (i + d + photos.length) % photos.length);
  if (error)
    return (
      <div className="aai-container aai-section aai-state">
        <h1>Vehicle unavailable.</h1>
        <p>We couldn’t load this model.</p>
        <button className="aai-button" onClick={() => setAttempt(attempt + 1)}>
          Try again
        </button>
        <Link to="/cars" className="aai-text-link">
          Back to collection
        </Link>
      </div>
    );
  if (!car)
    return (
      <div className="aai-state" role="status">
        Preparing your model…
      </div>
    );
  const hasInterior = licensedPhotos(car).some((x) => x.view === "interior");
  return (
    <div className="aai-detail" data-testid="showroom-page">
      <div className="aai-model-nav">
        <Link to="/cars">
          <ArrowLeft size={16} />
          The collection
        </Link>
        <nav aria-label="Model sections">
          <a href="#overview">Overview</a>
          <a href="#specifications">Specifications</a>
          <Link to={`/configurator/${car.variant_id || car.id}`}>
            Configure
          </Link>
        </nav>
      </div>
      <section className="aai-detail-intro aai-container" id="overview">
        <span className="aai-kicker">
          {car.brand} / {bodyStyle(car)}
        </span>
        <h1>{car.model}</h1>
        <p>{car.variant}</p>
        <div className="aai-actions">
          <Link
            className="aai-button"
            to={`/configurator/${car.variant_id || car.id}`}
          >
            Configure your vehicle
            <ArrowUpRight size={18} />
          </Link>
          <Link className="aai-button secondary" to={`/book/${car.id}`}>
            Enquire about this model
          </Link>
        </div>
      </section>
      <section className="aai-model-gallery" aria-label="Vehicle gallery">
        <div
          className="aai-gallery-stage"
          onTouchStart={(e) => {
            start.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (start.current !== null && photos.length > 1) {
              const d = e.changedTouches[0].clientX - start.current;
              if (Math.abs(d) > 45) change(d < 0 ? 1 : -1);
            }
            start.current = null;
          }}
        >
          <AnimatePresence mode="wait">
            {image ? (
              <motion.img
                key={image.url}
                src={image.url}
                alt={image.alt || `${car.brand} ${car.model} ${view}`}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onError={() => {
                  setFailedPhotos((old) => [...old, image.url]);
                  setIndex(0);
                }}
              />
            ) : (
              <CarVisual car={car} />
            )}
          </AnimatePresence>
          {image && (
            <button
              className="aai-gallery-full"
              aria-label="Open full-screen gallery"
              onClick={() => gallery.current.showModal()}
            >
              <Maximize2 size={21} />
            </button>
          )}
        </div>
        <div className="aai-gallery-toolbar">
          <div className="aai-view-tabs">
            <button
              aria-pressed={view === "exterior"}
              onClick={() => {
                setView("exterior");
                setIndex(0);
              }}
            >
              Exterior
            </button>
            <button
              disabled={!hasInterior}
              title={
                hasInterior
                  ? "View interior"
                  : "Licensed interior photography is not yet available"
              }
              aria-pressed={view === "interior"}
              onClick={() => {
                setView("interior");
                setIndex(0);
              }}
            >
              Interior
            </button>
          </div>
          <span>
            {photos.length
              ? `${index + 1} / ${photos.length}`
              : "Model photography pending"}
          </span>
          <div className="aai-gallery-arrows">
            <button
              disabled={photos.length < 2}
              onClick={() => change(-1)}
              aria-label="Previous vehicle photograph"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              disabled={photos.length < 2}
              onClick={() => change(1)}
              aria-label="Next vehicle photograph"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        {photos.length > 1 && (
          <div className="aai-thumbnails">
            {photos.map((p, i) => (
              <button
                key={p.url}
                aria-label={`View photograph ${i + 1}`}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
              >
                <img src={p.url} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
        <p className="aai-caption">
          Photographic gallery. Genuine orbit and paint changes are available
          only for models with verified 3D assets.
        </p>
      </section>
      <section className="aai-container aai-section" id="specifications">
        <span className="aai-kicker">The details that matter</span>
        <h2>Get to know your drive.</h2>
        <dl className="aai-specs">
          {[
            ["Ex-showroom", formatINR(car.price_ex_showroom)],
            ["Powertrain", car.fuel],
            ["Seats", car.seats],
            ["Transmission", car.transmission],
            ["Body style", bodyStyle(car)],
          ]
            .filter(([, value]) => value != null)
            .map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>
        <p className="aai-caption">
          Catalogue values are provided by the existing service. Confirm
          specifications, prices and availability with an authorised dealer.
        </p>
        <div className="aai-actions">
          <Link
            className="aai-button"
            to={`/configurator/${car.variant_id || car.id}`}
          >
            Explore configuration
            <ArrowUpRight size={18} />
          </Link>
          <Link className="aai-text-link" to="/compare">
            Compare your options
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <dialog
        ref={gallery}
        className="aai-lightbox"
        aria-label="Full-screen vehicle photography"
      >
        <button
          onClick={() => gallery.current.close()}
          aria-label="Close gallery"
        >
          <X />
        </button>
        {image && (
          <img src={image.url} alt={image.alt || `${car.brand} ${car.model}`} />
        )}
      </dialog>
    </div>
  );
}
