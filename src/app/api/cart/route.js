import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/middleware/auth";
import User from "@/models/User";

// GET /api/cart - Get user's cart
export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token không được cung cấp" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select("cart");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        cart: user.cart || [],
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token không được cung cấp" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "ID sản phẩm là bắt buộc" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Initialize cart if not exists
    if (!user.cart) {
      user.cart = [];
    }

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      user.cart.push({
        productId,
        quantity,
        addedAt: new Date(),
      });
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Đã thêm sản phẩm vào giỏ hàng",
      data: {
        cart: user.cart,
      },
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token không được cung cấp" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, message: "ID sản phẩm và số lượng là bắt buộc" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    if (!user.cart) {
      user.cart = [];
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Sản phẩm không có trong giỏ hàng" },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      user.cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      user.cart[itemIndex].quantity = quantity;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Đã cập nhật giỏ hàng",
      data: {
        cart: user.cart,
      },
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart or clear cart
export async function DELETE(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token không được cung cấp" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    if (!user.cart) {
      user.cart = [];
    }

    if (productId) {
      // Remove specific item
      const itemIndex = user.cart.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex === -1) {
        return NextResponse.json(
          { success: false, message: "Sản phẩm không có trong giỏ hàng" },
          { status: 404 }
        );
      }

      user.cart.splice(itemIndex, 1);
    } else {
      // Clear entire cart
      user.cart = [];
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: productId
        ? "Đã xóa sản phẩm khỏi giỏ hàng"
        : "Đã xóa tất cả sản phẩm khỏi giỏ hàng",
      data: {
        cart: user.cart,
      },
    });
  } catch (error) {
    console.error("Delete cart error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
