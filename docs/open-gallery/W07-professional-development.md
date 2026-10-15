# W07 Professional Development — Open Gallery

> **Reflection draft:** Review and personalize this account before transferring it into the official Professional Development Document. Replace the student name field. Keep statements that accurately describe your own work and learning.

**Student name:** OGWAL ALLAN *(from the project team file; confirm the preferred name order)*

**Project:** Open Gallery — a responsive art-discovery experience for the Art Institute of Chicago and The Metropolitan Museum of Art.

**Working application:** [Open Gallery on GitHub Pages](https://allan2468coder.github.io/wdd330-sleepoutside/open-gallery/)

**Source code:** [Open Gallery source folder](https://github.com/Allan2468coder/wdd330-sleepoutside/tree/main/src/open-gallery)

**Project planning board:** [Smookie — Open Gallery board](https://trello.com/b/0E3oXaWh/smookie)

## Development summary

I built Open Gallery as a set of pages within the existing Vite project. The experience combines the AIC and Met public collection APIs, presenting records in a shared format so a visitor can search both collections from one interface. I separated API/data normalization, page behavior, favorite persistence, page markup, and styling into modules and page-specific files.

The project progressed from searching and result cards to artwork details, a saved-works page, persistent favorites, and direct source-museum links. I added loading, no-results, partial-provider-failure, and unavailable-record states so users get feedback when network services do not respond normally.

## Professional skills practiced

### API research and integration

I compared the AIC and Met API structures and selected endpoints appropriate for search and detailed records. The providers use different field names and image conventions, so I normalize their responses before the display layer uses them. The Met search may return many object IDs; I limit concurrent detail requests to reduce the load on the public service.

Evidence: [artworks.js](../../src/open-gallery/artworks.js).

### Maintainable frontend architecture

I kept API requests and normalization separate from DOM rendering, and placed favorite storage logic in a small reusable module. This makes it clearer where to change a request, page interaction, or persistence rule. The project uses native browser APIs and ES modules rather than a JavaScript framework.

Evidence: [main.js](../../src/open-gallery/main.js), [favorites.js](../../src/open-gallery/favorites.js), [detail.js](../../src/open-gallery/detail.js).

### Resilience and quality assurance

I handle each provider result independently, provide status messages for failure and empty states, and use image fallbacks. Automated tests exercise data normalization, request behavior, Met concurrency limits, service errors, and local saved-work handling. I also verified the production build and public Pages routes.

Evidence: [OpenGallery.test.js](../../src/test/OpenGallery.test.js), [GitHub Pages workflow](../../.github/workflows/deploy-pages.yml).

### Accessibility and responsive interaction

I used semantic regions, labels, live status messages, keyboard focus styles, skip links, responsive CSS layouts, image alternatives, and a reduced-motion preference. I added small entrance animations while disabling those animations when reduced motion is requested.

Evidence: [index.html](../../src/open-gallery/index.html), [styles.css](../../src/open-gallery/styles.css).

## Reflection

One important lesson was to normalize external data at the boundary of the application. The museums have separate APIs and inconsistent naming, but a shared artwork object lets the same card, detail, and favorites patterns work across both collections. I also learned to think about network failure as part of the interface: parallel requests should not make a successful museum disappear just because the other one is unavailable.

Testing exposed project setup issues that a build alone did not catch: the existing Jest config referenced a Babel preset that was missing, and an empty test file caused the suite to fail. I added the compatible preset and focused tests so that the app's core data and persistence behavior can be checked repeatably.

## Work still requiring my own completion

- Confirm the name order/spelling for `OGWAL ALLAN` and update it in the official course documents if needed.
- Recheck the Trello board before submission to ensure card/checklist progress remains accurate and publicly visible.
- Record and publish the required video with my face visible at the start; include the browser demonstration and code walkthrough.
- Add the public video URL to the official Skills Development Document and test it while signed out.
- Upload the completed official documents to Canvas.
