import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const featured = searchParams.get("featured");

    await connectDB();

    // Xây dựng query
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    // Xây dựng sort
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Tính toán skip
    const skip = (page - 1) * limit;

    // Lấy sản phẩm
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("category", "name slug")
      .lean();

    // Đếm tổng số sản phẩm
    const total = await Product.countDocuments(query);

    // Tính toán pagination
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        products,
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
    console.error("Get products error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const productData = await request.json();

    await connectDB();

    const product = new Product(productData);
    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: "Tạo sản phẩm thành công",
        data: { product },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: "Dữ liệu không hợp lệ", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
