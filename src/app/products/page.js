"use client";

import { useState } from "react";
import ProductsSection from "@/components/products/ProductsSection";
import PageTransition from "@/components/PageTransition";
import LoadingLink from "@/components/LoadingLink";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleSearch = (e) => {
    e.preventDefault();
    // Search sẽ được xử lý trong ProductsSection
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-gray-100 py-3">
          <div className="container mx-auto px-4 max-w-6xl">
            <nav className="text-sm text-gray-600">
              <LoadingLink
                href="/"
                className="hover:text-pink-600 cursor-pointer"
                loadingText="Đang chuyển về trang chủ..."
              >
                Trang chủ
              </LoadingLink>
              <span className="mx-2">/</span>
              <span className="text-gray-800">Sản phẩm</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Sản phẩm M.O.B
              </h1>
              <div className="flex justify-center items-center space-x-2 mb-6">
                <div className="w-8 h-1 bg-pink-500"></div>
                <div className="w-6 h-1 bg-amber-600"></div>
                <div className="w-8 h-1 bg-pink-500"></div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-600"
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Sort */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="createdAt">Mới nhất</option>
                  <option value="name">Tên A-Z</option>
                  <option value="price">Giá</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="desc">Giảm dần</option>
                  <option value="asc">Tăng dần</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <ProductsSection
          search={search}
          sortBy={sortBy}
          sortOrder={sortOrder}
          limit={12}
        />
      </div>
    </PageTransition>
  );
}
