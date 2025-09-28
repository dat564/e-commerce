import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    await connectDB();

    // Tìm user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Kiểm tra tài khoản có bị vô hiệu hóa
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Tài khoản đã bị vô hiệu hóa" },
        { status: 401 }
      );
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
