import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Cấu hình transporter cho nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true cho port 465, false cho các port khác
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Tạo email template
const createEmailTemplate = (resetUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Đặt lại mật khẩu</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #ec4899 !important;
          color: #ffffff !important;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          background-color: #ec4899 !important;
          color: #ffffff !important;
          padding: 15px 30px;
          text-decoration: none !important;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: bold !important;
          font-size: 16px;
          border: none;
          text-align: center;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Đặt lại mật khẩu</h1>
      </div>
      <div class="content">
        <p>Xin chào <strong>${userName}</strong>,</p>
        
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
        </div>
        
        <p>Hoặc copy và dán link này vào trình duyệt:</p>
        <p style="word-break: break-all; background-color: #e9ecef; padding: 10px; border-radius: 4px;">
          ${resetUrl}
        </p>
        
        <p><strong>Lưu ý:</strong></p>
        <ul>
          <li>Link này sẽ hết hạn sau 15 phút</li>
          <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
          <li>Mật khẩu của bạn sẽ không thay đổi cho đến khi bạn nhấp vào link và tạo mật khẩu mới</li>
        </ul>
      </div>
      
      <div class="footer">
        <p>Trân trọng,<br>Đội ngũ E-Commerce</p>
        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
      </div>
    </body>
    </html>
  `;
};

export async function POST(request) {
  try {
    console.log("🔍 Starting forgot password request...");
    await connectDB();
    console.log("✅ Database connected successfully");

    const { email } = await request.json();
    console.log("📧 Email received:", email);

    // Validation
    if (!email) {
      console.log("❌ No email provided");
      return NextResponse.json(
        { success: false, message: "Email là bắt buộc" },
        { status: 400 }
      );
    }

    // Tìm user theo email
    console.log("🔍 Searching for user with email:", email.toLowerCase());
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json(
        { success: false, message: "Không tìm thấy tài khoản với email này" },
        { status: 404 }
      );
    }
    console.log("✅ User found:", user.name);

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
    console.log("🔑 Generated reset token");

    // Lưu reset token vào database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();
    console.log("💾 Reset token saved to database");

    // Tạo reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    console.log("🔗 Reset URL created:", resetUrl);

    // Gửi email
    try {
      console.log("📧 Creating email transporter...");
      const transporter = createTransporter();

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Đặt lại mật khẩu - E-Commerce",
        html: createEmailTemplate(resetUrl, user.name),
      };

      console.log("📤 Sending email to:", user.email);
      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully");

      return NextResponse.json({
        success: true,
        message:
          "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.",
      });
    } catch (emailError) {
      console.error("Lỗi gửi email:", emailError);

      // Xóa reset token nếu gửi email thất bại
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return NextResponse.json(
        { success: false, message: "Lỗi gửi email. Vui lòng thử lại sau." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Lỗi forgot password:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
