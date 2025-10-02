"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { showError, showSuccess } from "@/utils/notification";

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

    case "LOAD_CART":
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

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          dispatch({
            type: "LOAD_CART",
            payload: cartData,
          });
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    };

    loadCartFromStorage();
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(state.items));
    } else {
      localStorage.removeItem("cart");
    }
  }, [state.items]);

  const addToCart = (product, quantity = 1) => {
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        selected: true,
      };

      dispatch({
        type: "ADD_TO_CART",
        payload: cartItem,
      });

      showSuccess("Thành công", "Đã thêm sản phẩm vào giỏ hàng");
      return true;
    } catch (error) {
      console.error("Add to cart error:", error);
      showError("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng");
      return false;
    }
  };

  const removeFromCart = (productId) => {
    try {
      dispatch({ type: "REMOVE_FROM_CART", payload: productId });
      showSuccess("Thành công", "Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Remove from cart error:", error);
      showError("Lỗi", "Không thể xóa sản phẩm khỏi giỏ hàng");
    }
  };

  const updateQuantity = (productId, quantity) => {
    try {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { id: productId, quantity },
        });
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

  const clearCart = () => {
    try {
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      console.error("Clear cart error:", error);
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
