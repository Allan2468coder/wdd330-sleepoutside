# Open Gallery — Week 5 Development Report

## Task report

**Project:** Open Gallery, an art discovery site combining the Art Institute of Chicago and The Metropolitan Museum of Art collections.

**Week 5 focus:** Set up the application, connect both museum APIs, normalize the artwork data, and let visitors search and browse results.

| Work item | Result | Evidence |
| --- | --- | --- |
| Project setup | Added Open Gallery as a separate Vite page in the existing SleepOutside multi-page build. | [`package.json`](../../package.json), [`vite.config.js`](../../vite.config.js), [`index.html`](../../src/open-gallery/index.html) |
| Connect both APIs | AIC artwork search and current paginated Met search are implemented. Met object lookups are limited to five concurrent requests. | [`artworks.js`](../../src/open-gallery/artworks.js) |
| Shared artwork format | Both sources map into the same fields for cards and record links. | [`artworks.js`](../../src/open-gallery/artworks.js) |
| Search and results | Search form, collection selector, suggestions, responsive cards, sorting, and load-more control are implemented. | [`index.html`](../../src/open-gallery/index.html), [`main.js`](../../src/open-gallery/main.js), [`styles.css`](../../src/open-gallery/styles.css) |
| Loading and errors | Status messages cover search-in-progress, no matches, total failure, and partial provider failure. | [`main.js`](../../src/open-gallery/main.js) |
| Professional presentation | Responsive layout, semantic landmarks and labels, visible keyboard focus, and reduced-motion support are included. | [`index.html`](../../src/open-gallery/index.html), [`styles.css`](../../src/open-gallery/styles.css) |

## Professional and skills development

This work develops the project skills in API integration, asynchronous JavaScript, frontend organization, and inclusive interaction design.

- **API integration and research:** Compared the museums' official API documentation and used the Met's paginated v1.1 endpoint. Evidence: source-specific request functions in `src/open-gallery/artworks.js` and the official links in [Open Gallery README](./README.md#data-sources).
- **Data handling:** Built one normalized artwork representation so the interface can render either provider consistently. Evidence: the two mapping blocks in `src/open-gallery/artworks.js`.
- **Resilient asynchronous UI:** Used independent provider requests so a failure at one museum does not hide successful results from the other; bounded Met detail requests and displayed partial-failure status. Evidence: `searchMet()` and `loadPage()`.
- **Frontend structure:** Kept museum data access separate from page state/rendering and separated styling from markup. Evidence: `src/open-gallery/artworks.js`, `src/open-gallery/main.js`, `src/open-gallery/styles.css`.
- **Accessibility and responsive design:** Added semantic sections, a labeled search, a live status region, image alternatives, focus styles, reduced-motion support, and mobile layouts. Evidence: `src/open-gallery/index.html` and `src/open-gallery/styles.css`.
- **Professional planning:** The board cards were reviewed against the Week 5 implementation and the work was organized by deliverable. The board progress record is in [`trello-progress.md`](./trello-progress.md).

## Reflection and next steps

The most important design decision was to normalize each museum's different fields before the display layer uses them. This keeps the card component straightforward and lets the two API results be searched together. The Met API needs a search request followed by object requests, so the implementation limits concurrent lookups. Follow-up work should manually review representative searches and confirm live API behavior, then complete the proposal's Week 6 detail and favorites features and Week 7 deployment/demo work.

## Completion evidence

The project source is committed to the SleepOutside repository as a separate Vite entry at `/open-gallery/`. The local production build succeeds and emits `dist/open-gallery/index.html`. The deployed Render route responds with HTTP 200 and serves the Open Gallery page. The Trello board remains publicly readable but was not edited in this session; see the board progress note for the current checklist status and the board updates still needed.
