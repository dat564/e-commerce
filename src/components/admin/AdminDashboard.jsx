"use client";

import {
  BarChartOutlined,
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const stats = [
  {
    title: "Tổng người dùng",
    value: "1,234",
    change: "+12%",
    changeType: "positive",
    icon: <UserOutlined className="text-2xl" />,
    color: "bg-blue-500",
  },
  {
    title: "Tổng sản phẩm",
    value: "567",
    change: "+8%",
    changeType: "positive",
    icon: <ShoppingOutlined className="text-2xl" />,
    color: "bg-green-500",
  },
  {
    title: "Tổng đơn hàng",
    value: "89",
    change: "+23%",
    changeType: "positive",
    icon: <BarChartOutlined className="text-2xl" />,
    color: "bg-purple-500",
  },
  {
    title: "Thể loại",
    value: "12",
    change: "+2",
    changeType: "positive",
    icon: <AppstoreOutlined className="text-2xl" />,
    color: "bg-pink-500",
  },
];

export default function AdminDashboard() {
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
            {[
              {
                id: "#2029",
                customer: "Nguyễn Văn A",
                amount: "1,527,000₫",
                status: "Đã hủy",
              },
              {
                id: "#2028",
                customer: "Trần Thị B",
                amount: "999,000₫",
                status: "Đang xử lý",
              },
              {
                id: "#2027",
                customer: "Lê Văn C",
                amount: "2,100,000₫",
                status: "Đã giao hàng",
              },
            ].map((order, index) => (
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
                  <p
                    className={`text-sm ${
                      order.status === "Đã giao hàng"
                        ? "text-green-600"
                        : order.status === "Đang xử lý"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sản phẩm bán chạy
          </h3>
          <div className="space-y-3">
            {[
              {
                name: "Nến Thơm White Tea & Sage",
                sales: 45,
                revenue: "22,455,000₫",
              },
              {
                name: "Nến Thơm Stress Relief",
                sales: 38,
                revenue: "18,962,000₫",
              },
              {
                name: "Nến Thơm Peppermint Bark",
                sales: 32,
                revenue: "15,968,000₫",
              },
            ].map((product, index) => (
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
                  <p className="font-medium text-gray-800">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Thao tác nhanh
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <UserOutlined className="text-pink-500 text-xl" />
            <div className="text-left">
              <p className="font-medium text-gray-800">Thêm người dùng</p>
              <p className="text-sm text-gray-600">Tạo tài khoản mới</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AppstoreOutlined className="text-pink-500 text-xl" />
            <div className="text-left">
              <p className="font-medium text-gray-800">Thêm thể loại</p>
              <p className="text-sm text-gray-600">Tạo danh mục mới</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingOutlined className="text-pink-500 text-xl" />
            <div className="text-left">
              <p className="font-medium text-gray-800">Thêm sản phẩm</p>
              <p className="text-sm text-gray-600">Tạo sản phẩm mới</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
