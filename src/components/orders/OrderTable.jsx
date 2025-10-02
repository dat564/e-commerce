"use client";

import Image from "next/image";
import LoadingLink from "@/components/LoadingLink";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_STATUS_DISPLAY,
} from "@/constants/orderStatus";

export default function OrderTable({
  orders,
  onViewDetails,
  onCancelOrder,
  onPayment,
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status, statusText) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case ORDER_STATUS.CANCELLED:
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            {statusText}
          </span>
        );
      case ORDER_STATUS.PENDING:
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            {statusText}
          </span>
        );
      case ORDER_STATUS.CONFIRMED:
      case ORDER_STATUS.PROCESSING:
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            {statusText}
          </span>
        );
      case ORDER_STATUS.SHIPPED:
        return (
          <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
            {statusText}
          </span>
        );
      case ORDER_STATUS.DELIVERED:
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

  const getPaymentStatusBadge = (paymentStatus) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";

    switch (paymentStatus) {
      case PAYMENT_STATUS.PAID:
        return (
          <span className={`${baseClasses} bg-green-100 text-green-700`}>
            ✓ {PAYMENT_STATUS_DISPLAY[PAYMENT_STATUS.PAID]}
          </span>
        );
      case PAYMENT_STATUS.PENDING:
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>
            {PAYMENT_STATUS_DISPLAY[PAYMENT_STATUS.PENDING]}
          </span>
        );
      case PAYMENT_STATUS.FAILED:
        return (
          <span className={`${baseClasses} bg-red-100 text-red-700`}>
            {PAYMENT_STATUS_DISPLAY[PAYMENT_STATUS.FAILED]}
          </span>
        );
      default:
        return null;
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
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                STT
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                MÃ ĐƠN
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                NGÀY ĐẶT
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[110px]">
                TRẠNG THÁI ĐƠN
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                THANH TOÁN
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                TỔNG TIỀN
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                SẢN PHẨM
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                THAO TÁC
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {index + 1}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.id}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-xs text-gray-900">{order.date}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {getStatusBadge(order.status, order.statusText)}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {order.paymentStatus &&
                    getPaymentStatusBadge(order.paymentStatus)}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </div>
                  <div className="text-xs text-gray-500">
                    (Ship: {formatPrice(order.shipping)})
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={order.products[0].image}
                        alt={order.products[0].name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {order.products[0].name}
                      </div>
                      <div className="text-xs text-gray-500">
                        SL: {order.products[0].quantity}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <div className="flex flex-col gap-1">
                    {order.status === ORDER_STATUS.PENDING && (
                      <button
                        onClick={() => onCancelOrder(order.id)}
                        className="px-3 py-1 border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                      >
                        Hủy đơn
                      </button>
                    )}
                    {order.paymentStatus === PAYMENT_STATUS.FAILED &&
                      order.status === ORDER_STATUS.PENDING && (
                        <button
                          onClick={() => onPayment && onPayment(order)}
                          className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-all duration-200"
                        >
                          Thanh toán
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
