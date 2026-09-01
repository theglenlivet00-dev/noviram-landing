# Noviram website v4.1

Static, dependency-free website prepared for GitHub Pages.

The homepage presents Noviram's client services alongside its proprietary products, while `lead-engine.html` provides the dedicated Lead Engine product experience and interactive sample-data demo.

## Files

- `index.html` — Noviram company homepage
- `lead-engine.html` — dedicated Noviram Lead Engine product page and interactive demo
- `adatkezeles.html` — current Privacy Policy (source content preserved)
- `aszf.html` — current Terms (source content preserved)
- `favicon.svg` — Noviram logo-mark favicon
- `QA.md` — V4.1 validation checklist and recorded results

## Language behavior

The homepage and Lead Engine page use the same language state:

1. a valid `?lang=en` or `?lang=hu` query parameter;
2. an explicit preference stored under `noviramLang` in `localStorage`;
3. Hungarian (`hu`) as the first-visit default.

The language switch updates the page, `<html lang>`, title, meta description, mail subject, and current URL without reloading. Cross-page Noviram links retain the active language and preserve their anchors. A visitor who explicitly selects English keeps English between the homepage and Lead Engine page.

## Local preview

From this directory, run any static file server, for example:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

## Deployment

Publish the HTML files, `favicon.svg`, and documentation at the GitHub Pages site root. All internal links are relative, and the site has no build step or runtime dependency.

The Lead Engine conversation, deterministic scoring, routing, and pipeline are browser-only demonstrations using sample data. The demo stores no lead or personal data and makes no external integration requests. It is not connected to a CRM, messaging service, calendar, database, authentication system, analytics platform, payment provider, or backend persistence layer.

The only external page assets are the existing Google Fonts stylesheets and font files used by the approved Noviram visual identity.

## Legal note

The substantive Hungarian wording in `aszf.html` and `adatkezeles.html` is preserved. The Terms service list should be reviewed separately by legal counsel for consistency with Noviram's expanded commercial service list; it was not silently changed as part of this website polish pass.
