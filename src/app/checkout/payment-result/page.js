"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageTransition from "@/components/PageTransition";

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");

  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/orders");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, router]);

  if (!status) {
    return (
      <PageTransition>
        <div className="min-h-[600px] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-[600px] bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {status === "success" && (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Thanh toán thành công!
                </h1>
                <p className="text-gray-600 mb-6">
                  Đơn hàng của bạn đã được thanh toán và tạo thành công.
                </p>
                {orderId && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-1">Mã đơn hàng:</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {orderId}
                    </p>
                  </div>
                )}
                <p className="text-gray-500 mb-6">
                  Tự động chuyển đến trang đơn hàng sau {countdown} giây...
                </p>
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={() => router.push("/orders")}
                    className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Xem đơn hàng
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Về trang chủ
                  </button>
                </div>
              </>
            )}

            {status === "failed" && (
              <>
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Thanh toán không thành công
                </h1>
                <p className="text-gray-600 mb-6">
                  {message ||
                    "Giao dịch không được hoàn tất. Vui lòng thử lại."}
                </p>
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={() => router.push("/checkout")}
                    className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Thử lại
                  </button>
                  <button
                    onClick={() => router.push("/cart")}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Về giỏ hàng
                  </button>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Có lỗi xảy ra
                </h1>
                <p className="text-gray-600 mb-6">
                  {message ||
                    "Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại sau."}
                </p>
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={() => router.push("/checkout")}
                    className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Thử lại
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Về trang chủ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <PageTransition>
          <div className="min-h-[600px] flex items-center justify-center">
            <LoadingSpinner size="lg" text="Đang tải..." />
          </div>
        </PageTransition>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
