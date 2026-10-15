# W07 Open Gallery Video — Five-Minute Recording Outline

**Target duration:** approximately 5 minutes  
**Public video link:** [PASTE AFTER RECORDING]  
**Before recording:** Turn on the camera for the opening, use a screen recorder (not a phone), and confirm the browser has internet access. Publish the recording publicly and test it in a private/incognito window.

## 0:00–0:25 — Introduce the project (face visible)

“Hi, I’m OGWAL ALLAN. This is Open Gallery, a responsive art discovery app that lets visitors search the Art Institute of Chicago and The Met together. I’ll demonstrate the deployed site and show how the JavaScript combines the APIs, renders results, and saves favorites.”

Show the live site: <https://allan2468coder.github.io/wdd330-sleepoutside/open-gallery/>.

## 0:25–1:20 — Search and live museum results

- Enter a query such as “flowers” and keep “Both museums” selected.
- Submit and wait for result cards.
- Point out the loading/status message, museum attribution, artwork image, artist/date, and the responsive card grid.
- Explain that cards are built dynamically from API JSON rather than hard-coded markup.

Talking point: “The app makes independent requests to both public collection services. It can show the successful provider’s results if the other service fails.”

## 1:20–2:05 — Interactions and events

- Use a suggested search or change the museum selector and search again.
- Change sorting to title or artist.
- If the load-more control is present, request another page.
- Save a result using its heart control and point out the count update.

Talking point: “The interface responds to form submit, click, change, image error, page-show, and cross-tab storage events.”

## 2:05–2:55 — Details and saved works

- Open an artwork card and show the detail view and museum record link.
- Save or remove it from the detail view.
- Open Saved works and show the saved item; remove it or clear the list.

Talking point: “The saved artwork is kept in localStorage as JSON, so the user’s saved list stays on this browser across visits.”

## 2:55–4:20 — Source walkthrough

Show [artworks.js](../../src/open-gallery/artworks.js):

- Identify the four endpoint families: AIC search/details and Met search/object details.
- Compare source-specific field names and the shared normalized artwork shape.
- Explain the Met concurrency limit for object lookups.

Show [main.js](../../src/open-gallery/main.js):

- Identify the async search flow, independent result handling, dynamic card rendering, sort/paging events, and request ID protection against stale searches.

Show [favorites.js](../../src/open-gallery/favorites.js) and [OpenGallery.test.js](../../src/test/OpenGallery.test.js):

- Explain save/retrieve/remove/clear behavior and the tests covering normalization, API failure, request limits, and storage.

## 4:20–5:00 — CSS, accessibility, close

Show [styles.css](../../src/open-gallery/styles.css):

- Point out keyframe entrance effects, hover transforms/transitions, responsive grid breakpoints, and reduced-motion overrides.
- Mention skip links, semantic labels/status, and visible keyboard focus.

Close: “That’s Open Gallery: two collections, one normalized result experience, artwork details, and saved works. The app and source links are in my Skills Development Document.”

## After recording

- [ ] Keep face visible at least during the opening.
- [ ] Confirm final recording is about five minutes and includes both app use and code.
- [ ] Publish with public visibility.
- [ ] Test the URL in an incognito/private window while signed out.
- [ ] Paste the final video link in the Skills Development Document and Canvas submission.
