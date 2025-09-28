"use client";

import { useLoading } from "@/contexts/LoadingContext";
import { useState, useEffect } from "react";

export default function LoadingSpinner() {
  const { isLoading, loadingText } = useLoading();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShow(true);
    } else {
      // Fade out animation
      const timer = setTimeout(() => {
        setShow(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] transition-opacity duration-300 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-transform duration-300 scale-100">
        {/* Spinner */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl animate-pulse">🌸</span>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {loadingText}
          </h3>
          <p className="text-sm text-gray-600">
            Vui lòng chờ trong giây lát...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
