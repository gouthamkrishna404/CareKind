"use strict";

const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const PAGES_DIR = path.join(SRC, "pages");
const PARTIALS_DIR = path.join(SRC, "partials");
const DATA_DIR = path.join(SRC, "data");

const INCLUDE_RE = /\{\{>\s*([\w-]+)\s*\}\}/g;

// {{#each listName}} ... {{/each}} repeats its body once per item in
// data/listName.json. Inside the body: {{field}} inserts item.field,
// {{@index}} inserts a 1-based position, and {{#if field}}...{{/if}}
// keeps its content only when item.field is truthy (for optional bits
// like a service card's extra CTA link).
const EACH_RE = /\{\{#each\s+([\w-]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
const IF_RE = /\{\{#if\s+([\w-]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
const TOKEN_RE = /\{\{(@?[\w-]+)\}\}/g;

// {{page.field}} inserts data/pages.json[<the current page's file name>].field
// — the per-page SEO title/description/OG/Twitter/JSON-LD copy. Namespaced
// under "page." (rather than the bare {{field}} each-blocks use) so a page
// template can never collide with an each-block item field of the same name.
const PAGE_TOKEN_RE = /\{\{page\.([\w-]+)\}\}/g;

function readPartial(name) {
  const file = path.join(PARTIALS_DIR, `${name}.html`);
  if (!fs.existsSync(file)) {
    throw new Error(`Unknown partial "${name}" referenced (looked for ${file})`);
  }
  return fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
}

function loadData() {
  const data = {};
  for (const file of fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"))) {
    const name = path.basename(file, ".json");
    data[name] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));
  }
  return data;
}

function renderItem(itemTemplate, item, index) {
  let out = itemTemplate.replace(IF_RE, (_match, field, inner) => (item[field] ? inner : ""));
  out = out.replace(TOKEN_RE, (match, key) => {
    if (key === "@index") return String(index + 1);
    return item[key] !== undefined ? item[key] : match;
  });
  return out;
}

function renderDataLists(source, data) {
  return source.replace(EACH_RE, (_match, listName, itemTemplate) => {
    const list = data[listName];
    if (!Array.isArray(list)) {
      throw new Error(`Unknown data list "${listName}" referenced by {{#each}} (looked for src/data/${listName}.json)`);
    }
    return list.map((item, index) => renderItem(itemTemplate, item, index)).join("");
  });
}

function renderPageTokens(source, pageMeta, file) {
  return source.replace(PAGE_TOKEN_RE, (match, key) => {
    if (!pageMeta || pageMeta[key] === undefined) {
      throw new Error(`Unknown {{page.${key}}} token in ${file} (no such field in src/data/pages.json)`);
    }
    return pageMeta[key];
  });
}

function renderHtml(source, data, pageMeta, file) {
  const withPageTokens = renderPageTokens(source, pageMeta, file);
  const withData = renderDataLists(withPageTokens, data);
  return withData.replace(INCLUDE_RE, (_match, name) => readPartial(name));
}

function buildPages() {
  const data = loadData();
  const pageFiles = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".html"));
  for (const file of pageFiles) {
    const source = fs.readFileSync(path.join(PAGES_DIR, file), "utf8").replace(/\r\n/g, "\n");
    const slug = path.basename(file, ".html");
    const rendered = renderHtml(source, data, data.pages[slug], file);
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
