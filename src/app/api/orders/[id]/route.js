import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
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
    const { status, paymentStatus, trackingNumber, cancelReason } =
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
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (cancelReason) updateData.cancelReason = cancelReason;

    // Xử lý hủy đơn hàng
    if (status === "cancelled") {
      updateData.cancelledAt = new Date();

      // Hoàn trả hàng vào kho (chỉ nếu đã giảm số lượng trước đó)
      if (
        order.status === "confirmed" ||
        order.status === "processing" ||
        order.status === "shipped"
      ) {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
      }
    }

    // Xử lý xác nhận đơn hàng - GIẢM SỐ LƯỢNG TỒN KHO
    if (status === "confirmed" && order.status === "pending") {
      // Giảm số lượng tồn kho khi xác nhận đơn hàng
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    // Xử lý thanh toán thành công - GIẢM SỐ LƯỢNG TỒN KHO (nếu chưa giảm)
    if (paymentStatus === "paid" && order.paymentStatus !== "paid") {
      // Chỉ giảm số lượng nếu đơn hàng chưa được confirmed
      if (order.status === "pending") {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }
      }
      updateData.paidAt = new Date();
    }

    // Xử lý giao hàng thành công
    if (status === "delivered") {
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
