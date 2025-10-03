"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingLink from "@/components/LoadingLink";

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/products?status=active&limit=8&sortBy=createdAt&sortOrder=desc"
        );
        const data = await response.json();
        if (data.success) {
          setProducts(data.data.products || []);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-300 mb-4">
            New arrival
          </h2>
          <h3 className="text-xl sm:text-2xl text-pink-600 mb-4">
            Sản phẩm nổi bật
          </h3>
          <p className="text-gray-600 text-base sm:text-lg">
            Các dòng sản phẩm nổi bật M.O.B
          </p>
        </div>

        {/* Content with conditional rendering */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" text="Đang tải sản phẩm..." />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <LoadingLink
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                loadingText={`Đang xem chi tiết ${product.name}...`}
              >
                {/* Product Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  {product.image && product.image.trim() !== "" ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col items-center justify-center">
                      <div className="text-4xl mb-2">🕯️</div>
                      <span className="text-gray-500 text-sm font-medium">
                        M.O.B
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 line-clamp-2">
                    {product.name}
                  </h4>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price */}
                  <div className="text-lg font-bold text-pink-600">
                    {formatPrice(product.price)}
                  </div>
                </div>
              </LoadingLink>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg">Chưa có sản phẩm nào</div>
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-8 sm:mt-12">
          <LoadingLink
            href="/categories"
            className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors inline-block"
            loadingText="Đang chuyển đến danh mục..."
          >
            Xem tất cả danh mục
          </LoadingLink>
        </div>
      </div>
    </section>
  );
}
