import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  envDir: resolve(__dirname, "src"),

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        productListing: resolve(__dirname, "src/product_listing/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        checkoutSuccess: resolve(__dirname, "src/checkout/success.html"),
        forms: resolve(__dirname, "src/forms/index.html"),
        users: resolve(__dirname, "src/users/index.html"),
        timer: resolve(__dirname, "src/timer/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        openGallery: resolve(__dirname, "src/open-gallery/index.html"),
      },
    },
  },
});
