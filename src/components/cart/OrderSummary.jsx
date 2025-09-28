"use client";

import { useCart } from "@/contexts/CartContext";
import LoadingLink from "@/components/LoadingLink";

export default function OrderSummary() {
  const { getSelectedItems, getSubtotal, getTotal } = useCart();

  const selectedItems = getSelectedItems();
  const subtotal = getSubtotal();
  const shipping = subtotal > 0 ? 30000 : 0;
  const total = getTotal();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Tóm tắt đơn hàng</h2>

      <div className="space-y-4">
        {/* Selected Products */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Sản phẩm đã chọn:</span>
          <span className="font-medium">
            {selectedItems.length}/
            {selectedItems.length + (getSelectedItems().length === 0 ? 1 : 0)}
          </span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping Fee */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span className="font-medium">{formatPrice(shipping)}</span>
        </div>

        {/* Divider */}
        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span className="text-pink-600">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <LoadingLink
            href="/checkout"
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center ${
              selectedItems.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600 text-white"
            }`}
            loadingText="Đang chuyển đến thanh toán..."
            disabled={selectedItems.length === 0}
          >
            Tiến hành thanh toán
          </LoadingLink>

          <LoadingLink
            href="/categories"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            loadingText="Đang chuyển đến danh mục..."
          >
            Tiếp tục mua sắm
          </LoadingLink>
        </div>

        {/* Note */}
        {selectedItems.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Vui lòng chọn sản phẩm để thanh toán
          </p>
        )}
      </div>
    </div>
  );
}
