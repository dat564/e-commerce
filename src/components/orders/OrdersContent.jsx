"use client";

import { useState } from "react";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import Footer from "@/components/Footer";

// Mock data - in real app, this would come from API/database
const mockOrders = [
  {
    id: "2029",
    date: "27/09/2025 15:37",
    status: "cancelled",
    statusText: "Đã hủy",
    total: 1527000,
    shipping: 30000,
    products: [
      {
        id: 1,
        name: "Nến Thơm Bath & Body Works White Tea & Sage 3-Wick Candle",
        image: "/assets/images/products/white-tea-sage.jpg",
        quantity: 3,
        price: 499000,
      },
    ],
  },
  {
    id: "2027",
    date: "27/09/2025 14:00",
    status: "cancelled",
    statusText: "Đã hủy",
    total: 529000,
    shipping: 30000,
    products: [
      {
        id: 1,
        name: "Nến Thơm Bath & Body Works White Tea & Sage 3-Wick Candle",
        image: "/assets/images/products/white-tea-sage.jpg",
        quantity: 1,
        price: 499000,
      },
    ],
  },
  {
    id: "2025",
    date: "26/09/2025 10:30",
    status: "delivered",
    statusText: "Đã giao hàng",
    total: 998000,
    shipping: 30000,
    products: [
      {
        id: 2,
        name: "Nến thơm thư giãn Bath & Body Works Aromatherapy",
        image: "/assets/images/products/stress-relief.jpg",
        quantity: 2,
        price: 499000,
      },
    ],
  },
  {
    id: "2023",
    date: "25/09/2025 16:45",
    status: "processing",
    statusText: "Đang xử lý",
    total: 1497000,
    shipping: 30000,
    products: [
      {
        id: 3,
        name: "Nến Thơm Bath & Body Works Peppermint Bark 3-Wick",
        image: "/assets/images/products/peppermint-bark.jpg",
        quantity: 3,
        price: 499000,
      },
    ],
  },
];

export default function OrdersContent() {
  const [orders, setOrders] = useState(mockOrders);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateFrom: "",
    dateTo: "",
    sortBy: "price_desc",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // In real app, this would trigger API call
    console.log("Filters changed:", newFilters);
  };

  const handleViewDetails = (orderId) => {
    // Navigate to order details page
    console.log("View details for order:", orderId);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Đơn hàng của tôi
        </h1>

        {/* Filters */}
        <OrderFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Orders Table */}
        <OrderTable orders={orders} onViewDetails={handleViewDetails} />
      </div>
      <Footer />
    </div>
  );
}
