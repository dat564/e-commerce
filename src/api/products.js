import { apiClient } from "./base.js";

// Products API functions
export const productsAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    const response = await apiClient.get(
      `/api/products?${queryParams.toString()}`
    );
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await apiClient.post("/api/products", productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await apiClient.put(`/api/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/products/${id}`);
    return response.data;
  },

  search: async (query, params = {}) => {
    const response = await apiClient.get("/api/products/search", {
      params: { q: query, ...params },
    });
    return response.data;
  },
};
