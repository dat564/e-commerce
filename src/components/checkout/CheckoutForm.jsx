"use client";

import { useState } from "react";
import PaymentMethod from "./PaymentMethod";

export default function CheckoutForm({ onSubmit, onBack, isSubmitting, user }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    email: user?.email || "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("qr_code");
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên là bắt buộc";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.province.trim()) {
      newErrors.province = "Tỉnh/Thành phố là bắt buộc";
    }

    if (!formData.district.trim()) {
      newErrors.district = "Quận/Huyện là bắt buộc";
    }

    if (!formData.ward.trim()) {
      newErrors.ward = "Phường/Xã là bắt buộc";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ cụ thể là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        paymentMethod,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Thông tin giao hàng
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập họ và tên"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none appearance-none ${
                  errors.province ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Chọn tỉnh/thành phố</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
                <option value="haiphong">Hải Phòng</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.province && (
              <p className="mt-1 text-sm text-red-500">{errors.province}</p>
            )}
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none appearance-none ${
                  errors.district ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Chọn quận/huyện</option>
                <option value="cau-giay">Cầu Giấy</option>
                <option value="dong-da">Đống Đa</option>
                <option value="hai-ba-trung">Hai Bà Trưng</option>
                <option value="hoan-kiem">Hoàn Kiếm</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.district && (
              <p className="mt-1 text-sm text-red-500">{errors.district}</p>
            )}
          </div>

          {/* Ward */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none appearance-none ${
                  errors.ward ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Chọn phường/xã</option>
                <option value="dich-vong">Dịch Vọng</option>
                <option value="dich-vong-hau">Dịch Vọng Hậu</option>
                <option value="mai-dich">Mai Dịch</option>
                <option value="nghia-tan">Nghĩa Tân</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.ward && (
              <p className="mt-1 text-sm text-red-500">{errors.ward}</p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ cụ thể <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Số nhà, tên đường..."
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              placeholder="Ghi chú cho đơn hàng"
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <PaymentMethod
        selectedMethod={paymentMethod}
        onMethodChange={setPaymentMethod}
      />

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Quay lại giỏ hàng
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
        </button>
      </div>
    </form>
  );
}
