// Error handling utilities
export const getErrorMessage = (error) => {
  // Axios error
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    // Handle specific status codes
    switch (status) {
      case 400:
        return data?.message || "Dữ liệu không hợp lệ";
      case 401:
        return "Bạn cần đăng nhập để thực hiện hành động này";
      case 403:
        return "Bạn không có quyền thực hiện hành động này";
      case 404:
        return "Không tìm thấy dữ liệu";
      case 409:
        return data?.message || "Dữ liệu đã tồn tại";
      case 422:
        return data?.message || "Dữ liệu không hợp lệ";
      case 429:
        return "Quá nhiều yêu cầu, vui lòng thử lại sau";
      case 500:
        return "Lỗi server, vui lòng thử lại sau";
      default:
        return data?.message || "Có lỗi xảy ra";
    }
  } else if (error.request) {
    // Network error
    return "Không thể kết nối đến server, vui lòng kiểm tra kết nối mạng";
  } else {
    // Other errors
    return error.message || "Có lỗi xảy ra";
  }
};

// Show error notification (you can integrate with your notification system)
export const showError = (error) => {
  const message = getErrorMessage(error);
  console.error("API Error:", error);

  // You can integrate with toast notification library here
  // For example: toast.error(message);

  return message;
};

// Handle API errors with custom error handling
export const handleApiError = (error, customHandler) => {
  const message = getErrorMessage(error);

  if (customHandler) {
    customHandler(error, message);
  } else {
    showError(error);
  }

  return message;
};
