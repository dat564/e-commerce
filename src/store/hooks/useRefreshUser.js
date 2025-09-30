"use client";

import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import {
  userState,
  userLoadingState,
  accessTokenState,
  refreshTokenState,
  isAuthenticatedState,
} from "../atoms/userAtoms";

export const useRefreshUser = () => {
  const setUser = useSetRecoilState(userState);
  const setUserLoading = useSetRecoilState(userLoadingState);
  const setAccessToken = useSetRecoilState(accessTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);

  const refreshUser = useCallback(async () => {
    // Only run on client side
    if (typeof window === "undefined") return false;

    const savedRefreshToken = localStorage.getItem("refreshToken");

    if (!savedRefreshToken) {
      // No refresh token, clear all auth state
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      setUserLoading(false);
      return false;
    }

    try {
      setUserLoading(true);

      const response = await fetch("/api/auth/refresh-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: savedRefreshToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update Recoil state with fresh data
        setUser(data.data.user);
        setAccessToken(data.data.accessToken);
        setRefreshToken(data.data.refreshToken);
        setIsAuthenticated(true);

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);

        console.log("User data refreshed successfully");
        return true;
      } else {
        // Refresh failed, clear auth state
        console.warn("Failed to refresh user:", data.message);
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        setIsAuthenticated(false);

        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        return false;
      }
    } catch (error) {
      console.error("Error refreshing user:", error);

      // On error, clear auth state
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return false;
    } finally {
      setUserLoading(false);
    }
  }, [
    setUser,
    setUserLoading,
    setAccessToken,
    setRefreshToken,
    setIsAuthenticated,
  ]);

  return { refreshUser };
};
