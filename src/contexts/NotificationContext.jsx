"use client";

import React, { createContext, useContext } from "react";
import { notification } from "antd";

// Tạo context cho notification
const NotificationContext = createContext();

// Provider component
export function NotificationProvider({ children }) {
  const [api, contextHolder] = notification.useNotification();

  // Configure notification using the global notification object
  React.useEffect(() => {
    notification.config({
      placement: "topRight",
      duration: 4.5,
      maxCount: 3,
    });
  }, []);

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
}

// Hook để sử dụng notification
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}
