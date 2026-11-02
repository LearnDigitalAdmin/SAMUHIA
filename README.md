# SAMUHIA website

Static, modular, SEO- and LLM-optimised corporate site for **SAMUHIA Technology Group**, built with a zero-dependency Node build and hosted on **Firebase Hosting**.

**Start here → [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)** (new machine to live site, with every CMD command).

```cmd
npm install
npm run dev        :: http://localhost:5001
npm run check      :: build + validate
npm run deploy     :: publish
```

## Structure

```
samuhia-website/
├─ firebase.json            Hosting config: clean URLs, security headers, CSP, caching, LLM file types
├─ .firebaserc              Firebase project ID (edit)
├─ package.json             npm scripts
├─ docs/DEPLOYMENT.md       Full setup + deploy guide
├─ scripts/
│  ├─ build.js              Build entry (pages → /public, hashed assets, sitemap, robots, llms.txt …)
│  ├─ dev.js / serve.js     Local dev server (mimics Firebase rules)
│  ├─ generate-icons.js     Favicon, app icons, OG image from the SVG logos
│  └─ lib/                  fs, css bundler, validator (links, titles, JSON-LD)
├─ src/
│  ├─ content/              ★ ALL COPY LIVES HERE (JSON): site, home, about, founder, security,
│  │  │                     pages, solutions, features (Landlord Watch, House to Rent)
│  │  └─ products/*.json      one file per product
│  ├─ pages/                Page builders (home, products, solutions, company, pricing, misc) + registry
│  ├─ components/           header, footer, cards, mockup, ecosystem, pricing, faq, facts, brand …
│  ├─ layouts/base.js       <head>: canonical, robots, hreflang, Open Graph, Twitter, JSON-LD, icons
│  ├─ seo/                  jsonld, markdown twins, llms.txt, robots.txt, sitemap.xml
│  ├─ styles/               tokens → base → layout → components → pages → utilities
│  ├─ scripts/main.js       Progressive enhancement only (menu, reveal, hero diagram, form)
│  ├─ assets/brand/         SAMUHIA + 5 product logos (lockup, reversed, icon, symbol) from the Logo Studio
│  ├─ assets/icons, og/     App icons and 1200×630 social image
│  └─ static/               favicon.ico / favicon.svg / apple-touch-icon.png (copied to site root)
├─ .github/workflows/       Optional CI: preview per PR, deploy on merge
└─ public/                  Build output (this is what Firebase serves; regenerated on every build)
```

## Plot Yangu lead form

`/products/plot-yangu/get-started/` embeds a Google Form for prospective Plot Yangu customers (landlords, agencies, developers, cooperatives, caretakers). It is not linked from Samuhia Desk or careers pages.

- Copy, form URL and iframe heights: `src/content/plot-yangu-leads.json` (`formUrl`, `formHeight`, `formHeightMobile`).
- Page builder: `src/pages/leads.js`. Styles: `src/styles/leads.css`.
- `firebase.json` CSP allows framing only `https://docs.google.com` (`frame-src`). If you move the form to another host, change it there.
- Short link: `/get-plot-yangu` redirects to the page.
- Google does not index the content of an iframe, so all rankable copy is real HTML on the page; the form is just the conversion widget.

## What is built for SEO

- One page per product, feature, solution and company topic at clean URLs (`/products/plot-yangu/`), all in static HTML: fully crawlable with JavaScript off.
- Unique `<title>` and meta description per page, canonical, `hreflang="en-KE"`, robots directives, Open Graph and Twitter cards.
- JSON-LD: Organization, Person, WebSite, WebPage/AboutPage/ContactPage/ProfilePage, BreadcrumbList, `SoftwareApplication` with KES `Offer`s, FAQPage generated from the same text users see, ItemList.
- `sitemap.xml` (indexable pages only), `robots.txt`, `site.webmanifest`, `.well-known/security.txt`.
- Hashed CSS/JS with 1-year immutable caching; strict CSP (no inline scripts); SVG logos with explicit dimensions (no layout shift).
- Build validator fails on: missing/duplicate `<h1>`, duplicate titles or descriptions, invalid JSON-LD, broken internal links or anchors.

## What is built for LLMs and AI assistants

- `/llms.txt` (llmstxt.org format) and `/llms-full.txt` (entire site as Markdown).
- A clean **Markdown twin of every key page** at `<page>/index.md`, advertised with `<link rel="alternate" type="text/markdown">`.
- `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended and others (list in `site.json` → `aiCrawlers`).
- Semantic HTML (`article`, `section` with headings, `dl` for facts, `ol` for steps); illustrative mockup numbers are `data-nosnippet` + `aria-hidden` so they are never quoted as real statistics.
- Facts (founding year, location, pricing in KES, contact) are stated identically in visible text, JSON-LD and Markdown.

## Before you launch: checklist

- [ ] `site.json` → `url` is your real domain
- [ ] `site.json` → `bot` holds the WhatsApp bot number; every wa.me link on the site is generated from it
- [ ] Add `social` links, `verification.google`
- [ ] Add founder photo and links in `founder.json`
- [ ] Write real Privacy / Terms text, then remove `"draft": true` in `pages.json`
- [ ] Populate Resources, then remove its `"draft": true`
- [ ] Confirm prices in each product file are current
- [ ] `npm run check` shows no errors
