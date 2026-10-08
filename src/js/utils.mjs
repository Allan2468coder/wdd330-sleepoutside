// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(
      `Failed to load template "${path}" (${response.status} ${response.statusText}).`,
    );
  }

  return response.text();
}

export async function loadHeaderFooter() {
  const [headerTemplate, footerTemplate] = await Promise.all([
    loadTemplate("/partials/header.html"),
    loadTemplate("/partials/footer.html"),
  ]);
  const headerElement = qs("#main-header");
  const footerElement = qs("#main-footer");

  if (!headerElement || !footerElement) {
    throw new Error("The page is missing a header or footer placeholder.");
  }

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function alertMessage(message, scroll = true) {
  const main = qs("main");
  if (!main) return;

  const alert = document.createElement("div");
  alert.className = "alert";
  alert.setAttribute("role", "alert");

  const text = document.createElement("span");
  if (typeof message === "string") {
    text.textContent = message;
  } else if (Array.isArray(message)) {
    text.textContent = message.map(formatAlertDetail).join(" ");
  } else {
    text.textContent = formatAlertDetail(message);
  }

  const close = document.createElement("button");
  close.type = "button";
  close.className = "alert__close";
  close.setAttribute("aria-label", "Dismiss message");
  close.textContent = "×";
  close.addEventListener("click", () => alert.remove());

  alert.append(text, close);
  main.prepend(alert);
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

function formatAlertDetail(detail) {
  if (typeof detail === "string") return detail;
  if (!detail || typeof detail !== "object") return String(detail ?? "");

  return Object.entries(detail)
    .map(([key, value]) => {
      const readableKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
      const readableValue = Array.isArray(value) ? value.join(", ") : String(value);
      return `${readableKey}: ${readableValue}`;
    })
    .join(". ");
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
