"use client";

import { useRecoilValue } from "recoil";
import {
  userState,
  userLoadingState,
  accessTokenState,
  refreshTokenState,
  isAuthenticatedState,
} from "../atoms/userAtoms";
import {
  isAdminSelector,
  userProfileSelector,
  authHeadersSelector,
} from "../selectors/userSelectors";
import { useAuthActions } from "./useAuthActions";

export const useAuth = () => {
  const user = useRecoilValue(userState);
  const isLoading = useRecoilValue(userLoadingState);
  const accessToken = useRecoilValue(accessTokenState);
  const refreshToken = useRecoilValue(refreshTokenState);
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  const isAdmin = useRecoilValue(isAdminSelector);
  const userProfile = useRecoilValue(userProfileSelector);
  const authHeaders = useRecoilValue(authHeadersSelector);

  const actions = useAuthActions();

  // Helper functions
  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  const getRefreshToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  };

  const isAuthenticatedCheck = () => {
    if (typeof window === "undefined") return false;
    return (
      !!user &&
      !!localStorage.getItem("accessToken") &&
      !!localStorage.getItem("refreshToken")
    );
  };

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    userProfile,
    authHeaders,

    // Actions
    login: actions.login,
    logout: actions.logout,
    updateUser: actions.updateUser,
    updateTokens: actions.updateTokens,
    setLoading: actions.setLoading,

    // Helper functions
    getAccessToken,
    getRefreshToken,
    isAuthenticated: isAuthenticatedCheck,
  };
};
