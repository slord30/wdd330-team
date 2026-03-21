const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor() {
  }

  async getData(category, query = "") {
    const targetCategory = category || "tents";
    let url = `${baseURL}products/search/${targetCategory}`;

    const response = await fetch(url);
    const data = await convertToJson(response);
    let list = data.Result;

    if (query) {
      const term = query.toLowerCase();
      list = list.filter(product =>
        product.Name.toLowerCase().includes(term) ||
        product.Brand.Name.toLowerCase().includes(term)
      );
    }

    return list;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}
