import axios from "axios";

// Server-side API client (không sử dụng localStorage)
const createServerApiClient = () => {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Server-side API functions
export const serverAPI = {
  // Products API functions for server-side
  products: {
    getAll: async (params = {}) => {
      try {
        const client = createServerApiClient();
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== "") {
            queryParams.append(key, params[key]);
          }
        });
        const response = await client.get(
          `/api/products?${queryParams.toString()}`
        );
        return response.data;
      } catch (error) {
        console.error("Server API getAll error:", error);
        throw error;
      }
    },

    getById: async (id) => {
      try {
        const client = createServerApiClient();
        const response = await client.get(`/api/products/${id}`);
        return response.data;
      } catch (error) {
        console.error("Server API getById error:", error);
        throw error;
      }
    },
  },
};
