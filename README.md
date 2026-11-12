# MunVari

Free advance tax calculator for India (FY 2026-27). Tells you what to pay by the next due date, the 234B/234C interest you're exposed to, and whether the old or new regime costs less. No login, no trackers; every calculation runs on the user's device.

- Website: https://babubl.github.io/munvari/
- Android app: built automatically by GitHub Actions (see below)

## Structure

```
index.html                      calculator page
privacy.html, terms.html        privacy policy and terms (needed for Play Store)
assets/css/app.css              design system (Tesla-style palette, Roboto)
assets/js/rules-fy2026-27.js    every tax rate, limit and due date for the year
assets/js/engine.js             tax engine: pure functions, no DOM
assets/js/i18n.js               interface strings and FAQ
assets/js/app.js                UI
assets/fonts/                   self-hosted Roboto (Apache 2.0)
assets/icons/                   web icons, favicon, social image
manifest.webmanifest, sw.js     installable web app + offline support
tests/engine.test.js            engine tests
android/                        Android app project (Capacitor)
capacitor.config.json           app id com.babubl.munvari
resources/                      source images for Android icons and splash
scripts/build-web.mjs           copies the site into www/ for the app
.github/workflows/android.yml   builds the APK and Play bundle on every push
STORE.md, store/                Play Store listing text and graphics
```

The website needs no build step; GitHub Pages serves the folder as-is.

## Run locally

```
npm install
npm run serve      # http://localhost:8080
npm test           # engine tests
```

## Android app

Every push to `main` runs the **Android app** workflow (GitHub → Actions). When it finishes, open the run and download:

- **munvari-test-apk**: `app-debug.apk`. Unzip and install on any Android phone to test (allow "install unknown apps" when asked).
- **munvari-play-bundle**: the `.aab` file to upload to Google Play.

### Signing for Google Play (one-time)

1. Create an upload key on your computer (needs Java):
   ```
   keytool -genkeypair -v -keystore munvari-upload.keystore -alias munvari -keyalg RSA -keysize 2048 -validity 10000
   ```
   Keep this file and its passwords safe. Never commit it.
2. Convert it to text: `base64 -w0 munvari-upload.keystore > keystore.txt` (macOS: `base64 -i munvari-upload.keystore -o keystore.txt`).
3. In GitHub → repo Settings → Secrets and variables → Actions, add:
   - `MUNVARI_KEYSTORE_BASE64`: contents of keystore.txt
   - `MUNVARI_KEYSTORE_PASSWORD`
   - `MUNVARI_KEY_ALIAS`: `munvari`
   - `MUNVARI_KEY_PASSWORD`
4. Re-run the workflow. The `.aab` is now signed and ready to upload.

### Publishing on Google Play

1. Create a Google Play developer account (one-time US$25).
2. Create the app, then fill in the listing from `STORE.md` and upload `store/feature-graphic.png`, the icon and screenshots.
3. Use Play App Signing (default) and upload the signed `.aab` to Internal testing first, then Production.
4. New personal developer accounts must run a closed test with at least 12 testers for 14 days before production access. Plan for this.

### Releasing an update

Change the web files as usual and push. Bump `versionName` in `android/app/build.gradle` for each store release; `versionCode` comes from the workflow run number automatically.

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
4. Replace `https://babubl.github.io/munvari/` with the new URL in `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD), `robots.txt`, `sitemap.xml` and `STORE.md`. The share card and reminders read the canonical link, so they follow automatically.

## Disclaimer

MunVari is an educational estimator, not tax advice. Verify on the income-tax portal or with a tax professional before paying.
