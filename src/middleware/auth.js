import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không có token xác thực",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ hoặc tài khoản đã bị vô hiệu hóa",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
}

export function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Không có quyền truy cập",
    });
  }
  next();
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
