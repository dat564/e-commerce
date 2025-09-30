import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token là bắt buộc" },
        { status: 400 }
      );
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    await connectDB();

    // Find user and verify they're still active
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "Refresh token không hợp lệ" },
        { status: 401 }
      );
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" } // Access token ngắn hạn (1 giờ)
    );

    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "30d" } // Refresh token dài hạn (30 ngày)
    );

    return NextResponse.json({
      success: true,
      message: "Token đã được gia hạn",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { success: false, message: "Refresh token đã hết hạn" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Refresh token không hợp lệ" },
      { status: 401 }
    );
  }
}
