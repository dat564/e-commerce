"use client";

import { useState, useEffect } from "react";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { apiClient } from "@/api";
import { showError, showSuccess } from "@/utils/notification";
import { ORDER_STATUS_DISPLAY, ORDER_STATUS } from "@/constants/orderStatus";

export default function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateFrom: "",
    dateTo: "",
    sortBy: "price_desc",
  });

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };

      if (filters.status !== "all") {
        params.status = filters.status;
      }

      const response = await apiClient.get("/api/orders", { params });

      if (response.data.success) {
        // Transform data to match OrderTable format
        const transformedOrders = response.data.data.orders.map((order) => ({
          id: order.orderNumber || order._id,
          _id: order._id, // Keep the actual _id for API calls
          date: new Date(order.createdAt).toLocaleString("vi-VN"),
          status: order.status,
          statusText: ORDER_STATUS_DISPLAY[order.status] || order.status,
          total: order.total,
          shipping: order.shippingFee || 30000,
          products: order.items.map((item) => ({
            id: item.product?._id || item.product,
            name: item.product?.name || "Sản phẩm không tồn tại",
            image:
              item.product?.images?.[0] ||
              "/assets/images/products/placeholder.jpg",
            quantity: item.quantity,
            price: item.price,
          })),
          paymentStatus: order.paymentStatus,
          shippingAddress: order.shippingAddress,
          customer: order.customer,
        }));

        setOrders(transformedOrders);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showError("Lỗi", "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [filters.status]);

  const handlePageChange = (newPage) => {
    fetchOrders(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (orderId) => {
    console.log("View details for order:", orderId);
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      // Find order by orderNumber
      const orderToCancel = orders.find((o) => o.id === orderId);
      if (!orderToCancel) return;

      // Use the actual _id for API call
      const response = await apiClient.put(`/api/orders/${orderToCancel._id}`, {
        status: ORDER_STATUS.CANCELLED,
        cancelReason: "Khách hàng hủy đơn",
      });

      if (response.data.success) {
        showSuccess("Đã hủy đơn hàng", "Đơn hàng đã được hủy thành công");
        fetchOrders(pagination.currentPage);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      showError("Lỗi", "Không thể hủy đơn hàng");
    }
  };

  const handlePayment = async (order) => {
    try {
      // Create new payment QR for existing order
      const orderData = {
        userId: order.customer?.id || order.user,
        customer: order.customer,
        shippingAddress: order.shippingAddress,
        items: order.products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        subtotal: order.total - order.shipping,
        shippingFee: order.shipping,
        total: order.total,
        paymentMethod: "vnpay",
        notes: "Thanh toán lại đơn hàng",
      };

      const response = await apiClient.post("/api/create-qr-payment", {
        orderData,
        existingOrderId: order._id,
      });

      if (response.data.success) {
        showSuccess(
          "Tạo thanh toán thành công",
          "Vui lòng thanh toán trong thời gian quy định"
        );
        // Open VNPay payment page in new tab
        window.open(response.data.data.paymentUrl, "_blank");
      } else {
        throw new Error(response.data.message || "Không thể tạo thanh toán");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      showError(
        "Lỗi thanh toán",
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi tạo thanh toán"
      );
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Đơn hàng của tôi
          </h1>
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" text="Đang tải đơn hàng..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Đơn hàng của tôi
        </h1>

        {/* Filters */}
        <OrderFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Orders Table */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-600">
              Hãy mua sắm ngay để có đơn hàng đầu tiên!
            </p>
          </div>
        ) : (
          <>
            <OrderTable
              orders={orders}
              onViewDetails={handleViewDetails}
              onCancelOrder={handleCancelOrder}
              onPayment={handlePayment}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Hiển thị {orders.length} / {pagination.totalItems} đơn hàng
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Trước
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          page === pagination.currentPage
                            ? "bg-pink-500 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
