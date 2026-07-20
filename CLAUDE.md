# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static marketing website for CareKind, an in-home senior care service in Halifax, Nova Scotia (carekind.ca), deployed as-is via static hosting (see `CNAME`). There is no server-side backend.

The repo has two layers:

- **`src/`** — the source of truth: HTML page templates, shared partials, modular CSS, and modular JS (ES modules).
- **Repo root** (`index.html`, `services.html`, ..., `styles.css`, `script.js`, `book.css`, `book.js`) — the **generated, committed build output** that GitHub Pages actually serves. These files are produced from `src/` by the build script and must never be hand-edited directly; edits there get silently overwritten by the next build.

## Commands

```
npm install     # one-time, installs esbuild (the only dependency)
npm run build   # regenerate every root-level HTML/CSS/JS file from src/
npm run watch   # rebuild on every change under src/
```

There is no test suite or linter. **Always run `npm run build` and commit the regenerated root files together with any `src/` change** — the live site is served from the root files, not from `src/`.

## Architecture

### HTML: partials + page templates

- `src/partials/header.html`, `footer.html`, `popup.html` — the shared nav/dropdown/"Get Started" slide-panel header, the footer (including the mobile sticky "Get Started" bar), and the homepage-only marketing popup, respectively.
- `src/partials/header-minimal.html` — the stripped-down header (logo only, no nav) used by the standalone `book.html` funnel page.
- `src/pages/*.html` — one template per output page. Each is a full HTML document (own `<head>` with page-specific SEO meta/OG/Twitter/JSON-LD, left inline and unshared since it genuinely differs per page) with `{{> partial-name}}` include tokens marking where `build/build.js` splices in a partial. Add a new page by adding a template here — the build script picks up every file in this directory automatically.
- `build/build.js` resolves `{{> name}}` tokens against `src/partials/name.html` (see `INCLUDE_RE`) and writes the result to `<root>/<name>.html`. There's no nesting/loops/conditionals — just literal string splicing — by design, to keep the output predictable and diffable.

### CSS: split by concern, bundled back into one file

`src/css/*.css` holds the old monolithic `styles.css` split into ordered partials (`base`, `header-nav`, `slide-panel`, `forms`, `home-sections`, `carousel`, `contact-footer`, `page-sections`, `faq`, `popup`, `responsive`). **Order matters** — `src/css/main.css` `@import`s them in the same order as the original cascade, and esbuild bundles + minifies that into the root `styles.css`. If you add a partial, add its `@import` in the right cascade position, not just alphabetically.

`src/css/pages/book.css` is `book.html`'s own stylesheet (previously an inline `<style>` block); it bundles separately to root `book.css` and is loaded in addition to the shared `styles.css`.

Image `url(...)` references in the CSS are left untouched by the bundler (`external` in `build/build.js`) because the built `styles.css` lives at the repo root next to `images/`, same as the source — esbuild is not asked to resolve or copy them.

### JS: ES modules, one concern per file, bundled to a single IIFE

`src/js/main.js` is the entry point for the shared site-wide behavior, importing and calling one `initX()` per module in `src/js/modules/`:

- `nav.js` — hamburger + dropdown menus (breakpoint 1250px)
- `slidePanel.js` — the "Get Started" slide-in panel and step navigation; exports `goToStep`/`closeModal` used by other modules
- `careForms.js` — job-application and care-request form submission (POSTs to the Google Apps Script URL in `src/js/constants.js`)
- `careOptionCards.js` — radio-card selection inside the care-request step
- `testimonialCarousel.js`, `serviceCarousel.js` — the two homepage-only carousels
- `faqAccordion.js`, `marketingPopup.js`, `smoothScroll.js` — FAQ accordion, the timed/scroll-triggered marketing popup, and `#anchor` smooth-scrolling

**Every module guards on the elements it needs and no-ops if they're absent**, because these modules are shared across pages that don't all contain the same markup (e.g. the testimonial carousel and marketing popup only exist on `index.html`). This null-guarding is load-bearing, not defensive boilerplate: before this refactor, several of these lookups were unguarded in the monolithic `script.js`, which threw partway through initialization on every page except the homepage — silently breaking the "Get Started" panel's step navigation and the care-option-card selection on every subpage. Keep new module code guarded the same way, and add a new page's required elements to the relevant module rather than assuming they exist everywhere.

`src/js/pages/book.js` is `book.html`'s own multi-step wizard script (previously inline) — it's a separate, self-contained flow (different DOM structure/animation approach from the shared `slidePanel.js`) and bundles separately to root `book.js`. It imports the shared `SCRIPT_URL` constant from `src/js/constants.js` rather than duplicating the endpoint.

`build/build.js` bundles `src/js/main.js` → `script.js` and `src/js/pages/book.js` → `book.js` via esbuild (`format: "iife"`, minified) — the shipped files are plain scripts with no module-loader dependency at runtime.

## Working with this repo

- Never hand-edit the generated root `.html`/`.css`/`.js` files — edit under `src/` and run `npm run build`.
- `styles.css`/`script.js`/`book.css`/`book.js` are minified build output; do line-level debugging against the `src/` sources, not the generated files.
- Both the job-application and care-request forms (in the shared slide panel) and `book.html`'s own wizard POST JSON to the same hardcoded Google Apps Script Web App endpoint (`SCRIPT_URL` in `src/js/constants.js`), which forwards to a Google Sheet. There is no backend in this repo. **Submitting either form from a browser sends a real lead into the live spreadsheet** — don't click through to actual submission when testing; verify wiring by reading the code or by clearing/blocking the network request instead.
- Per-page SEO meta (`<title>`, description/keywords, OG/Twitter tags, JSON-LD) lives inline in each `src/pages/*.html` template and is intentionally not templated/shared — content differs per page and the risk of mangling quoted copy wasn't worth deduplicating a few boilerplate lines (charset/viewport/favicon links are the only truly identical bits, and are small enough to leave inline too).
- Images live in `images/` as `.webp` (content photos) plus a few `.svg`/`.png` (logo, icons, favicon), referenced by root-relative paths (`images/...`) from both the built CSS and HTML. Reuse existing assets where applicable.
- Phone number (`902-999-1445`) and `tel:` links are still repeated verbatim across page templates and partials; if it changes, update every occurrence under `src/`.

## Testing changes

No automated test suite. After `npm run build`, serve the repo root with any static file server (e.g. `python -m http.server`) and exercise the relevant interactive behavior in a browser: nav/dropdowns, the "Get Started" panel (open it from more than one page — the shared modules must work identically everywhere, not just on the homepage), carousel, FAQ accordion, marketing popup, and `book.html`'s wizard, at both desktop and mobile widths (breakpoints ~1250px/1024px). Avoid actually submitting either lead-capture form, since that POSTs to the live production Google Sheet.
