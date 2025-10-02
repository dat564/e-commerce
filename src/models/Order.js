import mongoose from "mongoose";
import {
  ORDER_STATUS_VALUES,
  PAYMENT_STATUS_VALUES,
} from "@/constants/orderStatus";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    customer: {
      fullName: String,
      phone: String,
      email: String,
    },
    shippingAddress: {
      province: String,
      district: String,
      ward: String,
      address: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "bank_transfer", "credit_card", "vnpay", "qr_code"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS_VALUES,
      default: "pending",
    },
    status: {
      type: String,
      enum: ORDER_STATUS_VALUES,
      default: "pending",
    },
    vnpayTransactionId: String,
    paymentExpiry: Date,
    paidAt: Date,
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    trackingNumber: String,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
  },
  {
    timestamps: true,
  }
);

// Auto generate order number
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Indexes for search
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 }, { unique: true, sparse: true });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
