"use strict";

const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const PAGES_DIR = path.join(SRC, "pages");
const PARTIALS_DIR = path.join(SRC, "partials");

const INCLUDE_RE = /\{\{>\s*([\w-]+)\s*\}\}/g;

function readPartial(name) {
  const file = path.join(PARTIALS_DIR, `${name}.html`);
  if (!fs.existsSync(file)) {
    throw new Error(`Unknown partial "${name}" referenced (looked for ${file})`);
  }
  return fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
}

function renderHtml(source) {
  return source.replace(INCLUDE_RE, (_match, name) => readPartial(name));
}

function buildPages() {
  const pageFiles = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".html"));
  for (const file of pageFiles) {
    const source = fs.readFileSync(path.join(PAGES_DIR, file), "utf8").replace(/\r\n/g, "\n");
    const rendered = renderHtml(source);
    fs.writeFileSync(path.join(ROOT, file), rendered);
    console.log(`  html  -> ${file}`);
  }
}

// Image references in the source CSS are already relative to the built
// styles.css location (the repo root, alongside images/), so leave every
// url(...) reference untouched instead of having esbuild resolve/copy it.
const CSS_ASSET_EXTERNAL = ["*.png", "*.jpg", "*.jpeg", "*.svg", "*.webp", "*.ico"];

async function buildStyles() {
  await esbuild.build({
    entryPoints: [path.join(SRC, "css", "main.css")],
    bundle: true,
    minify: true,
    external: CSS_ASSET_EXTERNAL,
    outfile: path.join(ROOT, "styles.css"),
    logLevel: "warning",
  });
  console.log("  css   -> styles.css");

  await esbuild.build({
    entryPoints: [path.join(SRC, "css", "pages", "book.css")],
    bundle: true,
    minify: true,
    external: CSS_ASSET_EXTERNAL,
    outfile: path.join(ROOT, "book.css"),
    logLevel: "warning",
  });
  console.log("  css   -> book.css");
}

async function buildScripts() {
  await esbuild.build({
    entryPoints: [path.join(SRC, "js", "main.js")],
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2018",
    outfile: path.join(ROOT, "script.js"),
    logLevel: "warning",
  });
  console.log("  js    -> script.js");

  await esbuild.build({
    entryPoints: [path.join(SRC, "js", "pages", "book.js")],
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2018",
    outfile: path.join(ROOT, "book.js"),
    logLevel: "warning",
  });
  console.log("  js    -> book.js");
}

async function build() {
  const start = Date.now();
  console.log("Building CareKind site from src/ ...");
  buildPages();
  await buildStyles();
  await buildScripts();
  console.log(`Done in ${Date.now() - start}ms`);
}

function watch() {
  console.log("Watching src/ for changes (Ctrl+C to stop)...");
  build().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });

  let pending = false;
  const rebuild = () => {
    if (pending) return;
    pending = true;
    setTimeout(() => {
      pending = false;
      build().catch((err) => console.error(err));
    }, 100);
  };

  fs.watch(SRC, { recursive: true }, rebuild);
}

if (require.main === module) {
  if (process.argv.includes("--watch")) {
    watch();
  } else {
    build().catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
  }
}

module.exports = { build };
