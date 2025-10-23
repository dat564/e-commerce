"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import LoadingLink from "@/components/LoadingLink";
import { getErrorMessage } from "@/utils/errorHandler";
import { showError, showSuccess } from "@/utils/notification";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Token không hợp lệ");
        setIsValidatingToken(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setUserInfo(data.user);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setError("Lỗi xác thực token");
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
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
      console.error("Reset password error:", error);
      const errorMsg = getErrorMessage(error);
      setError(errorMsg);
      showError("Lỗi", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while validating token
  if (isValidatingToken) {
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
        <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <LoadingOutlined className="text-4xl text-pink-500 animate-spin mb-4" />
          <p className="text-gray-600">Đang xác thực token...</p>
        </div>
      </div>
    );
  }

  // Success state
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
            <div className="flex items-center justify-center mb-2">
              <CheckCircleOutlined className="text-4xl text-green-500 mr-2" />
              <h2 className="text-lg font-semibold text-green-600">
                Đặt lại mật khẩu thành công!
              </h2>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              <p className="font-medium">Mật khẩu đã được cập nhật</p>
              <p className="mt-2">
                Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ
              </p>
            </div>

            <LoadingLink
              href="/login"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
              loadingText="Đang chuyển đến trang đăng nhập..."
            >
              Đăng nhập ngay
            </LoadingLink>
          </div>
        </div>
      </div>
    );
  }

  // Error state (invalid token)
  if (error && !userInfo) {
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
            <h2 className="text-lg font-semibold text-red-600">
              Token không hợp lệ
            </h2>
          </div>

          <div className="text-center space-y-4">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              <p className="font-medium">{error}</p>
              <p className="mt-2">Link có thể đã hết hạn hoặc không tồn tại</p>
            </div>

            <div className="flex flex-col space-y-3">
              <LoadingLink
                href="/forgot-password"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
                loadingText="Đang chuyển đến trang quên mật khẩu..."
              >
                Yêu cầu link mới
              </LoadingLink>

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

  // Reset password form
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
      {/* Reset Password Form */}
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
            Đặt lại mật khẩu
          </h2>
          {userInfo && (
            <p className="text-sm text-gray-600 mt-2">
              Xin chào <strong>{userInfo.name}</strong>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockOutlined className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className="duration-200 block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Nhập mật khẩu mới"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
              >
                {showPassword ? (
                  <EyeInvisibleOutlined className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeOutlined className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockOutlined className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                className="duration-200 block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
              >
                {showConfirmPassword ? (
                  <EyeInvisibleOutlined className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeOutlined className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
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
                <span>ĐANG CẬP NHẬT...</span>
              </>
            ) : (
              <span>→ ĐẶT LẠI MẬT KHẨU</span>
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center">
            <LoadingLink
              href="/login"
              className="text-pink-600 hover:text-pink-700 transition-colors text-sm"
              loadingText="Đang chuyển đến trang đăng nhập..."
            >
              Quay lại đăng nhập
            </LoadingLink>
          </div>
        </form>
      </div>
    </div>
  );
}

