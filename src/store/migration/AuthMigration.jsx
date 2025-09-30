"use client";

import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

// Component để migrate từ AuthContext sang Recoil
// Sử dụng component này trong các component cũ để đảm bảo tương thích
export const AuthMigration = ({ children }) => {
  const { user, isLoading, isAuthenticated, login, logout, updateUser, updateTokens, setLoading } = useAuth();

  // Migrate data từ localStorage nếu cần
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');

    if (savedUser && savedAccessToken && savedRefreshToken && !user) {
      try {
        const userData = JSON.parse(savedUser);
        login(userData, savedAccessToken, savedRefreshToken);
      } catch (error) {
        console.error('Error migrating user data:', error);
      }
    }
  }, [user, login]);

  return children;
};

// Hook tương thích với AuthContext cũ
export const useAuthLegacy = () => {
  const auth = useAuth();
  
  return {
    ...auth,
    // Giữ lại các method names cũ để tương thích
    isAdmin: () => auth.isAdmin,
    isAuthenticated: auth.isAuthenticated,
    getAccessToken: auth.getAccessToken,
    getRefreshToken: auth.getRefreshToken,
  };
};
