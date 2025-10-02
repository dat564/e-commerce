"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-12 sm:py-16 bg-white ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-gray-300 mb-4">
              M.O.B
            </h2>
            <h3 className="text-xl sm:text-2xl text-pink-600 mb-6 sm:mb-8">
              Về chúng tôi
            </h3>
            <div className="text-gray-700 leading-relaxed space-y-3 sm:space-y-4 text-sm sm:text-base">
              <p>M.O.B – Mỹ phẩm cho mọi người, đẹp theo cách của bạn</p>
              <p>
                M.O.B là trang web chuyên cung cấp các dòng mỹ phẩm chất lượng
                với mức giá trung bình – bình dân, phù hợp với túi tiền của
                nhiều đối tượng khách hàng. Tại đây, bạn có thể dễ dàng tìm thấy
                những sản phẩm chăm sóc da, trang điểm và làm đẹp đến từ các
                thương hiệu uy tín, vừa đảm bảo an toàn vừa mang lại hiệu quả.
                Với M.O.B, việc chăm sóc sắc đẹp trở nên đơn giản, tiết kiệm
                nhưng vẫn trọn vẹn và tinh tế.
              </p>
              <p>
                Cam kết mang đến sự hài lòng tối đa cho khách hàng thông qua
                dịch vụ chuyên nghiệp và chính sách đổi trả linh hoạt.
              </p>
            </div>
            <button className="mt-6 sm:mt-8 bg-pink-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-pink-700 transition-colors text-sm sm:text-base">
              Xem thêm
            </button>
          </div>

          {/* Right Content - Product Images */}
          <div className="flex justify-center lg:justify-end">
            <div className="flex gap-2 h-[400px]">
              {/* Gingham Blue */}
              <div className="group cursor-pointer h-full">
                <Image
                  src="/assets/images/home/ours-1.jpg"
                  alt="Gingham Body Mist"
                  width={170}
                  height={400}
                  className="object-cover w-full h-full transition-all duration-300 group-hover:-translate-y-2"
                  quality={100}
                />
              </div>

              {/* Gingham Gorgeous Pink */}
              <div className="group cursor-pointer h-full">
                <Image
                  src="/assets/images/home/ours-2.jpg"
                  alt="Gingham Gorgeous Body Mist"
                  width={170}
                  height={400}
                  className="object-cover w-full h-full transition-all duration-300 group-hover:-translate-y-2"
                  quality={90}
                />
              </div>

              {/* Gingham Love Red */}
              <div className="group cursor-pointer h-full">
                <Image
                  src="/assets/images/home/ours-3.jpg"
                  alt="Gingham Love Body Mist"
                  width={170}
                  height={400}
                  className="object-cover w-full h-full transition-all duration-300 group-hover:-translate-y-2"
                  quality={90}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
