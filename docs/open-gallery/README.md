# Open Gallery

Open Gallery is a responsive art discovery experience that searches the Art Institute of Chicago (AIC) and The Metropolitan Museum of Art (The Met) from one page. It turns both APIs into a shared artwork format and preserves a direct link to each museum's collection record.

## Run locally

From the repository root, run `npm install` and `npm run start`. Open Gallery is a page within the existing Vite app at `/open-gallery/`. Create a production build with `npm run build`; the Render static site publishes the repository's `dist` directory. Once Render deploys the new commit, the page URL is <https://wdd330-sleepoutside-e6lq.onrender.com/open-gallery/>.

## Week 5 work

- Search either collection or both with suggested subject queries.
- Normalize results to one artwork shape: `id`, `museum`, `title`, `artist`, `date`, `medium`, `image`, `record`, `publicDomain`, and `department`.
- Display artwork cards with the museum record link, image fallback, title, artist, date, and collection label.
- Show searching, no-result, collection failure, and partial-failure states with an accessible live status.
- Sort the loaded set by title or artist and request another page of results.
- Support small screens, keyboard focus, reduced motion, and semantic labels.

## Week 6 work

- Open an artwork details page from a result or saved work, with the artwork image, available metadata, and a direct museum record link.
- Show a designed fallback when an artwork image is unavailable.
- Save and remove artworks in browser local storage, with saved works available on a dedicated Favorites page.
- Keep saved state and accessible favorite counts synchronized across the search, detail, and Favorites pages.

## Data sources

- AIC Artworks API: <https://api.artic.edu/docs/>. The app requests only the fields it displays and builds image URLs from the API's IIIF configuration.
- The Met Collection API: <https://metmuseum.github.io/>. Search uses the paginated `/public/collection/v1.1/search` endpoint and fetches individual object records with a concurrency limit of five.

The APIs are public and can be temporarily unavailable or rate limited. The UI reports full and partial failures and keeps museum attribution attached to each result. The browser needs network access to the museums' API and image hosts.

## Project structure

- [`index.html`](../../src/open-gallery/index.html) — page structure, search controls, navigation, and content sections.
- [`artworks.js`](../../src/open-gallery/artworks.js) — API calls and source-specific normalization.
- [`main.js`](../../src/open-gallery/main.js) — search state, accessible status messages, sorting, paging, and card rendering.
- [`styles.css`](../../src/open-gallery/styles.css) — responsive visual system and reduced-motion support.
- [`detail.html`](../../src/open-gallery/detail.html) and [`detail.js`](../../src/open-gallery/detail.js) — artwork detail page and museum record lookup.
- [`favorites.html`](../../src/open-gallery/favorites.html), [`favorites-page.js`](../../src/open-gallery/favorites-page.js), and [`favorites.js`](../../src/open-gallery/favorites.js) — saved work page and local storage logic.
- [`development-report.md`](./development-report.md) — Week 5 work report, skill reflection, and evidence map.
- [`trello-progress.md`](./trello-progress.md) — Week 5 board review and progress record.

## Scope

This implementation completes the proposal's Week 5 search/results and Week 6 detail/favorites work. Accessibility review, device checks, and demo preparation remain Week 7 work.
