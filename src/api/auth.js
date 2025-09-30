import { apiClient } from "./base.js";

// Authentication API functions
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post("/api/auth/register", userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get("/api/auth/profile");
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put("/api/auth/profile", userData);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.put("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
