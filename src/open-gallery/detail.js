import { getArtworkDetails } from "./artworks.js";
import { isFavorite, setFavoriteCount, toggleFavorite } from "./favorites.js";

const status = document.querySelector("#detail-status");
const detail = document.querySelector("#artwork-detail");
const errorPanel = document.querySelector("#detail-error");
const image = document.querySelector("#detail-image");
const saveButton = document.querySelector("#detail-favorite");
const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23e8e2d5'/%3E%3Cpath d='M0 540Q180 360 330 520T600 470V700H0' fill='%23c9b9a0'/%3E%3Ccircle cx='405' cy='180' r='84' fill='%23d6a47a'/%3E%3C/svg%3E";

function setOptionalText(id, rowId, value) {
  const row = document.querySelector(`#${rowId}`);
  document.querySelector(`#${id}`).textContent = value || "";
  row.hidden = !value;
}

function updateSaveButton(artwork) {
  const saved = isFavorite(artwork.id);
  saveButton.setAttribute("aria-pressed", String(saved));
  saveButton.textContent = saved ? "♥ Remove from saved works" : "♡ Save this work";
}

async function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const museum = params.get("museum");
  const id = params.get("id");
  if (!id || !["aic", "met"].includes(museum)) {
    status.hidden = true;
    errorPanel.hidden = false;
    return;
  }

  try {
    const artwork = await getArtworkDetails(museum, id);
    document.title = `${artwork.title} — Open Gallery`;
    document.querySelector("#detail-title").textContent = artwork.title;
    document.querySelector("#detail-artist").textContent = artwork.artist;
    document.querySelector("#detail-date").textContent = artwork.date;
    document.querySelector("#detail-medium").textContent = artwork.medium;
    document.querySelector("#detail-museum").textContent = artwork.museum;
    document.querySelector("#museum-record").href = artwork.record;
    setOptionalText("detail-dimensions", "dimensions-row", artwork.dimensions);
    setOptionalText("detail-department", "department-row", artwork.department);
    setOptionalText("detail-credit", "credit-row", artwork.credit);
    setOptionalText("detail-public-domain", "public-domain-row", artwork.publicDomain ? "Public domain" : "Rights information on museum record");
    image.src = artwork.image || fallbackImage;
    image.alt = artwork.title;
    image.addEventListener("error", () => { image.src = fallbackImage; }, { once: true });
    saveButton.addEventListener("click", () => {
      const result = toggleFavorite(artwork);
      if (result.error) {
        status.hidden = false;
        status.textContent = "Your browser could not save this artwork. Check your storage settings and try again.";
        return;
      }
      updateSaveButton(artwork);
      setFavoriteCount(document.querySelector("#favorite-count"));
      status.hidden = false;
      status.textContent = result.saved ? "Artwork saved on this device." : "Artwork removed from saved works.";
    });
    updateSaveButton(artwork);
    setFavoriteCount(document.querySelector("#favorite-count"));
    detail.hidden = false;
    status.hidden = true;
  } catch {
    status.hidden = true;
    errorPanel.hidden = false;
  }
}

window.addEventListener("pageshow", () => setFavoriteCount(document.querySelector("#favorite-count")));
window.addEventListener("storage", () => setFavoriteCount(document.querySelector("#favorite-count")));
setFavoriteCount(document.querySelector("#favorite-count"));
loadDetail();
