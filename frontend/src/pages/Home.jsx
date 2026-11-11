import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { api } from "../lib/api";
import CarCard from "../components/CarCard";
import Reveal from "../components/experience/Reveal";
const stories = [
  {
    label: "Space for every possibility.",
    category: "SUV",
    image: "/media/editorial-suv.jpg",
    alt: "Editorial SUV photography",
    sub: "Explore SUVs",
  },
  {
    label: "A different kind of arrival.",
    category: "Sedan",
    image: "/media/editorial-sedan.jpg",
    alt: "Editorial luxury sedan photography",
    sub: "Explore sedans",
  },
  {
    label: "Find your everyday extraordinary.",
    category: "All",
    image: "/media/editorial-sport.jpg",
    alt: "Editorial sports car photography",
    sub: "Explore every drive",
  },
];
const slides = [
  {
    image: "/media/editorial-hero.jpg",
    title: (
      <>
        Every journey.
        <br />
        An expression of you.
      </>
    ),
    category: "Sedan",
    label: "The art of moving forward.",
  },
  {
    image: "/media/editorial-suv.jpg",
    title: (
      <>
        More room.
        <br />
        For what moves you.
      </>
    ),
    category: "SUV",
    label: "Go beyond the everyday.",
  },
];
export default function Home() {
  const [cars, setCars] = useState([]),
    [state, setState] = useState("loading"),
    [slide, setSlide] = useState(0),
    [paused, setPaused] = useState(false),
    [attempt, setAttempt] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    api
      .get("/cars", { signal: controller.signal })
      .then(({ data }) => {
        setCars(Array.isArray(data) ? data.slice(0, 4) : []);
        setState("ready");
      })
      .catch((e) => {
        if (e.code !== "ERR_CANCELED") setState("error");
      });
    return () => controller.abort();
  }, [attempt]);
  const current = slides[slide];
  return (
    <div className="aai-home">
      <section
        className={`aai-hero ${paused || reduced ? "motion-paused" : ""}`}
        data-testid="hero-section"
        aria-label="Featured journeys"
      >
        <img
          key={slide}
          src={current.image}
          className="aai-hero-image"
          alt="Luxury automotive editorial photography"
          fetchPriority="high"
          width="1920"
          height="1280"
        />
        <div className="aai-hero-shade" />
        <div className="aai-hero-content">
          <p className="aai-kicker">{current.label}</p>
          <h1 key={current.label}>{current.title}</h1>
          <div className="aai-actions">
            <Link
              className="aai-button light"
              to={`/cars?category=${current.category}`}
              data-testid="hero-cta-compare"
            >
              Discover your drive <ArrowUpRight size={18} />
            </Link>
            <Link
              className="aai-button outline-light"
              to="/recommend"
              data-testid="hero-cta-recommend"
            >
              Find my perfect car
            </Link>
          </div>
        </div>
        <div className="aai-hero-bottom">
          <a href="#discover" aria-label="Discover vehicle categories">
            <ArrowDown size={24} />
          </a>
          <div className="aai-slide-controls">
            <button
              aria-label="Previous featured journey"
              onClick={() =>
                setSlide((slide + slides.length - 1) % slides.length)
              }
            >
              <ArrowLeft size={18} />
            </button>
            <span aria-live="polite">
              0{slide + 1} / 0{slides.length}
            </span>
            <button
              aria-label="Next featured journey"
              onClick={() => setSlide((slide + 1) % slides.length)}
            >
              <ArrowRight size={18} />
            </button>
            <button
              aria-label={paused ? "Resume hero motion" : "Pause hero motion"}
              aria-pressed={paused}
              onClick={() => setPaused(!paused)}
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          </div>
        </div>
      </section>
      <section className="aai-container aai-section" id="discover">
        <Reveal>
          <div className="aai-section-heading">
            <div>
              <span className="aai-kicker">
                Different lives. Distinct drives.
              </span>
              <h2>Find what moves you.</h2>
            </div>
            <Link className="aai-text-link" to="/cars">
              View all vehicles <ArrowUpRight size={18} />
            </Link>
          </div>
        </Reveal>
        <div className="aai-story-grid">
          {stories.map((story, i) => (
            <Reveal key={story.category} delay={i * 0.08}>
              <Link
                className="aai-story"
                to={`/cars?category=${story.category}`}
              >
                <div className="aai-story-image">
                  <img
                    src={story.image}
                    alt={story.alt}
                    loading="lazy"
                    width="900"
                    height="700"
                  />
                </div>
                <span className="aai-kicker">{story.sub}</span>
                <h3>
                  {story.label}
                  <ArrowUpRight size={22} />
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="aai-caption">
          Editorial imagery illustrates the driving experience. Explore each
          model for its available photography.
        </p>
      </section>
      <section className="aai-collection aai-section">
        <div className="aai-container">
          <Reveal>
            <div className="aai-section-heading">
              <div>
                <span className="aai-kicker">The collection</span>
                <h2>
                  Your next chapter.
                  <br />
                  Starts with a choice.
                </h2>
              </div>
              <Link className="aai-text-link" to="/cars">
                Explore the collection <ArrowUpRight size={18} />
              </Link>
            </div>
          </Reveal>
          <div className="aai-category-links">
            {[
              "SUV",
              "Sedan",
              "Hatchback",
              "Electric",
              "Hybrid",
              "Motorcycle",
            ].map((c) => (
              <Link key={c} to={`/cars?category=${c}`}>
                {c}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
          {state === "loading" ? (
            <p role="status" className="aai-state">
              Loading the collection…
            </p>
          ) : state === "error" ? (
            <div className="aai-state" role="status">
              <p>The collection is temporarily unavailable.</p>
              <button
                className="aai-button"
                onClick={() => setAttempt(attempt + 1)}
              >
                Try again
              </button>
            </div>
          ) : cars.length ? (
            <div className="aai-car-grid">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <p className="aai-state">
              New vehicles will appear here when published.
            </p>
          )}
        </div>
      </section>
      <section className="aai-editorial">
        <div className="aai-editorial-image">
          <img
            src="/media/editorial-suv.jpg"
            alt="An SUV ready for the open road"
            loading="lazy"
            width="1000"
            height="700"
          />
        </div>
        <Reveal className="aai-editorial-copy">
          <span className="aai-kicker">Intelligence. With intuition.</span>
          <h2>
            A drive that fits
            <br />
            your world.
          </h2>
          <p>
            City streets or open highways. A growing family or a new beginning.
            Tell our AI advisor what matters, and explore the possibilities
            together.
          </p>
          <Link className="aai-button light" to="/recommend">
            Meet your car advisor <ArrowUpRight size={18} />
          </Link>
        </Reveal>
      </section>
      <section className="aai-container aai-section">
        <Reveal>
          <span className="aai-kicker">Make an informed move.</span>
          <h2>Every detail. Considered.</h2>
        </Reveal>
        <div className="aai-tools">
          {[
            [
              "01",
              "Side by side.",
              "Compare the details that matter to your drive.",
              "Compare vehicles",
              "/compare",
            ],
            [
              "02",
              "Plan the possibilities.",
              "Explore monthly payments at your own pace.",
              "Calculate your EMI",
              "/emi",
            ],
            [
              "03",
              "Stay in the know.",
              "The latest stories from the automotive world.",
              "Read the journal",
              "/news",
            ],
          ].map(([n, title, copy, cta, to]) => (
            <Reveal key={n}>
              <span className="aai-tool-number">{n}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <Link className="aai-text-link" to={to}>
                {cta}
                <ArrowUpRight size={18} />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
