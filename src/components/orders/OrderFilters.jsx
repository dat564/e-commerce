"use client";

import { useState } from "react";

export default function OrderFilters({ filters, onFilterChange }) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "processing", label: "Đang xử lý" },
    { value: "shipped", label: "Đang giao hàng" },
    { value: "delivered", label: "Đã giao hàng" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleSortChange = (sortBy) => {
    onFilterChange({
      ...filters,
      sortBy,
    });
  };

  const getStatusLabel = () => {
    const status = statusOptions.find((opt) => opt.value === filters.status);
    return status ? status.label : "Tất cả";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm mã đơn hoặc tên sản phẩm
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
            placeholder="Nhập mã đơn hoặc tên sản phẩm..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none flex items-center justify-between"
          >
            <span>{getStatusLabel()}</span>
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

          {isStatusOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange("status", option.value);
                    setIsStatusOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                    filters.status === option.value
                      ? "bg-pink-50 text-pink-600"
                      : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleInputChange("dateFrom", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleInputChange("dateTo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
          />
        </div>
      </div>

      {/* Sort Buttons */}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => handleSortChange("price_asc")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filters.sortBy === "price_asc"
              ? "bg-pink-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Giá tăng
        </button>
        <button
          onClick={() => handleSortChange("price_desc")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filters.sortBy === "price_desc"
              ? "bg-pink-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Giá giảm
        </button>
      </div>
    </div>
  );
}
