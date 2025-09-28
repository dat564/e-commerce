"use client";

import { useState } from "react";

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    {
      id: "description",
      label: "Mô tả sản phẩm",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Specifications */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">
              Thông số kỹ thuật
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Trọng lượng:</span>
                <span className="ml-2 font-medium">
                  {product.specifications.weight}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Thời gian đốt:</span>
                <span className="ml-2 font-medium">
                  {product.specifications.burnTime}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Số bấc:</span>
                <span className="ml-2 font-medium">
                  {product.specifications.wicks}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Hương thơm:</span>
                <span className="ml-2 font-medium">
                  {product.specifications.fragrance}
                </span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">
              Tính năng nổi bật
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.features.map((feature, index) => (
                <span
                  key={index}
                  className="bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "qa",
      label: "Hỏi đáp",
      content: (
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">❓</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Chưa có câu hỏi nào
            </h3>
            <p className="text-gray-500 text-sm">
              Hãy là người đầu tiên đặt câu hỏi về sản phẩm này!
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
}
