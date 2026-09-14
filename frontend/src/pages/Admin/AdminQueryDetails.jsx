import { useEffect, useState } from "react";

import {
  useParams,
  Link,
  useLocation,
} from "react-router-dom";

import {
  ArrowLeft,
  ClipboardList,
  User,
  Mail,
  Phone,
  ShieldCheck,
  FileText,
  IndianRupee,
  CheckCircle2,
  Clock,
  UserCheck,
  Lock,
  Save,
  MessageSquare,
  Eye,
  AlertTriangle,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";

import { useAuth } from "../../context/AuthContext";

import {
  getAdminQueryById,
  updateQuery,
} from "../../api/queryApi";

import apiClient from "../../api/apiClient";

/* =========================================================
   STATUS OPTIONS

   EXACT BACKEND STATUS FLOW
========================================================= */

const statusOptions = [
  "Query Submitted",
  "Under Initial Review",
  "Document Review",
  "Claim Processing",
  "Resolution",
];

/* =========================================================
   STATUS STYLE
========================================================= */

function getStatusStyle(status) {
  const styles = {
    "Query Submitted":
      "border border-blue-200 bg-blue-50 text-blue-700",

    "Under Initial Review":
      "border border-indigo-200 bg-indigo-50 text-indigo-700",

    "Document Review":
      "border border-amber-200 bg-amber-50 text-amber-700",

    "Claim Processing":
      "border border-orange-200 bg-orange-50 text-orange-700",

    Resolution:
      "border border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    styles[status] ||
    "border border-slate-200 bg-slate-100 text-slate-600"
  );
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   FORMAT DATE + TIME
========================================================= */

function formatDateTime(date) {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* =========================================================
   FORMAT CLAIM AMOUNT
========================================================= */

function formatAmount(amount) {
  if (
    amount === null ||
    amount === undefined ||
    amount === ""
  ) {
    return "N/A";
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return String(amount);
  }

  return numericAmount.toLocaleString("en-IN");
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {
  if (!name) {
    return "U";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* =========================================================
   DOCUMENT TYPE
========================================================= */

function getDocumentType(document) {
  if (document?.documentType) {
    return document.documentType;
  }

  if (document?.fileType) {
    return document.fileType;
  }

  return "Document";
}

/* =========================================================
   ADMIN QUERY DETAILS
========================================================= */

function AdminQueryDetails() {
  const { id } = useParams();

  const location = useLocation();

  const { user } = useAuth();

  /* =======================================================
     BACK NAVIGATION
  ======================================================= */

  const fromAssignedQueries =
    location.state?.fromAssignedQueries === true;

  const backPath =
    location.state?.from ||
    "/admin/queries";

  /* =======================================================
     QUERY STATE
  ======================================================= */

  const [query, setQuery] = useState(null);

  const [documents, setDocuments] = useState([]);

  const [canManage, setCanManage] =
    useState(false);

  /* =======================================================
     LOADING / ERROR
  ======================================================= */

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  /* =======================================================
     MANAGEMENT STATE
  ======================================================= */

  const [status, setStatus] = useState("");

  const [adminNote, setAdminNote] =
    useState("");

  const [savedStatus, setSavedStatus] =
    useState("");

  const [savedNote, setSavedNote] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  /* =======================================================
     DOCUMENT LOADING
  ======================================================= */

  const [isDocumentsLoading, setIsDocumentsLoading] =
    useState(false);

  /* =======================================================
     FETCH QUERY
  ======================================================= */

  const fetchQuery = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response =
        await getAdminQueryById(id);

      const fetchedQuery =
        response?.query || null;

      if (!fetchedQuery) {
        throw new Error(
          "Query information is not available."
        );
      }

      setQuery(fetchedQuery);

      setStatus(
        fetchedQuery.status || ""
      );

      setSavedStatus(
        fetchedQuery.status || ""
      );

      setAdminNote(
        fetchedQuery.adminNotes || ""
      );

      setSavedNote(
        fetchedQuery.adminNotes || ""
      );

      setCanManage(
        Boolean(
          response?.permissions?.canManage
        )
      );
    } catch (error) {
      console.error(
        "Fetch admin query details error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to fetch query details."
      );

      setQuery(null);
      setCanManage(false);
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================================================
     FETCH DOCUMENTS

     Backend admin document endpoint supports
     search by query ID.
  ======================================================= */

  const fetchDocuments = async () => {
    try {
      setIsDocumentsLoading(true);

      const response =
        await apiClient(
          `/api/documents/admin?search=${encodeURIComponent(
            id
          )}`,
          {
            method: "GET",
          }
        );

      setDocuments(
        response?.documents || []
      );
    } catch (error) {
      console.error(
        "Fetch query documents error:",
        error
      );

      setDocuments([]);
    } finally {
      setIsDocumentsLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setErrorMessage(
        "Query ID is missing."
      );
      return;
    }

    fetchQuery();
    fetchDocuments();
  }, [id]);

  /* =======================================================
     SAVE CHANGES
  ======================================================= */

  const handleSave = async () => {
    if (!canManage || isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      const response =
        await updateQuery(id, {
          status,
          adminNotes: adminNote,
        });

      const updatedQuery =
        response?.query || null;

      if (updatedQuery) {
        setQuery(updatedQuery);

        setStatus(
          updatedQuery.status || ""
        );

        setSavedStatus(
          updatedQuery.status || ""
        );

        setAdminNote(
          updatedQuery.adminNotes || ""
        );

        setSavedNote(
          updatedQuery.adminNotes || ""
        );
      } else {
        setSavedStatus(status);
        setSavedNote(adminNote);

        await fetchQuery();
      }
    } catch (error) {
      console.error(
        "Update admin query error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to update query."
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     VIEW DOCUMENT
  ======================================================= */

  const handleViewDocument = async (
    documentId
  ) => {
    try {
      const response =
        await apiClient(
          `/api/documents/admin/${encodeURIComponent(
            documentId
          )}`,
          {
            method: "GET",
          }
        );

      const document =
        response?.document;

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
          "Unable to open document."
      );
    }
  };

  /* =======================================================
     NOT FOUND / ERROR
  ======================================================= */

  if (!isLoading && !query) {
    return (
      <AdminLayout role={user?.role}>
        <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500">
            <AlertTriangle className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Query Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {errorMessage ||
              "The requested query does not exist."}
          </p>

          <Link
            to={backPath}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        </div>
      </AdminLayout>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <AdminLayout role={user?.role}>
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
            <Clock className="h-5 w-5 animate-spin" />
            Loading query details...
          </div>
        </div>
      </AdminLayout>
    );
  }

  /* =======================================================
     SAFE DATA
  ======================================================= */

  const personalDetails =
    query.personalDetails || {};

  const address =
    query.address || {};

  const insuranceDetails =
    query.insuranceDetails || {};

  const claimDetails =
    query.claimDetails || {};

  const queryDetails =
    query.queryDetails || {};

  const assignedAdmin =
    query.assignedAdmin || null;

  const timeline =
    Array.isArray(query.timeline)
      ? query.timeline
      : [];

  const userDetails =
    query.user || {
      name:
        personalDetails.fullName ||
        "Unknown User",
      email:
        personalDetails.email ||
        "N/A",
      phone:
        personalDetails.phone ||
        "N/A",
    };

  const displayInsuranceType =
    insuranceDetails.insuranceType ||
    "N/A";

  const displayAmount =
    formatAmount(
      claimDetails.claimAmount
    );

  return (
    <AdminLayout role={user?.role}>
      <div className="mx-auto w-full max-w-7xl">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <Link
          to={backPath}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />

          {fromAssignedQueries
            ? "Back to My Assigned Queries"
            : "Back to All Queries"}
        </Link>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">

            {/* LEFT */}

            <div className="flex gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                <ClipboardList className="h-7 w-7" />
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    {query.queryId}
                  </h1>

                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Submitted on{" "}
                  {formatDate(
                    query.createdAt
                  )}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">

                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                      savedStatus
                    )}`}
                  >
                    {savedStatus || "N/A"}
                  </span>

                  {assignedAdmin ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      <UserCheck className="h-3.5 w-3.5" />

                      Assigned to{" "}
                      {assignedAdmin.name}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                      <Clock className="h-3.5 w-3.5" />

                      Not Assigned
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ACCESS */}

            <div
              className={`rounded-2xl border p-4 ${
                canManage
                  ? "border-blue-100 bg-blue-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    canManage
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {canManage ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Your Access
                  </p>

                  <p
                    className={`mt-1 text-sm font-bold ${
                      canManage
                        ? "text-blue-700"
                        : "text-slate-600"
                    }`}
                  >
                    {canManage
                      ? "Manage Access"
                      : "View Only"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            VIEW ONLY ALERT
        ================================================= */}

        {!canManage && (
          <div className="mb-6 flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Eye className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-amber-800">
                View Only Access
              </h3>

              <p className="mt-1 text-sm leading-6 text-amber-700">
                This query is not assigned to you.
                You can view all query information,
                but you cannot update the status or
                add management notes.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            GRID
        ================================================= */}

        <div className="grid gap-6 xl:grid-cols-3">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="space-y-6 xl:col-span-2">

            {/* QUERY DETAILS */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ClipboardList className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Query Details
                  </h2>

                  <p className="text-xs text-slate-500">
                    Complete information about the claim
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Insurance Type
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
                    {displayInsuranceType}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Claim Amount
                  </p>

                  <div className="mt-2 flex items-center gap-1">
                    <IndianRupee className="h-4 w-4 text-slate-500" />

                    <p className="font-bold text-slate-900">
                      {displayAmount}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Issue Type
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
                    {claimDetails.issueType ||
                      "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Claim Number
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
                    {claimDetails.claimNumber ||
                      "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Issue Date
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
                    {formatDate(
                      claimDetails.issueDate
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Issue Description
                </p>

                <p className="mt-3 leading-7 text-slate-600">
                  {queryDetails.issueDescription ||
                    "N/A"}
                </p>
              </div>

              {queryDetails.additionalDetails && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Additional Details
                  </p>

                  <p className="mt-3 leading-7 text-slate-600">
                    {queryDetails.additionalDetails}
                  </p>
                </div>
              )}
            </div>

            {/* POLICY INFORMATION */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Policy Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Insurance policy details
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Policy Number
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {insuranceDetails.policyNumber ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Insurance Company
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {insuranceDetails.insuranceCompany ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Insurance Type
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {displayInsuranceType}
                  </p>
                </div>
              </div>
            </div>

            {/* ADDRESS */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <ClipboardList className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Address Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Claimant address details
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Address Line 1
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {address.addressLine1 ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Address Line 2
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {address.addressLine2 ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Landmark
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {address.landmark ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    City
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {address.city || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    State
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {address.state || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Pincode
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {address.pincode || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* DOCUMENTS */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Submitted Documents
                  </h2>

                  <p className="text-xs text-slate-500">
                    Documents uploaded with this query
                  </p>
                </div>
              </div>

              {isDocumentsLoading ? (
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-5 text-sm font-medium text-slate-500">
                  <Clock className="h-4 w-4 animate-spin" />
                  Loading documents...
                </div>
              ) : documents.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                  No documents found for this query.
                </div>
              ) : (
                <div className="space-y-3">

                  {documents.map(
                    (document) => (
                      <div
                        key={
                          document._id
                        }
                        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
                            <FileText className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-slate-800">
                              {document.fileName ||
                                "Unnamed Document"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {getDocumentType(
                                document
                              )}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleViewDocument(
                              document._id
                            )
                          }
                          className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
                        >
                          View
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* TIMELINE */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-7 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Clock className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Query Timeline
                  </h2>

                  <p className="text-xs text-slate-500">
                    Activity and status history
                  </p>
                </div>
              </div>

              {timeline.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                  No timeline activity available.
                </div>
              ) : (
                <div className="space-y-6">

                  {timeline.map(
                    (item, index) => (
                      <div
                        key={`${item._id || index}`}
                        className="relative flex gap-4"
                      >
                        {index !==
                          timeline.length - 1 && (
                          <div className="absolute left-5 top-10 h-[calc(100%-10px)] w-px bg-slate-200" />
                        )}

                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">

                          {index ===
                          timeline.length - 1 ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>

                        <div className="pb-2">

                          <div className="flex flex-wrap items-center gap-3">

                            <h3 className="text-sm font-bold text-slate-800">
                              {item.status ||
                                "Status Update"}
                            </h3>

                            <span className="text-xs text-slate-400">
                              {formatDateTime(
                                item.updatedAt
                              )}
                            </span>
                          </div>

                          {item.updatedBy && (
                            <p className="mt-1 text-xs font-medium text-slate-400">
                              Updated by{" "}
                              {item.updatedBy.name ||
                                item.updatedBy.email ||
                                "Admin"}
                            </p>
                          )}

                          {item.note && (
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                              {item.note}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <div className="space-y-6">

            {/* USER INFORMATION */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <User className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    User Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Claim owner details
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-lg font-bold text-white shadow-md">
                  {getInitials(
                    userDetails.name
                  )}
                </div>

                <div>

                  <p className="font-bold text-slate-900">
                    {userDetails.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Policy Holder
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">

                <div className="flex items-start gap-3">

                  <Mail className="mt-0.5 h-4 w-4 text-slate-400" />

                  <div className="min-w-0">

                    <p className="text-xs text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-slate-700">
                      {userDetails.email ||
                        "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">

                  <Phone className="mt-0.5 h-4 w-4 text-slate-400" />

                  <div>

                    <p className="text-xs text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {userDetails.phone ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ADMIN MANAGEMENT */}

            <div
              className={`rounded-3xl border p-6 shadow-sm ${
                canManage
                  ? "border-blue-200 bg-white"
                  : "border-slate-200 bg-slate-50"
              }`}
            >

              <div className="flex items-center gap-3">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    canManage
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {canManage ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Admin Management
                  </h2>

                  <p className="text-xs text-slate-500">
                    Query management controls
                  </p>
                </div>
              </div>

              {/* VIEW ONLY */}

              {!canManage ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">

                  <div className="flex items-start gap-3">

                    <Lock className="mt-0.5 h-4 w-4 text-slate-400" />

                    <div>

                      <p className="text-sm font-bold text-slate-700">
                        View Only
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Only the assigned Secondary
                        Admin or Main Admin can manage
                        this query.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* STATUS */}

                  <div className="mt-6">

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Update Progress
                    </label>

                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target.value
                        )
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    >
                      {statusOptions.map(
                        (statusOption) => (
                          <option
                            key={
                              statusOption
                            }
                            value={
                              statusOption
                            }
                          >
                            {statusOption}
                          </option>
                        )
                      )}
                    </select>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      This progress status follows
                      the same 5-step claim flow shown
                      to the user.
                    </p>
                  </div>

                  {/* NOTE */}

                  <div className="mt-5">

                    <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">

                      <MessageSquare className="h-3.5 w-3.5" />

                      Admin Note
                    </label>

                    <textarea
                      value={adminNote}
                      onChange={(event) =>
                        setAdminNote(
                          event.target.value
                        )
                      }
                      placeholder="Add a note about this query..."
                      rows={5}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  {/* SAVE */}

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>

                  {/* SAVED STATUS */}

                  <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                    <div className="flex items-start gap-3">

                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                      <div>

                        <p className="text-xs font-bold text-blue-700">
                          Current Saved Progress
                        </p>

                        <p className="mt-2 text-sm font-semibold text-blue-900">
                          {savedStatus ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SAVED NOTE */}

                  {savedNote && (
                    <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

                      <div className="flex items-start gap-3">

                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                        <div>

                          <p className="text-xs font-bold text-emerald-700">
                            Saved Admin Note
                          </p>

                          <p className="mt-2 text-sm leading-6 text-emerald-800">
                            {savedNote}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ASSIGNED ADMIN */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assigned Admin
              </p>

              <div className="mt-4">

                {assignedAdmin ? (
                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-md">
                      {getInitials(
                        assignedAdmin.name
                      )}
                    </div>

                    <div>

                      <p className="text-sm font-bold text-slate-900">
                        {assignedAdmin.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {assignedAdmin.role ===
                        "main_admin"
                          ? "Main Admin"
                          : "Secondary Admin"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <Clock className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Not Assigned
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        No admin is currently assigned.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CURRENT ADMIN */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Admin
              </p>

              <div className="mt-4 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-md">
                  {getInitials(
                    user?.name
                  )}
                </div>

                <div>

                  <p className="text-sm font-bold text-slate-900">
                    {user?.name ||
                      "Current Admin"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {user?.role ===
                    "main_admin"
                      ? "Main Admin"
                      : "Secondary Admin"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminQueryDetails;