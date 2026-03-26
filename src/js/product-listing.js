import ExternalServices  from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import {loadHeaderFooter, getParam} from "./utils.mjs";


loadHeaderFooter();

const category = getParam("category");
const searchQuery = getParam("query");

const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");

const titleElement = document.querySelector(".title");
titleElement.textContent = searchQuery
    ? `Search results for: ${searchQuery}`
    : `Top Products: ${category}`;

const myList = new ProductList(category, dataSource, listElement, searchQuery);

myList.init();
