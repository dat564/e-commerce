"use client";

import CategoryCard from "./CategoryCard";

const categories = [
  {
    id: 1,
    name: "Nến Thơm",
    slug: "nen-thom",
    productCount: 5,
    image: "/assets/images/categories/candles.jpg",
    description: "Nến thơm cao cấp với hương thơm tự nhiên",
  },
  {
    id: 2,
    name: "Nước hoa cơ thể",
    slug: "nuoc-hoa-co-the",
    productCount: 12,
    image: "/assets/images/categories/body-fragrance.jpg",
    description: "Nước hoa cơ thể với hương thơm quyến rũ",
  },
  {
    id: 3,
    name: "Combo quà tặng",
    slug: "combo-qua-tang",
    productCount: 8,
    image: "/assets/images/categories/gift-combo.jpg",
    description: "Bộ sưu tập quà tặng đặc biệt",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Danh mục sản phẩm của M.O.B
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <div className="w-8 h-1 bg-pink-500"></div>
            <div className="w-6 h-1 bg-amber-600"></div>
            <div className="w-8 h-1 bg-pink-500"></div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
