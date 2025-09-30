"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProductsSection({
  category = "",
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  limit = 12,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        status: "active",
      });

      if (category) params.append("category", category);
      if (search) params.append("search", search);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } else {
        setError(data.message || "Không thể tải sản phẩm");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải sản phẩm");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [category, search, sortBy, sortOrder, limit]);

  const handlePageChange = (newPage) => {
    fetchProducts(newPage);
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-20">
            <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
            <button
              onClick={() => fetchProducts(1)}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    Trước
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.page >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              pageNum === pagination.page
                                ? "bg-pink-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg">
              {search
                ? `Không tìm thấy sản phẩm nào cho "${search}"`
                : "Chưa có sản phẩm nào"}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
