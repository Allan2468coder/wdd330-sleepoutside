import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      document.querySelector(".product-detail").textContent =
        "Product not found.";
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
    const largeImage = product.Image.replace(
      "../images/tents/",
      "https://i.stpost.com/",
    ).replace("~320.jpg", "~600.jpg");

    productDetail.innerHTML = `
      <h3>${product.Brand.Name}</h3>
      <h2 class="divider">${product.NameWithoutBrand}</h2>
      <picture>
        <source media="(min-width: 600px)" srcset="${largeImage}" />
        <img class="divider" src="${product.Image}" alt="${product.Name}" />
      </picture>
      <p class="product-card__price">$${product.FinalPrice}</p>
      <p class="product__color">${product.Colors[0].ColorName}</p>
      <p class="product__description">${product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    `;
  }
}
