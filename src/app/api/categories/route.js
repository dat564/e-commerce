import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { getErrorMessage } from "@/utils/errorHandler";

// GET /api/categories - Lấy danh sách danh mục
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get categories with pagination
    const categories = await Category.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Category.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        categories,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev,
        },
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST /api/categories - Tạo danh mục mới
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, description, image, status } = body;

    // Validation
    if (!name || !description) {
      return NextResponse.json(
        { success: false, message: "Tên và mô tả danh mục là bắt buộc" },
        { status: 400 }
      );
    }

    // Check if category name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Tên danh mục đã tồn tại" },
        { status: 409 }
      );
    }

    // Create new category
    const category = new Category({
      name,
      description,
      image: image || "",
      status: status || "active",
      productCount: 0,
    });

    await category.save();

    return NextResponse.json({
      success: true,
      message: "Tạo danh mục thành công",
      data: {
        id: category._id,
        name: category.name,
        description: category.description,
        image: category.image,
        status: category.status,
        productCount: category.productCount,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
