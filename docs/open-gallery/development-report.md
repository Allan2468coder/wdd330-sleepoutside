# Open Gallery — Week 5–6 Development Report

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

## Week 6 task report

| Work item | Result | Evidence |
| --- | --- | --- |
| Artwork details | Added a detail route that retrieves the selected record from the correct museum API and displays the image, artist, date, medium, dimensions, collection, and available credit information. | [`detail.html`](../../src/open-gallery/detail.html), [`detail.js`](../../src/open-gallery/detail.js), [`artworks.js`](../../src/open-gallery/artworks.js) |
| Museum source and image fallback | Detail pages link to the museum's public record and show a designed fallback if the image cannot load. | [`detail.js`](../../src/open-gallery/detail.js), [`styles.css`](../../src/open-gallery/styles.css) |
| Favorites | Added save/remove controls on search cards and detail pages, with saved data persisted in local storage. | [`favorites.js`](../../src/open-gallery/favorites.js), [`main.js`](../../src/open-gallery/main.js), [`detail.js`](../../src/open-gallery/detail.js) |
| Favorites page | Added a dedicated page for saved work, including remove and clear actions and an empty state. | [`favorites.html`](../../src/open-gallery/favorites.html), [`favorites-page.js`](../../src/open-gallery/favorites-page.js) |

## Week 6 professional development reflection

This week I practiced connecting a selected result to a detail view with URL parameters, fetching the full record from its originating museum, and handling missing images and unavailable records. I also applied browser local storage to persist a user's saved works across page visits, created a dedicated Favorites page, and added accessible pressed states and status messages to the save/remove controls. The implementation keeps data fetching, persistence, page behavior, and styling in separate modules so each responsibility is easier to maintain.

## Reflection and next steps

The most important design decision was to normalize each museum's different fields before the display layer uses them. This keeps the card component straightforward and lets the two API results be searched together. The Met API uses a paginated search endpoint and a separate object endpoint, while AIC provides its detail record from the artwork endpoint. Follow-up work is the proposal's Week 7 accessibility review, screen-size checks, and demo preparation.

## Completion evidence

The Week 5–6 source is committed to the SleepOutside repository as separate Vite entries under `/open-gallery/`. The production build succeeds and emits `dist/open-gallery/index.html`, `dist/open-gallery/detail.html`, and `dist/open-gallery/favorites.html`. The updated Render routes should be checked after the Week 6 commit deploys. The Trello board remains publicly readable but was not edited in this session; see the board progress note for the current Week 6 checklist status and the board updates still needed.
