import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  FileImage,
  FileCheck2,
  Eye,
  Download,
  Trash2,
  X,
  Search,
  FolderOpen,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

const documentTypes = [
  "Aadhaar",
  "Insurance Policy",
  "Claim Form",
  "Discharge Summary",
  "Final Bill",
  "Bank Account Passbook",
  "Other Supporting Documents",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const getApiUrl = () =>
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) {
    return "0 MB";
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const getDocumentIcon = (fileType = "") => {
  if (fileType.startsWith("image/")) {
    return FileImage;
  }

  if (fileType === "application/pdf") {
    return FileCheck2;
  }

  return FileText;
};

const getStatusLabel = (status) => {
  switch (status) {
    case "approved":
      return "Approved";

    case "rejected":
      return "Rejected";

    case "pending":
    default:
      return "Pending";
  }
};

function MyDocuments() {
  const [documentList, setDocumentList] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedDocumentType, setSelectedDocumentType] =
    useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isUploading, setIsUploading] = useState(false);

  const [deletingDocumentId, setDeletingDocumentId] =
    useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  /*
  =========================================================
  FETCH MY DOCUMENTS
  =========================================================
  */

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login to view your documents."
        );
      }

      const response = await fetch(
        `${getApiUrl()}/api/documents/my`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch your documents."
        );
      }

      setDocumentList(data.documents || []);
    } catch (error) {
      console.error(
        "Fetch documents error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to fetch your documents."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  /*
  =========================================================
  CLEAR MESSAGES
  =========================================================
  */

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  /*
  =========================================================
  DOCUMENT COUNTS
  =========================================================
  */

  const approvedDocuments = documentList.filter(
    (document) =>
      document.status === "approved"
  ).length;

  const pendingDocuments = documentList.filter(
    (document) =>
      document.status === "pending"
  ).length;

  const rejectedDocuments = documentList.filter(
    (document) =>
      document.status === "rejected"
  ).length;

  /*
  =========================================================
  SEARCH
  =========================================================
  */

  const filteredDocuments = documentList.filter(
    (document) => {
      const searchTerm =
        searchQuery.toLowerCase().trim();

      if (!searchTerm) {
        return true;
      }

      const documentName =
        document.fileName?.toLowerCase() || "";

      const documentType =
        document.documentType?.toLowerCase() || "";

      const queryId =
        document.query?.queryId?.toLowerCase() || "";

      return (
        documentName.includes(searchTerm) ||
        documentType.includes(searchTerm) ||
        queryId.includes(searchTerm)
      );
    }
  );

  /*
  =========================================================
  VIEW DOCUMENT
  =========================================================
  */

  const handleView = async (documentId) => {
    try {
      clearMessages();

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login to view your document."
        );
      }

      const response = await fetch(
        `${getApiUrl()}/api/documents/my/${documentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch document."
        );
      }

      if (!data.document?.cloudinaryUrl) {
        throw new Error(
          "Document URL is not available."
        );
      }

      window.open(
        data.document.cloudinaryUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error(
        "View document error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to open document."
      );
    }
  };

  /*
  =========================================================
  DOWNLOAD DOCUMENT
  =========================================================
  */

  const handleDownload = async (documentId) => {
    try {
      clearMessages();

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login to download your document."
        );
      }

      const response = await fetch(
        `${getApiUrl()}/api/documents/my/${documentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch document."
        );
      }

      const document = data.document;

      if (!document?.cloudinaryUrl) {
        throw new Error(
          "Document URL is not available."
        );
      }

      const link =
        window.document.createElement("a");

      link.href = document.cloudinaryUrl;

      link.target = "_blank";

      link.rel = "noopener noreferrer";

      link.download =
        document.fileName || "document";

      window.document.body.appendChild(link);

      link.click();

      window.document.body.removeChild(link);
    } catch (error) {
      console.error(
        "Download document error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to download document."
      );
    }
  };

  /*
  =========================================================
  DELETE DOCUMENT
  =========================================================
  */

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login to delete your document."
        );
      }

      setDeletingDocumentId(documentId);

      const response = await fetch(
        `${getApiUrl()}/api/documents/my/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete document."
        );
      }

      setDocumentList((prev) =>
        prev.filter(
          (document) =>
            document._id !== documentId
        )
      );

      setSuccessMessage(
        data.message ||
          "Document deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete document error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to delete document."
      );
    } finally {
      setDeletingDocumentId(null);
    }
  };

  /*
  =========================================================
  FILE CHANGE
  =========================================================
  */

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);

    clearMessages();
  };

  /*
  =========================================================
  CLOSE UPLOAD MODAL
  =========================================================
  */

  const closeUploadModal = () => {
    if (isUploading) {
      return;
    }

    setIsUploadOpen(false);

    setSelectedFile(null);

    setSelectedDocumentType("");

    clearMessages();
  };

  /*
  =========================================================
  UPLOAD DOCUMENT
  =========================================================
  */

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage(
        "Please select a document first."
      );

      return;
    }

    if (!selectedDocumentType) {
      setErrorMessage(
        "Please select a document type."
      );

      return;
    }

    try {
      setIsUploading(true);

      clearMessages();

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login before uploading a document."
        );
      }

      const requestData = new FormData();

      requestData.append(
        "documents",
        selectedFile
      );

      requestData.append(
        "documentTypes",
        JSON.stringify([
          selectedDocumentType,
        ])
      );

      const response = await fetch(
        `${getApiUrl()}/api/documents/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: requestData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Document upload failed."
        );
      }

      setSuccessMessage(
        data.message ||
          "Document uploaded successfully."
      );

      setSelectedFile(null);

      setSelectedDocumentType("");

      setIsUploadOpen(false);

      await fetchDocuments();
    } catch (error) {
      console.error(
        "Upload document error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Document upload failed."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 sm:py-16">
      {/* Background Decoration */}

      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-xl">
              <FolderOpen className="h-4 w-4" />

              Document Center
            </div>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              My{" "}
              <span className="text-blue-600">
                Documents
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Upload, manage and securely access all
              documents related to your insurance claims.
            </p>
          </div>

          {/* Upload Button */}

          <motion.button
            type="button"
            onClick={() => {
              clearMessages();
              setIsUploadOpen(true);
            }}
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
          >
            <Upload className="h-5 w-5" />

            Upload Document
          </motion.button>
        </motion.div>

        {/* ================= MESSAGES ================= */}

        {errorMessage && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
            {successMessage}
          </div>
        )}

        {/* ================= STATS ================= */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Total */}

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Documents
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {documentList.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </motion.div>

          {/* Approved */}

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Approved Documents
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {approvedDocuments}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </motion.div>

          {/* Pending */}

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Verification
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {pendingDocuments}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ================= DOCUMENT SECTION ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
          className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-xl shadow-blue-900/5 backdrop-blur-xl"
        >
          {/* Top Section */}

          <div className="flex flex-col gap-5 border-b border-slate-200/70 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Uploaded Documents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage documents submitted for your insurance
                claims.
              </p>
            </div>

            {/* Search */}

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white/80 pl-11 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* ================= LOADING ================= */}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

              <p className="mt-5 text-sm font-medium text-slate-500">
                Loading your documents...
              </p>
            </div>
          ) : (
            <>
              {/* ================= DOCUMENT LIST ================= */}

              <div className="divide-y divide-slate-200/70">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map(
                    (document, index) => {
                      const Icon =
                        getDocumentIcon(
                          document.fileType
                        );

                      return (
                        <motion.div
                          key={document._id}
                          initial={{
                            opacity: 0,
                            x: -20,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: 0.4,
                            delay:
                              index * 0.05,
                          }}
                          className="group flex flex-col gap-5 p-6 transition-colors hover:bg-blue-50/40 lg:flex-row lg:items-center"
                        >
                          {/* File Icon */}

                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Icon className="h-7 w-7" />
                          </div>

                          {/* File Details */}

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold text-slate-900">
                              {document.fileName}
                            </h3>

                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                              <span>
                                {document.documentType}
                              </span>

                              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                              <span>
                                {document.query?.queryId ||
                                  "Standalone Document"}
                              </span>

                              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                              <span>
                                {formatDate(
                                  document.createdAt
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Size */}

                          <div className="text-sm text-slate-500 lg:w-20">
                            {formatFileSize(
                              document.fileSize
                            )}
                          </div>

                          {/* Status */}

                          <div className="lg:w-32">
                            {document.status ===
                            "approved" ? (
                              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />

                                Approved
                              </div>
                            ) : document.status ===
                              "rejected" ? (
                              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
                                <XCircle className="h-4 w-4" />

                                Rejected
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                                <Clock3 className="h-4 w-4" />

                                Pending
                              </div>
                            )}
                          </div>

                          {/* Actions */}

                          <div className="flex items-center gap-2">
                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                handleView(
                                  document._id
                                )
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              title="View Document"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* DOWNLOAD */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDownload(
                                  document._id
                                )
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              title="Download Document"
                            >
                              <Download className="h-4 w-4" />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  document._id
                                )
                              }
                              disabled={
                                deletingDocumentId ===
                                document._id
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Delete Document"
                            >
                              {deletingDocumentId ===
                              document._id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-red-500" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      );
                    }
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <FileText className="h-8 w-8" />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-slate-900">
                      No Documents Found
                    </h3>

                    <p className="mt-2 max-w-sm text-sm text-slate-500">
                      {searchQuery
                        ? "We couldn't find any documents matching your search."
                        : "You haven't uploaded any documents yet."}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* ================= UPLOAD MODAL ================= */}

      <AnimatePresence>
        {isUploadOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              transition={{
                duration: 0.25,
              }}
              className="w-full max-w-lg rounded-3xl border border-white/80 bg-white p-6 shadow-2xl sm:p-8"
            >
              {/* Modal Header */}

              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Upload Document
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Upload documents related to your insurance
                    claim.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={isUploading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Document Type */}

              <div className="mt-7">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Document Type
                </label>

                <select
                  value={selectedDocumentType}
                  onChange={(event) =>
                    setSelectedDocumentType(
                      event.target.value
                    )
                  }
                  disabled={isUploading}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <option value="">
                    Select document type
                  </option>

                  {documentTypes.map(
                    (documentType) => (
                      <option
                        key={documentType}
                        value={documentType}
                      >
                        {documentType}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Upload Area */}

              <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-6 py-12 text-center transition-all hover:border-blue-400 hover:bg-blue-50">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                  <Upload className="h-7 w-7" />
                </div>

                <h3 className="mt-5 font-semibold text-slate-900">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to upload your document"}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  PDF, JPG, JPEG or PNG files supported
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Maximum file size: 1 MB
                </p>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {/* Selected File */}

              {selectedFile && (
                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="h-5 w-5 shrink-0 text-blue-600" />

                    <div className="min-w-0">
                      <p className="max-w-[220px] truncate text-sm font-semibold text-slate-800">
                        {selectedFile.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {formatFileSize(
                          selectedFile.size
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFile(null)
                    }
                    disabled={isUploading}
                    className="text-sm font-medium text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Modal Error */}

              {errorMessage && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {errorMessage}
                </div>
              )}

              {/* Buttons */}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={isUploading}
                  className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={
                    !selectedFile ||
                    !selectedDocumentType ||
                    isUploading
                  }
                  className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading
                    ? "Uploading..."
                    : "Upload Document"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default MyDocuments;