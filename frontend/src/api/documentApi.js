import apiClient from "./apiClient";

export const uploadDocuments = ({
  files = [],
  documentTypes = [],
  queryId = "",
}) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("documents", file);
  });

  formData.append(
    "documentTypes",
    JSON.stringify(documentTypes)
  );

  if (queryId) {
    formData.append("queryId", queryId);
  }

  return apiClient("/api/documents/upload", {
    method: "POST",
    body: formData,
  });
};

export const getMyDocuments = () => {
  return apiClient("/api/documents/my", {
    method: "GET",
  });
};

export const getMyDocumentById = (documentId) => {
  return apiClient(
    `/api/documents/my/${encodeURIComponent(documentId)}`,
    {
      method: "GET",
    }
  );
};

export const deleteMyDocument = (documentId) => {
  return apiClient(
    `/api/documents/my/${encodeURIComponent(documentId)}`,
    {
      method: "DELETE",
    }
  );
};