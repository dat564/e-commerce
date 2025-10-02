import { VNPay, ignoreLogger } from "vnpay";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Initialize VNPay with same config
    const vnpay = new VNPay({
      tmnCode: process.env.VNPAY_TMN_CODE || "VEJ6JRY7",
      secureSecret:
        process.env.VNPAY_SECRET_KEY || "RME03ZI55WD82BT17PCFUVJK0RW0I1R9",
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });

    // Convert searchParams to object
    const vnpayParams = {};
    searchParams.forEach((value, key) => {
      vnpayParams[key] = value;
    });

    // Verify the callback
    const verify = vnpay.verifyReturnUrl(vnpayParams);

    if (!verify.isVerified) {
      // Payment verification failed
      return NextResponse.redirect(
        new URL(
          `/checkout/payment-result?status=error&message=${encodeURIComponent(
            "Xác thực thanh toán thất bại"
          )}`,
          request.url
        )
      );
    }

    if (!verify.isSuccess) {
      // Payment failed or cancelled
      const orderNumber = vnpayParams.vnp_TxnRef;

      // Update order status to cancelled
      await connectDB();
      await Order.findOneAndUpdate(
        { orderNumber },
        {
          status: "cancelled",
          paymentStatus: "failed",
          cancelledAt: new Date(),
        }
      );

      return NextResponse.redirect(
        new URL(
          `/checkout/payment-result?status=failed&message=${encodeURIComponent(
            "Thanh toán không thành công"
          )}`,
          request.url
        )
      );
    }

    // Payment successful, update order
    const orderNumber = vnpayParams.vnp_TxnRef;

    // Connect to database
    await connectDB();

    // Find the order first to check current status
    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return NextResponse.redirect(
        new URL(
          `/checkout/payment-result?status=error&message=${encodeURIComponent(
            "Không tìm thấy đơn hàng"
          )}`,
          request.url
        )
      );
    }

    // Update the order
    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber },
      {
        status: "pending",
        paymentStatus: "paid",
        vnpayTransactionId: vnpayParams.vnp_TransactionNo,
        paidAt: new Date(),
      },
      { new: true }
    );

    // GIẢM SỐ LƯỢNG TỒN KHO khi thanh toán thành công
    if (order.paymentStatus !== "paid") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    // Redirect to success page with order ID
    return NextResponse.redirect(
      new URL(
        `/checkout/payment-result?status=success&orderId=${updatedOrder._id}`,
        request.url
      )
    );
  } catch (error) {
    console.error("Error handling VNPay callback:", error);
    return NextResponse.redirect(
      new URL(
        `/checkout/payment-result?status=error&message=${encodeURIComponent(
          error.message || "Có lỗi xảy ra"
        )}`,
        request.url
      )
    );
  }
}
