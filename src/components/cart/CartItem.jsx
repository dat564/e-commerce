"use client";

import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart, toggleSelect } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const handleSelect = () => {
    toggleSelect(item.id);
  };

  return (
    <div className="p-6 flex items-center space-x-4">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={item.selected}
        onChange={handleSelect}
        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
      />

      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0">
        {item.image && item.image.trim() !== "" ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-2xl">📦</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-gray-800 line-clamp-2">
          {item.name}
        </h3>
        <p className="text-xl font-bold text-pink-600 mt-1">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          -
        </button>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
          min="1"
          className="duration-200 w-12 text-center border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none"
        />
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          +
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="text-xl font-bold text-gray-800">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleRemove}
        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
