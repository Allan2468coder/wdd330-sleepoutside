import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const money = (amount) => `$${amount.toFixed(2)}`;

export default class CheckoutProcess {
  constructor(form, dataSource = new ProductData()) {
    this.form = form;
    this.dataSource = dataSource;
    this.items = getLocalStorage("so-cart") ?? [];
    this.subtotal = this.items.reduce(
      (sum, item) => sum + Number(item.FinalPrice) * (Number(item.Quantity) || 1),
      0,
    );
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
    this.renderSubtotal();
    this.form.elements.zip.addEventListener("input", () => this.calculateOrder());
    this.form.addEventListener("submit", (event) => this.submit(event));
  }

  renderSubtotal() {
    document.querySelector("#subtotal").textContent = money(this.subtotal);
    if (!this.items.length) {
      document.querySelector("#checkout-message").textContent = "Your cart is empty. Add an item before checking out.";
      this.form.querySelector('button[type="submit"]').disabled = true;
    }
  }

  calculateOrder() {
    const zip = this.form.elements.zip.value.trim();
    if (!zip) return;
    const count = this.items.reduce((sum, item) => sum + (Number(item.Quantity) || 1), 0);
    this.tax = Math.round(this.subtotal * 0.06 * 100) / 100;
    this.shipping = count ? 10 + 2 * (count - 1) : 0;
    this.orderTotal = Math.round((this.subtotal + this.tax + this.shipping) * 100) / 100;
    document.querySelector("#tax").textContent = money(this.tax);
    document.querySelector("#shipping").textContent = money(this.shipping);
    document.querySelector("#order-total").textContent = money(this.orderTotal);
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: Number(item.FinalPrice),
      quantity: Number(item.Quantity) || 1,
    }));
  }

  async submit(event) {
    event.preventDefault();
    if (!this.form.reportValidity()) return;
    this.calculateOrder();
    if (!this.form.elements.zip.value.trim()) return;

    const message = document.querySelector("#checkout-message");
    const button = this.form.querySelector('button[type="submit"]');
    button.disabled = true;
    message.textContent = "Submitting your order…";
    const fields = Object.fromEntries(new FormData(this.form).entries());
    const payload = {
      ...fields,
      orderDate: new Date().toISOString(),
      items: this.packageItems(this.items),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    try {
      const response = await this.dataSource.checkout(payload);
      message.textContent = response.message ?? "Order submitted successfully.";
    } catch (error) {
      message.textContent = `Unable to submit your order: ${error.message}`;
      button.disabled = false;
    }
  }
}

loadHeaderFooter();
new CheckoutProcess(document.querySelector("#checkout-form"));
