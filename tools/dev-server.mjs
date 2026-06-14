import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const requestedPort = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function resolvePath(url) {
  const parsed = new URL(url, "http://localhost");
  const pathname = parsed.pathname === "/" ? "/index.html" : decodeURIComponent(parsed.pathname);
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  return join(root, safePath);
}

function createAppServer() {
  return createServer((req, res) => {
    const filePath = resolvePath(req.url || "/");
    if (!filePath.startsWith(root) || !existsSync(filePath)) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const type = mimeTypes[extname(filePath)] || "application/octet-stream";
    res.writeHead(200, {
      "cache-control": "no-store",
      "content-type": type,
    });
    createReadStream(filePath).pipe(res);
  });
}

function listen(port, attempts = 12) {
  const server = createAppServer();
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attempts > 0) {
      listen(port + 1, attempts - 1);
      return;
    }
    throw error;
  });
  server.listen(port, "::", () => {
    const address = server.address();
    const actualPort = typeof address === "object" && address ? address.port : port;
    console.log(`Zombie Wave Defense running at http://localhost:${actualPort}/`);
  });
}

listen(requestedPort);
