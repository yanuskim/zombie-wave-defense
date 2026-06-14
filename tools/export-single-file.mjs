import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const outputPath = join(root, "dist", "zombie-wave-defense-iphone-test.html");

function readText(path) {
  return readFileSync(join(root, path), "utf8");
}

function dataUri(path) {
  const ext = path.split(".").pop();
  const mime = ext === "png" ? "image/png" : "application/octet-stream";
  const body = readFileSync(join(root, path)).toString("base64");
  return `data:${mime};base64,${body}`;
}

function inlineCssAssets(css) {
  return css.replace(/url\("([^"]+)"\)/g, (_match, assetPath) => {
    if (!assetPath.startsWith("assets/")) return `url("${assetPath}")`;
    return `url("${dataUri(assetPath)}")`;
  });
}

function escapeScript(script) {
  return script.replaceAll("</script>", "<\\/script>");
}

let html = readText("index.html");
const css = inlineCssAssets(readText("styles.css"));
const js = readText("game.js").replace(/assets\/images\/[\w-]+\.png/g, (assetPath) => dataUri(assetPath));

html = html
  .replace(/\s*<link rel="manifest" href="manifest\.webmanifest">\n/, "\n")
  .replace(/<link rel="stylesheet" href="styles\.css\?[^"]+">/, `<style>\n${css}\n</style>`)
  .replace(/<script src="game\.js\?[^"]+"><\/script>/, `<script>\n${escapeScript(js)}\n</script>`)
  .replace(/\n\s*<script>\n\s*if \("serviceWorker" in navigator[\s\S]*?<\/script>/, "");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, html);

console.log(`Exported ${outputPath}`);
