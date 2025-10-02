import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");

    // Xây dựng query
    let query = {};

    // Tìm kiếm theo order number
    if (search) {
      query.orderNumber = { $regex: search, $options: "i" };
    }

    // Lọc theo trạng thái đơn hàng
    if (status && status !== "all") {
      query.status = status;
    }

    // Lọc theo trạng thái thanh toán
    if (paymentStatus && paymentStatus !== "all") {
      query.paymentStatus = paymentStatus;
    }

    // Tính toán skip
    const skip = (page - 1) * limit;

    // Lấy đơn hàng
    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Đếm tổng số đơn hàng
    const total = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get admin orders error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
