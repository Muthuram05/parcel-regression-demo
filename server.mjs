import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { quote, products } from "./src/checkout/pricing.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
let revision = "uncommitted";
try {
  revision = execFileSync("git", ["-C", root, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
} catch {}
const files = new Map([
  ["/", ["public/index.html", "text/html; charset=utf-8"]],
  ["/app.js", ["public/app.js", "text/javascript; charset=utf-8"]],
  ["/style.css", ["public/style.css", "text/css; charset=utf-8"]],
]);
function json(res, status, value) {
  res.writeHead(status, {
    "content-type": "application/json",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(value));
}
const server = http.createServer(async (req, res) => {
  try {
    const path = new URL(req.url, "http://localhost").pathname;
    res.setHeader("x-content-type-options", "nosniff");
    res.setHeader(
      "content-security-policy",
      "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; frame-ancestors 'none'",
    );
    if (req.method === "GET" && path === "/__build")
      return json(res, 200, { revision, id: revision });
    if (req.method === "GET" && path === "/api/products")
      return json(res, 200, products);
    if (req.method === "POST" && path === "/api/quote") {
      let input = "";
      for await (const chunk of req) {
        input += chunk;
        if (Buffer.byteLength(input) > 4096)
          return json(res, 413, { error: "Request is too large." });
      }
      try {
        return json(res, 200, quote(JSON.parse(input)));
      } catch (error) {
        return json(res, 422, { error: error.message });
      }
    }
    if (req.method === "GET" && files.has(path)) {
      const [file, type] = files.get(path);
      res.writeHead(200, { "content-type": type, "cache-control": "no-store" });
      return res.end(await readFile(new URL(file, import.meta.url)));
    }
    json(res, 404, { error: "Page not found." });
  } catch {
    if (!res.headersSent) json(res, 500, { error: "Unable to load the demo." });
    else res.end();
  }
});
const port = Number(process.env.PORT || 4180);
server.listen(port, process.env.HOST || "127.0.0.1", () =>
  console.log(`Parcel demo http://127.0.0.1:${port}`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close(() => process.exit(0)));
