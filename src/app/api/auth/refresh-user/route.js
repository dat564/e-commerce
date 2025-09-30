import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectDB();

    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );

    // Return user data and new tokens
    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          address: user.address,
          permissions: user.permissions || [],
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      message: "User data refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh user error:", error);

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { success: false, message: "Refresh token expired" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
