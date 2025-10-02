"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import { Pagination } from "@/components/ui";

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
  const [currentSort, setCurrentSort] = useState({ sortBy, sortOrder });
  const [viewMode, setViewMode] = useState("grid");
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
        sortBy: currentSort.sortBy,
        sortOrder: currentSort.sortOrder,
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
  }, [category, search, currentSort.sortBy, currentSort.sortOrder, limit]);

  const handlePageChange = (newPage) => {
    fetchProducts(newPage);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setCurrentSort({ sortBy: newSortBy, sortOrder: newSortOrder });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleViewChange = (newViewMode) => {
    setViewMode(newViewMode);
  };

  return (
    <div className="bg-gray-50">
      {/* Filters */}
      <ProductFilters
        onSortChange={handleSortChange}
        onViewChange={handleViewChange}
        currentSort={currentSort.sortBy}
        currentView={viewMode}
        totalProducts={pagination.total}
        currentPage={pagination.page}
        limit={limit}
      />

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" text="Đang tải sản phẩm..." />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
              <button
                onClick={() => fetchProducts(1)}
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Products Grid */}
              <div
                className={`grid gap-6 lg:gap-8 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              </div>
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
    </div>
  );
}
