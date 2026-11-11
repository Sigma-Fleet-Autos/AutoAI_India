// Local-only UI fixture server. Never imports backend code or connects to data.
// Usage: build with REACT_APP_BACKEND_URL=http://127.0.0.1:4173, then run
// node scripts/ui-preview.cjs --fixtures --port 4173
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
if (!process.argv.includes("--fixtures"))
  throw new Error("Explicit --fixtures flag required");
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
http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/__qa__/viewport") {
      const width = Math.max(
        320,
        Math.min(1920, Number(url.searchParams.get("width")) || 390),
      );
      const height = Math.max(
        600,
        Math.min(1200, Number(url.searchParams.get("height")) || 844),
      );
      const target = [
        "/",
        "/cars",
        "/showroom/ui-suv",
        "/configurator/ui-suv",
        "/emi",
      ].includes(url.searchParams.get("path"))
        ? url.searchParams.get("path")
        : "/";
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end(
        `<!doctype html><html><head><meta charset="utf-8"><title>AutoAI responsive QA</title><style>body{margin:0;background:#d9dadd;font:12px Arial}p{margin:10px}iframe{border:0;display:block;transform-origin:top left;margin:20px}</style></head><body><p>LOCAL UI FIXTURE · ${width} × ${height} CSS px · ${target}</p><iframe title="Responsive AutoAI preview" src="${target}" width="${width}" height="${height}"></iframe><script>const f=document.querySelector('iframe');f.style.transform='scale('+Math.min(1,(innerWidth-40)/${width})+')';</script></body></html>`,
      );
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
    const requested = path.resolve(
      root,
      "." + decodeURIComponent(url.pathname),
    );
    if (!requested.startsWith(root + path.sep) && requested !== root) {
      res.writeHead(403);
      return res.end();
    }
    let file =
      fs.existsSync(requested) && fs.statSync(requested).isFile()
        ? requested
        : path.join(root, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(503);
      return res.end("Build frontend before starting UI preview");
    }
    const mime = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".jpg": "image/jpeg",
      ".png": "image/png",
      ".svg": "image/svg+xml",
    };
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Read-only UI fixture preview at http://127.0.0.1:${port}`),
  );
