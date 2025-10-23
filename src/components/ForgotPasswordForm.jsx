"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MailOutlined,
  LoadingOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import LoadingLink from "@/components/LoadingLink";
import { getErrorMessage } from "@/utils/errorHandler";
import { showError, showSuccess } from "@/utils/notification";

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        showSuccess("Thành công!", data.message);
      } else {
        setError(data.message);
        showError("Lỗi", data.message);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMsg = getErrorMessage(error);
      setError(errorMsg);
      showError("Lỗi", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-[600px] flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: "url(/assets/images/login/background.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 overflow-hidden">
              <img
                src="/assets/images/home/logo.png"
                alt="M.O.B Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold text-green-600">
              Email đã được gửi!
            </h2>
          </div>

          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              <p className="font-medium">Kiểm tra hộp thư của bạn</p>
              <p className="mt-2">
                Chúng tôi đã gửi link đặt lại mật khẩu đến email{" "}
                <strong>{email}</strong>
              </p>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>• Kiểm tra cả thư mục Spam/Junk</p>
              <p>• Link sẽ hết hạn sau 15 phút</p>
              <p>• Nếu không nhận được email, vui lòng thử lại</p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Gửi lại email
              </button>

              <LoadingLink
                href="/login"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
                loadingText="Đang chuyển đến trang đăng nhập..."
              >
                Quay lại đăng nhập
              </LoadingLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[600px] flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url(/assets/images/login/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Forgot Password Form */}
      <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 overflow-hidden">
            <img
              src="/assets/images/home/logo.png"
              alt="M.O.B Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold text-pink-600">
            Quên mật khẩu?
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Nhập email để nhận link đặt lại mật khẩu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailOutlined className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                disabled={isLoading}
                className="duration-200 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Nhập email của bạn"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <LoadingOutlined className="animate-spin" />
                <span>ĐANG GỬI...</span>
              </>
            ) : (
              <span>→ GỬI LINK ĐẶT LẠI MẬT KHẨU</span>
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center">
            <LoadingLink
              href="/login"
              className="inline-flex items-center text-pink-600 hover:text-pink-700 transition-colors text-sm"
              loadingText="Đang chuyển đến trang đăng nhập..."
            >
              <ArrowLeftOutlined className="mr-1" />
              Quay lại đăng nhập
            </LoadingLink>
          </div>
        </form>
      </div>
    </div>
  );
}
