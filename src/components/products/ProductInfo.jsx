"use client";

import { useState } from "react";
import LoadingLink from "@/components/LoadingLink";
import { useCart } from "@/contexts/CartContext";

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Show success message or notification
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    console.log(`Buying ${quantity} of product ${product.id} now`);
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-pink-600">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span className="text-xl text-gray-500 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-600 font-medium">Còn hàng</span>
        </div>
        <span className="text-gray-600 text-sm">
          (Còn {product.stock} sản phẩm)
        </span>
      </div>

      {/* Category */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-600">Danh mục:</span>
        <LoadingLink
          href={`/categories/${product.categorySlug}`}
          className="text-pink-600 hover:text-pink-700 font-medium"
          loadingText={`Đang chuyển đến danh mục ${product.category}...`}
        >
          {product.category}
        </LoadingLink>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-gray-700 font-medium">Số lượng:</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={product.stock}
            className="w-16 px-2 py-2 text-center border-0 focus:ring-0 focus:outline-none"
          />
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Thêm vào giỏ hàng
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Mua ngay
        </button>
      </div>

      {/* Customer Service */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">
          CHAT VỚI NHÂN VIÊN TƯ VẤN
        </h3>
        <p className="text-gray-600 text-sm mb-1">
          Hotline:{" "}
          <span className="font-medium text-pink-600">0968.736.913</span>
        </p>
        <p className="text-gray-500 text-xs">(7AM – 22PM)</p>
      </div>

      {/* Return Policy */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">CHÍNH SÁCH ĐỔI TRẢ</h3>
        <p className="text-gray-600 text-sm">{product.returnPolicy}</p>
      </div>
    </div>
  );
}
