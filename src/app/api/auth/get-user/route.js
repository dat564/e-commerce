import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await connectDB();

    // Get authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Access token is required" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify access token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return user data
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
      },
      message: "User data retrieved successfully",
    });
  } catch (error) {
    console.error("Get user error:", error);

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { success: false, message: "Invalid access token" },
        { status: 401 }
      );
    }

    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { success: false, message: "Access token expired" },
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
