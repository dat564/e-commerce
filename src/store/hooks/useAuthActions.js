"use client";

import { useSetRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/navigation";
import {
  userState,
  userLoadingState,
  accessTokenState,
  refreshTokenState,
  isAuthenticatedState,
} from "../atoms/userAtoms";

export const useAuthActions = () => {
  const setUser = useSetRecoilState(userState);
  const setUserLoading = useSetRecoilState(userLoadingState);
  const setAccessToken = useSetRecoilState(accessTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
  const router = useRouter();

  const login = (userData, accessToken, refreshToken) => {
    setUser(userData);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIsAuthenticated(true);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    // Redirect to login page
    router.push("/login");
  };

  const updateUser = (userData) => {
    setUser(userData);

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const updateTokens = (accessToken, refreshToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  const setLoading = (loading) => {
    setUserLoading(loading);
  };

  return {
    login,
    logout,
    updateUser,
    updateTokens,
    setLoading,
  };
};
