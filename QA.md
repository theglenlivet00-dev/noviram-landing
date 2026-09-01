# Noviram website V4.1 QA

Validation completed against the static site served locally on 2026-09-01.

## Language and localization

- [x] Fresh visitor defaults to Hungarian without browser-language detection.
- [x] `?lang=en` and `?lang=hu` override stored state.
- [x] An explicitly selected language persists under `noviramLang`.
- [x] Homepage ↔ Lead Engine links preserve language; the custom-project link also preserves `#contact`.
- [x] `<html lang>`, document title, meta description, mail subject, legal labels, and accessibility labels update live.
- [x] Pending-language visibility prevents an English first-paint flash; the class is removed after localization.
- [x] Switching language during the demo resets the conversation with two correctly localized opening messages.
- [x] English and Hungarian translation objects contain the same 155 Lead Engine keys and the same 88 homepage keys, with no missing or empty values.

## Lead Engine demo

The following scenarios passed in both English and Hungarian with score parity:

| Scenario | Score | Status | Result |
| --- | ---: | --- | --- |
| In-area, urgent, contact, booked appointment | 95 | HOT | Booked expert consultation |
| In-area, one-month timing, no booking | 60 | WARM | Short automated follow-up |
| Research-only, later follow-up requested | 45 | NURTURE | Low-intensity later follow-up |
| Urgent, no contact | 55 | WARM | No follow-up; contact unavailable |
| Debrecen, urgent, contact | 55 | WARM | Human service-area confirmation |
| Urgent, contact, no booking | 70 | WARM | Short automated follow-up |
| Research-only, explicit opt-out | 45 | NURTURE | No further automated action |

- [x] Reset restores score 10, the first location step, and localized opening messages.
- [x] Scoring and routing use canonical IDs rather than translated labels.
- [x] Dynamic appointment/next-step summary labels are semantically correct.
- [x] User chat bubbles have explicit off-white-on-navy contrast and long labels wrap.
- [x] The conversation log uses `role="log"` and polite live announcements.

## Responsive and accessibility review

- [x] Tested at 1440, 1024, 768, and 390 px on the homepage and Lead Engine page.
- [x] No page-level horizontal overflow at any tested width.
- [x] Five-service grid resolves to balanced desktop, two-column tablet, and one-column mobile layouts.
- [x] Product cards, orbit, ticker, chat, summary, buttons, and footer were visually reviewed on desktop and mobile.
- [x] Lead flow and sample pipeline remain internally scrollable; mobile scroll cues are visible at 390 px.
- [x] Mobile navigation fills the viewport, closes after navigation, and updates its open/close label in both languages.
- [x] Reduced-motion mode disables orbit/ticker animation and reveals content without transitions.
- [x] Focus-visible styling and keyboard-operable native controls are preserved.

## Static and runtime audit

- [x] JavaScript syntax checks pass for `index.html` and `lead-engine.html`.
- [x] No duplicate IDs, missing local files, or broken relative links.
- [x] No obsolete forced-English initializer, translation overrides, or Hungarian display-string business comparisons.
- [x] No console errors or unhandled page errors during automated browser scenarios.
- [x] No `fetch`, XHR, WebSocket, or EventSource requests; only the existing Google Fonts hosts are external.
- [x] Mail subjects and English legal labels (`Terms (HU)`, `Privacy (HU)`) are localized correctly.
- [x] The legal document bodies are byte-identical to V4; only favicon links were added in their document heads.
- [x] No fake metrics, testimonials, customer logos, integrations, ROI claims, or backend behavior were added.
