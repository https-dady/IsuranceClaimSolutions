import apiClient from "./apiClient";

export const getAdminDashboard = () => {
  return apiClient("/api/admins/dashboard", {
    method: "GET",
  });
};

export const getAdmins = () => {
  return apiClient("/api/admins", {
    method: "GET",
  });
};

export const promoteToSecondaryAdmin = (userId) => {
  return apiClient(
    `/api/admins/promote/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
    }
  );
};

export const removeSecondaryAdmin = (userId) => {
  return apiClient(
    `/api/admins/remove/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
    }
  );
};