import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  
  // checking to see if cart is empty
  if (cartItems.length > 0) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");

    displayCartTotal(cartItems);
  } else {
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty.</p>";

    const cartFooter = document.querySelector(".cart-fooer");
    if (cartFooter) {
      cartFooter.classList.add("hide");
    }
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function displayCartTotal(cartItems) {
  const cartFooter = document.querySelector(".cart-footer");

  if (cartItems.length > 0) {
    cartFooter.classList.remove("hide");

    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);

    document.querySelector(".cart-total").innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
  }
}



renderCartContents();

