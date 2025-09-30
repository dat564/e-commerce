import { notification } from "antd";

// Configure notification default settings
notification.config({
  placement: "topRight",
  duration: 4.5,
  maxCount: 3,
});

// Success notification
export const showSuccess = (message, description = "") => {
  notification.success({
    message,
    description,
    duration: 3,
  });
};

// Error notification
export const showError = (message, description = "") => {
  notification.error({
    message,
    description,
    duration: 5,
  });
};

// Warning notification
export const showWarning = (message, description = "") => {
  notification.warning({
    message,
    description,
    duration: 4,
  });
};

// Info notification
export const showInfo = (message, description = "") => {
  notification.info({
    message,
    description,
    duration: 4,
  });
};
// Loading notification (for long operations)
export const showLoading = (message, key) => {
  notification.loading({
    message,
    description: "Vui lòng chờ...",
    key,
    duration: 0, // Don't auto close
  });
};

// Close specific notification
export const closeNotification = (key) => {
  notification.close(key);
};

// Close all notifications
export const closeAllNotifications = () => {
  notification.destroy();
};
