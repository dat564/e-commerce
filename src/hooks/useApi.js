import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/errorHandler";
import { authAPI, productsAPI, ordersAPI } from "@/api";

// Custom hook for API calls with loading and error states
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, onSuccess, onError) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);

      if (onError) {
        onError(err, errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
  };
};

// Hook for specific API operations
export const useAuthApi = () => {
  const { loading, error, execute, clearError } = useApi();

  const login = useCallback(
    async (email, password, onSuccess, onError) => {
      return execute(() => authAPI.login(email, password), onSuccess, onError);
    },
    [execute]
  );

  const register = useCallback(
    async (userData, onSuccess, onError) => {
      return execute(() => authAPI.register(userData), onSuccess, onError);
    },
    [execute]
  );

  const getProfile = useCallback(
    async (onSuccess, onError) => {
      return execute(() => authAPI.getProfile(), onSuccess, onError);
    },
    [execute]
  );

  return {
    loading,
    error,
    login,
    register,
    getProfile,
    clearError,
  };
};

export const useProductsApi = () => {
  const { loading, error, execute, clearError } = useApi();

  const getProducts = useCallback(
    async (params, onSuccess, onError) => {
      return execute(() => productsAPI.getAll(params), onSuccess, onError);
    },
    [execute]
  );

  const getProduct = useCallback(
    async (id, onSuccess, onError) => {
      return execute(() => productsAPI.getById(id), onSuccess, onError);
    },
    [execute]
  );

  const searchProducts = useCallback(
    async (query, params, onSuccess, onError) => {
      return execute(
        () => productsAPI.search(query, params),
        onSuccess,
        onError
      );
    },
    [execute]
  );

  return {
    loading,
    error,
    getProducts,
    getProduct,
    searchProducts,
    clearError,
  };
};

export const useOrdersApi = () => {
  const { loading, error, execute, clearError } = useApi();

  const getOrders = useCallback(
    async (params, onSuccess, onError) => {
      return execute(() => ordersAPI.getAll(params), onSuccess, onError);
    },
    [execute]
  );

  const getOrder = useCallback(
    async (id, onSuccess, onError) => {
      return execute(() => ordersAPI.getById(id), onSuccess, onError);
    },
    [execute]
  );

  const createOrder = useCallback(
    async (orderData, onSuccess, onError) => {
      return execute(() => ordersAPI.create(orderData), onSuccess, onError);
    },
    [execute]
  );

  return {
    loading,
    error,
    getOrders,
    getOrder,
    createOrder,
    clearError,
  };
};
