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
      const savedUser = localStorage.getItem("user");

      if (savedAccessToken && savedRefreshToken) {
        // Set tokens and authentication state immediately
        setAccessToken(savedAccessToken);
        setRefreshToken(savedRefreshToken);
        setIsAuthenticated(true);

        // Load user from localStorage immediately (fast)
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            setUser(userData);
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
        }

        // Only refresh user data if it's old (older than 5 minutes)
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            const userTimestamp = userData._lastUpdated || 0;
            const now = Date.now();
            const timeDiff = now - userTimestamp;

            // Only refresh if user data is older than 5 minutes
            if (timeDiff > 5 * 60 * 1000) {
              console.log(
                "🔄 RecoilInitializer: User data is old, refreshing from API"
              );
              await getUser(false); // Don't show loading spinner
            } else {
              console.log(
                "✅ RecoilInitializer: User data is fresh, skipping API call"
              );
            }
          } catch (parseError) {
            console.log("❌ Failed to parse user data, refreshing from API");
            await getUser(false);
          }
        } else {
          // No user data, try to get it from API
          console.log("🔄 RecoilInitializer: No user data, fetching from API");
          try {
            await getUser(false);
          } catch (error) {
            console.log("❌ Failed to get user data:", error);
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
