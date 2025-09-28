"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  MailOutlined,
  LockOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import LoadingLink from "@/components/LoadingLink";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/utils/api";
import { getErrorMessage } from "@/utils/errorHandler";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const router = useRouter();

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

    try {
      const data = await authAPI.login(formData.email, formData.password);

      if (data.success) {
        // Lưu token vào localStorage
        localStorage.setItem("token", data.data.token);

        // Login user với thông tin từ API
        login(data.data.user);

        // Redirect based on user role
        if (data.data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url(/assets/images/login/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background overlay - removed để hiển thị background image rõ ràng hơn */}

      {/* Login Form */}
      <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 rounded-full mb-4">
            <span className="text-white text-2xl font-bold">🌸</span>
          </div>
          <h1 className="text-2xl font-bold text-pink-600 mb-2">M.O.B</h1>
          <h2 className="text-lg font-semibold text-pink-600">
            Đăng nhập tài khoản
          </h2>
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
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Nhập email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mật khẩu
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
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Nhập mật khẩu"
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <LoadingOutlined className="animate-spin" />
                <span>ĐANG ĐĂNG NHẬP...</span>
              </>
            ) : (
              <span>→ ĐĂNG NHẬP</span>
            )}
          </button>

          {/* Action Links */}
          <div className="flex items-center justify-between text-sm">
            <a
              href="#"
              className="text-pink-600 hover:text-pink-700 transition-colors"
            >
              Quên mật khẩu?
            </a>
            <span className="text-gray-300">|</span>
            <LoadingLink
              href="/register"
              className="text-pink-600 hover:text-pink-700 transition-colors"
              loadingText="Đang chuyển đến trang đăng ký..."
            >
              Đăng ký tài khoản mới
            </LoadingLink>
          </div>
        </form>
      </div>
    </div>
  );
}
