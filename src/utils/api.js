import axios from "axios";

// API utility functions with authentication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle auth errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login if not already there
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await apiClient(endpoint, options);
    return { response, data: response.data };
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

// Specific API functions
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

export const productsAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/products", { params });
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

export const categoriesAPI = {
  getAll: async () => {
    const response = await apiClient.get("/api/categories");
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/categories/${id}`);
    return response.data;
  },

  create: async (categoryData) => {
    const response = await apiClient.post("/api/categories", categoryData);
    return response.data;
  },

  update: async (id, categoryData) => {
    const response = await apiClient.put(`/api/categories/${id}`, categoryData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/categories/${id}`);
    return response.data;
  },
};

export const ordersAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/orders", { params });
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

// Cart API (if needed)
export const cartAPI = {
  getCart: async () => {
    const response = await apiClient.get("/api/cart");
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await apiClient.post("/api/cart/add", {
      productId,
      quantity,
    });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await apiClient.put(`/api/cart/items/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await apiClient.delete(`/api/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete("/api/cart/clear");
    return response.data;
  },
};

// Export the axios instance for custom requests
export { apiClient };
