import { getLocalStorage, setLocalStorage } from "./utils.mjs";

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
        const shippingElement = document.querySelector("#shipping");
        const taxElement = document.querySelector("#tax");
        const totalElement = document.querySelector("#total");

        if (shippingElement) shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
        if (taxElement) taxElement.innerText = `$${this.tax}`;
        if (totalElement) totalElement.innerText = `$${this.total}`;
    }
}