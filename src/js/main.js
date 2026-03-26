import ExternalServices from "./ExternalServices.mjs";

import ProductList from "./ProductList.mjs";

import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const listElement = document.querySelector(".product-list");

if (listElement) {
    const dataSource = new ExternalServices("tents");
    const myList = new ProductList("tents", dataSource, listElement);

    myList.init();
}

