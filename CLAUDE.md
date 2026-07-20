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

### HTML: partials + page templates + data-driven repeated blocks

- `src/partials/header.html`, `footer.html`, `popup.html` — the shared nav/dropdown/"Get Started" slide-panel header, the footer (including the mobile sticky "Get Started" bar), and the homepage-only marketing popup, respectively.
- `src/partials/header-minimal.html` — the stripped-down header (logo only, no nav) used by the standalone `book.html` funnel page.
- `src/pages/*.html` — one template per output page. Each is a full HTML document with `{{> partial-name}}` include tokens marking where `build/build.js` splices in a partial. Add a new page by adding a template here — the build script picks up every file in this directory automatically.
- `src/data/*.json` — structured content consumed by the two templating constructs below: `pages.json` (per-page SEO meta) and one file per repeated content block (`faq.json`, `testimonials.json`, `benefits.json`, `process-steps.json`, `services.json`).
- `build/build.js` renders each page template in three passes, in order: (1) `{{page.field}}` tokens are filled from `pages.json[<page slug>]`; (2) `{{#each listName}}...{{/each}}` blocks are repeated once per item in `data/listName.json`, with `{{field}}` / `{{@index}}` / `{{#if field}}...{{/if}}` resolved inside each repetition; (3) `{{> partialName}}` tokens are spliced in from `src/partials/`. The two token forms are deliberately namespaced differently (`page.foo` vs. bare `foo`) so a page's own SEO field can never collide with an each-block item field of the same name. There's no other nesting/logic — by design, to keep the output predictable and diffable.

**Per-page SEO meta** (`<title>`, description/keywords, OG/Twitter titles+descriptions, JSON-LD description) is data-driven via `src/data/pages.json`, keyed by page slug (the template's file name). Everything else in each page's `<head>` — viewport format, favicon path style, `og:site_name`, `twitter:card` type, `author`, whether the JSON-LD block includes `areaServed` — is **left inline per page on purpose**: those actually differ page-to-page in the original site (not just the content that's supposed to vary), so unifying them into a shared partial would silently change real metadata rather than deduplicate true duplication. Check `pages.json` before assuming a `<head>` line is missing — most content fields live there, not in the template.

**Repeated content blocks** (FAQ accordion items, testimonial cards, benefit cards, process consult-steps, service blocks) are `{{#each}}` loops over `src/data/*.json` rather than hand-duplicated markup — e.g. adding an FAQ is a new object in `faq.json`, not a copy-pasted `.faq-item` block. `services.json` entries support an optional `ctaHref`/`ctaLabel` pair (only `cognitive-care` uses it today) via `{{#if ctaHref}}`. If a block you're adding has genuinely unique markup per item (not just swapped text/attributes), don't force it into this pattern — write it out directly in the page template instead, the way the rest of each page's content still is.

### CSS: organized by actual concern, bundled back into one file

`src/css/` is organized by what a rule is *for*, not by where it happened to sit in the original 3000-line `styles.css`:

- `base/` — `tokens.css` (CSS custom properties) and `reset.css` (global reset/typography, nothing page- or component-specific).
- `layout/` — `header-nav.css`, `slide-panel.css`, `footer.css`: the site chrome that every full page shares via the header/footer partials.
- `components/` — self-contained, reused-across-pages widgets: `buttons.css`, `forms.css`, `carousel.css`, `faq.css`, `popup.css`, plus `info-split.css` (the alternating text/image block used on 7 pages, including its `float-left`/`float-right`/`float-above` decorative animations) and `contact-cta.css` (the "Individualized Home Care Options" block used on 11 pages).
- `pages/` — `home.css`, `services.css`, `process.css`, `benefits.css`: styles that are genuinely specific to one page's layout, plus `pages/book.css` (`book.html`'s own stylesheet, bundled separately to root `book.css`).
- `responsive.css` — all `@media` breakpoint overrides in one file, kept together rather than split per-component; a component/page file only holds base styles, its responsive overrides live here instead. This is a deliberate scope boundary, not an oversight — splitting media queries per-file wasn't worth the risk for a site this size.

**Order matters** — `src/css/main.css` `@import`s every partial in cascade order (base → layout → components → pages → responsive last), and esbuild bundles + minifies that into the root `styles.css`. If you add a partial, add its `@import` in the right cascade position, not just alphabetically. Class names are semantic (`.home-highlight-row`, `.process-content`, `.panel-step-heading`, `.footer-column-heading`) — if you're tempted to name something `.container5` or `.thing2`, that's a signal that whatever it's styling probably belongs in `pages/` as its own named section instead.

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
- To change a page's title/description/OG/Twitter copy, edit its entry in `src/data/pages.json` — not the `<head>` in `src/pages/*.html`. To add a new full page, add both a `src/pages/<name>.html` template (with `{{page.*}}` tokens in its `<head>`) and a matching `"<name>": {...}` entry in `pages.json`, or the build throws (`Unknown {{page.*}} token`).
- Images live in `images/` as `.webp` (content photos, named descriptively — e.g. `hero-caregiver-help.webp`, not `image1.webp`) plus a few `.svg`/`.png` (logo, icons, favicon), referenced by root-relative paths (`images/...`) from both the built CSS and HTML. Reuse existing assets where applicable, and give new ones a descriptive name.
- Phone number (`902-999-1445`) and `tel:` links are still repeated verbatim across page templates and partials; if it changes, update every occurrence under `src/`.

## Testing changes

No automated test suite. After `npm run build`, serve the repo root with any static file server (e.g. `python -m http.server`) and exercise the relevant interactive behavior in a browser: nav/dropdowns, the "Get Started" panel (open it from more than one page — the shared modules must work identically everywhere, not just on the homepage), carousel, FAQ accordion, marketing popup, and `book.html`'s wizard, at both desktop and mobile widths (breakpoints ~1250px/1024px). Avoid actually submitting either lead-capture form, since that POSTs to the live production Google Sheet.
