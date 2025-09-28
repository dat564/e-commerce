"use client";

import Image from "next/image";

const categories = [
  {
    id: 1,
    name: "Nến Thơm",
    nameEn: "Scented Candles",
    image: "/assets/images/home/ours-1.jpg",
    description: "Nến thơm cao cấp với nhiều mùi hương đa dạng",
  },
  {
    id: 2,
    name: "Nước hoa cơ thể",
    nameEn: "Body Mist/Perfume",
    image: "/assets/images/home/ours-2.jpg",
    description: "Nước hoa cơ thể với mùi hương tươi mới",
  },
  {
    id: 3,
    name: "Combo quà tặng",
    nameEn: "Gift Combo",
    image: "/assets/images/home/ours-3.jpg",
    description: "Bộ sản phẩm quà tặng đặc biệt",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-300 mb-4">
            Categories
          </h2>
          <h3 className="text-xl sm:text-2xl text-pink-600 mb-4">
            Danh mục sản phẩm
          </h3>
          <p className="text-gray-600 text-base sm:text-lg">
            Các dòng sản phẩm chính tại THƠM THƠM
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
            >
              {/* Category Image */}
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Category Info */}
              <div className="p-6 text-center">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {category.name}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <button className="text-pink-600 hover:text-pink-700 font-medium transition-colors">
                  Xem sản phẩm →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
