"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductsSection from "@/components/products/ProductsSection";
import LoadingSpinner from "@/components/LoadingSpinner";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {search ? `Kết quả tìm kiếm cho "${search}"` : "Tất cả sản phẩm"}
          </h1>
          {search && (
            <p className="text-gray-600">
              Tìm thấy sản phẩm phù hợp với từ khóa của bạn
            </p>
          )}
        </div>

        {/* Products Section */}
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          }
        >
          <ProductsSection
            category={category}
            search={search}
            sortBy={sortBy}
            sortOrder={sortOrder}
            limit={12}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
