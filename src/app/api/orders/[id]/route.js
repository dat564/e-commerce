import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import authMiddleware from "@/middleware/auth";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    await connectDB();

    // Middleware sẽ xử lý authentication
    const user = await authMiddleware(request);
    if (user instanceof NextResponse) return user;

    const order = await Order.findById(id)
      .populate("items.product", "name images price")
      .lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền truy cập (chỉ user sở hữu hoặc admin)
    if (
      order.user.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { orderStatus, paymentStatus, trackingNumber, cancelReason } =
      await request.json();

    await connectDB();

    // Middleware sẽ xử lý authentication
    const user = await authMiddleware(request);
    if (user instanceof NextResponse) return user;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền truy cập
    if (
      order.user.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập" },
        { status: 403 }
      );
    }

    // Cập nhật trạng thái đơn hàng
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (cancelReason) updateData.cancelReason = cancelReason;

    // Xử lý hủy đơn hàng
    if (orderStatus === "cancelled") {
      updateData.cancelledAt = new Date();

      // Hoàn trả hàng vào kho
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    // Xử lý giao hàng thành công
    if (orderStatus === "delivered") {
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("items.product", "name images price");

    return NextResponse.json({
      success: true,
      message: "Cập nhật đơn hàng thành công",
      data: { order: updatedOrder },
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
