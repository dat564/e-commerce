"use client";

import { useLoading } from "@/contexts/LoadingContext";
import LoadingSpinner from "./LoadingSpinner";

export default function GlobalLoadingSpinner() {
  const { isLoading, loadingText } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
        <LoadingSpinner size="lg" text={loadingText} />
      </div>
    </div>
  );
}
