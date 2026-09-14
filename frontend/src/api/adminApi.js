import apiClient from "./apiClient";


/*
=========================================================
GET ADMINS
=========================================================
*/

export const getAdmins = () => {
  return apiClient("/api/admins", {
    method: "GET",
  });
};


/*
=========================================================
CREATE SECONDARY ADMIN
=========================================================
*/

export const createSecondaryAdmin = ({
  name,
  email,
  phone,
  password,
  confirmPassword,
}) => {
  return apiClient(
    "/api/admins/create-secondary-admin",
    {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        confirmPassword,
      }),
    }
  );
};


/*
=========================================================
REMOVE SECONDARY ADMIN
=========================================================
*/

export const removeSecondaryAdmin = (
  userId
) => {
  return apiClient(
    `/api/admins/remove/${encodeURIComponent(
      userId
    )}`,
    {
      method: "PATCH",
    }
  );
};


/*
=========================================================
ADMIN DASHBOARD
=========================================================
*/

export const getAdminDashboard = () => {
  return apiClient("/api/admins/dashboard", {
    method: "GET",
  });
};