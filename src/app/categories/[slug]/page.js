"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductsSection from "@/components/products/ProductsSection";
import PageTransition from "@/components/PageTransition";
import LoadingLink from "@/components/LoadingLink";

export default function CategoryDetailPage({ params }) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);

        // Tìm category theo slug chính xác
        const response = await fetch(
          `/api/categories?slug=${params.slug}&status=active`
        );
        const data = await response.json();

        if (data.success && data.data.categories.length > 0) {
          // API đã tìm kiếm chính xác theo slug, lấy category đầu tiên
          setCategory(data.data.categories[0]);
        } else {
          setError("Danh mục không tồn tại");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải danh mục");
        console.error("Error fetching category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params.slug]);

  return (
    <PageTransition>
      <div className=" bg-white">
        {loading ? (
          <div className="flex justify-center items-center py-20 min-h-[600px]">
            <LoadingSpinner size="lg" text="Đang tải danh mục..." />
          </div>
        ) : (
          category && (
            <>
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
                      href="/categories"
                      className="hover:text-pink-600 cursor-pointer"
                      loadingText="Đang chuyển đến danh mục..."
                    >
                      Danh mục
                    </LoadingLink>
                    <span className="mx-2">/</span>
                    <span className="text-gray-800">{category.name}</span>
                  </nav>
                </div>
              </div>

              {/* Category Header */}
              <div className="bg-white pt-4">
                <div className="container mx-auto px-4 max-w-6xl">
                  <div className="text-left">
                    <h4 className="text-4xl font-bold text-pink-400 p-0">
                      {category.name}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Products */}
              <ProductsSection category={category._id} limit={12} />
            </>
          )
        )}
      </div>
    </PageTransition>
  );
}
