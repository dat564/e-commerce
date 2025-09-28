"use client";

import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="text-6xl mb-4">🕯️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có sản phẩm nào
            </h3>
            <p className="text-gray-500">
              Danh mục này hiện chưa có sản phẩm nào. Vui lòng quay lại sau!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
