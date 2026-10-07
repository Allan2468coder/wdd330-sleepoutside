const baseURL =
  import.meta.env.VITE_SERVER_URL?.trim() ||
  "https://wdd330-backend-osp8.onrender.com/";
const categories = new Set(["tents", "backpacks", "sleeping-bags", "hammocks"]);

function apiUrl(path) {
  return `${baseURL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

async function fetchJson(path) {
  const response = await fetch(apiUrl(path));

  if (!response.ok) {
    throw new Error(
      `Product request failed (${response.status} ${response.statusText}).`,
    );
  }

  return response.json();
}

export default class ProductData {
  async getData(category) {
    if (!categories.has(category)) {
      throw new Error(`Unknown product category: ${category}`);
    }

    const data = await fetchJson(`products/search/${category}`);

    if (!Array.isArray(data.Result)) {
      throw new Error("The product service returned an invalid product list.");
    }

    return data.Result;
  }

  async findProductById(id, category) {
    if (!id) return null;

    const detailData = await fetchJson(`product/${encodeURIComponent(id)}`);
    const product = detailData.Result ?? detailData;

    if (product && product.Id) {
      return product;
    }

    if (!category || !categories.has(category)) {
      return null;
    }

    const products = await this.getData(category);
    return products.find((item) => item.Id === id);
  }
}
