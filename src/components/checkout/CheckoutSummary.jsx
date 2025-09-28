"use client";

import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutSummary({ items }) {
  const { getSubtotal, getTotal } = useCart();

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
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Tóm tắt đơn hàng
      </h2>

      {/* Products List */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {item.quantity} x {formatPrice(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Summary */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span className="font-medium">{formatPrice(shipping)}</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span className="text-pink-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
