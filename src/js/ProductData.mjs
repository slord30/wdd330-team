function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
  }

  getData(category) {
    const response = await fetch(`../json.${category}.json`);
    const data = await convertToJson(response);
    return data;
  }

  async findProductById(id) {
    const products = await this.getData("tents");
    return products.find((item) => item.Id === id);
  }
}
