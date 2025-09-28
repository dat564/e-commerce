"use client";

import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Xịt Thơm Toàn Thân Gingham Gorgeous Body Mist Bath and Body Works",
    type: "NƯỚC HOA CƠ THỂ",
    price: "289,000 ₫",
    image: "/assets/images/home/ours-1.jpg",
    scentNotes: ["Dâu tây", "Hoa mẫu đơn", "Mật đào"],
    duration: "Lưu hương 4-5 tiếng",
    brand: "Màu Nắng COLLECTION",
  },
  {
    id: 2,
    name: "Nến Thơm Bath & Body Works Peppermint Bark 3-Wick Candle",
    type: "NẾN THƠM",
    price: "499,000 ₫",
    image: "/assets/images/home/ours-2.jpg",
    scentNotes: ["Socola đen tan chảy", "Socola trắng tan chảy"],
    duration: "Thời gian đốt 45 tiếng",
    brand: "Màu Nắng",
  },
  {
    id: 3,
    name: "Xịt Thơm Toàn Thân Gingham Fresh Body Mist Bath and Body Works",
    type: "NƯỚC HOA CƠ THỂ",
    price: "289,000 ₫",
    image: "/assets/images/home/ours-3.jpg",
    scentNotes: ["Lê ngọt", "Clementin lấp lánh", "Hoa cúc tươi"],
    duration: "Lưu hương 3-4 tiếng",
    brand: "Màu Nắng",
  },
  {
    id: 4,
    name: "Xịt Thơm Toàn Thân Warm Vanilla Sugar Body Mist Bath and Body Works",
    type: "NƯỚC HOA CƠ THỂ",
    price: "289,000 ₫",
    image: "/assets/images/home/ours-1.jpg",
    scentNotes: ["Vanilla", "Hoa lan trắng", "Đường"],
    duration: "Lưu hương 3-4 tiếng",
    brand: "Màu Nắng",
  },
  {
    id: 5,
    name: "A Thousand Wishes Body Mist",
    type: "NƯỚC HOA CƠ THỂ",
    price: "289,000 ₫",
    image: "/assets/images/home/ours-2.jpg",
    scentNotes: ["Rượu hoa hồng", "Hổ phách", "Hoa mẫu đơn"],
    duration: "Lưu hương 4-5 tiếng",
    brand: "Màu Nắng",
  },
  {
    id: 6,
    name: "White Gardenia 3-Wick Candle",
    type: "NẾN THƠM",
    price: "399,000 ₫",
    image: "/assets/images/home/ours-3.jpg",
    scentNotes: ["Dành dành", "Hoa huệ trắng"],
    duration: "Thời gian đốt 40 tiếng",
    brand: "Màu Nắng",
  },
  {
    id: 7,
    name: "Fall Apple Cider 3-Wick Candle",
    type: "NẾN THƠM",
    price: "399,000 ₫",
    image: "/assets/images/home/ours-1.jpg",
    scentNotes: ["Mưa phùn caramel", "Rượu táo gia vị"],
    duration: "Thời gian đốt 40 tiếng",
    brand: "Màu Nắng",
  },
];

export default function ProductsSection() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-300 mb-4">
            New arrival
          </h2>
          <h3 className="text-xl sm:text-2xl text-pink-600 mb-4">
            Sản phẩm nổi bật
          </h3>
          <p className="text-gray-600 text-base sm:text-lg">
            Các dòng sản phẩm nổi bật THƠM THƠM
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Brand Logo */}
              <div className="p-4 pb-2">
                <div className="text-xs font-semibold text-pink-600">
                  {product.brand}
                </div>
              </div>

              {/* Product Image */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="text-xs text-pink-600 font-medium mb-2">
                  {product.type}
                </div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3 line-clamp-2">
                  {product.name}
                </h4>

                {/* Scent Notes */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.scentNotes.map((note, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {/* Duration */}
                <div className="text-xs text-gray-500 mb-3">
                  {product.duration}
                </div>

                {/* Price */}
                <div className="text-lg font-bold text-pink-600">
                  {product.price}
                </div>

                {/* Add to Cart Button */}
                <button className="w-full mt-3 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8 sm:mt-12">
          <button className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors">
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>
    </section>
  );
}
