import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
      maxLength: [100, "Tên sản phẩm không được vượt quá 100 ký tự"],
    },
    description: {
      type: String,
      required: [true, "Mô tả sản phẩm là bắt buộc"],
      trim: true,
      maxLength: [1000, "Mô tả không được vượt quá 1000 ký tự"],
    },
    price: {
      type: Number,
      required: [true, "Giá sản phẩm là bắt buộc"],
      min: [0, "Giá sản phẩm không được âm"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Giá gốc không được âm"],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: [true, "Danh mục sản phẩm là bắt buộc"],
      enum: [
        "skincare",
        "makeup",
        "haircare",
        "bodycare",
        "fragrance",
        "tools",
      ],
    },
    brand: {
      type: String,
      required: [true, "Thương hiệu là bắt buộc"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Số lượng tồn kho là bắt buộc"],
      min: [0, "Số lượng tồn kho không được âm"],
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    specifications: {
      weight: String,
      dimensions: String,
      ingredients: [String],
      origin: String,
      expiryDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo SKU tự động nếu không có
productSchema.pre("save", function (next) {
  if (!this.sku) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.sku = `SKU-${timestamp}-${random}`;
  }
  next();
});

// Index cho tìm kiếm
productSchema.index({ name: "text", description: "text", brand: "text" });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
