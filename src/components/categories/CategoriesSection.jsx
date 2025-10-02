"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import CategoryCard from "./CategoryCard";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories?status=active&limit=20");
        const data = await response.json();

        if (data.success) {
          setCategories(data.data.categories);
        } else {
          setError(data.message || "Không thể tải danh mục");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải danh mục");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Danh mục sản phẩm của M.O.B
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <div className="w-8 h-1 bg-pink-500"></div>
            <div className="w-6 h-1 bg-amber-600"></div>
            <div className="w-8 h-1 bg-pink-500"></div>
          </div>
        </div>

        {/* Content with conditional rendering */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" text="Đang tải danh mục sản phẩm..." />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg">Chưa có danh mục nào</div>
          </div>
        )}
      </div>
    </section>
  );
}
