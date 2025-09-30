import CategoriesSection from "@/components/categories/CategoriesSection";
import PageTransition from "@/components/PageTransition";
import LoadingLink from "@/components/LoadingLink";

export const metadata = {
  title: "Danh mục sản phẩm - M.O.B",
  description: "Khám phá các danh mục sản phẩm mỹ phẩm cao cấp tại M.O.B",
};

export default function CategoriesPage() {
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
              <span className="text-gray-800">Danh mục sản phẩm</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <CategoriesSection />
      </div>
    </PageTransition>
  );
}
