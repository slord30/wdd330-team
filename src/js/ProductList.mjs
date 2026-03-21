import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement, searchQuery = "") {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.searchQuery = searchQuery;
  }

  async init() {
    const list = await this.dataSource.getData(this.category, this.searchQuery);

    const titleElement = document.querySelector(".title");

    if (this.searchQuery) {
      titleElement.innerHTML = `Search results for: ${this.searchQuery}`;
    } else if (this.category) {
      const categoryName = this.category.charAt(0).toUpperCase() + this.category.slice(1);
      titleElement.innerHTML = `Top Products: ${categoryName}`;
    }
    
    this.renderList(list);
  }

  renderList(list) {
    const htmlStrings = list.map(productCardTemplate);
    this.listElement.innerHTML = htmlStrings.join("");
  }
}
