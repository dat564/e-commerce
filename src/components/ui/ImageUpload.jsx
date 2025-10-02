import React, { useState, useRef } from "react";
import { UploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Upload,
  Button,
  Image,
  Progress,
  Switch,
  Space,
  Typography,
} from "antd";
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  uploadMultipleToCloudinaryParallel,
  validateFile,
} from "@/utils/cloudinaryUpload";
import { showSuccess, showError } from "@/utils/notification";

const { Text } = Typography;

const ImageUpload = ({
  onUploadSuccess,
  onUploadError,
  maxSize = 10, // MB
  accept = "image/*",
  className = "",
  value = null, // URL của ảnh hiện tại (single) hoặc array (multiple)
  onChange, // callback khi có ảnh mới
  multiple = false, // Cho phép upload nhiều ảnh
  maxCount = 5, // Số lượng ảnh tối đa khi multiple = true
  uploadMode = "sequential", // "sequential" hoặc "parallel"
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [fileProgresses, setFileProgresses] = useState({}); // Progress của từng file riêng biệt
  const pendingFilesRef = useRef([]); // Lưu trữ files đang chờ upload

  // beforeUpload - validate và lưu trữ files
  const beforeUpload = (file, fileListFromUpload) => {
    // Validate file
    const validation = validateFile(file, maxSize * 1024 * 1024);
    if (!validation.isValid) {
      validation.errors.forEach((error) => showError(error));
      return false;
    }

    // Kiểm tra số lượng file nếu multiple mode
    if (multiple && fileListFromUpload.length > maxCount) {
      showError(`Chỉ được upload tối đa ${maxCount} ảnh`);
      return false;
    }

    // Lưu files vào ref để sử dụng trong customRequest
    pendingFilesRef.current = fileListFromUpload;

    return true;
  };

  // Custom upload function
  const customRequest = async (info) => {
    const { file, onSuccess, onError, onProgress } = info || {};

    try {
      setUploading(true);
      setUploadProgress(0);
      setFileProgresses({});

      if (multiple) {
        // Lấy tất cả files từ ref
        const filesToUpload = pendingFilesRef.current;

        if (!filesToUpload || filesToUpload.length === 0) {
          showError("Không có file nào để upload");
          onError(new Error("Không có file nào để upload"));
          return;
        }

        // Chỉ upload một lần khi file cuối cùng được add
        const isLastFile = file === filesToUpload[filesToUpload.length - 1];

        if (!isLastFile) {
          // Nếu không phải file cuối, chỉ báo success để UI cập nhật
          onSuccess({ url: URL.createObjectURL(file) }, file);
          return;
        }

        // Upload tất cả files
        const uploadFunction =
          uploadMode === "parallel"
            ? uploadMultipleToCloudinaryParallel
            : uploadMultipleToCloudinary;

        const result = await uploadFunction(
          filesToUpload,
          (totalProgress) => {
            setUploadProgress(totalProgress);
            onProgress({ percent: totalProgress });
          },
          (fileIndex, fileName, fileProgress) => {
            setFileProgresses((prev) => ({
              ...prev,
              [fileIndex]: { fileName, progress: fileProgress },
            }));
          }
        );

        // Cập nhật file list với kết quả upload
        const newFileList = result.results.map((uploadResult, index) => ({
          uid: uploadResult.url,
          name: uploadResult.originalName,
          status: "done",
          url: uploadResult.url,
          originalName: uploadResult.originalName,
        }));

        setFileList(newFileList);
        onSuccess(result);
        onChange?.(result.results.map((r) => r.url));
        onUploadSuccess?.(result);

        // Hiển thị thông báo kết quả
        if (result.successCount > 0) {
          showSuccess(
            `Upload thành công ${result.successCount}/${result.totalFiles} ảnh!`
          );
        }

        if (result.errorCount > 0) {
          showError(`${result.errorCount} ảnh upload thất bại`);
        }

        // Clear pending files
        pendingFilesRef.current = [];
      } else {
        // Upload single image
        const result = await uploadToCloudinary(file, (progress) => {
          setUploadProgress(progress);
          onProgress({ percent: progress });
        });

        const newFile = {
          uid: result.url,
          name: result.originalName || file.name,
          status: "done",
          url: result.url,
        };

        setFileList([newFile]);
        onSuccess(result);
        onChange?.(result.url);
        onUploadSuccess?.(result);
        showSuccess("Upload ảnh thành công!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showError(error.message || "Có lỗi xảy ra khi upload ảnh");
      onError(error);
      onUploadError?.(error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setFileProgresses({});
    }
  };

  // Handle remove image
  const handleRemove = (file) => {
    if (multiple) {
      const newFileList = fileList.filter((item) => item.uid !== file.uid);
      setFileList(newFileList);
      onChange?.(newFileList.map((f) => f.url));
    } else {
      setFileList([]);
      onChange?.(null);
    }
    return true;
  };

  // Handle onChange to update fileList state
  const handleChange = ({ fileList: newFileList }) => {
    // Chỉ cập nhật fileList khi không đang upload
    // Vì khi upload xong, chúng ta đã cập nhật fileList trong customRequest
    if (!uploading) {
      setFileList(newFileList);
    }
  };

  // Initialize file list with current value
  React.useEffect(() => {
    if (multiple) {
      // Multiple mode: value là array of URLs
      if (value && Array.isArray(value) && value.length > 0) {
        const initialFileList = value.map((url, index) => ({
          uid: url,
          name: `Image ${index + 1}`,
          status: "done",
          url: url,
        }));
        setFileList(initialFileList);
      } else {
        setFileList([]);
      }
    } else {
      // Single mode: value là URL string hoặc null
      if (value) {
        setFileList([
          {
            uid: value,
            name: "Current Image",
            status: "done",
            url: value,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [value, multiple]);

  return (
    <div className={`image-upload ${className}`}>
      {/* Multiple mode toggle */}
      {multiple && (
        <div className="mb-3">
          <Space>
            <Text>Upload nhiều ảnh:</Text>
            <Switch checked={multiple} disabled size="small" />
            <Text type="secondary">
              Mode: {uploadMode === "parallel" ? "Song song" : "Tuần tự"}
            </Text>
          </Space>
        </div>
      )}

      <Upload
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        fileList={fileList}
        onChange={handleChange}
        onRemove={handleRemove}
        listType="picture-card"
        maxCount={multiple ? maxCount : 1}
        multiple={multiple}
        accept={accept}
        showUploadList={{
          showPreviewIcon: true,
          showRemoveIcon: true,
          showDownloadIcon: false,
        }}
        disabled={uploading}
      >
        {fileList.length >= (multiple ? maxCount : 1) ? null : (
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>
              {uploading
                ? "Đang upload..."
                : multiple
                ? `Chọn ảnh (${fileList.length}/${maxCount})`
                : "Chọn ảnh"}
            </div>
          </div>
        )}
      </Upload>

      {/* Progress tracking */}
      {uploading && (
        <div className="mt-3">
          <Progress
            percent={Math.round(uploadProgress)}
            size="small"
            status="active"
            format={(percent) => `Tổng: ${percent}%`}
          />

          {/* Progress của từng file riêng biệt (chỉ hiển thị khi multiple) */}
          {multiple && Object.keys(fileProgresses).length > 0 && (
            <div className="mt-2">
              <Text strong>Chi tiết:</Text>
              <div className="mt-1">
                {Object.entries(fileProgresses).map(
                  ([fileIndex, { fileName, progress }]) => (
                    <div key={fileIndex} className="mb-1">
                      <Space
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          ellipsis
                          style={{ maxWidth: 150, fontSize: "12px" }}
                        >
                          {fileName}
                        </Text>
                        <Progress
                          percent={Math.round(progress)}
                          size="small"
                          style={{ width: 80 }}
                        />
                      </Space>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
