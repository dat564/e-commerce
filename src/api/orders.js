import { apiClient } from "./base.js";

// Orders API functions
export const ordersAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/orders", { params });
    return response.data;
  },

  getAllAdmin: async (params = {}) => {
    const response = await apiClient.get("/api/admin/orders", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data;
  },

  create: async (orderData) => {
    const response = await apiClient.post("/api/orders", orderData);
    return response.data;
  },

  update: async (id, orderData) => {
    const response = await apiClient.put(`/api/orders/${id}`, orderData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/api/orders/${id}/status`, {
      status,
    });
    return response.data;
  },

  cancel: async (id) => {
    const response = await apiClient.patch(`/api/orders/${id}/cancel`);
    return response.data;
  },
};
