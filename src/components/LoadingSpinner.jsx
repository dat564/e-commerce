"use client";

export default function LoadingSpinner({ size = "md", text = "Đang tải..." }) {
  const sizeClasses = {
    sm: "w-8 h-8 border-4",
    md: "w-12 h-12 border-4",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-pink-200 border-t-pink-600 rounded-full animate-spin`}
      ></div>
      {text && <p className="mt-4 text-gray-600 text-lg">{text}</p>}
    </div>
  );
}
