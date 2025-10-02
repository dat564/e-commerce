"use client";

import { useCart } from "@/contexts/CartContext";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import LoadingLink from "@/components/LoadingLink";

export default function CartContent() {
  const { items, selectAll, getSelectedItems } = useCart();
  const selectedItems = getSelectedItems();
  const allSelected = items.length > 0 && selectedItems.length === items.length;

  const handleSelectAll = () => {
    selectAll(!allSelected);
  };

  if (items.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </p>
            <LoadingLink
              href="/categories"
              className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
              loadingText="Đang chuyển đến danh mục sản phẩm..."
            >
              Tiếp tục mua sắm
            </LoadingLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Header */}
              <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  Giỏ hàng của tôi
                </h1>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-gray-700">
                    Chọn tất cả ({items.length} sản phẩm)
                  </span>
                </label>
              </div>

              {/* Cart Items List */}
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
