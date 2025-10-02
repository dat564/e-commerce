"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import LoadingLink from "@/components/LoadingLink";
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const menuItems = [
  {
    key: "dashboard",
    label: "Tổng quan",
    icon: <DashboardOutlined />,
    href: "/admin",
    loadingText: "Đang tải trang tổng quan...",
  },
  {
    key: "users",
    label: "Quản lý tài khoản",
    icon: <UserOutlined />,
    href: "/admin/users",
    loadingText: "Đang tải quản lý tài khoản...",
  },
  {
    key: "categories",
    label: "Quản lý thể loại",
    icon: <AppstoreOutlined />,
    href: "/admin/categories",
    loadingText: "Đang tải quản lý thể loại...",
  },
  {
    key: "products",
    label: "Quản lý sản phẩm",
    icon: <ShoppingOutlined />,
    href: "/admin/products",
    loadingText: "Đang tải quản lý sản phẩm...",
  },
  {
    key: "orders",
    label: "Quản lý đơn hàng",
    icon: <BarChartOutlined />,
    href: "/admin/orders",
    loadingText: "Đang tải quản lý đơn hàng...",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white shadow-sm border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Collapse Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.key}>
                <LoadingLink
                  href={item.href}
                  loadingText={item.loadingText}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-pink-100 text-pink-600 border-r-2 border-pink-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </LoadingLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin Info */}
      {!isCollapsed && (
        <div className="mt-auto p-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <UserOutlined className="text-white text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  Admin
                </p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
