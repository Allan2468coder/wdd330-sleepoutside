import { normalizeAic, normalizeMet, searchAic, searchMet } from "../open-gallery/artworks.js";
import { clearFavorites, getFavorites, isFavorite, toggleFavorite } from "../open-gallery/favorites.js";
import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";

const originalFetch = global.fetch;

function jsonResponse(data, ok = true) {
  return Promise.resolve({ ok, status: ok ? 200 : 503, json: () => Promise.resolve(data) });
}

describe("Open Gallery artwork data", () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("normalizes AIC API fields to a shared, display-ready artwork record", () => {
    const artwork = normalizeAic({
      id: 123,
      title: "Study & Bloom",
      artist_display: "Ada Artist",
      date_display: "1901",
      medium_display: "Oil on canvas",
      image_id: "flower image",
      is_public_domain: true,
      artwork_type_title: "Painting",
      dimensions: "20 × 30 cm",
      credit_line: "Gift of a donor",
    }, "https://iiif.example.test/v2");

    expect(artwork).toMatchObject({
      id: "aic-123",
      museum: "Art Institute of Chicago",
      title: "Study & Bloom",
      artist: "Ada Artist",
      date: "1901",
      medium: "Oil on canvas",
      image: "https://iiif.example.test/v2/flower%20image/full/843,/0/default.jpg",
      record: "https://www.artic.edu/artworks/123",
      publicDomain: true,
      department: "Painting",
      dimensions: "20 × 30 cm",
      credit: "Gift of a donor",
    });
    expect(Object.keys(artwork)).toHaveLength(12);
  });

  test("normalizes Met records and supplies safe fallbacks", () => {
    const artwork = normalizeMet({ objectID: 456, title: "Untitled", primaryImageSmall: "https://images.example.test/456.jpg" });

    expect(artwork).toMatchObject({
      id: "met-456",
      museum: "The Metropolitan Museum of Art",
      title: "Untitled",
      artist: "Artist unknown",
      date: "Date unknown",
      image: "https://images.example.test/456.jpg",
      record: "https://www.metmuseum.org/art/collection/search/456",
      publicDomain: false,
    });
    expect(Object.keys(artwork)).toHaveLength(12);
  });

  test("requests paginated AIC search data and normalizes its results", async () => {
    global.fetch = jest.fn(() => jsonResponse({
      config: { iiif_url: "https://iiif.example.test" },
      pagination: { total: 30, current_page: 2, total_pages: 3 },
      data: [{ id: 7, title: "Blue vase" }],
    }));

    const result = await searchAic("blue vase", 1);

    expect(global.fetch.mock.calls[0][0]).toContain("/artworks/search?");
    expect(global.fetch.mock.calls[0][0]).toContain("page=2");
    expect(result.total).toBe(30);
    expect(result.hasMore).toBe(true);
    expect(result.artworks[0]).toMatchObject({ id: "aic-7", title: "Blue vase" });
  });

  test("limits Met object requests to five concurrent calls", async () => {
    let inFlight = 0;
    let maximumInFlight = 0;
    global.fetch = jest.fn((url) => {
      if (url.includes("/search?")) return jsonResponse({ total: 6, objectIDs: [1, 2, 3, 4, 5, 6] });
      inFlight += 1;
      maximumInFlight = Math.max(maximumInFlight, inFlight);
      const id = Number(url.split("/").pop());
      return new Promise((resolve) => {
        setTimeout(() => {
          inFlight -= 1;
          resolve({ ok: true, json: () => Promise.resolve({ objectID: id, title: `Work ${id}`, primaryImage: `https://images.example.test/${id}.jpg` }) });
        }, 2);
      });
    });

    const result = await searchMet("flowers", 0);

    expect(maximumInFlight).toBe(5);
    expect(result.artworks).toHaveLength(6);
    expect(result.hasMore).toBe(false);
    expect(result.artworks[5]).toMatchObject({ id: "met-6", title: "Work 6" });
  });

  test("rejects a failed museum response", async () => {
    global.fetch = jest.fn(() => jsonResponse({}, false));
    await expect(searchAic("missing", 0)).rejects.toThrow("Museum service returned 503");
  });
});

describe("Open Gallery saved works", () => {
  const store = new Map();

  beforeEach(() => {
    store.clear();
    global.localStorage = {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    };
  });

  test("saves, retrieves, identifies, removes, and clears works", () => {
    const artwork = { id: "aic-12", title: "Blue vase", artist: "Ada Artist", museum: "Art Institute" };

    expect(toggleFavorite(artwork)).toMatchObject({ saved: true, count: 1, error: false });
    expect(isFavorite("aic-12")).toBe(true);
    expect(getFavorites()).toEqual([artwork]);
    expect(toggleFavorite(artwork)).toMatchObject({ saved: false, count: 0, error: false });
    expect(clearFavorites()).toBe(true);
    expect(getFavorites()).toEqual([]);
  });

  test("ignores malformed or invalid stored favorite data", () => {
    store.set("open-gallery-favorites-v1", "not-json");
    expect(getFavorites()).toEqual([]);
    store.set("open-gallery-favorites-v1", JSON.stringify([{ title: "Missing ID" }, { id: "valid", title: "Valid" }]));
    expect(getFavorites()).toEqual([{ id: "valid", title: "Valid" }]);
  });
});