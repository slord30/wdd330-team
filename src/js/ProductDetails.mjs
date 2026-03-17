import { setLocalStorage, getLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {

        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails("main");

        document
            .getElementById("addToCart")
            .addEventListener("click", this.addToCart.bind(this));
    }

    addToCart() {
        let cart = getLocalStorage("so-cart") || [];
        cart.push(this.product);
        setLocalStorage("so-cart", cart);

        // shakes backpack icon when item is added to cart
        const cartIcon = document.querySelector(".cart");
        cartIcon.classList.add("cart-animate");

        // Remove the class after the animation ends so it can run again later
        setTimeout(() => cartIcon.classList.remove("cart-animate"), 500);

  const message = document.createElement("p");
  message.textContent = "Added to cart!";
  message.style.color = "green";
  
  // Put the message inside the product detail section
  document.querySelector(".product-detail").appendChild(message);

  // Make it disappear after 2 seconds
  setTimeout(() => message.remove(), 2000);
    }

    renderProductDetails(selector) {
        const element = document.querySelector(selector);
        element.innerHTML = "";

        // Price discount indictor
        let priceHTML = `<p class="product-price">$${this.product.FinalPrice.toFixed(2)}</p>`;

        if (this.product.FinalPrice < this.product.SuggestedRetailPrice) {
            const discount = (this.product.SuggestedRetailPrice - this.product.FinalPrice).toFixed(2);
            priceHTML = `
            <p class="product-price">
                <span class="original-price">$${this.product.SuggestedRetailPrice.toFixed(2)}</span>
                <span class="discounted-price">$${this.product.FinalPrice.toFixed(2)}</span>
                <span class="discount-flag">Save $${discount}!</span>
            </p>`;
        }

        element.insertAdjacentHTML(
            "afterBegin",
            `<section class="product-detail">
        <h3>${this.product.Brand.Name}</h3>
        <h2 class="divider">${this.product.NameWithoutBrand}</h2>
        <img class="divider" src="${this.product.Image}" alt="${this.product.Name}" />

        ${priceHTML}
        
        <p class="product__color">${this.product.Colors[0].ColorName}</p>
        <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        </div>
      </section>`
        );
    }
}
