import { atom } from "recoil";

// User data atom
export const userState = atom({
  key: "userState",
  default: null,
});

// Loading state atom
export const userLoadingState = atom({
  key: "userLoadingState",
  default: true,
});

// Access token atom
export const accessTokenState = atom({
  key: "accessTokenState",
  default: null,
});

// Refresh token atom
export const refreshTokenState = atom({
  key: "refreshTokenState",
  default: null,
});

// Authentication status atom
export const isAuthenticatedState = atom({
  key: "isAuthenticatedState",
  default: false,
});
