import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// GET - Get user profile
export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
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

// PUT - Update user profile
export async function PUT(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, phone } = await request.json();

    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Update user data
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
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
