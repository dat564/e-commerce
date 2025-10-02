"use client";

import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import {
  userState,
  userLoadingState,
  isAuthenticatedState,
} from "../atoms/userAtoms";

export const useGetUser = () => {
  const setUser = useSetRecoilState(userState);
  const setUserLoading = useSetRecoilState(userLoadingState);
  const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);

  const getUser = useCallback(
    async (showLoading = false) => {
      // Only run on client side
      if (typeof window === "undefined") return false;

      const savedAccessToken = localStorage.getItem("accessToken");

      if (!savedAccessToken) {
        // No access token, clear auth state
        setUser(null);
        setIsAuthenticated(false);
        setUserLoading(false);
        return false;
      }

      try {
        if (showLoading) {
          setUserLoading(true);
        }

        const response = await fetch("/api/auth/get-user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${savedAccessToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          console.log(
            "🔄 getUser API called - updating user data:",
            data.data.user
          );
          // Update Recoil state with fresh user data
          setUser(data.data.user);
          setIsAuthenticated(true);

          // Update localStorage with fresh user data
          const userDataWithTimestamp = {
            ...data.data.user,
            _lastUpdated: Date.now(),
          };
          localStorage.setItem("user", JSON.stringify(userDataWithTimestamp));

          console.log("✅ User data loaded successfully from API");
          return true;
        } else {
          // Get user failed, handle different error cases
          console.warn("Failed to get user:", data.message);

          // If token is invalid or expired, clear auth state
          if (
            data.message.includes("token") ||
            data.message.includes("expired") ||
            data.message.includes("Invalid")
          ) {
            setUser(null);
            setIsAuthenticated(false);

            // Clear localStorage
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          } else {
            // For other errors, keep current state but log the error
            console.error("API error:", data.message);
          }

          return false;
        }
      } catch (error) {
        console.error("Error getting user:", error);

        // Check if it's a network error or server error
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          // Network error - keep current state but log
          console.warn(
            "Network error while getting user, keeping current state"
          );
          return false;
        }

        // For other errors, clear auth state
        setUser(null);
        setIsAuthenticated(false);

        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        return false;
      } finally {
        if (showLoading) {
          setUserLoading(false);
        }
      }
    },
    [setUser, setUserLoading, setIsAuthenticated]
  );

  return { getUser };
};
