"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFoundPage({
  title = "Trang không tìm thấy",
  message = "Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.",
  showAutoRedirect = false,
  redirectDelay = 3000,
}) {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  useEffect(() => {
    if (showAutoRedirect) {
      const timer = setTimeout(() => {
        router.push("/");
      }, redirectDelay);

      return () => clearTimeout(timer);
    }
  }, [router, showAutoRedirect, redirectDelay]);

  return (
    <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center p-8 max-w-md mx-auto">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-pink-100 rounded-full mb-4">
            <span className="text-6xl">🔍</span>
          </div>
          <h1 className="text-6xl font-bold text-pink-600 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <p className="text-gray-600 mb-4">{message}</p>
          {showAutoRedirect && (
            <p className="text-sm text-gray-500">
              Bạn sẽ được tự động chuyển về trang chủ trong{" "}
              <span className="font-semibold text-pink-600">
                {redirectDelay / 1000} giây
              </span>
              ...
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            🏠 Về trang chủ ngay
          </Link>

          <button
            onClick={handleGoBack}
            className="inline-block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            ← Quay lại trang trước
          </button>
        </div>

        {/* Help Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Hoặc bạn có thể:</p>
          <div className="flex justify-center space-x-4 text-sm">
            <Link
              href="/categories"
              className="text-pink-600 hover:text-pink-700 transition-colors"
            >
              Xem sản phẩm
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/categories"
              className="text-pink-600 hover:text-pink-700 transition-colors"
            >
              Thể loại
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/contact"
              className="text-pink-600 hover:text-pink-700 transition-colors"
            >
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
