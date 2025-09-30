import axios from "axios";

// API utility functions with authentication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Helper function to handle logout
const handleLogout = () => {
  // Don't redirect if we're already on login/register pages
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";
  const isAuthPage = currentPath === "/login" || currentPath === "/register";

  if (!isAuthPage) {
    // Clear auth data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Redirect to login if not already there
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
};

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
    const token = localStorage.getItem("accessToken");
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
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Try to refresh the token
          const response = await axios.post("/api/auth/refresh", {
            refreshToken: refreshToken,
          });

          if (response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data;

            // Update tokens in localStorage
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            // Retry the original request
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Refresh failed, redirect to login
          handleLogout();
        }
      } else {
        // No refresh token, redirect to login
        handleLogout();
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

// Export the axios instance for custom requests
export { apiClient };
