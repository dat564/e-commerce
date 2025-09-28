"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";
import Footer from "@/components/Footer";

export default function CheckoutContent() {
  const { getSelectedItems, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItems = getSelectedItems();

  // Redirect if no items selected or not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (selectedItems.length === 0) {
      router.push("/cart");
      return;
    }
  }, [user, selectedItems, router]);

  const handlePlaceOrder = async (formData) => {
    setIsSubmitting(true);

    try {
      // Mock order placement - in real app, this would call API
      const orderData = {
        id: `ORD${Date.now()}`,
        customer: formData,
        items: selectedItems,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      console.log("Order placed:", orderData);

      // Clear selected items from cart
      selectedItems.forEach((item) => {
        // In real app, you'd remove only selected items
        // For now, we'll clear the entire cart
      });
      clearCart();

      // Redirect to success page or orders page
      router.push("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCart = () => {
    router.push("/cart");
  };

  if (!user || selectedItems.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
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
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Title */}
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
            <CheckoutSummary items={selectedItems} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
