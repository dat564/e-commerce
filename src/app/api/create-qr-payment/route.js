import { VNPay, ignoreLogger } from "vnpay";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  ORDER_EXPIRY_TIME,
} from "@/constants/orderStatus";

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderData, existingOrderId } = body;

    if (!orderData) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin đơn hàng" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    let order;
    let orderNumber;

    if (existingOrderId) {
      // Update existing order for new payment attempt
      order = await Order.findById(existingOrderId);
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Không tìm thấy đơn hàng" },
          { status: 404 }
        );
      }

      // Update payment status and expiry
      order.paymentStatus = PAYMENT_STATUS.PENDING;
      order.paymentExpiry = new Date(Date.now() + ORDER_EXPIRY_TIME);
      await order.save();

      orderNumber = order.orderNumber;
    } else {
      // Create new order
      orderNumber = `ORD${Date.now()}`;
      order = await Order.create({
        user: orderData.userId,
        orderNumber,
        items: orderData.items,
        customer: orderData.customer,
        shippingAddress: orderData.shippingAddress,
        subtotal: orderData.subtotal,
        shippingFee: orderData.shippingFee,
        total: orderData.total,
        notes: orderData.notes,
        status: ORDER_STATUS.PENDING,
        paymentStatus: PAYMENT_STATUS.PENDING,
        paymentMethod: orderData.paymentMethod || "vnpay",
        paymentExpiry: new Date(Date.now() + ORDER_EXPIRY_TIME),
      });
    }

    // Initialize VNPay
    const vnpay = new VNPay({
      tmnCode: process.env.VNPAY_TMN_CODE || "VEJ6JRY7",
      secureSecret:
        process.env.VNPAY_SECRET_KEY || "RME03ZI55WD82BT17PCFUVJK0RW0I1R9",
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";

    // Build payment URL
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: orderData.total,
      vnp_IpAddr: ip,
      vnp_OrderInfo: `Thanh toan don hang ${orderNumber}`,
      vnp_OrderType: "other",
      vnp_TxnRef: orderNumber,
      vnp_ReturnUrl: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/vnpay-callback`,
      vnp_Locale: "vn",
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentUrl,
        orderId: order._id.toString(),
        orderNumber,
      },
    });
  } catch (error) {
    console.error("Error creating VNPay payment:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tạo thanh toán" },
      { status: 500 }
    );
  }
}
