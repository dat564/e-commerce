import { apiClient } from "./base.js";

// Users API functions
export const usersAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    const response = await apiClient.get(
      `/api/users?${queryParams.toString()}`
    );
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post("/api/users", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/users/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  },

  search: async (query, params = {}) => {
    const searchParams = { search: query, ...params };
    return usersAPI.getAll(searchParams);
  },
};
