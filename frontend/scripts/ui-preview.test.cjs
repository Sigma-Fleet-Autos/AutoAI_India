const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { once } = require("node:events");
const { createPreviewServer } = require("./ui-preview.cjs");
let server, origin, directory;
before(async () => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "autoai-preview-"));
  fs.writeFileSync(path.join(directory, "index.html"), "<h1>UI fixture</h1>");
  server = createPreviewServer({ staticRoot: directory });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(directory, { recursive: true, force: true });
});
test("viewport response never interpolates attacker-controlled query text", async () => {
  const payload = "<script>alert(1)</script>";
  const response = await fetch(
    origin +
      "/__qa__/viewport?path=" +
      encodeURIComponent(payload) +
      "&width=" +
      encodeURIComponent(payload),
  );
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.ok(!html.includes(payload));
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});
test("encoded traversal cannot read outside the preloaded build manifest", async () => {
  const response = await fetch(origin + "/%2e%2e%2fpackage.json");
  assert.equal(response.status, 404);
  assert.equal(await response.text(), "Not found");
});
test("malformed URL encoding produces a bounded error response", async () => {
  const response = await fetch(origin + "/%E0%A4%A");
  assert.equal(response.status, 400);
});
test("mutating API calls are refused", async () => {
  const response = await fetch(origin + "/api/bookings", {
    method: "POST",
    body: "{}",
  });
  assert.equal(response.status, 405);
});
test("published UI routes resolve to the build index", async () => {
  const response = await fetch(origin + "/cars");
  assert.equal(await response.text(), "<h1>UI fixture</h1>");
});
