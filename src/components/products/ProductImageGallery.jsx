"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImageGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
        <Image
          src={product.images[selectedImage]}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />

        {/* Navigation Arrows */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedImage(
                  selectedImage === 0
                    ? product.images.length - 1
                    : selectedImage - 1
                )
              }
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setSelectedImage(
                  selectedImage === product.images.length - 1
                    ? 0
                    : selectedImage + 1
                )
              }
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Feature Labels */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4">
            <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
              {product.features[0]}
            </span>
          </div>
          <div className="absolute top-1/4 left-4">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              {product.features[1]}
            </span>
          </div>
          <div className="absolute bottom-1/4 left-4">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {product.features[2]}
            </span>
          </div>
          <div className="absolute bottom-1/3 right-4">
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              {product.features[3]}
            </span>
          </div>
          <div className="absolute bottom-4 right-4">
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
              {product.features[4]}
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnail Images */}
      {product.images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                selectedImage === index
                  ? "border-pink-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={image}
                alt={`${product.name} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
