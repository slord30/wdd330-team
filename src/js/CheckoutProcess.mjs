import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { alertMessage } from "./utils.mjs";

export default class CheckoutProcess {
    //constructor gets localStorage key and the CSS selector for where to diplay checkout info
    constructor(key, displaySelector) {
        this.key = key;
        this.displaySelector = displaySelector;
        this.list = [];
        this.subtotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.total = 0;
    };

    //start the process of grabbing cart items from storage and calling the calculation method
    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateSubtotal();
    }

    //function to calculate subtotal of cart items
    calculateSubtotal() {
        this.subtotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0); //reduce to add up the FinalPrice of every item in the cart array.
        
        const subtotalElement = document.querySelector("#subtotal");
        const countElement = document.querySelector("#numItems");

        if (subtotalElement) subtotalElement.innerText = `$${this.subtotal.toFixed(2)}`;
        if (countElement) countElement.innerText = this.list.length;
    }

    //calculate everything else (called after zip code is entered)
    calculateOrderTotal() {

        //shipping is $10 for first item + $2 for each additional item
        this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;

        //calculates a 6% tax
        this.tax = (this.subtotal * 0.06).toFixed(2);

        //parseFloat converts string to int. Calculate the total
        this.total = (
            parseFloat(this.subtotal) +
            parseFloat(this.shipping) +
            parseFloat(this.tax)).toFixed(2);

        this.displayOrderTotal();
    }

    displayOrderTotal() {
        const shipping = document.querySelector("#shipping");
        const tax = document.querySelector("#tax");
        const total = document.querySelector("#total");

        if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
        if (tax) tax.innerText = `$${this.tax}`;
        if (total) total.innerText = `$${this.total}`;
    }

    async checkout(form) {
        const json = formDataToJSON(form);

        json.orderDate = new Date().toISOString();
        json.orderTotal = this.total;
        json.tax = this.tax;
        json.shipping = this.shipping;
        json.items = packageItems(this.list);

        console.log("Payload being sent to server:", json);

        try {
            const services = new ExternalServices();
            const res = await services.checkout(json);
            console.log("Server Response:", res);

            setLocalStorage(this.key, []);

            location.assign("success.html");
        }   catch (err) {
            const existingAlerts = document.querySelectorAll(".alert");
            existingAlerts.forEach((alert) => alert.remove());

            if (err.name === "servicesError") {
                for (let key in err.message) {
                    alertMessage(err.message[key]);
                }
            }   else {
                alertMessage("Something went wrong. Please try again.")
                console.log(err);
            }
        }
    }
}

function formDataToJSON(formElement) {
    const formData =  new FormData(formElement);
    const convertedJSON = {};
    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });
    return convertedJSON;
}

function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        price: item.FinalPrice,
        name: item.Name,
        quantity: 1,
    }));
}