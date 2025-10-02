// Order Status Constants
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Payment Status Constants
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

// Status Display Names (Vietnamese)
export const ORDER_STATUS_DISPLAY = {
  [ORDER_STATUS.PENDING]: "Chờ xử lý",
  [ORDER_STATUS.CONFIRMED]: "Đã xác nhận",
  [ORDER_STATUS.PROCESSING]: "Đang xử lý",
  [ORDER_STATUS.SHIPPED]: "Đang giao",
  [ORDER_STATUS.DELIVERED]: "Đã giao hàng",
  [ORDER_STATUS.CANCELLED]: "Đã hủy",
};

export const PAYMENT_STATUS_DISPLAY = {
  [PAYMENT_STATUS.PENDING]: "Chờ thanh toán",
  [PAYMENT_STATUS.PAID]: "Đã thanh toán",
  [PAYMENT_STATUS.FAILED]: "Thanh toán thất bại",
  [PAYMENT_STATUS.REFUNDED]: "Đã hoàn tiền",
};

// Get all order status values as array
export const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS);
export const PAYMENT_STATUS_VALUES = Object.values(PAYMENT_STATUS);

// Order expiry time (in milliseconds)
export const ORDER_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
