import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getErrorMessage } from "@/utils/errorHandler";

// GET /api/products - Lấy danh sách sản phẩm
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const exclude = searchParams.get("exclude") || "";
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

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (exclude) {
      query._id = { $ne: exclude };
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products with pagination
    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Product.countDocuments(query);

    // Get statistics (only when not searching to get overall stats)
    let statistics = null;
    if (!search && !category && !status) {
      const totalProducts = await Product.countDocuments();
      const activeProducts = await Product.countDocuments({ status: "active" });
      const totalValue = await Product.aggregate([
        { $match: { status: "active" } },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$price", "$stock"] } },
          },
        },
      ]);

      statistics = {
        total: totalProducts,
        activeProducts,
        totalValue: totalValue.length > 0 ? totalValue[0].total : 0,
      };
    }

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Transform products data
    const transformedProducts = products.map((product) => ({
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
    }));

    return NextResponse.json({
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev,
        },
        statistics,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST /api/products - Tạo sản phẩm mới
export async function POST(request) {
  try {
    await connectDB();

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

    // Validation
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { success: false, message: "Tên, mô tả, giá và danh mục là bắt buộc" },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { success: false, message: "Giá phải lớn hơn 0" },
        { status: 400 }
      );
    }

    // Check if product name already exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: "Tên sản phẩm đã tồn tại" },
        { status: 409 }
      );
    }

    // Create new product
    const product = new Product({
      name,
      description,
      price,
      category,
      image: image || "",
      images: images || [],
      features: features || [],
      stock: stock || 0,
      status: status || "active",
    });

    await product.save();

    // Populate category before returning
    await product.populate("category", "name");

    return NextResponse.json({
      success: true,
      message: "Tạo sản phẩm thành công",
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
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
