import md5 from "md5";

const API_URL = "https://api.valantis.store:41000/";
const PASSWORD = "Valantis";

const authenticate = () => {
  const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const authString = md5(`${PASSWORD}_${timestamp}`);
  return authString;
};

const fetchProductIds = async (page) => {
  try {
    const authString = authenticate();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": authString,
      },
      body: JSON.stringify({
        action: "get_ids",
        params: {
          offset: (page - 1) * 50,
          limit: 50,
        },
      }),
    };

    const response = await fetch(API_URL, requestOptions);
    if (!response.ok) {
      throw new Error("Failed to fetch product IDs");
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error("Error fetching product IDs:", error);
    return [];
  }
};

const fetchProducts = async (ids) => {
  try {
    const uniqueIds = [...new Set(ids)];

    const authString = authenticate();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": authString,
      },
      body: JSON.stringify({
        action: "get_items",
        params: { ids: uniqueIds },
      }),
    };

    const response = await fetch(API_URL, requestOptions);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const fetchFilteredProductIds = async (filterField, filterValue) => {
  try {
    const authString = authenticate();
    let params = {};

    if (!isNaN(filterValue)) {
      params = { [filterField]: parseFloat(filterValue) };
    } else {
      params = { [filterField]: filterValue };
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": authString,
      },
      body: JSON.stringify({
        action: "filter",
        params: params,
      }),
    };

    const response = await fetch(API_URL, requestOptions);
    if (!response.ok) {
      throw new Error("Failed to fetch filtered product IDs");
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error("Error fetching filtered product IDs:", error);
    return [];
  }
};

export { fetchProductIds, fetchProducts, fetchFilteredProductIds };
