# W07 Skills Development Assessment — Open Gallery

> **Submission draft:** Transfer this evidence into the official WDD 330 Skills Development Document if your instructor requires the supplied Word template. Replace every bracketed field, review the first-person statements for accuracy, and upload the completed document to Canvas.

**Student name:** OGWAL ALLAN *(from the project team file; confirm the preferred name order)*

**Working application:** [Open Gallery on GitHub Pages](https://allan2468coder.github.io/wdd330-sleepoutside/open-gallery/)

**Application source:** [Open Gallery source folder on GitHub](https://github.com/Allan2468coder/wdd330-sleepoutside/tree/main/src/open-gallery)

**Project Trello board:** [SleepOutside Team 13 board](https://trello.com/b/2wOtGweU)

**Public five-minute demonstration video:** [PASTE THE PUBLIC VIDEO URL AFTER RECORDING]

## Project summary

Open Gallery is a responsive art-discovery application built with semantic HTML, CSS, and vanilla JavaScript ES modules. It searches public collections from the Art Institute of Chicago (AIC) and The Metropolitan Museum of Art (The Met), converts their different JSON response shapes into one shared artwork record, and lets visitors inspect details and save favorites in browser local storage.

The application requests data from four museum API endpoints: AIC artwork search and individual artwork details, and Met collection search and individual object records. Search results are generated from live JSON, not hard-coded sample cards. The application handles separate provider failures so available results can still be shown if one museum is temporarily unavailable.

## Rubric evidence map

| Rubric area | Evidence and demonstration | Source evidence |
| --- | --- | --- |
| **1. JavaScript — 25 points** | JavaScript validates and submits a search, makes parallel asynchronous museum requests, handles partial failures with `Promise.allSettled`, normalizes results, builds accessible result cards, sorts and pages results, opens details, and updates favorites. A request ID prevents an earlier slow search from overwriting newer results. | [main.js](../../src/open-gallery/main.js), [artworks.js](../../src/open-gallery/artworks.js), [detail.js](../../src/open-gallery/detail.js) |
| **2. Third-party APIs — 25 points** | AIC: `/api/v1/artworks/search` and `/api/v1/artworks/{id}`. The Met: `/public/collection/v1.1/search` and `/public/collection/v1/objects/{id}`. The app calls both providers and displays provider-specific metadata with links to original museum records. | [artworks.js](../../src/open-gallery/artworks.js), [AIC API documentation](https://api.artic.edu/docs/), [The Met API documentation](https://metmuseum.github.io/) |
| **3. JSON — 10 points** | Each API result is normalized into a reusable artwork object with 12 properties: `id`, `museum`, `title`, `artist`, `date`, `medium`, `image`, `record`, `publicDomain`, `department`, `dimensions`, and `credit`. Arrays of these objects are rendered as cards and detail/favorites views. | [artworks.js](../../src/open-gallery/artworks.js), [OpenGallery.test.js](../../src/test/OpenGallery.test.js) |
| **4. Advanced CSS — 10 points** | CSS uses keyframe entrance animations for the hero copy, hero artwork, and result cards; image and favorite hover transforms; transitions; responsive grid/layout breakpoints; visible keyboard focus; and reduced-motion overrides. | [styles.css](../../src/open-gallery/styles.css) |
| **5. Events — 10 points** | Demonstrated events include form submit, suggested-query click, load-more click, sort change, delegated favorite click, image error fallback, `pageshow`, and cross-tab `storage` updates. | [main.js](../../src/open-gallery/main.js), [detail.js](../../src/open-gallery/detail.js), [favorites-page.js](../../src/open-gallery/favorites-page.js) |
| **6. LocalStorage — 5 points** | Saved artwork records are serialized under `open-gallery-favorites-v1`. The record retains multiple fields used to render saved cards and detail links; save, remove, retrieve, clear, invalid JSON, and invalid record handling are covered. | [favorites.js](../../src/open-gallery/favorites.js), [OpenGallery.test.js](../../src/test/OpenGallery.test.js) |
| **7. Trello Board — 5 points** | The public project board is linked above. Before submission, review the board and make sure card positions/checklists reflect the work actually completed; the source report is not a substitute for updating the board. | [Trello progress notes](./trello-progress.md) |
| **8. Video — 10 points** | Still to complete: record an approximately five-minute screen demonstration, show my face at the beginning, discuss both the running application and its source, publish the recording publicly, test the public link in a private/incognito window, and paste the link above. | [Five-minute recording outline](./W07-video-outline.md) |

## Testing and deployment evidence

- `npm test -- --runInBand` — 7 Open Gallery tests pass. Tests cover normalized AIC and Met JSON, AIC pagination, Met detail-request concurrency, API failure behavior, and favorite persistence/validation.
- `npm run build` — production build emits the home, detail, and favorites pages under `dist/open-gallery/`.
- GitHub Actions publishes the built `dist` site to GitHub Pages. The public application link above is the deployed route.
- To demonstrate museum search, use a real query in the live app; museum APIs require a network connection and can occasionally rate-limit or be unavailable.

## Final submission checklist

- [ ] Confirm the name order/spelling for `OGWAL ALLAN` and update it if needed.
- [ ] Paste my public video link and test it in a private/incognito browser window.
- [ ] Review the official Skills Development Document template and transfer this evidence into its required sections if needed.
- [ ] Review/update Trello card statuses and checklists to match what is actually done.
- [ ] Open the application, source, Trello, and video links in a signed-out/private browser.
- [ ] Upload the completed skills document to the W07 Canvas assignment.
