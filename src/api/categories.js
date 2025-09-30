import { apiClient } from "./base.js";

// Categories API functions
export const categoriesAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    const response = await apiClient.get(
      `/api/categories?${queryParams.toString()}`
    );
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/categories/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post("/api/categories", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/categories/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/categories/${id}`);
    return response.data;
  },

  search: async (query, params = {}) => {
    const searchParams = { search: query, ...params };
    return categoriesAPI.getAll(searchParams);
  },
};
