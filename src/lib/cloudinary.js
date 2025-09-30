import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debug: Kiểm tra config
console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "***" : "MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "MISSING",
});

export default cloudinary;

// Hàm upload ảnh lên Cloudinary
export const uploadImage = async (file, folder = "ecommerce") => {
  try {
    // Chuyển đổi Buffer thành base64 string
    const base64String = `data:image/jpeg;base64,${file.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: "auto",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    });
    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

// Hàm xóa ảnh khỏi Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

// Hàm lấy URL ảnh với các transformation
export const getImageUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    ...transformations,
    secure: true,
  });
};
