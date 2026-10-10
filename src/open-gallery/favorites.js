const STORAGE_KEY = "open-gallery-favorites-v1";

export function getFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter((artwork) => artwork && artwork.id && artwork.title) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().some((artwork) => artwork.id === id);
}

export function toggleFavorite(artwork) {
  const saved = getFavorites();
  const alreadySaved = saved.some((item) => item.id === artwork.id);
  const next = alreadySaved ? saved.filter((item) => item.id !== artwork.id) : [...saved, artwork];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    return { saved: alreadySaved, count: saved.length, error: true };
  }
  return { saved: !alreadySaved, count: next.length, error: false };
}

export function clearFavorites() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function setFavoriteCount(element) {
  if (element) element.textContent = String(getFavorites().length);
}
