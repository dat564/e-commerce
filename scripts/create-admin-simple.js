// Script đơn giản để tạo admin bằng API
const createAdmin = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/admin/create-admin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Admin M.O.B",
          email: "admin@mob.com",
          password: "admin123",
          phone: "0123456789",
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log("✅ Đã tạo admin thành công!");
      console.log("📧 Email: admin@mob.com");
      console.log("🔑 Mật khẩu: admin123");
      console.log("👤 Tên: Admin M.O.B");
    } else {
      console.log("❌ Lỗi:", result.message);
    }
  } catch (error) {
    console.log("❌ Lỗi khi gọi API:", error.message);
    console.log("💡 Hãy đảm bảo server đang chạy (npm run dev)");
  }
};

createAdmin();
