import { getLocalStorage, loadHeaderFooter, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") ?? [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  const list = document.querySelector(".product-list");
  list.innerHTML = htmlItems.join("");
  list.querySelectorAll(".cart-card__quantity").forEach((input) => {
    input.addEventListener("change", updateQuantity);
  });
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images?.PrimaryMedium ?? item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <label class="cart-card__quantity">
    Qty:
    <input type="number" min="1" step="1" value="${item.Quantity ?? 1}" data-product-id="${item.Id}" aria-label="Quantity for ${item.Name}" />
  </label>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function updateQuantity(event) {
  const productId = event.target.dataset.productId;
  const quantity = Math.max(1, Number.parseInt(event.target.value, 10) || 1);
  const cartItems = getLocalStorage("so-cart") ?? [];
  const item = cartItems.find((cartItem) => cartItem.Id === productId);

  if (!item) return;

  item.Quantity = quantity;
  event.target.value = quantity;
  setLocalStorage("so-cart", cartItems);
}

loadHeaderFooter();
renderCartContents();
