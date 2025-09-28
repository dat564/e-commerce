import CheckoutContent from "@/components/checkout/CheckoutContent";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "Thanh toán đơn hàng - M.O.B",
  description: "Hoàn tất đơn hàng của bạn tại M.O.B",
};

export default function CheckoutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-100 py-3">
          <div className="container mx-auto px-4 max-w-6xl">
            <nav className="text-sm text-gray-600">
              <span className="hover:text-pink-600 cursor-pointer">Home</span>
              <span className="mx-2">/</span>
              <span className="hover:text-pink-600 cursor-pointer">
                Giỏ hàng
              </span>
              <span className="mx-2">/</span>
              <span className="text-gray-800">Thanh toán</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <CheckoutContent />
      </div>
    </PageTransition>
  );
}
