import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getErrorMessage } from "@/utils/errorHandler";

// GET /api/products/[id] - Lấy sản phẩm theo ID
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID sản phẩm là bắt buộc" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id)
      .populate("category", "name")
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        images: product.images,
        features: product.features,
        stock: product.stock,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Cập nhật sản phẩm
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const {
      name,
      description,
      price,
      category,
      image,
      images,
      features,
      stock,
      status,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID sản phẩm là bắt buộc" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    // Validation
    if (name && name !== existingProduct.name) {
      const duplicateProduct = await Product.findOne({
        name,
        _id: { $ne: id },
      });
      if (duplicateProduct) {
        return NextResponse.json(
          { success: false, message: "Tên sản phẩm đã tồn tại" },
          { status: 409 }
        );
      }
    }

    if (price && price <= 0) {
      return NextResponse.json(
        { success: false, message: "Giá phải lớn hơn 0" },
        { status: 400 }
      );
    }

    // Update product
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image;
    if (images !== undefined) updateData.images = images;
    if (features !== undefined) updateData.features = features;
    if (stock !== undefined) updateData.stock = stock;
    if (status !== undefined) updateData.status = status;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "name");

    return NextResponse.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: {
        id: updatedProduct._id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        category: updatedProduct.category,
        image: updatedProduct.image,
        images: updatedProduct.images,
        features: updatedProduct.features,
        stock: updatedProduct.stock,
        status: updatedProduct.status,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Xóa sản phẩm
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID sản phẩm là bắt buộc" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
