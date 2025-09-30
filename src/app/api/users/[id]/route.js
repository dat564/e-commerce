import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getErrorMessage } from "@/utils/errorHandler";

// GET /api/users/[id] - Lấy thông tin user theo ID
export async function GET(request, { params }) {
  try {
    await connectDB();

    const user = await User.findById(params.id).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Cập nhật thông tin user
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, role, isActive } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Tên và email là bắt buộc" },
        { status: 400 }
      );
    }

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Check if email already exists (excluding current user)
    const existingUser = await User.findOne({
      email,
      _id: { $ne: params.id },
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email đã được sử dụng" },
        { status: 409 }
      );
    }

    // Update user
    user.name = name;
    user.email = email;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Cập nhật người dùng thành công",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Xóa user
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Prevent deleting admin users
    if (user.role === "admin") {
      return NextResponse.json(
        { success: false, message: "Không thể xóa tài khoản quản trị viên" },
        { status: 403 }
      );
    }

    await User.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Xóa người dùng thành công",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
