import CartContent from "@/components/cart/CartContent";
import LoadingLink from "@/components/LoadingLink";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "Giỏ hàng - M.O.B",
  description: "Xem và quản lý giỏ hàng của bạn tại M.O.B",
};

export default function CartPage() {
  return (
    <PageTransition>
      <div className="bg-white">
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
              <span className="text-gray-800">Giỏ hàng</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <CartContent />
      </div>
    </PageTransition>
  );
}
