"use client";

import { useAuth } from "@/store";
import LoadingLink from "@/components/LoadingLink";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

export default function LoginPrompt() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
            <LockOutlined className="text-white text-xl" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Đăng nhập để mua sắm
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng và thực hiện thanh
            toán
          </p>
          <div className="flex space-x-3">
            <LoadingLink
              href="/login"
              className="inline-flex items-center px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors text-sm"
              loadingText="Đang chuyển đến trang đăng nhập..."
            >
              <UserOutlined className="mr-2" />
              Đăng nhập
            </LoadingLink>
            <LoadingLink
              href="/register"
              className="inline-flex items-center px-4 py-2 border border-pink-500 text-pink-500 font-medium rounded-lg hover:bg-pink-50 transition-colors text-sm"
              loadingText="Đang chuyển đến trang đăng ký..."
            >
              Đăng ký
            </LoadingLink>
          </div>
        </div>
      </div>
    </div>
  );
}
