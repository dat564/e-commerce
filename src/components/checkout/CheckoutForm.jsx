"use client";

import { useState, useEffect } from "react";
import PaymentMethod from "./PaymentMethod";

export default function CheckoutForm({ onSubmit, onBack, isSubmitting, user }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    email: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("qr_code");
  const [errors, setErrors] = useState({});

  // Address data from API
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.province) {
        setDistricts([]);
        setWards([]);
        return;
      }

      try {
        setLoadingDistricts(true);
        const response = await fetch(
          `https://provinces.open-api.vn/api/p/${formData.province}?depth=2`
        );
        const data = await response.json();
        setDistricts(data.districts || []);
        setWards([]);
        // Reset district and ward when province changes
        setFormData((prev) => ({
          ...prev,
          district: "",
          ward: "",
        }));
      } catch (error) {
        console.error("Error fetching districts:", error);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [formData.province]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!formData.district) {
        setWards([]);
        return;
      }

      try {
        setLoadingWards(true);
        const response = await fetch(
          `https://provinces.open-api.vn/api/d/${formData.district}?depth=2`
        );
        const data = await response.json();
        setWards(data.wards || []);
        // Reset ward when district changes
        setFormData((prev) => ({
          ...prev,
          ward: "",
        }));
      } catch (error) {
        console.error("Error fetching wards:", error);
        setWards([]);
      } finally {
        setLoadingWards(false);
      }
    };

    fetchWards();
  }, [formData.district]);

  // Fill user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

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
      // Get names instead of codes
      const selectedProvince = provinces.find(
        (p) => p.code === parseInt(formData.province)
      );
      const selectedDistrict = districts.find(
        (d) => d.code === parseInt(formData.district)
      );
      const selectedWard = wards.find(
        (w) => w.code === parseInt(formData.ward)
      );

      onSubmit({
        ...formData,
        province: selectedProvince?.name || formData.province,
        district: selectedDistrict?.name || formData.district,
        ward: selectedWard?.name || formData.ward,
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
              className={`duration-200 w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none ${
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
              className={`duration-200 w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none ${
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
                disabled={loadingProvinces}
                className={`duration-200 w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none appearance-none ${
                  errors.province ? "border-red-500" : "border-gray-300"
                } ${loadingProvinces ? "bg-gray-100" : ""}`}
              >
                <option value="">
                  {loadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành phố"}
                </option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
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
                disabled={!formData.province || loadingDistricts}
                className={`duration-200 w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none appearance-none ${
                  errors.district ? "border-red-500" : "border-gray-300"
                } ${
                  !formData.province || loadingDistricts ? "bg-gray-100" : ""
                }`}
              >
                <option value="">
                  {loadingDistricts ? "Đang tải..." : "Chọn quận/huyện"}
                </option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
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
                disabled={!formData.district || loadingWards}
                className={`duration-200 w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none appearance-none ${
                  errors.ward ? "border-red-500" : "border-gray-300"
                } ${!formData.district || loadingWards ? "bg-gray-100" : ""}`}
              >
                <option value="">
                  {loadingWards ? "Đang tải..." : "Chọn phường/xã"}
                </option>
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
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
              className={`duration-200 w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none ${
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
              className={`duration-200 w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none ${
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
              className="duration-200 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none"
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
