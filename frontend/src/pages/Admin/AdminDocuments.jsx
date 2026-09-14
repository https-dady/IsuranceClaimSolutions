import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  Download,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";

const API_URL =
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

function AdminDocuments() {
  const [documents, setDocuments] = useState([]);

  const [stats, setStats] = useState({
    totalDocuments: 0,
    pendingDocuments: 0,
    approvedDocuments: 0,
    rejectedDocuments: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openingDocumentId, setOpeningDocumentId] = useState(null);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Please login as an admin to view documents."
        );
      }

      const params = new URLSearchParams();

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const queryString = params.toString();

      const response = await fetch(
        `${API_URL}/api/documents/admin${
          queryString ? `?${queryString}` : ""
        }`,
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
            "Failed to fetch admin documents."
        );
      }

      setDocuments(data.documents || []);

      setStats(
        data.stats || {
          totalDocuments: 0,
          pendingDocuments: 0,
          approvedDocuments: 0,
          rejectedDocuments: 0,
        }
      );
    } catch (error) {
      console.error(
        "Fetch admin documents error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to fetch admin documents."
      );

      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocuments();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
          <Clock3 className="h-3.5 w-3.5" />
          Pending
        </span>
      );
    }

    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Approved
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
          <XCircle className="h-3.5 w-3.5" />
          Rejected
        </span>
      );
    }

    return null;
  };

  const fetchDocumentById = async (documentId) => {
    const token = getToken();

    if (!token) {
      throw new Error(
        "Please login as an admin to view documents."
      );
    }

    const response = await fetch(
      `${API_URL}/api/documents/admin/${documentId}`,
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

    return data.document;
  };

  const handleView = async (documentId) => {
    try {
      setErrorMessage("");
      setOpeningDocumentId(documentId);

      const document =
        await fetchDocumentById(documentId);

      if (!document?.cloudinaryUrl) {
        throw new Error(
          "Document URL is not available."
        );
      }

      window.open(
        document.cloudinaryUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error(
        "View admin document error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to open document."
      );
    } finally {
      setOpeningDocumentId(null);
    }
  };

  const handleDownload = async (documentId) => {
    try {
      setErrorMessage("");
      setOpeningDocumentId(documentId);

      const document =
        await fetchDocumentById(documentId);

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
        "Download admin document error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to download document."
      );
    } finally {
      setOpeningDocumentId(null);
    }
  };

  return (
    <AdminLayout role="main_admin">
      {/* ================= PAGE HEADER ================= */}

      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          View and manage all uploaded documents
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Documents
        </h1>
      </div>

      {/* ================= ERROR ================= */}

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {errorMessage}
        </div>
      )}

      {/* ================= STATS ================= */}

      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Documents
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {stats.totalDocuments}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending Review
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {stats.pendingDocuments}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* APPROVED */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Approved
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {stats.approvedDocuments}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* REJECTED */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Rejected
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {stats.rejectedDocuments}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= DOCUMENT LIST ================= */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* TOP SECTION */}

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Documents
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review documents uploaded by users
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* SEARCH */}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 sm:w-64"
              />
            </div>

            {/* STATUS FILTER */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-500"
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>
        </div>

        {/* ================= TABLE ================= */}

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-16 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading documents...
              </p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Document
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Query
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Uploaded
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {documents.map((document) => (
                    <tr
                      key={document._id}
                      className="border-b border-slate-100 last:border-none transition hover:bg-slate-50/70"
                    >
                      {/* DOCUMENT */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FileText className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-xs truncate font-semibold text-slate-900">
                              {document.fileName}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {document.documentType}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* USER */}

                      <td className="px-6 py-5">
                        <div>
                          <span className="text-sm font-medium text-slate-700">
                            {document.user?.name ||
                              "N/A"}
                          </span>

                          {document.user?.email && (
                            <p className="mt-1 text-xs text-slate-400">
                              {document.user.email}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* QUERY */}

                      <td className="px-6 py-5">
                        {document.query?.queryId ? (
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {document.query.queryId}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                      {/* UPLOADED */}

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-600">
                          {formatDate(
                            document.createdAt
                          )}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">
                        {getStatusBadge(
                          document.status
                        )}
                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              handleView(
                                document._id
                              )
                            }
                            disabled={
                              openingDocumentId ===
                              document._id
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                            title="View Document"
                          >
                            {openingDocumentId ===
                            document._id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>

                          {/* DOWNLOAD */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDownload(
                                document._id
                              )
                            }
                            disabled={
                              openingDocumentId ===
                              document._id
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Download Document"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* EMPTY STATE */}

              {documents.length === 0 && (
                <div className="py-16 text-center">
                  <FileText className="mx-auto h-10 w-10 text-slate-300" />

                  <h3 className="mt-4 font-semibold text-slate-700">
                    No documents found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filter.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDocuments;