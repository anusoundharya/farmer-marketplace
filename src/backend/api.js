const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const request = async (path, options = {}) => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const registerUser = (user) => request("/auth/register", {
  method: "POST",
  body: JSON.stringify(user),
});

export const loginUser = (credentials) => request("/auth/login", {
  method: "POST",
  body: JSON.stringify(credentials),
});

export const getProducts = () => request("/products");

export const addProduct = (product) => request("/products", {
  method: "POST",
  body: JSON.stringify(product),
});

export const updateProduct = (id, changes) => request(`/products/${id}`, {
  method: "PATCH",
  body: JSON.stringify(changes),
});

export const deleteProduct = (id) => request(`/products/${id}`, {
  method: "DELETE",
});

export const createOrder = (order) => request("/orders", {
  method: "POST",
  body: JSON.stringify(order),
});

export const getOrders = () => request("/orders");
