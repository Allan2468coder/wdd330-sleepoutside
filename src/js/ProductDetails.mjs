import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";

const glossaryTerms = {
  Closeout: {
    href: "#glossary-dialog",
    title:
      "Closeout: Closeout indicates an item may be last year's model or color. Closeouts are often offered at a discount.",
  },
  Featherlite: {
    href: "#glossary-dialog",
    title:
      "Featherlite: An unusually strong, lightweight aluminum tent pole system.",
  },
};

function addGlossaryLinks(description) {
  const fragment = document.createElement("template");
  fragment.innerHTML = description ?? "";

  const walker = document.createTreeWalker(
    fragment.content,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        return node.parentElement?.closest("a")
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    },
  );
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  const termsPattern = /\b(Closeouts?|Featherlite)\b/gi;

  for (const textNode of textNodes) {
    const text = textNode.textContent;
    const matches = [...text.matchAll(termsPattern)];

    if (!matches.length) continue;

    const replacement = document.createDocumentFragment();
    let cursor = 0;

    for (const match of matches) {
      const start = match.index;
      const end = start + match[0].length;
      const term = match[0].toLowerCase().startsWith("closeout")
        ? "Closeout"
        : "Featherlite";
      const glossary = glossaryTerms[term];
      const link = document.createElement("a");

      replacement.append(text.slice(cursor, start));
      link.className = "glossaryTermLink";
      link.href = glossary.href;
      link.title = glossary.title;
      link.setAttribute("aria-haspopup", "dialog");
      link.textContent = match[0];
      replacement.append(link);
      cursor = end;
    }

    replacement.append(text.slice(cursor));
    textNode.replaceWith(replacement);
  }

  fragment.content.querySelectorAll("a.glossaryTermLink").forEach((link) => {
    link.href = "#glossary-dialog";
    link.setAttribute("aria-haspopup", "dialog");
  });

  return fragment.innerHTML;
}

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
    const existingItem = cartItems.find(
      (item) => String(item.Id) === String(this.product.Id),
    );

    if (existingItem) {
      existingItem.Quantity = (Number(existingItem.Quantity) || 1) + 1;
    } else {
      cartItems.push({ ...this.product, Quantity: 1 });
    }

    setLocalStorage("so-cart", cartItems);
    alertMessage(`${this.product.Name} was added to your cart.`, false);
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
      <p class="product__description">${addGlossaryLinks(product.DescriptionHtmlSimple)}</p>
      <dialog class="glossary-dialog" id="glossary-dialog" aria-labelledby="glossary-dialog-title">
        <h2 id="glossary-dialog-title"></h2>
        <p id="glossary-dialog-definition"></p>
        <button class="glossary-dialog__close" type="button">Close</button>
      </dialog>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    `;

    const glossaryDialog = productDetail.querySelector("#glossary-dialog");
    const closeButton = glossaryDialog.querySelector(".glossary-dialog__close");
    closeButton.autofocus = true;
    closeButton.addEventListener("click", () => glossaryDialog.close());
    glossaryDialog.addEventListener("click", (event) => {
      if (event.target === glossaryDialog) glossaryDialog.close();
    });
    productDetail.addEventListener("click", (event) => {
      const glossaryLink = event.target.closest("a.glossaryTermLink");
      if (!glossaryLink) return;

      event.preventDefault();
      const definition = glossaryLink.title || `${glossaryLink.textContent} is used in this product description.`;
      const separator = definition.indexOf(":");
      document.querySelector("#glossary-dialog-title").textContent = glossaryLink.textContent;
      document.querySelector("#glossary-dialog-definition").textContent =
        separator >= 0 ? definition.slice(separator + 1).replace(/^\s*[-:]\s*/, "") : definition;
      glossaryDialog.showModal();
    });
  }
}
