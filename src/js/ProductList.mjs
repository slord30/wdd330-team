import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  // Discount indicator
  const priceElement = document.getElementById("productPrice");

  if (product.FinalPrice < product.SuggestedRetailPrice) {
    // show both prices if discounted
    priceElement.innerHTML = `
    <span class = "original-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>
    <span class = "final-price">$${product.FinalPrice.toFixed(2)}</span>
    <span class = "discount-flag">Save $${(product.SuggestedRetailPrice - product.FinalPrice).toFixed(2)}!</span>`;
  } else {
    // show only final price if no discount
    priceElement.textContent = `$${product.FinalPrice.toFixed(2)}`;
  }

  // document.getElementById("productPrice").textContent = product.FinalPrice;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}