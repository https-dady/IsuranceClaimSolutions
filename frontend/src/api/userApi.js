import apiClient from "./apiClient";

export const getUsers = () => {
  return apiClient("/api/users", {
    method: "GET",
  });
};