import apiClient from "./apiClient";

export const signup = (userData) => {
  return apiClient("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const verifyEmail = (data) => {
  return apiClient("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const resendVerificationOTP = (email) => {
  return apiClient("/api/auth/resend-verification-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const login = (credentials) => {
  return apiClient("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const forgotPassword = (email) => {
  return apiClient("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const verifyResetOTP = (data) => {
  return apiClient("/api/auth/verify-reset-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const resetPassword = (data) => {
  return apiClient("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};