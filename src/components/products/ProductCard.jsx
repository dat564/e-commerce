"use client";

import Image from "next/image";
import LoadingLink from "@/components/LoadingLink";

export default function ProductCard({ product, viewMode = "grid" }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (viewMode === "list") {
    return (
      <LoadingLink
        href={`/products/${product.id}`}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
        loadingText={`Đang xem chi tiết ${product.name}...`}
      >
        <div className="flex">
          {/* Image Container */}
          <div className="relative w-32 h-32 flex-shrink-0">
            {product.image && product.image.trim() !== "" ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col items-center justify-center">
                <div className="text-3xl mb-1">🕯️</div>
                <span className="text-gray-500 text-xs font-medium">M.O.B</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-pink-600 transition-colors mb-2">
                {product.name}
              </h3>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <span
                      key={index}
                      className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              {product.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-bold text-pink-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500">Xem chi tiết →</span>
            </div>
          </div>
        </div>
      </LoadingLink>
    );
  }

  return (
    <LoadingLink
      href={`/products/${product.id}`}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer h-full flex flex-col"
      loadingText={`Đang xem chi tiết ${product.name}...`}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden flex-shrink-0">
        {product.image && product.image.trim() !== "" ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col items-center justify-center">
            <div className="text-6xl mb-2">🕯️</div>
            <span className="text-gray-500 text-sm font-medium">M.O.B</span>
          </div>
        )}

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
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-pink-600 transition-colors min-h-[2rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-pink-600">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </LoadingLink>
  );
}
