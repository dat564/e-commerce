"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/store";
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";
import { showSuccess, showError, showWarning } from "@/utils/notification";
import { apiClient, ordersAPI } from "@/api";

export default function CheckoutContent() {
  const { getSelectedItems, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  const selectedItems = getSelectedItems();
  const productId = searchParams.get("product");
  const quantity = parseInt(searchParams.get("quantity")) || 1;

  // Fetch product data for buy now
  useEffect(() => {
    if (productId && !buyNowItem) {
      setIsLoadingProduct(true);
      const fetchProduct = async () => {
        try {
          const response = await apiClient.get(`/api/products/${productId}`);

          // API có thể trả về { success: true, data: product } hoặc trực tiếp product
          const product = response.data.success
            ? response.data.data
            : response.data;

          if (product) {
            setBuyNowItem({
              id: product._id || product.id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || product.image,
              quantity: quantity,
              selected: true,
            });
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          showError("Lỗi", "Không thể tải thông tin sản phẩm");
        } finally {
          setIsLoadingProduct(false);
        }
      };
      fetchProduct();
    }
  }, [productId, quantity, buyNowItem, router]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      showError("Vui lòng đăng nhập", "Bạn cần đăng nhập để thanh toán");
      router.push("/login");
      return;
    }
  }, [user, router]);

  const handlePlaceOrder = async (formData) => {
    setIsSubmitting(true);

    try {
      // Determine items to order (either from cart or buy now)
      const itemsToOrder = buyNowItem ? [buyNowItem] : selectedItems;

      // Calculate totals
      const subtotal = itemsToOrder.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);
      const shipping = subtotal > 0 ? 30000 : 0;
      const total = subtotal + shipping;

      // Prepare order data for API
      const orderData = {
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },
        shippingAddress: {
          province: formData.province,
          district: formData.district,
          ward: formData.ward,
          address: formData.address,
        },
        items: itemsToOrder.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shippingFee: shipping,
        total,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || "",
      };

      // Add userId to order data
      orderData.userId = user?._id || user?.id;

      // Check payment method
      if (formData.paymentMethod === "cod") {
        // COD - Create order directly without VNPay
        orderData.paymentMethod = "cod";
        orderData.paymentStatus = "pending";
        orderData.status = "pending";

        const response = await ordersAPI.create(orderData);

        // Clear cart only if not buy now
        if (!buyNowItem) {
          clearCart();
        }

        // Clear checkout session flag
        sessionStorage.removeItem("checkout_visited");

        showSuccess(
          "Đặt hàng thành công!",
          "Đơn hàng của bạn đã được tạo. Vui lòng thanh toán khi nhận hàng."
        );

        router.push("/orders");
      } else {
        // VNPay/QR Code - Create order and redirect to payment
        const response = await apiClient.post("/api/create-qr-payment", {
          orderData,
        });

        if (response.data.success) {
          // Clear cart only if not buy now (do this before redirecting)
          if (!buyNowItem) {
            clearCart();
          }

          // Clear checkout session flag
          sessionStorage.removeItem("checkout_visited");

          // Open VNPay payment page in new tab
          window.open(response.data.data.paymentUrl, "_blank");

          // Redirect current tab to orders page
          router.push("/orders");
        } else {
          throw new Error(response.data.message || "Không thể tạo thanh toán");
        }
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      showError(
        "Lỗi thanh toán",
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại!"
      );
      setIsSubmitting(false);
    }
  };

  const handleBackToCart = () => {
    if (buyNowItem) {
      router.push(`/products/${productId}`);
    } else {
      router.push("/cart");
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {isLoadingProduct ? (
          // Loading state
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" text="Đang tải thông tin sản phẩm..." />
          </div>
        ) : !user || (selectedItems.length === 0 && !buyNowItem) ? (
          // Empty state
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Không có sản phẩm để thanh toán
            </h2>
            <p className="text-gray-600 mb-8">
              Vui lòng chọn sản phẩm trong giỏ hàng trước khi thanh toán
            </p>
            <button
              onClick={() => router.push("/cart")}
              className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
            >
              Quay lại giỏ hàng
            </button>
          </div>
        ) : (
          // Main content
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Thanh toán đơn hàng
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <CheckoutForm
                  onSubmit={handlePlaceOrder}
                  onBack={handleBackToCart}
                  isSubmitting={isSubmitting}
                  user={user}
                />
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <CheckoutSummary
                  items={buyNowItem ? [buyNowItem] : selectedItems}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
