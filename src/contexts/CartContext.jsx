"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "@/store";
import { showError, showWarning } from "@/utils/notification";
import { cartAPI } from "@/api";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "TOGGLE_SELECT":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, selected: !item.selected }
            : item
        ),
      };

    case "SELECT_ALL":
      return {
        ...state,
        items: state.items.map((item) => ({
          ...item,
          selected: action.payload,
        })),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    case "LOAD_USER_CART":
      return {
        ...state,
        items: action.payload || [],
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
  });
  const { user } = useAuth();
  const loadedUserIdRef = useRef(null);
  const isLoadingRef = useRef(false);

  // Load cart from API when user changes
  useEffect(() => {
    const loadCart = async () => {
      // Chỉ load cart khi:
      // 1. Có user và chưa load cart cho user này
      // 2. Hoặc user đã logout (để clear cart)
      if (user) {
        const currentUserId = user._id;

        // Kiểm tra xem đã load cart cho user này chưa
        if (
          loadedUserIdRef.current === currentUserId &&
          !isLoadingRef.current
        ) {
          return; // Đã load rồi, không cần load lại
        }

        // Kiểm tra xem đang load không
        if (isLoadingRef.current) {
          return; // Đang load rồi, không load lại
        }

        try {
          isLoadingRef.current = true;
          const response = await cartAPI.getCart();
          if (response.success) {
            dispatch({
              type: "LOAD_USER_CART",
              payload: response.data.cart || [],
            });
            loadedUserIdRef.current = currentUserId; // Đánh dấu đã load
          }
        } catch (error) {
          console.error("Error loading cart:", error);
          dispatch({ type: "CLEAR_CART" });
        } finally {
          isLoadingRef.current = false;
        }
      } else {
        // Clear cart when user logs out
        dispatch({ type: "CLEAR_CART" });
        loadedUserIdRef.current = null; // Reset loaded user
      }
    };

    loadCart();
  }, [user?._id]); // Chỉ depend vào user _id, không phải toàn bộ user object

  const addToCart = async (product, quantity = 1) => {
    // Check if user is logged in
    if (!user) {
      showWarning(
        "Vui lòng đăng nhập",
        "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng"
      );
      return false;
    }

    try {
      const response = await cartAPI.addToCart(product.id, quantity);
      if (response.success) {
        // Update local state with API response
        dispatch({ type: "LOAD_USER_CART", payload: response.data.cart || [] });
        // Không cần reset loadedUserIdRef vì vẫn là cùng user
        return true;
      } else {
        showError(
          "Lỗi",
          response.message || "Không thể thêm sản phẩm vào giỏ hàng"
        );
        return false;
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      showError("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng");
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      const response = await cartAPI.removeFromCart(productId);
      if (response.success) {
        dispatch({ type: "LOAD_USER_CART", payload: response.data.cart || [] });
        // Không cần reset loadedUserIdRef vì vẫn là cùng user
      } else {
        showError(
          "Lỗi",
          response.message || "Không thể xóa sản phẩm khỏi giỏ hàng"
        );
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
      showError("Lỗi", "Không thể xóa sản phẩm khỏi giỏ hàng");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;

    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
      } else {
        const response = await cartAPI.updateCartItem(productId, quantity);
        if (response.success) {
          dispatch({
            type: "LOAD_USER_CART",
            payload: response.data.cart || [],
          });
          // Không cần reset loadedUserIdRef vì vẫn là cùng user
        } else {
          showError("Lỗi", response.message || "Không thể cập nhật số lượng");
        }
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      showError("Lỗi", "Không thể cập nhật số lượng");
    }
  };

  const toggleSelect = (productId) => {
    dispatch({ type: "TOGGLE_SELECT", payload: productId });
  };

  const selectAll = (selected) => {
    dispatch({ type: "SELECT_ALL", payload: selected });
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const response = await cartAPI.clearCart();
      if (response.success) {
        dispatch({ type: "CLEAR_CART" });
        // Reset loadedUserIdRef vì đã clear cart
        loadedUserIdRef.current = null;
      } else {
        showError("Lỗi", response.message || "Không thể xóa giỏ hàng");
      }
    } catch (error) {
      console.error("Clear cart error:", error);
      showError("Lỗi", "Không thể xóa giỏ hàng");
    }
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSelectedItems = () => {
    return state.items.filter((item) => item.selected);
  };

  const getSubtotal = () => {
    return state.items
      .filter((item) => item.selected)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const shipping = subtotal > 0 ? 30000 : 0; // 30,000 VND shipping fee
    return subtotal + shipping;
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleSelect,
    selectAll,
    clearCart,
    getTotalItems,
    getSelectedItems,
    getSubtotal,
    getTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
