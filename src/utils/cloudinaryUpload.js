// Client-side upload utility cho Cloudinary
// Upload trực tiếp từ browser lên Cloudinary

import axios from "axios";
import { showError, showSuccess } from "./notification";

// Cách 1: Sử dụng XMLHttpRequest (có progress tracking)
export const uploadToCloudinaryXHR = async (
  file,
  folder = "ecommerce",
  onProgress = null
) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            publicId: response.public_id,
            url: response.secure_url,
            width: response.width,
            height: response.height,
            format: response.format,
            bytes: response.bytes,
            originalFilename: response.original_filename,
          });
        } catch (error) {
          reject(new Error("Invalid response from Cloudinary"));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error?.message || "Upload failed"));
        } catch {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was aborted"));
    });

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
    );
    xhr.send(formData);
  });
};

// Cách 2: Sử dụng Fetch (không có progress tracking)
export const uploadToCloudinaryFetch = async (file, folder = "ecommerce") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append("folder", folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Upload failed");
    }

    const result = await response.json();
    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      originalFilename: result.original_filename,
    };
  } catch (error) {
    throw new Error(error.message || "Upload failed");
  }
};

// Cách 3: Sử dụng Axios (có thể có progress tracking với interceptor)
export const uploadToCloudinary = async (file, onProgress = null) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

  console.log(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
  console.log("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

  try {
    const { data, status } = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: onProgress
          ? (progressEvent) => {
              const percentComplete =
                (progressEvent.loaded / progressEvent.total) * 100;
              onProgress(percentComplete);
            }
          : undefined,
      }
    );
    return {
      publicId: data.public_id,
      url: data.secure_url,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes,
      originalFilename: data.original_filename,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || error.message || "Upload thất bại"
    );
  }
};

// Helper function để validate file
export const validateFile = (file, maxSize = 10 * 1024 * 1024) => {
  const errors = [];

  // Kiểm tra file type
  if (!file.type.startsWith("image/")) {
    errors.push("Chỉ cho phép upload file ảnh");
  }

  // Kiểm tra file size
  if (file.size > maxSize) {
    errors.push(
      `File quá lớn! Kích thước tối đa là ${Math.round(
        maxSize / 1024 / 1024
      )}MB`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function để tạo thumbnail URL
export const getThumbnailUrl = (publicId, size = 150) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${size},h_${size},c_fill,g_center,q_auto,f_auto/${publicId}`;
};

// Helper function để tạo optimized URL
export const getOptimizedUrl = (publicId, width = 300, height = 300) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,g_center,q_auto,f_auto/${publicId}`;
};

// Hàm upload nhiều ảnh cùng lúc
export const uploadMultipleToCloudinary = async (
  files,
  onProgress = null,
  onFileProgress = null // Callback cho progress của từng file riêng biệt
) => {
  if (!files || files.length === 0) {
    throw new Error("Không có file nào để upload");
  }

  const results = [];
  const errors = [];

  // Validate tất cả files trước
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const validation = validateFile(file);
    if (!validation.isValid) {
      errors.push({
        file: file.name,
        errors: validation.errors,
        index: i,
      });
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Validation failed: ${errors
        .map((e) => `${e.file}: ${e.errors.join(", ")}`)
        .join("; ")}`
    );
  }

  // Upload từng file một cách tuần tự để tránh quá tải
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      // Callback progress cho file hiện tại
      const fileProgressCallback = onFileProgress
        ? (progress) => onFileProgress(i, file.name, progress)
        : null;

      const result = await uploadToCloudinary(file, fileProgressCallback);

      results.push({
        ...result,
        originalName: file.name,
        index: i,
      });

      // Callback progress tổng thể
      if (onProgress) {
        const totalProgress = ((i + 1) / files.length) * 100;
        onProgress(totalProgress);
      }
    } catch (error) {
      console.error(`Upload failed for file ${file.name}:`, error);
      errors.push({
        file: file.name,
        error: error.message,
        index: i,
      });
    }
  }

  return {
    results,
    errors,
    successCount: results.length,
    errorCount: errors.length,
    totalFiles: files.length,
  };
};

// Hàm upload nhiều ảnh song song (nhanh hơn nhưng có thể gây quá tải)
export const uploadMultipleToCloudinaryParallel = async (
  files,
  onProgress = null,
  onFileProgress = null,
  maxConcurrent = 3 // Số lượng upload đồng thời tối đa
) => {
  if (!files || files.length === 0) {
    throw new Error("Không có file nào để upload");
  }

  const results = [];
  const errors = [];

  // Validate tất cả files trước
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const validation = validateFile(file);
    if (!validation.isValid) {
      errors.push({
        file: file.name,
        errors: validation.errors,
        index: i,
      });
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Validation failed: ${errors
        .map((e) => `${e.file}: ${e.errors.join(", ")}`)
        .join("; ")}`
    );
  }

  // Chia files thành các batch để upload song song
  const batches = [];
  for (let i = 0; i < files.length; i += maxConcurrent) {
    batches.push(files.slice(i, i + maxConcurrent));
  }

  let completedFiles = 0;

  // Upload từng batch
  for (const batch of batches) {
    const batchPromises = batch.map(async (file, batchIndex) => {
      const globalIndex = completedFiles + batchIndex;

      try {
        const fileProgressCallback = onFileProgress
          ? (progress) => onFileProgress(globalIndex, file.name, progress)
          : null;

        const result = await uploadToCloudinary(file, fileProgressCallback);

        const finalResult = {
          ...result,
          originalName: file.name,
          index: globalIndex,
        };

        // Callback progress tổng thể
        if (onProgress) {
          completedFiles++;
          const totalProgress = (completedFiles / files.length) * 100;
          onProgress(totalProgress);
        }

        return { success: true, result: finalResult };
      } catch (error) {
        console.error(`Upload failed for file ${file.name}:`, error);
        return {
          success: false,
          error: {
            file: file.name,
            error: error.message,
            index: globalIndex,
          },
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);

    batchResults.forEach((result) => {
      if (result.success) {
        results.push(result.result);
      } else {
        errors.push(result.error);
      }
    });
  }

  return {
    results,
    errors,
    successCount: results.length,
    errorCount: errors.length,
    totalFiles: files.length,
  };
};
