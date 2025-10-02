"use client";

import { useState } from "react";

export default function ProductFilters({
  onSortChange,
  onViewChange,
  currentSort = "createdAt",
  currentView = "grid",
  totalProducts = 0,
  currentPage = 1,
  limit = 12,
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const sortOptions = [
    { value: "createdAt", label: "Mới nhất", order: "desc" },
    { value: "createdAt", label: "Cũ nhất", order: "asc" },
    { value: "price", label: "Giá thấp đến cao", order: "asc" },
    { value: "price", label: "Giá cao đến thấp", order: "desc" },
    { value: "name", label: "Tên A-Z", order: "asc" },
    { value: "name", label: "Tên Z-A", order: "desc" },
  ];

  const handleSortChange = (option) => {
    onSortChange(option.value, option.order);
  };

  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, totalProducts);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 space-y-4 lg:space-y-0">
          {/* Product Count & View Toggle */}
          <div className="flex items-center justify-between lg:justify-start space-x-4">
            <div className="text-sm text-gray-600">
              Hiển thị {totalProducts > 0 ? `${startIndex}-${endIndex}` : "0"}{" "}
              trong tổng số {totalProducts} sản phẩm
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewChange("grid")}
                className={`p-2 rounded-md transition-colors ${
                  currentView === "grid"
                    ? "bg-white text-pink-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Xem dạng lưới"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => onViewChange("list")}
                className={`p-2 rounded-md transition-colors ${
                  currentView === "list"
                    ? "bg-white text-pink-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Xem dạng danh sách"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex items-center space-x-4">
            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                />
              </svg>
              <span>Bộ lọc</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                onChange={(e) => {
                  const [value, order] = e.target.value.split("-");
                  handleSortChange({ value, order });
                }}
                value={`${currentSort}-${
                  sortOptions.find((opt) => opt.value === currentSort)?.order ||
                  "desc"
                }`}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
              >
                {sortOptions.map((option, index) => (
                  <option key={index} value={`${option.value}-${option.order}`}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
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
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters (Hidden by default) */}
        {isFiltersOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200">
            <div className="pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Sắp xếp theo
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {sortOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSortChange(option)}
                    className="text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
