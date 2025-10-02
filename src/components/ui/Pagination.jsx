"use client";

import { useState } from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) {
  const [hoveredPage, setHoveredPage] = useState(null);

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Trang trước"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Trước
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="px-3 py-2 text-sm font-medium text-gray-500"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            const isHovered = page === hoveredPage;

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                onMouseEnter={() => setHoveredPage(page)}
                onMouseLeave={() => setHoveredPage(null)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-white bg-pink-600 border border-pink-600 shadow-lg transform scale-105"
                    : isHovered
                    ? "text-pink-600 bg-pink-50 border border-pink-200 transform scale-105"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                }`}
                aria-label={`Trang ${page}`}
                aria-current={isActive ? "page" : undefined}
              >
                {page}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-500 rounded opacity-20"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Trang sau"
        >
          Sau
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </nav>

      {/* Page Info */}
      <div className="ml-4 text-sm text-gray-600">
        Trang {currentPage} / {totalPages}
      </div>
    </div>
  );
}
