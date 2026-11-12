# MunVari

Free advance tax calculator for India (FY 2026-27). Tells you what to pay by the next due date, the 234B/234C interest you're exposed to, and whether the old or new regime costs less. English and Tanglish. No login, no trackers; every calculation runs in the browser.

Live: https://babubl.github.io/munvari/

## Structure

```
index.html                      page markup
assets/css/app.css              design system (Tesla-style palette, Roboto)
assets/js/rules-fy2026-27.js    every tax rate, limit and due date for the year
assets/js/engine.js             tax engine: pure functions, no DOM
assets/js/i18n.js               English + Tanglish strings and FAQ
assets/js/app.js                UI
assets/fonts/                   self-hosted Roboto (Apache 2.0)
assets/icons/                   app icons, favicon, social image
manifest.webmanifest, sw.js     installable app + offline support
tests/engine.test.js            engine tests
```

No build step. GitHub Pages serves the folder as-is.

## Run locally

```
npm run serve      # http://localhost:8080
npm test           # engine tests (Node 18+)
```

## Updating for a new financial year or Budget

1. Copy `assets/js/rules-fy2026-27.js` to the new year and edit the values.
2. Point the `<script>` tag in `index.html` at the new file.
3. Update or add cases in `tests/engine.test.js`, then run `npm test`.
4. Bump the `?v=` query strings in `index.html` and `VERSION` in `sw.js` so returning users get the new files.

## Moving to a custom domain

1. Buy the domain and add a `CNAME` file at the repo root containing just the domain, e.g. `munvari.in`.
2. At your registrar, add DNS records:
   - Apex (`munvari.in`): four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www`: `CNAME` → `babubl.github.io`
3. In GitHub → repo Settings → Pages, enter the domain and tick **Enforce HTTPS** once the certificate is issued.
4. Replace `https://babubl.github.io/munvari/` with the new URL in `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD), `robots.txt` and `sitemap.xml`. The share card and calendar reminders pick up the domain automatically.

## Roadmap

- Store apps (Capacitor wrapper around this same folder)
- More calculators (HRA, capital gains, F&O tradebook) sharing the same engine
- Optional AI explanations via a server-side proxy (Claude API) as a paid tier

## Disclaimer

MunVari is an educational estimator, not tax advice. Verify on the income-tax portal or with a tax professional before paying.
