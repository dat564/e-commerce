import { Suspense } from "react";
import CheckoutContent from "@/components/checkout/CheckoutContent";
import PageTransition from "@/components/PageTransition";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingLink from "@/components/LoadingLink";

export const metadata = {
  title: "Thanh toán đơn hàng - M.O.B",
  description: "Hoàn tất đơn hàng của bạn tại M.O.B",
};

export default function CheckoutPage() {
  return (
    <PageTransition>
      <div className="min-h-[600px] bg-white">
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
              <LoadingLink
                href="/cart"
                className="hover:text-pink-600 cursor-pointer"
                loadingText="Đang chuyển đến giỏ hàng..."
              >
                Giỏ hàng
              </LoadingLink>
              <span className="mx-2">/</span>
              <span className="text-gray-800">Thanh toán</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <Suspense
          fallback={
            <div className="py-20 flex justify-center">
              <LoadingSpinner size="lg" text="Đang tải..." />
            </div>
          }
        >
          <CheckoutContent />
        </Suspense>
      </div>
    </PageTransition>
  );
}
