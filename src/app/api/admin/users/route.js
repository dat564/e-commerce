import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getErrorMessage } from "@/utils/errorHandler";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await User.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        users,
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
    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Tạo người dùng mới
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      name,
      email,
      role = "user",
      isActive = true,
      password = "mob123",
    } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Tên và email là bắt buộc" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email đã được sử dụng" },
        { status: 409 }
      );
    }

    // Create new user with provided password
    const user = new User({
      name,
      email,
      password, // Sử dụng password từ request hoặc mặc định "mob123"
      role,
      isActive,
    });

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Tạo người dùng thành công",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        defaultPassword: password, // Trả về mật khẩu mặc định để frontend hiển thị
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
