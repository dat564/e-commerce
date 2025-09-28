"use client";

import { MessageOutlined, FacebookOutlined } from "@ant-design/icons";

export default function FloatingElements() {
  return (
    <>
      {/* Floating Chat and Fanpage Buttons */}
      <div className="fixed right-2 sm:right-4 bottom-4 z-50 flex flex-col space-y-2 sm:space-y-3">
        {/* Chat Button */}
        {/* <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl flex items-center space-x-1 sm:space-x-2 group text-sm sm:text-base">
          <MessageOutlined className="text-lg" />
          <span className="font-medium">Chat</span>
        </button> */}

        {/* Fanpage Button */}
        {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl flex items-center space-x-1 sm:space-x-2 group text-sm sm:text-base">
          <FacebookOutlined className="text-lg" />
          <span className="font-medium">Fanpage</span>
        </button> */}
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => {
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        className="fixed right-2 sm:right-4 bottom-12 sm:bottom-12 bg-pink-500 hover:bg-pink-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center z-40"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </>
  );
}
