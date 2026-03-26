const baseURL = "https://wdd330-backend.onrender.com/";

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw {name: "servicesError", message: jsonResponse};
  }
}

export default class ExternalServices {
  constructor() {
  }

  async getData(category, query = "") {
    
    const safeCategory = category || "";
    const safeQuery = query || "";

    const categoryMap = {
      "tent": "tents",
      "tents": "tents",
      "backpack": "backpacks",
      "backpacks": "backpacks",
      "pack" : "backpacks",
      "hammock": "hammocks",
      "hammocks": "hammocks",
      "sleeping bag": "sleeping-bags",
      "sleeping bags": "sleeping-bags",
      "sleeping-bag": "sleeping-bags",
      "sleeping-bags": "sleeping-bags",
      "sleeping": "sleeping-bags",
      "bag": "sleeping-bags"
    };

    let searchTerm = safeQuery.toLowerCase().trim();
    let categoryTerm = safeCategory.toLowerCase().trim();

    let targetCategory = categoryMap[searchTerm] || categoryMap[categoryTerm] || safeCategory || "tents";

    const url = `${baseURL}products/search/${targetCategory}`;
    const response = await fetch(url);
    const data = await convertToJson(response);
    let list = data.Result;

    if (query && !categoryMap[searchTerm]) {
      const term = searchTerm.replace(/[^a-z0-9]/g, "");
      const singularTerm = term.endsWith("s") ? term.slice(0, -1) : term;

      list = list.filter(product => {
        const name = product.Name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const brand = product.Brand.Name.toLowerCase().replace(/[^a-z0-9]/g, "");
        return name.includes(term) || name.includes(singularTerm) ||
          brand.includes(term) || brand.includes(singularTerm);
      });
    }

    return list;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout`, options).then(convertToJson);
  }
}
