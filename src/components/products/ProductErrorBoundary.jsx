"use client";

import { useEffect } from "react";

export default function ProductErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Product page error:", error);
  }, [error]);

  return (
    <div className="min-h-[600px] bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">😞</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Có lỗi xảy ra</h1>
        <p className="text-gray-600 mb-6">
          Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.
        </p>
        <button
          onClick={reset}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
