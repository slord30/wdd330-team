import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", "#order-summary"); //where the checkout info will be displayed (displaySelector parameter in CheckoutProcess.mjs)
myCheckout.init();

document.querySelector("#zip").addEventListener("blur", () => {
    myCheckout.calculateOrderTotal();
});

document.querySelector("#checkout-form").addEventListener("submit", (e) => {
    e.preventDefault(); //prevents page from refreshing

    const formData = new FormData(e.target); //get all user's info
    const data = Object.fromEntries(formData.entries());

    data.orderDate = new Date();
    data.total = myCheckout.total;
    data.tax = myCheckout.tax;
    data.shipping = myCheckout.shipping;
    data.items = myCheckout.list;

    console.log("Order data send:", data);
});
