import apiClient from "./apiClient";

export const getMyProfile = () => {
  return apiClient("/api/profile/me", {
    method: "GET",
  });
};

export const updateMyProfile = (profileData) => {
  return apiClient("/api/profile/me", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  });
};

export const updateProfilePhoto = (file) => {
  const formData = new FormData();

  formData.append("profilePhoto", file);

  return apiClient("/api/profile/me/photo", {
    method: "PATCH",
    body: formData,
  });
};