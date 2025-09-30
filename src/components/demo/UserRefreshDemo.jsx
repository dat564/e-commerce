"use client";

import { useAuth, useGetUser } from "@/store";
import { useState } from "react";

export default function UserRefreshDemo() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { getUser } = useGetUser();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const handleRefreshUser = async () => {
    setIsRefreshing(true);
    try {
      const success = await getUser();
      if (success) {
        setLastRefresh(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        User Refresh Demo
      </h2>

      {/* Current User Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">
          Current User Info
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Is Authenticated:</span>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs ${
                isAuthenticated
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isAuthenticated ? "Yes" : "No"}
            </span>
          </p>
          <p>
            <span className="font-medium">Is Loading:</span>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs ${
                isLoading
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {isLoading ? "Yes" : "No"}
            </span>
          </p>
          <p>
            <span className="font-medium">User Email:</span>
            <span className="ml-2 text-gray-600">
              {user?.email || "Not logged in"}
            </span>
          </p>
          <p>
            <span className="font-medium">User Role:</span>
            <span className="ml-2 text-gray-600">{user?.role || "N/A"}</span>
          </p>
          {lastRefresh && (
            <p>
              <span className="font-medium">Last Refresh:</span>
              <span className="ml-2 text-gray-600">{lastRefresh}</span>
            </p>
          )}
        </div>
      </div>

      {/* User Data */}
      {user && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            User Data
          </h3>
          <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={handleRefreshUser}
          disabled={isRefreshing || !isAuthenticated}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isRefreshing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <span>🔄</span>
              <span>Refresh User Data</span>
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Hướng dẫn sử dụng
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            • <strong>Refresh User Data:</strong> Gọi API để lấy thông tin user
            mới nhất từ server
          </p>
          <p>
            • <strong>Auto Refresh:</strong> Mỗi khi load lại trang, hệ thống sẽ
            tự động gọi API để cập nhật user data
          </p>
          <p>
            • <strong>Fallback:</strong> Nếu API call thất bại, hệ thống sẽ sử
            dụng data từ localStorage
          </p>
          <p>
            • <strong>Error Handling:</strong> Xử lý các lỗi token expired,
            network error, etc.
          </p>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">
          API Endpoints
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">
              GET /api/auth/get-user
            </h4>
            <p className="text-gray-600">
              Lấy thông tin user dựa trên access token
            </p>
            <pre className="bg-white p-2 rounded border text-xs mt-1">
              {`Headers: {
  "Authorization": "Bearer <access_token>"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
