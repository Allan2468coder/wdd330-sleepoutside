import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, category, dataSource) {
    this.productId = productId;
    this.category = category;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    const productDetail = document.querySelector(".product-detail");

    try {
      this.product = await this.dataSource.findProductById(
        this.productId,
        this.category,
      );
    } catch (error) {
      productDetail.textContent = `Unable to load product details: ${error.message}`;
      return;
    }

    if (!this.product) {
      productDetail.textContent = "Product not found.";
      return;
    }

    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") ?? [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    const product = this.product;
    const productDetail = document.querySelector(".product-detail");
    const productImage = product.Images?.PrimaryLarge ?? product.Image ?? "";

    productDetail.innerHTML = `
      <h3>${product.Brand.Name}</h3>
      <h2 class="divider">${product.NameWithoutBrand}</h2>
      <picture>
        <img class="divider" src="${productImage}" alt="${product.Name}" />
      </picture>
      <p class="product-card__price">$${product.FinalPrice}</p>
      <p class="product__color">${product.Colors?.[0]?.ColorName ?? ""}</p>
      <p class="product__description">${product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    `;
  }
}
