import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import PageIntro from "../components/experience/PageIntro";
import Reveal from "../components/experience/Reveal";
export default function About() {
  return (
    <div className="aai-service-page" data-testid="about-page">
      <div className="aai-container aai-section">
        <PageIntro
          eyebrow="This is AutoAI India"
          title={
            <>
              For the road.
              <br />
              And the person
              <br />
              behind the wheel.
            </>
          }
          description="Buying a car is a personal decision. AutoAI India brings discovery, comparison and ownership tools together, so you can explore with more clarity."
          image="/media/editorial-hero.jpg"
        />
        <Reveal className="aai-about-statement">
          <span className="aai-kicker">Our perspective</span>
          <h2>
            The right questions.
            <br />
            Before the next turn.
          </h2>
          <p>
            What fits your everyday life? What matters beyond the specification
            sheet? What will ownership look like? We build tools that help you
            ask those questions and find your own answers.
          </p>
        </Reveal>
      </div>
      <section className="aai-about-image">
        <img
          src="/media/editorial-suv.jpg"
          alt="An SUV in an open mountain landscape"
          loading="lazy"
          width="1000"
          height="700"
        />
        <div>
          <span className="aai-kicker">Room for your ambitions</span>
          <h2>
            Everyday routes.
            <br />
            Extraordinary possibilities.
          </h2>
        </div>
      </section>
      <section className="aai-container aai-section">
        <span className="aai-kicker">Our principles</span>
        <div className="aai-principles">
          {[
            [
              "01",
              "Clarity before complexity.",
              "Specifications, prices and availability should help you make a decision. We distinguish estimates and AI guidance from details that require dealer confirmation.",
            ],
            [
              "02",
              "A view you can trust.",
              "Photography and 3D assets have different capabilities. We show genuine views, enable supported interactions and identify missing assets.",
            ],
            [
              "03",
              "Your priorities lead.",
              "Your budget, routines and preferences shape the shortlist. Comparison and planning tools help you explore the trade-offs.",
            ],
          ].map(([n, title, body]) => (
            <Reveal key={n}>
              <span className="aai-kicker">{n}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
        <div className="aai-about-next">
          <h2>
            Discover your
            <br />
            next chapter.
          </h2>
          <div className="aai-actions">
            <Link
              className="aai-button"
              to="/compare"
              data-testid="about-cta-compare"
            >
              Compare your shortlist
              <ArrowUpRight size={18} />
            </Link>
            <Link
              className="aai-text-link"
              to="/dealers/apply"
              data-testid="about-cta-dealer"
            >
              Partner with us
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
