"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/store";
import { authAPI } from "@/api";
import { getErrorMessage } from "@/utils/errorHandler";
import { showSuccess, showError } from "@/utils/notification";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CrownOutlined,
  CalendarOutlined,
  EditOutlined,
  LockOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export default function ProfileContent() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await authAPI.updateProfile(formData);

      if (data.success) {
        // Update user context
        login(data.data.user);
        showSuccess(
          "Cập nhật thành công!",
          "Thông tin cá nhân đã được cập nhật"
        );
        setSuccess("Cập nhật thông tin thành công!");
        setIsEditing(false);
      } else {
        const errorMsg = data.message || "Cập nhật thất bại";
        setError(errorMsg);
        showError("Cập nhật thất bại", errorMsg);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      const errorMsg = getErrorMessage(error);
      setError(errorMsg);
      showError("Lỗi cập nhật", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      const errorMsg = "Mật khẩu mới và xác nhận mật khẩu không khớp";
      setError(errorMsg);
      showError("Lỗi xác thực", errorMsg);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      const errorMsg = "Mật khẩu mới phải có ít nhất 6 ký tự";
      setError(errorMsg);
      showError("Lỗi xác thực", errorMsg);
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await authAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (data.success) {
        showSuccess("Đổi mật khẩu thành công!", "Mật khẩu đã được thay đổi");
        setSuccess("Đổi mật khẩu thành công!");
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorMsg = data.message || "Đổi mật khẩu thất bại";
        setError(errorMsg);
        showError("Đổi mật khẩu thất bại", errorMsg);
      }
    } catch (error) {
      console.error("Change password error:", error);
      const errorMsg = getErrorMessage(error);
      setError(errorMsg);
      showError("Lỗi đổi mật khẩu", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Vui lòng đăng nhập để xem thông tin tài khoản
          </h2>
          <a
            href="/login"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thông tin tài khoản
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin cá nhân và bảo mật tài khoản
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Current Account Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Thông tin hiện tại
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <MailOutlined className="text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                {/* Name */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserOutlined className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="font-medium text-gray-900">
                      {user.name || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <PhoneOutlined className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium text-gray-900">
                      {user.phone || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <CrownOutlined className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vai trò</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                    </p>
                  </div>
                </div>

                {/* Join Date */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <CalendarOutlined className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày tham gia</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  setIsChangingPassword(false);
                  setError("");
                  setSuccess("");
                }}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
              >
                <EditOutlined />
                <span>Cập nhật thông tin</span>
              </button>

              <button
                onClick={() => {
                  setIsChangingPassword(!isChangingPassword);
                  setIsEditing(false);
                  setError("");
                  setSuccess("");
                }}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <LockOutlined />
                <span>Đổi mật khẩu</span>
              </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center space-x-2">
                <CloseOutlined />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center space-x-2">
                <CheckOutlined />
                <span>{success}</span>
              </div>
            )}

            {/* Update Information Form */}
            {isEditing && (
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Cập nhật thông tin
                </h3>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Đang cập nhật...</span>
                        </>
                      ) : (
                        <>
                          <CheckOutlined />
                          <span>Cập nhật thông tin</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name || "",
                          phone: user.phone || "",
                        });
                        setError("");
                      }}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Change Password Form */}
            {isChangingPassword && (
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Đổi mật khẩu
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Nhập mật khẩu mới"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Nhập lại mật khẩu mới"
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Đang đổi mật khẩu...</span>
                        </>
                      ) : (
                        <>
                          <CheckOutlined />
                          <span>Đổi mật khẩu</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setError("");
                      }}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
