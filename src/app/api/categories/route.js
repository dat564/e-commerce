import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const parent = searchParams.get("parent");

    await connectDB();

    let query = { isActive: true };
    if (parent === "null" || parent === "") {
      query.parent = null;
    } else if (parent) {
      query.parent = parent;
    }

    const categories = await Category.find(query)
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const categoryData = await request.json();

    await connectDB();

    const category = new Category(categoryData);
    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: "Tạo danh mục thành công",
        data: { category },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create category error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: "Dữ liệu không hợp lệ", errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Tên danh mục đã tồn tại" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
