import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import authMiddleware from "@/middleware/auth";

export async function GET(request) {
  try {
    await connectDB();

    // Middleware sẽ xử lý authentication
    const user = await authMiddleware(request);
    if (user instanceof NextResponse) return user;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");

    // Xây dựng query
    let query = { user: user._id };
    if (status) {
      query.status = status;
    }

    // Tính toán skip
    const skip = (page - 1) * limit;

    // Lấy đơn hàng
    const orders = await Order.find(query)
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Đếm tổng số đơn hàng
    const total = await Order.countDocuments(query);

    // Tính toán pagination
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNext,
          hasPrev,
        },
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const orderData = await request.json();
    const { items, shippingAddress, paymentMethod, notes, customer } =
      orderData;

    await connectDB();

    // Middleware sẽ xử lý authentication
    const user = await authMiddleware(request);
    if (user instanceof NextResponse) return user;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Giỏ hàng không được để trống" },
        { status: 400 }
      );
    }

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: "Thông tin giao hàng và thanh toán là bắt buộc",
        },
        { status: 400 }
      );
    }

    // Kiểm tra sản phẩm và tính toán giá
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return NextResponse.json(
          {
            success: false,
            message: `Sản phẩm ${item.product} không tồn tại hoặc đã ngừng bán`,
          },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Sản phẩm ${product.name} không đủ hàng trong kho`,
          },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Tính phí ship - mặc định 30k
    const shippingFee = 30000;
    const total = subtotal + shippingFee;

    // Tạo đơn hàng
    const order = new Order({
      user: user._id,
      items: orderItems,
      customer,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      total,
      notes,
    });

    await order.save();

    // KHÔNG giảm số lượng ngay khi tạo đơn hàng
    // Số lượng chỉ giảm khi đơn hàng được confirmed hoặc paid
    // Logic này sẽ được xử lý trong API update order status

    // Populate để trả về thông tin đầy đủ
    const populatedOrder = await Order.findById(order._id)
      .populate("items.product", "name images price")
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Tạo đơn hàng thành công",
        data: { order: populatedOrder },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
