import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        forms: resolve(__dirname, "src/forms/index.html"),
        users: resolve(__dirname, "src/users/index.html"),
        timer: resolve(__dirname, "src/timer/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
      },
    },
  },
});
