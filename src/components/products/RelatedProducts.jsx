"use client";

import ProductCard from "./ProductCard";

export default function RelatedProducts({ products }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          SẢN PHẨM KHÁC CỦA M.O.B
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
