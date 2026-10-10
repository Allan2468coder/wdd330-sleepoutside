import { clearFavorites, getFavorites, setFavoriteCount, toggleFavorite } from "./favorites.js";

const grid = document.querySelector("#favorites-grid");
const emptyState = document.querySelector("#favorites-empty");
const countText = document.querySelector("#saved-count");
const status = document.querySelector("#saved-status");
const clearButton = document.querySelector("#clear-saved");
const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 450'%3E%3Crect width='600' height='450' fill='%23e8e2d5'/%3E%3Cpath d='M0 350Q150 230 300 350T600 320V450H0' fill='%23c9b9a0'/%3E%3Ccircle cx='420' cy='130' r='60' fill='%23d6a47a'/%3E%3C/svg%3E";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function card(art) {
  const [museum, ...parts] = art.id.split("-");
  const detailUrl = `detail.html?museum=${encodeURIComponent(museum)}&id=${encodeURIComponent(parts.join("-"))}`;
  const museumLabel = art.museum === "The Metropolitan Museum of Art" ? "The Met" : "Art Institute";
  return `<article class="art-card"><div class="art-image-frame"><a class="image-link" href="${escapeHtml(detailUrl)}" aria-label="View details for ${escapeHtml(art.title)}"><img src="${escapeHtml(art.image || fallbackImage)}" alt="${escapeHtml(art.title)}" loading="lazy" /><span class="museum-tag">${museumLabel}</span></a><button class="favorite-button" type="button" data-remove-id="${escapeHtml(art.id)}" aria-label="Remove ${escapeHtml(art.title)} from saved works" aria-pressed="true">♥</button></div><div class="art-card-copy"><h2><a href="${escapeHtml(detailUrl)}">${escapeHtml(art.title)}</a></h2><p class="artist">${escapeHtml(art.artist)}</p><p class="art-meta">${escapeHtml([art.date, art.department].filter(Boolean).join(" · "))}</p></div></article>`;
}

function render() {
  const artworks = getFavorites();
  grid.innerHTML = artworks.map(card).join("");
  grid.querySelectorAll("img").forEach((image) => image.addEventListener("error", () => { image.src = fallbackImage; }, { once: true }));
  countText.textContent = `${artworks.length} ${artworks.length === 1 ? "work" : "works"} saved`;
  emptyState.hidden = artworks.length > 0;
  clearButton.hidden = artworks.length === 0;
  setFavoriteCount(document.querySelector("#favorite-count"));
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-id]");
  if (!button) return;
  const artwork = getFavorites().find((item) => item.id === button.dataset.removeId);
  const result = artwork ? toggleFavorite(artwork) : null;
  if (result?.error) {
    status.textContent = "Your browser could not update saved works. Check your storage settings and try again.";
    return;
  }
  render();
  status.textContent = "Saved work removed.";
});

clearButton.addEventListener("click", () => {
  status.textContent = clearFavorites() ? "All saved works were removed." : "Your browser could not update saved works.";
  render();
});

window.addEventListener("pageshow", render);
window.addEventListener("storage", render);
render();
