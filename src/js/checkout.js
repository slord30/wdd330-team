import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();


const checkoutForm = document.querySelector("#checkout-form");

if (checkoutForm) {
    const myCheckout = new CheckoutProcess("so-cart", "#order-summary"); //where the checkout info will be displayed (displaySelector parameter in CheckoutProcess.mjs)
    myCheckout.init();

    document.querySelector("#zip").addEventListener("blur", () => {
        myCheckout.calculateOrderTotal();
    });

    document.querySelector("#checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const myForm = e.target;
        const chk_status = myForm.checkValidity();

        myForm.reportValidity();

        if(chk_status) {
            myCheckout.checkout(myForm);
        }
    });
}

