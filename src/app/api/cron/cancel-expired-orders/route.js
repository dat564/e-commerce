import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  ORDER_EXPIRY_TIME,
} from "@/constants/orderStatus";

// API to cancel expired orders (pending for more than 10 minutes)
export async function GET(request) {
  try {
    await connectDB();

    // Find orders that are pending and expired
    const expiryTime = new Date(Date.now() - ORDER_EXPIRY_TIME);

    const expiredOrders = await Order.updateMany(
      {
        status: ORDER_STATUS.PENDING,
        paymentStatus: PAYMENT_STATUS.PENDING,
        createdAt: { $lt: expiryTime },
      },
      {
        $set: {
          status: ORDER_STATUS.CANCELLED,
          paymentStatus: PAYMENT_STATUS.FAILED,
          cancelledAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Cancelled ${expiredOrders.modifiedCount} expired orders`,
      count: expiredOrders.modifiedCount,
    });
  } catch (error) {
    console.error("Error cancelling expired orders:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
