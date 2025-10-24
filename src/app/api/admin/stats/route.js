import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Category from "@/models/Category";
import authMiddleware from "@/middleware/auth";

export async function GET(request) {
  try {
    await connectDB();

    // Middleware sẽ xử lý authentication
    const user = await authMiddleware(request);
    if (user instanceof NextResponse) return user;

    // Kiểm tra quyền admin
    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập" },
        { status: 403 }
      );
    }

    // Lấy thống kê tổng quan
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      recentOrders,
      bestSellingProducts,
      monthlyStats,
    ] = await Promise.all([
      // Tổng số người dùng
      User.countDocuments(),

      // Tổng số sản phẩm
      Product.countDocuments(),

      // Tổng số đơn hàng
      Order.countDocuments(),

      // Tổng số thể loại
      Category.countDocuments(),

      // Đơn hàng gần đây (5 đơn hàng mới nhất)
      Order.find()
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("orderNumber user total status createdAt")
        .lean(),

      // Sản phẩm bán chạy (top 5) - chỉ tính đơn hàng đã thanh toán thành công và chưa hủy
      Order.aggregate([
        { $match: { paymentStatus: "paid", status: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            totalSold: { $sum: "$items.quantity" },
            totalRevenue: {
              $sum: { $multiply: ["$items.price", "$items.quantity"] },
            },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $project: {
            name: "$product.name",
            totalSold: 1,
            totalRevenue: 1,
          },
        },
      ]),

      // Thống kê tháng trước để tính phần trăm thay đổi
      getMonthlyStats(),
    ]);

    // Tính phần trăm thay đổi
    const userChange = calculatePercentageChange(
      monthlyStats.users.lastMonth,
      totalUsers
    );
    const productChange = calculatePercentageChange(
      monthlyStats.products.lastMonth,
      totalProducts
    );
    const orderChange = calculatePercentageChange(
      monthlyStats.orders.lastMonth,
      totalOrders
    );
    const categoryChange = totalCategories - monthlyStats.categories.lastMonth;

    // Debug logging
    console.log(
      "Recent orders data:",
      recentOrders.map((order) => ({
        orderNumber: order.orderNumber,
        total: order.total,
        user: order.user,
      }))
    );

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalCategories,
          userChange,
          productChange,
          orderChange,
          categoryChange,
        },
        recentOrders: recentOrders.map((order) => ({
          id: order.orderNumber,
          customer: order.user?.name || "Khách hàng",
          amount: formatCurrency(order.total || 0),
          status: getStatusText(order.status),
          statusColor: getStatusColor(order.status),
        })),
        bestSellingProducts: bestSellingProducts.map((product) => ({
          name: product.name,
          sales: product.totalSold || 0,
          revenue: formatCurrency(product.totalRevenue || 0),
        })),
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}

// Hàm lấy thống kê tháng trước
async function getMonthlyStats() {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    usersLastMonth,
    productsLastMonth,
    ordersLastMonth,
    categoriesLastMonth,
  ] = await Promise.all([
    User.countDocuments({ createdAt: { $lt: thisMonth } }),
    Product.countDocuments({ createdAt: { $lt: thisMonth } }),
    Order.countDocuments({ createdAt: { $lt: thisMonth } }),
    Category.countDocuments({ createdAt: { $lt: thisMonth } }),
  ]);

  return {
    users: { lastMonth: usersLastMonth },
    products: { lastMonth: productsLastMonth },
    orders: { lastMonth: ordersLastMonth },
    categories: { lastMonth: categoriesLastMonth },
  };
}

// Hàm tính phần trăm thay đổi
function calculatePercentageChange(oldValue, newValue) {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return Math.round(((newValue - oldValue) / oldValue) * 100);
}

// Hàm format tiền tệ
function formatCurrency(amount) {
  // Kiểm tra và xử lý các trường hợp đặc biệt
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0 ₫";
  }

  // Đảm bảo amount là số
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    return "0 ₫";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numericAmount);
}

// Hàm lấy text trạng thái
function getStatusText(status) {
  const statusMap = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    shipped: "Đã giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
  };
  return statusMap[status] || status;
}

// Hàm lấy màu trạng thái
function getStatusColor(status) {
  const colorMap = {
    pending: "text-yellow-600",
    processing: "text-blue-600",
    shipped: "text-blue-600",
    delivered: "text-green-600",
    cancelled: "text-red-600",
  };
  return colorMap[status] || "text-gray-600";
}
