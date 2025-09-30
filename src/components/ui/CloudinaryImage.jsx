import React from "react";

const CloudinaryImage = ({
  src,
  alt = "",
  width = "auto",
  height = "auto",
  className = "",
  style = {},
  ...props
}) => {
  if (!src) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
        {...props}
      >
        <span className="text-gray-400">Không có ảnh</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ width, height, ...style }}
      loading="lazy"
      {...props}
    />
  );
};

// Component cho ảnh thumbnail
export const ThumbnailImage = ({ src, alt, className = "", ...props }) => (
  <CloudinaryImage
    src={src}
    alt={alt}
    width={150}
    height={150}
    className={`object-cover ${className}`}
    {...props}
  />
);

// Component cho ảnh banner
export const BannerImage = ({ src, alt, className = "", ...props }) => (
  <CloudinaryImage
    src={src}
    alt={alt}
    width="100%"
    height={300}
    className={`object-cover ${className}`}
    {...props}
  />
);

// Component cho ảnh sản phẩm
export const ProductImage = ({ src, alt, className = "", ...props }) => (
  <CloudinaryImage
    src={src}
    alt={alt}
    width={300}
    height={300}
    className={`object-cover ${className}`}
    {...props}
  />
);

export default CloudinaryImage;
