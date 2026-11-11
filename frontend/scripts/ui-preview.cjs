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
  const mime = {".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".json":"application/json",".jpg":"image/jpeg",".png":"image/png",".svg":"image/svg+xml"};
  function collect(directory, prefix = "") {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      const key = prefix + "/" + entry.name;
      if (entry.isDirectory()) collect(file, key);
      else if (entry.isFile()) files.set(key, { body: fs.readFileSync(file), type: mime[path.extname(entry.name)] || "application/octet-stream" });
    }
  }
  collect(staticRoot);
  const viewportHtml = fs.readFileSync(path.join(__dirname, "ui-viewport.html"));
  return http.createServer((req, res) => {
    let url;
    try { url = new URL(req.url, "http://localhost"); } catch { res.writeHead(400); return res.end("Invalid URL"); }
    if (url.pathname === "/__qa__/viewport") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "X-Content-Type-Options": "nosniff" });
      return res.end(viewportHtml);
    }
    if (url.pathname.startsWith("/api/")) {
      if (req.method !== "GET")
        return json(res, { detail: "UI fixture server is read-only" }, 405);
      if (url.pathname === "/api/cars") return json(res, cars);
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
    try { key = decodeURIComponent(url.pathname); } catch { res.writeHead(400); return res.end("Invalid URL encoding"); }
    const file = files.get(key) || (!path.extname(key) ? files.get("/index.html") : null);
    if (!file) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": file.type, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    res.end(file.body);
  });
}
module.exports = { createPreviewServer };
if (require.main === module) {
  if (!process.argv.includes("--fixtures")) throw new Error("Explicit --fixtures flag required");
  const server = createPreviewServer();
  server.listen(port, "127.0.0.1", () => console.log(`Read-only UI fixture preview at http://127.0.0.1:${server.address().port}`));
}
