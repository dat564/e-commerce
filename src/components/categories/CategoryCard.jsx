"use client";

import Image from "next/image";
import Link from "next/link";
import LoadingLink from "@/components/LoadingLink";

export default function CategoryCard({ category }) {
  // Tạo slug từ name nếu không có slug
  const slug = category.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return (
    <LoadingLink
      href={`/categories/${slug}`}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group h-full flex flex-col cursor-pointer"
      loadingText={`Đang chuyển đến danh mục ${category.name}...`}
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
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

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {category.description}
        </p>
        <div className="flex items-center justify-center mt-auto">
          <span className="text-pink-600 font-semibold text-sm">
            {category.productCount} sản phẩm
          </span>
        </div>
      </div>
    </LoadingLink>
  );
}
