import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();

    const { token, password } = await request.json();

    // Validation
    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "Token và mật khẩu mới là bắt buộc" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // Tìm user theo reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token chưa hết hạn
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    // Cập nhật password và xóa reset token
    // Password sẽ được hash tự động bởi User model pre-save hook
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message:
        "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.",
    });
  } catch (error) {
    console.error("Lỗi reset password:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}

// API để kiểm tra token hợp lệ (cho frontend)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token là bắt buộc" },
        { status: 400 }
      );
    }

    // Tìm user theo reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Token hợp lệ",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Lỗi kiểm tra token:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
