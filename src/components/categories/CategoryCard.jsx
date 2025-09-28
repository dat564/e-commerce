"use client";

import Image from "next/image";
import Link from "next/link";
import LoadingLink from "@/components/LoadingLink";

export default function CategoryCard({ category }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {category.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-pink-600 font-semibold text-sm">
            {category.productCount} sản phẩm
          </span>
          <LoadingLink
            href={`/categories/${category.slug}`}
            className="inline-flex items-center px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600 transition-colors"
            loadingText={`Đang chuyển đến danh mục ${category.name}...`}
          >
            Xem thêm
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </LoadingLink>
        </div>
      </div>
    </div>
  );
}
