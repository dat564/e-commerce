"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  DownOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import LoadingLink from "@/components/LoadingLink";
import SearchBar from "@/components/SearchBar";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/store";

export default function Header() {
  const { getTotalItems } = useCart();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const cartItemsCount = getTotalItems();
  const pathname = usePathname();

  // Get user data from Recoil state
  const { user, isAdmin, logout } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log("🔍 Header: User state changed:", { user, isAdmin });
  }, [user, isAdmin]);

  // Helper function to check if a link is active
  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/categories") {
      // Active for both /categories and /categories/[slug]
      return pathname === "/categories" || pathname.startsWith("/categories/");
    }
    return pathname.startsWith(href);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white">
      {/* Top Bar */}
      <div className="bg-gray-100 text-gray-600 text-xs sm:text-sm py-2 hidden sm:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <PhoneOutlined />
              <span>0968 737 913</span>
            </div>
            <div className="flex items-center space-x-2">
              <MailOutlined />
              <span>mob@gmail.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative z-[55]" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 hover:text-pink-600 transition-colors"
                >
                  <UserOutlined />
                  <span>{user.name || user.email}</span>
                  <DownOutlined className="text-xs" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-[60]">
                    <div className="py-2">
                      <LoadingLink
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        loadingText="Đang chuyển đến thông tin tài khoản..."
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Thông tin tài khoản
                      </LoadingLink>
                      <LoadingLink
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        loadingText="Đang chuyển đến đơn hàng..."
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Đơn hàng của tôi
                      </LoadingLink>
                      {isAdmin && (
                        <LoadingLink
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          loadingText="Đang chuyển đến admin..."
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Quản trị
                        </LoadingLink>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <LoadingLink
                  href="/login"
                  className="flex items-center space-x-1 hover:text-pink-600 transition-colors"
                  loadingText="Đang chuyển đến trang đăng nhập..."
                >
                  <UserOutlined />
                  <span>Đăng nhập</span>
                </LoadingLink>
                <LoadingLink
                  href="/register"
                  className="flex items-center space-x-1 hover:text-pink-600 transition-colors"
                  loadingText="Đang chuyển đến trang đăng ký..."
                >
                  <PlusOutlined />
                  <span>Đăng ký</span>
                </LoadingLink>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <LoadingLink
              href="/"
              className="flex items-center space-x-3"
              loadingText="Đang chuyển về trang chủ..."
            >
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🌸</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-pink-600 font-serif">
                  M.O.B
                </span>
                <span className="text-xs text-gray-500 -mt-1">Love Store</span>
              </div>
            </LoadingLink>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4 sm:mx-8">
              <SearchBar />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <LoadingLink
                href="/"
                className={`transition-colors relative text-sm lg:text-base text-gray-700 hover:text-pink-600 ${
                  isActive("/") ? "text-pink-600" : ""
                }`}
                loadingText="Đang chuyển về trang chủ..."
              >
                Trang chủ
                {isActive("/") && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-pink-600"></span>
                )}
              </LoadingLink>
              <LoadingLink
                href="/categories"
                className={`transition-colors relative text-sm lg:text-base text-gray-700 hover:text-pink-600 ${
                  isActive("/categories") ? "text-pink-600" : ""
                }`}
                loadingText="Đang chuyển đến thể loại..."
              >
                Danh mục
                {isActive("/categories") && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-pink-600"></span>
                )}
              </LoadingLink>
              <LoadingLink
                href="/"
                className={`transition-colors relative text-sm lg:text-base text-gray-700 hover:text-pink-600`}
                loadingText="Đang chuyển đến trang giới thiệu..."
              >
                Về chúng tôi
              </LoadingLink>
              <LoadingLink
                href="/"
                className={`transition-colors relative text-sm lg:text-base text-gray-700 hover:text-pink-600`}
                loadingText="Đang chuyển đến trang liên hệ..."
              >
                Liên hệ
              </LoadingLink>

              {/* Cart Icon */}
              <LoadingLink
                href="/cart"
                className="relative text-gray-700 hover:text-pink-600 transition-colors p-2"
                loadingText="Đang chuyển đến giỏ hàng..."
              >
                <ShoppingCartOutlined className="text-xl" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </LoadingLink>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-700 hover:text-pink-600 transition-colors">
              <svg
                className="w-6 h-6"
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
        </div>
      </header>
    </div>
  );
}
