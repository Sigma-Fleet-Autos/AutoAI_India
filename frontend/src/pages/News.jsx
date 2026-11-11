import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { api } from "../lib/api";
import { licensedPhotos } from "../lib/vehicleMedia";
import { requestError } from "../lib/requestError";
import PageIntro from "../components/experience/PageIntro";
import Reveal from "../components/experience/Reveal";
function sourceLink(value) {
  try {
    const u = new URL(value);
    return ["https:", "http:"].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
}
export default function News() {
  const [items, setItems] = useState([]),
    [state, setState] = useState("loading"),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0),
    [category, setCategory] = useState("All"),
    [search, setSearch] = useState("");
  useEffect(() => {
    const c = new AbortController();
    setState("loading");
    api
      .get("/news", { signal: c.signal })
      .then(({ data }) => {
        setItems(Array.isArray(data) ? data : []);
        setState("ready");
      })
      .catch((e) => {
        if (!c.signal.aborted) {
          setError(requestError(e, "The journal is temporarily unavailable."));
          setState("error");
        }
      });
    return () => c.abort();
  }, [attempt]);
  const categories = useMemo(
    () => ["All", ...new Set(items.map((x) => x.category).filter(Boolean))],
    [items],
  );
  const filtered = items.filter(
    (x) =>
      (category === "All" || x.category === category) &&
      `${x.title} ${x.summary}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div
      className="aai-service-page aai-container aai-section"
      data-testid="news-page"
    >
      <PageIntro
        eyebrow="The AutoAI journal"
        title={
          <>
            A world
            <br />
            in motion.
          </>
        }
        description="New perspectives on the cars, technology and ideas shaping the way we drive."
      />
      <div className="aai-journal-toolbar">
        <div
          className="aai-category-tabs"
          role="group"
          aria-label="Journal topics"
        >
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c === "All" ? "All stories" : c}
            </button>
          ))}
        </div>
        <label className="aai-journal-search">
          Find a story
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the journal"
          />
        </label>
      </div>
      {state === "loading" ? (
        <p className="aai-state" role="status">
          Opening the journal…
        </p>
      ) : state === "error" ? (
        <div className="aai-state">
          <p className="aai-error" role="alert">
            {error}
          </p>
          <button
            className="aai-button"
            onClick={() => setAttempt(attempt + 1)}
          >
            Try again
          </button>
        </div>
      ) : !filtered.length ? (
        <div className="aai-state">
          <h2>No stories here yet.</h2>
          <p>Try a different topic or search.</p>
        </div>
      ) : (
        <div className="aai-journal-grid">
          {filtered.map((item, i) => {
            const photo = licensedPhotos(item)[0],
              href = sourceLink(item.source_url || item.url);
            return (
              <Reveal
                key={item.id || i}
                className={i === 0 ? "aai-journal-feature" : ""}
              >
                <article
                  className="aai-journal-story"
                  data-testid={`news-${item.id}`}
                >
                  {photo && (
                    <img
                      src={photo.url}
                      alt={photo.alt || ""}
                      loading="lazy"
                      width="1000"
                      height="650"
                    />
                  )}
                  <div className="aai-journal-meta">
                    <span>{item.category || "Journal"}</span>
                    <time>{item.date}</time>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                  <div className="aai-journal-source">
                    {href ? (
                      <a
                        className="aai-text-link"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.source || "Read the source"}
                        <ArrowUpRight size={17} />
                      </a>
                    ) : (
                      <span>{item.source || "Source not provided"}</span>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
