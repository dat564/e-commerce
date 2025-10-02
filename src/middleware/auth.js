import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default async function authMiddleware(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Không có token xác thực",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password").lean();

    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Token không hợp lệ hoặc tài khoản đã bị vô hiệu hóa",
        },
        { status: 401 }
      );
    }

    return user;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Token không hợp lệ",
      },
      { status: 401 }
    );
  }
}

export async function adminMiddleware(request, user) {
  if (user.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Không có quyền truy cập",
      },
      { status: 403 }
    );
  }
  return null;
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(
      "Token verified successfully. Expires at:",
      new Date(decoded.exp * 1000)
    );
    console.log(
      "JWT_SECRET used for verification:",
      JWT_SECRET.substring(0, 10) + "..."
    );
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    console.log(
      "JWT_SECRET used for verification:",
      JWT_SECRET.substring(0, 10) + "..."
    );
    return null;
  }
}
