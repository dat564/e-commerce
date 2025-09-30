import { connectDB } from "../src/lib/mongodb.js";
import User from "../src/models/User.js";

async function createDefaultAdmin() {
  try {
    await connectDB();

    // Kiểm tra xem đã có admin chưa
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin đã tồn tại:");
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Tên: ${existingAdmin.name}`);
      return;
    }

    // Tạo admin mặc định
    const adminUser = new User({
      name: "Admin M.O.B",
      email: "admin@mob.com",
      password: "admin123",
      phone: "0123456789",
      role: "admin",
      isActive: true,
    });

    await adminUser.save();

    console.log("✅ Đã tạo admin thành công!");
    console.log("📧 Email: admin@mob.com");
    console.log("🔑 Mật khẩu: admin123");
    console.log("👤 Tên: Admin M.O.B");
  } catch (error) {
    console.error("❌ Lỗi khi tạo admin:", error);
  } finally {
    process.exit(0);
  }
}

createDefaultAdmin();
