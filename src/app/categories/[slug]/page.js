"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import ProductsSection from "@/components/products/ProductsSection";
import PageTransition from "@/components/PageTransition";
import LoadingLink from "@/components/LoadingLink";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CategoryDetailPage({ params }) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("params", params.slug);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);

        // Tìm category theo slug
        const response = await fetch(
          `/api/categories?search=${params.slug}&status=active`
        );
        const data = await response.json();

        if (data.success && data.data.categories.length > 0) {
          // Tìm category có slug khớp hoặc name khớp
          const foundCategory = data.data.categories.find(
            (cat) =>
              cat.slug === params.slug ||
              cat.name
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "") === params.slug
          );

          if (foundCategory) {
            setCategory(foundCategory);
          } else {
            setError("Danh mục không tồn tại");
          }
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

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50">
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !category) {
    notFound();
  }

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
        <div className="bg-white py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                {category.name}
              </h1>
              <div className="flex justify-center items-center space-x-2 mb-6">
                <div className="w-8 h-1 bg-pink-500"></div>
                <div className="w-6 h-1 bg-amber-600"></div>
                <div className="w-8 h-1 bg-pink-500"></div>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Products */}
        <ProductsSection category={category._id} limit={12} />
      </div>
    </PageTransition>
  );
}
