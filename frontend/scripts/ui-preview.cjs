// Local-only UI fixture server. Never imports backend code or connects to data.
// Usage: build with REACT_APP_BACKEND_URL=http://127.0.0.1:4173, then run
// node scripts/ui-preview.cjs --fixtures --port 4173
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const portFlag = process.argv.indexOf("--port");
const port = Number(portFlag < 0 ? 4173 : process.argv[portFlag + 1]);
const root = path.resolve(__dirname, "../build");
const photo = (file, view) => ({
  type: "image",
  url: `/media/${file}`,
  license_verified: true,
  license: "UI fixture only — editorial stock, not a named model",
  source_url: "https://unsplash.com/license",
  view,
});
const cars = [
  {
    id: "ui-suv",
    brand: "UI fixture",
    model: "Adventure SUV",
    variant: "Illustrative layout data",
    segment: "SUV",
    fuel: "Electric",
    price_ex_showroom: 4000000,
    seats: 5,
    transmission: "Automatic",
    media: [photo("editorial-suv.jpg", "exterior")],
  },
  {
    id: "ui-sedan",
    brand: "UI fixture",
    model: "Touring Sedan",
    variant: "Illustrative layout data",
    segment: "Sedan",
    fuel: "Hybrid",
    price_ex_showroom: 5000000,
    seats: 5,
    transmission: "Automatic",
    media: [photo("editorial-hero.jpg", "exterior")],
  },
  {
    id: "ui-hatch",
    brand: "UI fixture",
    model: "City Hatchback",
    variant: "No licensed model photography",
    segment: "Hatchback",
    fuel: "Petrol",
    price_ex_showroom: 1000000,
    seats: 5,
    transmission: "Manual",
    media: [],
  },
];
function json(res, data, status = 200) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}
function createPreviewServer({ staticRoot = root } = {}) {
  const files = new Map();
  const mime = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
  };
  function collect(directory, prefix = "") {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      const key = prefix + "/" + entry.name;
      if (entry.isDirectory()) collect(file, key);
      else if (entry.isFile())
        files.set(key, {
          body: fs.readFileSync(file),
          type: mime[path.extname(entry.name)] || "application/octet-stream",
        });
    }
  }
  collect(staticRoot);
  let axeSource = null;
  try {
    axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"));
  } catch {
    /* Audit is optional when axe-core is not installed. */
  }

  const viewportHtml = fs.readFileSync(
    path.join(__dirname, "ui-viewport.html"),
  );
  return http.createServer((req, res) => {
    let url;
    try {
      url = new URL(req.url, "http://localhost");
    } catch {
      res.writeHead(400);
      return res.end("Invalid URL");
    }
    if (url.pathname === "/__qa__/axe.js") {
      res.writeHead(axeSource ? 200 : 404, {
        "Content-Type": "text/javascript; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      });
      return res.end(axeSource || "");
    }
    if (url.pathname === "/__qa__/viewport") {
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      });
      return res.end(viewportHtml);
    }
    if (
      req.method === "POST" &&
      ["/api/ai/compare", "/api/ai/recommend", "/api/emi/calculate"].includes(
        url.pathname,
      )
    ) {
      let raw = "";
      req.on("data", (chunk) => {
        raw += chunk;
        if (Buffer.byteLength(raw) > 16384) {
          res.writeHead(413);
          res.end("Fixture request too large");
          req.destroy();
        }
      });
      req.on("end", () => {
        if (res.writableEnded) return;
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          return json(res, { detail: "Invalid fixture JSON" }, 400);
        }
        if (!data || typeof data !== "object" || Array.isArray(data))
          return json(res, { detail: "Expected a fixture object" }, 400);
        if (url.pathname === "/api/emi/calculate")
          return json(
            res,
            { detail: "UI fixture: use local calculation" },
            503,
          );
        if (
          [data.car_a, data.car_b, data.notes].some(
            (x) => typeof x === "string" && x.includes("unavailable"),
          )
        )
          return json(
            res,
            { detail: "UI fixture: service temporarily unavailable" },
            503,
          );
        if (url.pathname === "/api/ai/compare")
          return json(res, {
            car_a: cars[0],
            car_b: cars[1],
            analysis: {
              winner: "Adventure SUV",
              headline: "UI fixture: two different possibilities.",
              verdict: "Illustrative response for layout testing only.",
              best_for: "Testing the comparison interface",
              pros_a: ["Fixture comparison point"],
              cons_a: ["Verify real vehicle specifications"],
              pros_b: ["Alternate fixture point"],
              cons_b: ["Verify real vehicle availability"],
            },
          });
        return json(res, {
          summary:
            "UI fixture: illustrative recommendations, not real vehicle advice.",
          top_picks: cars
            .slice(0, 2)
            .map((car) => ({
              car,
              why: "Fixture data for responsive layout verification.",
              watchouts: "Confirm actual model data with a dealer.",
            })),
        });
      });
      return;
    }
    if (url.pathname.startsWith("/api/")) {
      if (req.method !== "GET")
        return json(res, { detail: "UI fixture server is read-only" }, 405);
      if (url.pathname === "/api/cars") return json(res, cars);
      if (url.pathname === "/api/news")
        return json(res, [
          {
            id: "fixture-story-1",
            category: "Technology",
            date: "UI fixture",
            title: "UI fixture: a new perspective on the everyday drive.",
            summary:
              "Illustrative journal content for layout testing. No current-event claim is made.",
            source: "Local UI fixture",
          },
          {
            id: "fixture-story-2",
            category: "Ownership",
            date: "UI fixture",
            title: "UI fixture: consider the details.",
            summary:
              "An illustrative second story for topic filters and mobile composition.",
            source: "Local UI fixture",
          },
        ]);
      if (url.pathname.startsWith("/api/cars/")) {
        const car = cars.find((x) => x.id === url.pathname.split("/").pop());
        return json(
          res,
          car || { detail: "Vehicle unavailable" },
          car ? 200 : 404,
        );
      }
      if (/\/capabilities$/.test(url.pathname))
        return json(res, {
          ready: false,
          blockers: ["UI test fixture: no approved 3D asset"],
          options: {},
        });
      if (/\/variants\//.test(url.pathname)) {
        const car = cars.find((x) => x.id === url.pathname.split("/").pop());
        return json(res, car || { detail: "Not found" }, car ? 200 : 404);
      }
      return json(res, { detail: "Not provided by UI fixture" }, 404);
    }
    let key;
    try {
      key = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(400);
      return res.end("Invalid URL encoding");
    }
    const file =
      files.get(key) || (!path.extname(key) ? files.get("/index.html") : null);
    if (!file) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, {
      "Content-Type": file.type,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(file.body);
  });
}
module.exports = { createPreviewServer };
if (require.main === module) {
  if (!process.argv.includes("--fixtures"))
    throw new Error("Explicit --fixtures flag required");
  const server = createPreviewServer();
  server.listen(port, "127.0.0.1", () =>
    console.log(
      `Read-only UI fixture preview at http://127.0.0.1:${server.address().port}`,
    ),
  );
}
