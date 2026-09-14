import apiClient from "./apiClient";

const insuranceTypeMap = {
  "Health Insurance": "Health",
  "Motor Insurance": "Motor",
  "Life Insurance": "Life",
  "Property Insurance": "Property",
  "Travel Insurance": "Travel",
  Other: "Other",
};

export const createQuery = ({
  personalDetails,
  address,
  insuranceDetails,
  claimDetails,
  queryDetails,
  files = [],
  documentTypes = [],
}) => {
  const formData = new FormData();

  formData.append(
    "personalDetails",
    JSON.stringify(personalDetails)
  );

  formData.append(
    "address",
    JSON.stringify(address)
  );

  formData.append(
    "insuranceDetails",
    JSON.stringify({
      ...insuranceDetails,
      insuranceType:
        insuranceTypeMap[insuranceDetails.insuranceType] ||
        insuranceDetails.insuranceType,
    })
  );

  formData.append(
    "claimDetails",
    JSON.stringify(claimDetails)
  );

  formData.append(
    "queryDetails",
    JSON.stringify(queryDetails)
  );

  files.forEach((file) => {
    formData.append("documents", file);
  });

  documentTypes.forEach((documentType) => {
    formData.append("documentTypes", documentType);
  });

  return apiClient("/api/queries/", {
    method: "POST",
    body: formData,
  });
};

export const getMyQueries = () => {
  return apiClient("/api/queries/my", {
    method: "GET",
  });
};

export const getMyQueryById = (queryId) => {
  return apiClient(
    `/api/queries/my/${encodeURIComponent(queryId)}`,
    {
      method: "GET",
    }
  );
};