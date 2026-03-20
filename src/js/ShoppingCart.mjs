import { getLocalStorage, renderListWithTemplate, setLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
    const newItem = `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images?.PrimaryMedium || item.Image}"
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

export default class ShoppingCart {
    constructor(key, parentElement) {
        this.key = key;
        this.parentElement = parentElement;
    }

    renderCartContents() {
        const cartItems = getLocalStorage(this.key);

        if (cartItems.length > 0) {
            renderListWithTemplate(cartItemTemplate, this.parentElement, cartItems);
            this.calculateListTotal(cartItems);

            const removeButtons = document.querySelectorAll(".cart-card__remove");
            removeButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    this.removeItem(button.dataset.id);
                });
            });
        } else {
            this.parentElement.innerHTML = "<p>Your cart is empty.</p>";
            const footer = document.querySelector(".cart-footer");
            if (footer) {
                footer.classList.add("hide");
            }

        }
    }

    removeItem(id) {
        let cartItems = getLocalStorage(this.key);
        const index = cartItems.findIndex(item => item.Id === id);
        if (index !== -1) {
            cartItems.splice(index, 1);
            setLocalStorage(this.key, cartItems);
            this.renderCartContents();
        }
    }

    calculateListTotal(cartItems) {
        const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
        const footer = document.querySelector(".cart-footer");
        footer.classList.remove("hide");
        document.querySelector(".cart-total").innerHTML = `Total: $${total.toFixed(2)}`;
    }
}