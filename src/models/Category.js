import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      unique: true,
      trim: true,
      maxLength: [50, "Tên danh mục không được vượt quá 50 ký tự"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [200, "Mô tả không được vượt quá 200 ký tự"],
    },
    image: {
      type: String,
      default: "",
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxLength: [60, "SEO title không được vượt quá 60 ký tự"],
    },
    seoDescription: {
      type: String,
      trim: true,
      maxLength: [160, "SEO description không được vượt quá 160 ký tự"],
    },
  },
  {
    timestamps: true,
  }
);

// Tạo slug từ name
categorySchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }
  next();
});

// Index cho tìm kiếm
categorySchema.index({ name: "text", description: "text" });
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1, isActive: 1 });
categorySchema.index({ sortOrder: 1 });

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
