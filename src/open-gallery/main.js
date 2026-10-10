import { searchMuseum } from "./artworks.js";
import { isFavorite, setFavoriteCount, toggleFavorite } from "./favorites.js";

const form = document.querySelector("#search-form");
const queryInput = document.querySelector("#query");
const museumInput = document.querySelector("#museum");
const resultsElement = document.querySelector("#results");
const statusElement = document.querySelector("#status");
const toolbar = document.querySelector("#results-toolbar");
const countElement = document.querySelector("#result-count");
const moreButton = document.querySelector("#load-more");
const sortInput = document.querySelector("#sort");

const state = { query: "", museum: "both", page: 0, busy: false, controllers: [], entries: [], total: 0, nextPage: true };
const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 450'%3E%3Crect width='600' height='450' fill='%23e8e2d5'/%3E%3Cpath d='M0 350Q150 230 300 350T600 320V450H0' fill='%23c9b9a0'/%3E%3Ccircle cx='420' cy='130' r='60' fill='%23d6a47a'/%3E%3C/svg%3E";

function artworkCard(art) {
  const favorite = isFavorite(art.id);
  const [museum, ...parts] = art.id.split("-");
  const detailUrl = `detail.html?museum=${encodeURIComponent(museum)}&id=${encodeURIComponent(parts.join("-"))}`;
  const museumLabel = art.museum === "The Metropolitan Museum of Art" ? "The Met" : "Art Institute";
  return `
    <article class="art-card">
      <div class="art-image-frame">
        <a class="image-link" href="${escapeAttribute(detailUrl)}" aria-label="View details for ${escapeAttribute(art.title)}">
          <img src="${escapeAttribute(art.image || fallbackImage)}" alt="${escapeAttribute(art.title)}" loading="lazy" />
          <span class="museum-tag">${escapeHtml(museumLabel)}</span>
        </a>
        <button class="favorite-button" type="button" data-favorite-id="${escapeAttribute(art.id)}" aria-pressed="${favorite}" aria-label="${favorite ? "Remove" : "Save"} ${escapeAttribute(art.title)} ${favorite ? "from" : "to"} saved works">${favorite ? "♥" : "♡"}</button>
      </div>
      <div class="art-card-copy"><h3><a href="${escapeAttribute(detailUrl)}">${escapeHtml(art.title)}</a></h3><p class="artist">${escapeHtml(art.artist)}</p><p class="art-meta">${escapeHtml([art.date, art.department].filter(Boolean).join(" · "))}</p></div>
    </article>`;
}

function render() {
  const sorted = [...state.entries];
  if (sortInput.value === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (sortInput.value === "artist") sorted.sort((a, b) => a.artist.localeCompare(b.artist));
  resultsElement.innerHTML = sorted.map(artworkCard).join("");
  countElement.textContent = `${state.entries.length} works shown${state.total ? ` · ${state.total.toLocaleString()} records match` : ""}`;
  toolbar.hidden = state.entries.length === 0;
  moreButton.hidden = !state.nextPage || state.entries.length === 0;
  resultsElement.querySelectorAll("img").forEach((image) => image.addEventListener("error", () => { image.src = fallbackImage; }, { once: true }));
  setFavoriteCount(document.querySelector("#favorite-count"));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
const escapeAttribute = escapeHtml;

async function loadPage(reset = false) {
  if (state.busy) return;
  if (reset) {
    state.controllers.forEach((controller) => controller.abort());
    state.controllers = [];
    state.entries = [];
    state.page = 0;
    state.total = 0;
    state.nextPage = true;
    resultsElement.replaceChildren();
    toolbar.hidden = true;
  }
  state.busy = true;
  moreButton.disabled = true;
  statusElement.textContent = state.entries.length ? "Finding more works…" : "Searching the museum collections…";
  const providers = state.museum === "both" ? ["aic", "met"] : [state.museum];
  const requests = providers.map(async (provider) => {
    const controller = new AbortController();
    state.controllers.push(controller);
    return { provider, result: await searchMuseum(provider, state.query, state.page, controller.signal) };
  });
  const settled = await Promise.allSettled(requests);
  const successful = settled.filter((entry) => entry.status === "fulfilled").map((entry) => entry.value);
  const failed = settled.filter((entry) => entry.status === "rejected");
  for (const { provider, result } of successful) {
    state.entries.push(...result.artworks);
    state.total += result.total;
  }
  state.nextPage = successful.some(({ result }) => result.hasMore);
  if (state.page === 0 && successful.length === 0) {
    state.nextPage = false;
    statusElement.textContent = "We couldn’t reach the selected collection. Check your connection and try again.";
  } else if (!state.entries.length) {
    state.nextPage = false;
    statusElement.textContent = `No artworks found for “${state.query}”. Try a broader subject or another collection.`;
  } else {
    statusElement.textContent = failed.length ? "Some collection results could not load. Results from the available museum are shown." : "Explore these works and follow the links to their museum records.";
  }
  state.page += 1;
  state.busy = false;
  moreButton.disabled = false;
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!queryInput.reportValidity()) return;
  state.query = queryInput.value.trim();
  state.museum = museumInput.value;
  sortInput.value = "relevance";
  loadPage(true);
  document.querySelector("#search").scrollIntoView({ behavior: "smooth", block: "start" });
});

resultsElement.addEventListener("click", (event) => {
  const button = event.target.closest("[data-favorite-id]");
  if (!button) return;
  const artwork = state.entries.find((item) => item.id === button.dataset.favoriteId);
  if (!artwork) return;
  const result = toggleFavorite(artwork);
  if (result.error) {
    statusElement.textContent = "Your browser could not save this artwork. Check your storage settings and try again.";
    return;
  }
  render();
});

document.querySelectorAll("[data-query]").forEach((button) => button.addEventListener("click", () => {
  queryInput.value = button.dataset.query;
  form.requestSubmit();
}));
moreButton.addEventListener("click", () => loadPage());
sortInput.addEventListener("change", render);
window.addEventListener("storage", () => setFavoriteCount(document.querySelector("#favorite-count")));
window.addEventListener("pageshow", () => setFavoriteCount(document.querySelector("#favorite-count")));
setFavoriteCount(document.querySelector("#favorite-count"));
