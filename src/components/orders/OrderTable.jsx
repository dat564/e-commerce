"use client";

import Image from "next/image";
import LoadingLink from "@/components/LoadingLink";

export default function OrderTable({ orders, onViewDetails }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status, statusText) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "cancelled":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            {statusText}
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            {statusText}
          </span>
        );
      case "processing":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            {statusText}
          </span>
        );
      case "shipped":
        return (
          <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
            {statusText}
          </span>
        );
      case "delivered":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {statusText}
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {statusText}
          </span>
        );
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Chưa có đơn hàng nào
        </h3>
        <p className="text-gray-500 mb-6">
          Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
        </p>
        <LoadingLink
          href="/categories"
          className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
          loadingText="Đang chuyển đến danh mục..."
        >
          Bắt đầu mua sắm
        </LoadingLink>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền (bao gồm ship)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status, order.statusText)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatPrice(order.total + order.shipping)}
                    <span className="text-gray-500 text-xs ml-1">
                      (+{formatPrice(order.shipping)} ship)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={order.products[0].image}
                        alt={order.products[0].name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {order.products[0].name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Số lượng: {order.products[0].quantity}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <LoadingLink
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                    loadingText="Đang xem chi tiết đơn hàng..."
                  >
                    Xem chi tiết
                  </LoadingLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
