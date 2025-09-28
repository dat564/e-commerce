import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import authMiddleware from "@/middleware/auth";

export async function GET(request) {
  try {
    await connectDB();

    // Middleware sẽ xử lý authentication
    const user = await authMiddleware(request);
    if (user instanceof NextResponse) return user;

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { name, phone, address, avatar } = await request.json();

    await connectDB();

    // Middleware sẽ xử lý authentication
    const user = await authMiddleware(request);
    if (user instanceof NextResponse) return user;

    // Cập nhật thông tin user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name, phone, address, avatar },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
        },
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
