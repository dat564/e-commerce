"use client";

import { useState, useEffect } from "react";
import {
  BarChartOutlined,
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/store/hooks/useAuth";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authHeaders, isAdmin } = useAuth();

  useEffect(() => {
    if (authHeaders.Authorization && isAdmin) {
      fetchDashboardData();
    } else if (!authHeaders.Authorization) {
      setError("Vui lòng đăng nhập để truy cập trang admin");
      setLoading(false);
    }
  }, [authHeaders, isAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Check if user is admin
      if (!isAdmin) {
        setError("Bạn không có quyền truy cập trang admin");
        return;
      }

      const response = await fetch("/api/admin/stats", {
        headers: authHeaders,
      });
      const result = await response.json();

      if (result.success) {
        const {
          stats: statsData,
          recentOrders: orders,
          bestSellingProducts: products,
        } = result.data;

        // Format stats data
        const formattedStats = [
          {
            title: "Tổng người dùng",
            value: statsData.totalUsers.toLocaleString(),
            change: `${statsData.userChange >= 0 ? "+" : ""}${
              statsData.userChange
            }%`,
            changeType: statsData.userChange >= 0 ? "positive" : "negative",
            icon: <UserOutlined className="text-2xl" />,
            color: "bg-blue-500",
          },
          {
            title: "Tổng sản phẩm",
            value: statsData.totalProducts.toLocaleString(),
            change: `${statsData.productChange >= 0 ? "+" : ""}${
              statsData.productChange
            }%`,
            changeType: statsData.productChange >= 0 ? "positive" : "negative",
            icon: <ShoppingOutlined className="text-2xl" />,
            color: "bg-green-500",
          },
          {
            title: "Tổng đơn hàng",
            value: statsData.totalOrders.toLocaleString(),
            change: `${statsData.orderChange >= 0 ? "+" : ""}${
              statsData.orderChange
            }%`,
            changeType: statsData.orderChange >= 0 ? "positive" : "negative",
            icon: <BarChartOutlined className="text-2xl" />,
            color: "bg-purple-500",
          },
          {
            title: "Thể loại",
            value: statsData.totalCategories.toLocaleString(),
            change: `${statsData.categoryChange >= 0 ? "+" : ""}${
              statsData.categoryChange
            }`,
            changeType: statsData.categoryChange >= 0 ? "positive" : "negative",
            icon: <AppstoreOutlined className="text-2xl" />,
            color: "bg-pink-500",
          },
        ];

        setStats(formattedStats);
        setRecentOrders(orders);
        setBestSellingProducts(products);
      } else {
        setError(result.message || "Có lỗi xảy ra khi tải dữ liệu");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Không có dữ liệu để hiển thị</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
        <p className="text-gray-600">
          Chào mừng bạn đến với trang quản trị M.O.B
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} so với tháng trước
                </p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Đơn hàng gần đây
          </h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{order.amount}</p>
                    <p className={`text-sm ${order.statusColor}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Chưa có đơn hàng nào
              </p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sản phẩm bán chạy
          </h3>
          <div className="space-y-3">
            {bestSellingProducts.length > 0 ? (
              bestSellingProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.sales} đã bán
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      {product.revenue}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Chưa có sản phẩm nào được bán
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
