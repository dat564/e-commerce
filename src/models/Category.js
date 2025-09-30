import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      trim: true,
      unique: true,
      maxLength: [100, "Tên danh mục không được vượt quá 100 ký tự"],
    },
    description: {
      type: String,
      required: [true, "Mô tả danh mục là bắt buộc"],
      trim: true,
      maxLength: [500, "Mô tả không được vượt quá 500 ký tự"],
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    productCount: {
      type: Number,
      default: 0,
      min: [0, "Số lượng sản phẩm không được âm"],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo slug tự động từ name
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }
  next();
});

// Index cho tìm kiếm
categorySchema.index({ name: "text", description: "text" });
categorySchema.index({ status: 1, isFeatured: 1 });
categorySchema.index({ sortOrder: 1 });

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
