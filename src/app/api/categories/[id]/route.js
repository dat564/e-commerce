import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { getErrorMessage } from "@/utils/errorHandler";

// GET /api/categories/[id] - Lấy danh mục theo ID
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID danh mục là bắt buộc" },
        { status: 400 }
      );
    }

    const category = await Category.findById(id).lean();

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy danh mục" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
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
    console.error("Get category error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Cập nhật danh mục
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { name, description, image, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID danh mục là bắt buộc" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy danh mục" },
        { status: 404 }
      );
    }

    // Validation
    if (name && name !== existingCategory.name) {
      const duplicateCategory = await Category.findOne({
        name,
        _id: { $ne: id },
      });
      if (duplicateCategory) {
        return NextResponse.json(
          { success: false, message: "Tên danh mục đã tồn tại" },
          { status: 409 }
        );
      }
    }

    // Update category
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (status !== undefined) updateData.status = status;

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật danh mục thành công",
      data: {
        id: updatedCategory._id,
        name: updatedCategory.name,
        description: updatedCategory.description,
        image: updatedCategory.image,
        status: updatedCategory.status,
        productCount: updatedCategory.productCount,
        createdAt: updatedCategory.createdAt,
        updatedAt: updatedCategory.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Xóa danh mục
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID danh mục là bắt buộc" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy danh mục" },
        { status: 404 }
      );
    }

    // Check if category has products
    const productsInCategory = await Product.countDocuments({
      category: existingCategory.name,
    });
    if (productsInCategory > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Không thể xóa danh mục vì còn ${productsInCategory} sản phẩm trong danh mục này`,
        },
        { status: 400 }
      );
    }

    // Delete category
    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Xóa danh mục thành công",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
