"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingLink from "@/components/LoadingLink";
import { categoriesAPI } from "@/api/categories";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoriesAPI.getAll({
          status: "active",
          limit: 6,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        if (data.success) {
          setCategories(data.data.categories);
        } else {
          setError("Không thể tải danh mục");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Có lỗi xảy ra khi tải danh mục");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-300 mb-4">
            Categories
          </h2>
          <h3 className="text-xl sm:text-2xl text-pink-600 mb-4">
            Thể loại sản phẩm
          </h3>
          <p className="text-gray-600 text-base sm:text-lg">
            Các dòng sản phẩm chính tại THƠM THƠM
          </p>
        </div>

        {/* Content with conditional rendering */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" text="Đang tải danh mục..." />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category) => {
              // Tạo slug từ name nếu không có slug
              const slug =
                category.slug ||
                category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "");

              return (
                <LoadingLink
                  key={category._id}
                  href={`/categories/${slug}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                  loadingText={`Đang chuyển đến danh mục ${category.name}...`}
                >
                  {/* Category Image */}
                  <div className="relative h-48 sm:h-64 overflow-hidden">
                    {category.image && category.image.trim() !== "" ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col items-center justify-center">
                        <div className="text-4xl mb-2">📦</div>
                        <span className="text-gray-500 text-sm font-medium">
                          {category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Category Info */}
                  <div className="p-6 text-center">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {category.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>
                    <span className="text-pink-600 hover:text-pink-700 font-medium transition-colors">
                      Xem sản phẩm →
                    </span>
                  </div>
                </LoadingLink>
              );
            })}
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
