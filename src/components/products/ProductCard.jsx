"use client";

import Image from "next/image";
import LoadingLink from "@/components/LoadingLink";

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <LoadingLink
      href={`/products/${product.id}`}
      className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer"
      loadingText={`Đang xem chi tiết ${product.name}...`}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Features Overlay */}
        {product.features && product.features.length > 0 && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-pink-600">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </LoadingLink>
  );
}
