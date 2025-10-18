"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store";
import { UserOutlined, LogoutOutlined, HomeOutlined } from "@ant-design/icons";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src="/assets/images/home/logo.png"
                alt="M.O.B Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">M.O.B Admin</h1>
              <p className="text-sm text-gray-500">Quản trị hệ thống</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <HomeOutlined />
              <span>Về trang chủ</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors"
              >
                <UserOutlined />
                <span>{user?.name || user?.email}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogoutOutlined />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
