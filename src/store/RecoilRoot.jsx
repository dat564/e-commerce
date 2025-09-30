"use client";

import { RecoilRoot } from "recoil";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import {
  userState,
  userLoadingState,
  accessTokenState,
  refreshTokenState,
  isAuthenticatedState,
} from "./atoms/userAtoms";
import { useGetUser } from "./hooks/useGetUser";

// Component to initialize Recoil state from localStorage and fetch fresh user data
const RecoilInitializer = ({ children }) => {
  const setUser = useSetRecoilState(userState);
  const setUserLoading = useSetRecoilState(userLoadingState);
  const setAccessToken = useSetRecoilState(accessTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
  const { getUser } = useGetUser();

  useEffect(() => {
    const initializeAuth = async () => {
      // Load tokens from localStorage on mount
      const savedAccessToken = localStorage.getItem("accessToken");
      const savedRefreshToken = localStorage.getItem("refreshToken");

      if (savedAccessToken && savedRefreshToken) {
        // Set tokens first
        setAccessToken(savedAccessToken);
        setRefreshToken(savedRefreshToken);

        // Try to get fresh user data from API
        const success = await getUser();

        if (!success) {
          // If API call failed, try to load from localStorage as fallback
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser);
              setUser(userData);
              setIsAuthenticated(true);
            } catch (error) {
              console.error("Error parsing saved user:", error);
              // Clear invalid data
              localStorage.removeItem("user");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              setUser(null);
              setAccessToken(null);
              setRefreshToken(null);
              setIsAuthenticated(false);
            }
          } else {
            // No user data in localStorage, clear auth state
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        // No tokens, clear auth state
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        setIsAuthenticated(false);
      }

      setUserLoading(false);
    };

    initializeAuth();
  }, [
    setUser,
    setAccessToken,
    setRefreshToken,
    setIsAuthenticated,
    setUserLoading,
    getUser,
  ]);

  return children;
};

export const CustomRecoilRoot = ({ children }) => {
  return (
    <RecoilRoot>
      <RecoilInitializer>{children}</RecoilInitializer>
    </RecoilRoot>
  );
};
