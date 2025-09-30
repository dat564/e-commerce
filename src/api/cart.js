import { apiClient } from "./base.js";

// Cart API functions
export const cartAPI = {
  getCart: async () => {
    const response = await apiClient.get("/api/cart");
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await apiClient.post("/api/cart", {
      productId,
      quantity,
    });
    return response.data;
  },

  updateCartItem: async (productId, quantity) => {
    const response = await apiClient.put("/api/cart", {
      productId,
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (productId) => {
    const response = await apiClient.delete(`/api/cart?productId=${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete("/api/cart");
    return response.data;
  },
};
