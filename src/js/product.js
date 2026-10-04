import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const productId = getParam("product");
const category = getParam("category") ?? "tents";
const dataSource = new ProductData();
const product = new ProductDetails(productId, category, dataSource);

loadHeaderFooter();
product.init();
