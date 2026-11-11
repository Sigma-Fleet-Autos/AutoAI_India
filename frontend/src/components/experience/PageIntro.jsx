import Reveal from "./Reveal";
export default function PageIntro({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "Automotive editorial photography",
  children,
}) {
  return (
    <header className={`aai-page-intro ${image ? "with-image" : ""}`}>
      <Reveal className="aai-page-intro-copy">
        <span className="aai-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {children}
      </Reveal>
      {image && (
        <div className="aai-page-intro-image">
          <img
            src={image}
            alt={imageAlt}
            width="1000"
            height="700"
            decoding="async"
          />
        </div>
      )}
    </header>
  );
}
export function FormMessage({
  error,
  pending,
  pendingText = "Working on it…",
}) {
  return (
    <div className="aai-form-message" aria-live="polite" aria-atomic="true">
      {error ? (
        <p role="alert" className="aai-error">
          {error}
        </p>
      ) : pending ? (
        <p role="status">{pendingText}</p>
      ) : null}
    </div>
  );
}
