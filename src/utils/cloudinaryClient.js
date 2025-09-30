// Client-side utility để tạo Cloudinary URLs
// Không import cloudinary SDK để tránh lỗi fs module

export const getCloudinaryUrl = (publicId, transformations = {}) => {
  if (!publicId) return "";

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    console.warn("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not found");
    return "";
  }

  // Tạo base URL
  let url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // Thêm transformations
  const transformParams = [];

  if (transformations.width) transformParams.push(`w_${transformations.width}`);
  if (transformations.height)
    transformParams.push(`h_${transformations.height}`);
  if (transformations.crop) transformParams.push(`c_${transformations.crop}`);
  if (transformations.gravity)
    transformParams.push(`g_${transformations.gravity}`);
  if (transformations.quality)
    transformParams.push(`q_${transformations.quality}`);
  if (transformations.format)
    transformParams.push(`f_${transformations.format}`);
  if (transformations.effect)
    transformParams.push(`e_${transformations.effect}`);
  if (transformations.opacity)
    transformParams.push(`o_${transformations.opacity}`);

  // Thêm các transformations khác
  Object.keys(transformations).forEach((key) => {
    if (
      ![
        "width",
        "height",
        "crop",
        "gravity",
        "quality",
        "format",
        "effect",
        "opacity",
      ].includes(key)
    ) {
      transformParams.push(`${key}_${transformations[key]}`);
    }
  });

  if (transformParams.length > 0) {
    url += `/${transformParams.join(",")}`;
  }

  // Thêm public ID
  url += `/${publicId}`;

  return url;
};

// Helper functions cho các transformations phổ biến
export const getThumbnailUrl = (publicId, size = 150) => {
  return getCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: "fill",
    gravity: "center",
    quality: "auto",
    format: "auto",
  });
};

export const getProductImageUrl = (publicId, width = 300, height = 300) => {
  return getCloudinaryUrl(publicId, {
    width,
    height,
    crop: "fill",
    gravity: "center",
    quality: "auto",
    format: "auto",
  });
};

export const getBannerImageUrl = (publicId, height = 300) => {
  return getCloudinaryUrl(publicId, {
    width: "auto",
    height,
    crop: "fill",
    gravity: "center",
    quality: "auto",
    format: "auto",
  });
};
