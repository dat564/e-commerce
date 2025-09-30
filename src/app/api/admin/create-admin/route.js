import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "Not allowed in production" },
        { status: 403 }
      );
    }

    const { name, email, password, phone } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email và password là bắt buộc" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin account already exists" },
        { status: 400 }
      );
    }

    // Create admin user
    const adminUser = new User({
      name,
      email,
      password,
      phone: phone || "",
      role: "admin",
      isActive: true,
    });

    await adminUser.save();

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          phone: adminUser.phone,
          role: adminUser.role,
        },
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
