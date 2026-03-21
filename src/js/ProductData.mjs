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
  const url = `${baseURL}products/search/${targetCategory}`;

  const response = await fetch(url);
  const data = await convertToJson(response);
  let list = data.Result;

  if (query) {
    const term = query.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    const singularTerm = term.endsWith("s") && term.length > 3 ? term.slice(0, -1) : term;

    list = list.filter(product => {
      const name = product.Name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const brand = product.Brand.Name.toLowerCase().replace(/[^a-z0-9]/g, "");

      return name.includes(term) || 
             name.includes(singularTerm) || 
             brand.includes(term) || 
             brand.includes(singularTerm);
    });
  }

  return list;
}
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}
