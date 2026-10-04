import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

const categoryLabels = {
  tents: "Tents",
  backpacks: "Backpacks",
  "sleeping-bags": "Sleeping Bags",
  hammocks: "Hammocks",
};

const category = getParam("category") ?? "tents";
const categoryTitle = document.querySelector("#category-title");
const statusMessage = document.querySelector("#products-status");
const listElement = document.querySelector(".product-list");

categoryTitle.textContent = `Top Products: ${categoryLabels[category] ?? "Products"}`;
loadHeaderFooter();

const dataSource = new ProductData();
const productList = new ProductList(category, dataSource, listElement);

async function loadProducts() {
  try {
    const products = await productList.init();
    statusMessage.textContent = products.length
      ? `${products.length} products found.`
      : "No products were found in this category.";
  } catch (error) {
    statusMessage.textContent = `Unable to load products: ${error.message}`;
  }
}

loadProducts();
