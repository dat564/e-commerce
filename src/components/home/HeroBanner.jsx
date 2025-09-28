"use client";

import { Carousel } from "antd";
import Image from "next/image";

const banners = [
  {
    id: 1,
    title: "THE BIG EVENT",
    subtitle: "Sản Phẩm Chọn Lọc",
    discount: "75%",
    buttonText: "MUA NGAY",
    backgroundImage: "/assets/images/home/carousel-1.jpg",
  },
  {
    id: 2,
    title: "SUMMER COLLECTION",
    subtitle: "Bộ Sưu Tập Mùa Hè",
    discount: "50%",
    buttonText: "MUA NGAY",
    backgroundImage: "/assets/images/home/carousel-2.jpg",
  },
];

export default function HeroBanner() {
  return (
    <section className="relative h-[60vh] sm:h-[70vh] min-h-[400px] sm:min-h-[500px] overflow-hidden">
      <Carousel
        autoplay
        autoplaySpeed={5000}
        infinite
        arrows
        dots={{
          className: "custom-dots",
          style: {
            bottom: "16px",
            zIndex: 20,
          },
        }}
        dotPosition="bottom"
      >
        {banners.map((banner) => (
          <div key={banner.id}>
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={banner.backgroundImage}
                alt="Hero Banner"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-[60vh] sm:h-[70vh] min-h-[400px] sm:min-h-[500px] flex items-center">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 items-center">
                  {/* Left Content */}
                  <div className="text-white text-center lg:text-left">
                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-4 leading-tight">
                      {banner.title}
                    </h1>
                  </div>

                  {/* Right Content */}
                  <div className="text-white text-center lg:text-right">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl mb-4">
                      {banner.subtitle}
                    </h2>
                    <div className="mb-6">
                      <span className="text-lg sm:text-2xl lg:text-3xl">
                        GIẢM ĐẾN
                      </span>
                      <div className="text-6xl sm:text-8xl lg:text-9xl font-bold">
                        {banner.discount}
                      </div>
                    </div>
                    <button className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-gray-800 transition-colors">
                      {banner.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <style jsx global>{`
        .custom-dots li button {
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
          background: rgba(255, 255, 255, 0.5) !important;
          border: none !important;
        }

        .custom-dots li.slick-active button {
          background: white !important;
        }

        .custom-dots li {
          margin: 0 4px !important;
        }

        /* Arrow styles */
        .slick-prev,
        .slick-next {
          z-index: 30 !important;
          width: 50px !important;
          height: 50px !important;
          background: rgba(0, 0, 0, 0.5) !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.3s ease !important;
        }

        .slick-prev:hover,
        .slick-next:hover {
          background: rgba(0, 0, 0, 0.8) !important;
          transform: scale(1.1) !important;
        }

        .slick-prev {
          left: 20px !important;
        }

        .slick-next {
          right: 20px !important;
        }

        .slick-prev:before,
        .slick-next:before {
          font-size: 20px !important;
          color: white !important;
          opacity: 1 !important;
        }

        .slick-prev:before {
          content: "‹" !important;
        }

        .slick-next:before {
          content: "›" !important;
        }

        @media (max-width: 640px) {
          .custom-dots li button {
            width: 8px !important;
            height: 8px !important;
          }

          .slick-prev,
          .slick-next {
            width: 40px !important;
            height: 40px !important;
          }

          .slick-prev {
            left: 10px !important;
          }

          .slick-next {
            right: 10px !important;
          }

          .slick-prev:before,
          .slick-next:before {
            font-size: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
