import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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
    const { currentPassword, newPassword } = await request.json();

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Mật khẩu hiện tại và mật khẩu mới là bắt buộc",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu mới phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(decoded.userId).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu hiện tại không đúng" },
        { status: 400 }
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
