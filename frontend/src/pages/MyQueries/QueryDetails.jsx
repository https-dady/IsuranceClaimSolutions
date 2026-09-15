import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  Upload,
  FileCheck2,
  ShieldCheck,
  MessageSquare,
  Phone,
  Download,
  Eye,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getMyQueryById } from "../../api/queryApi";
import {
  getMyQueryDocuments,
  uploadDocuments,
} from "../../api/documentApi";
import { useAuth } from "../../context/AuthContext";

const statusConfig = {
  "Query Submitted": {
    icon: "bg-blue-600",
    line: "bg-blue-500",
    text: "text-blue-600",
    date: "text-blue-600",
    ring: "border-blue-100",
    dot: "bg-blue-600",
    pendingBorder: "border-blue-200",
    pendingBg: "bg-blue-50",
    pendingIcon: "text-blue-300",
  },

  "Under Initial Review": {
    icon: "bg-indigo-600",
    line: "bg-indigo-500",
    text: "text-indigo-600",
    date: "text-indigo-600",
    ring: "border-indigo-100",
    dot: "bg-indigo-600",
    pendingBorder: "border-indigo-200",
    pendingBg: "bg-indigo-50",
    pendingIcon: "text-indigo-300",
  },

  "Document Review": {
    icon: "bg-amber-500",
    line: "bg-amber-400",
    text: "text-amber-600",
    date: "text-amber-600",
    ring: "border-amber-100",
    dot: "bg-amber-500",
    pendingBorder: "border-amber-200",
    pendingBg: "bg-amber-50",
    pendingIcon: "text-amber-300",
  },

  "Claim Processing": {
    icon: "bg-orange-500",
    line: "bg-orange-400",
    text: "text-orange-600",
    date: "text-orange-600",
    ring: "border-orange-100",
    dot: "bg-orange-500",
    pendingBorder: "border-orange-200",
    pendingBg: "bg-orange-50",
    pendingIcon: "text-orange-300",
  },

  Resolution: {
    icon: "bg-emerald-600",
    line: "bg-emerald-500",
    text: "text-emerald-600",
    date: "text-emerald-600",
    ring: "border-emerald-100",
    dot: "bg-emerald-600",
    pendingBorder: "border-emerald-200",
    pendingBg: "bg-emerald-50",
    pendingIcon: "text-emerald-300",
  },
};

const statusOrder = [
  "Query Submitted",
  "Under Initial Review",
  "Document Review",
  "Claim Processing",
  "Resolution",
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
    },
  },
};

function QueryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [query, setQuery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [queryDocuments, setQueryDocuments] = useState([]);
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(true);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [documentError, setDocumentError] = useState("");
  const [documentSuccess, setDocumentSuccess] = useState("");

  /*
  =========================================================
  FETCH QUERY DETAILS
  =========================================================
  */

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchQuery = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getMyQueryById(id);

        if (!response?.query) {
          throw new Error("Query details could not be found.");
        }

        setQuery(response.query);
      } catch (err) {
        console.error("Failed to fetch query details:", err);

        if (err?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err?.message ||
            "Unable to load query details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuery();
  }, [id, isAuthenticated, navigate]);

  /*
  =========================================================
  FETCH QUERY DOCUMENTS
  =========================================================
  */

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchQueryDocuments = async () => {
      try {
        setIsDocumentsLoading(true);
        setDocumentError("");

        const response = await getMyQueryDocuments(id);

        setQueryDocuments(
          Array.isArray(response?.documents)
            ? response.documents
            : []
        );
      } catch (err) {
        console.error(
          "Failed to fetch query documents:",
          err
        );

        if (err?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        setDocumentError(
          err?.message ||
            "Unable to load query documents."
        );
      } finally {
        setIsDocumentsLoading(false);
      }
    };

    fetchQueryDocuments();
  }, [id, isAuthenticated, navigate]);

  /*
  =========================================================
  DOCUMENT UPLOAD MODAL
  =========================================================
  */

  const openUpload = () => {
    setSelectedFile(null);
    setDocumentType("");
    setDocumentError("");
    setDocumentSuccess("");
    setIsUploadOpen(true);
  };

  const closeUpload = () => {
    if (isUploading) {
      return;
    }

    setIsUploadOpen(false);
    setSelectedFile(null);
    setDocumentType("");
    setDocumentError("");
    setDocumentSuccess("");
  };

  /*
  =========================================================
  FILE SELECTION
  =========================================================
  */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setDocumentError("");
    setDocumentSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);

      setDocumentError(
        "Only PDF, JPG, JPEG, and PNG files are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setSelectedFile(null);

      setDocumentError(
        "File size must be 1 MB or less."
      );

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  /*
  =========================================================
  UPLOAD DOCUMENT
  =========================================================
  */

  const handleDocumentUpload = async (event) => {
    event.preventDefault();

    setDocumentError("");
    setDocumentSuccess("");

    if (!selectedFile) {
      setDocumentError("Please select a document.");
      return;
    }

    if (!documentType) {
      setDocumentError("Please select a document type.");
      return;
    }

    try {
      setIsUploading(true);

      const response = await uploadDocuments({
        files: [selectedFile],
        documentTypes: [documentType],
        queryId: id,
      });

      const uploadedDocuments = Array.isArray(
        response?.documents
      )
        ? response.documents
        : [];

      if (uploadedDocuments.length > 0) {
        setQueryDocuments((currentDocuments) => [
          ...uploadedDocuments,
          ...currentDocuments,
        ]);
      } else {
        const documentsResponse =
          await getMyQueryDocuments(id);

        setQueryDocuments(
          Array.isArray(documentsResponse?.documents)
            ? documentsResponse.documents
            : []
        );
      }

      setDocumentSuccess(
        "Document uploaded successfully."
      );

      setSelectedFile(null);
      setDocumentType("");
    } catch (err) {
      console.error(
        "Failed to upload document:",
        err
      );

      if (err?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      setDocumentError(
        err?.message ||
          "Unable to upload document. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  /*
  =========================================================
  CONTACT SUPPORT
  =========================================================
  */

  const handleContactSupport = () => {
    const footer = document.querySelector("footer");

    if (footer) {
      footer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /*
  =========================================================
  DATE FORMATTER
  =========================================================
  */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  /*
  =========================================================
  DATE + TIME FORMATTER
  =========================================================
  */

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return {
        date: "—",
        time: "",
      };
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return {
        date: "—",
        time: "",
      };
    }

    return {
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  /*
  =========================================================
  GET STATUS CONFIG
  =========================================================
  */

  const getStatusConfig = (status) => {
    return (
      statusConfig[status] ||
      statusConfig["Query Submitted"]
    );
  };

  /*
  =========================================================
  BUILD PROGRESS
  =========================================================
  */

  const buildProgress = () => {
    if (!query) {
      return [];
    }

    const currentIndex = statusOrder.indexOf(
      query.status
    );

    const timelineMap = new Map();

    if (Array.isArray(query.timeline)) {
      query.timeline.forEach((item) => {
        if (!item?.status) {
          return;
        }

        timelineMap.set(item.status, item);
      });
    }

    return statusOrder.map((status, index) => {
      const timelineItem = timelineMap.get(status);

      const completed =
        currentIndex >= 0 &&
        index < currentIndex;

      const current =
        currentIndex >= 0 &&
        index === currentIndex;

      const config = getStatusConfig(status);

      let date = "Pending";

      if (timelineItem?.updatedAt) {
        date = formatDate(timelineItem.updatedAt);
      } else if (completed || current) {
        if (index === 0 && query.createdAt) {
          date = formatDate(query.createdAt);
        } else {
          date = "Updated";
        }
      }

      let description =
        "This stage has not been reached yet.";

      if (status === "Query Submitted") {
        description =
          "Your query has been successfully submitted.";
      }

      if (status === "Under Initial Review") {
        description =
          "Our team is reviewing your claim details and submitted information.";
      }

      if (status === "Document Review") {
        description =
          "Required documents and claim information are being reviewed.";
      }

      if (status === "Claim Processing") {
        description =
          "Your claim is being processed by our team.";
      }

      if (status === "Resolution") {
        description =
          "The final update and resolution of your claim will be provided.";
      }

      if (timelineItem?.note) {
        description = timelineItem.note;
      }

      return {
        title: status,
        description,
        date,
        completed,
        current,
        colors: config,
      };
    });
  };

  /*
  =========================================================
  BUILD UPDATES
  =========================================================
  */

  const buildUpdates = () => {
    if (!query) {
      return [];
    }

    if (
      !Array.isArray(query.timeline) ||
      query.timeline.length === 0
    ) {
      return [];
    }

    return [...query.timeline]
      .sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() -
          new Date(b.updatedAt).getTime()
      )
      .reverse()
      .map((item) => {
        const dateTime = formatDateTime(
          item.updatedAt
        );

        const isCurrent =
          item.status === query.status;

        const description =
          item.note ||
          getTimelineDescription(item.status);

        return {
          title: getTimelineTitle(item.status),
          description,
          date: dateTime.date,
          time: dateTime.time,
          type: isCurrent
            ? "current"
            : item.status === "Query Submitted"
            ? "success"
            : "review",
        };
      });
  };

  /*
  =========================================================
  TIMELINE TITLE
  =========================================================
  */

  const getTimelineTitle = (status) => {
    switch (status) {
      case "Query Submitted":
        return "Your query has been submitted successfully";

      case "Under Initial Review":
        return "Query is under initial review";

      case "Document Review":
        return "Documents are being reviewed";

      case "Claim Processing":
        return "Claim processing has started";

      case "Resolution":
        return "Your query has reached resolution";

      default:
        return status || "Query updated";
    }
  };

  /*
  =========================================================
  TIMELINE DESCRIPTION
  =========================================================
  */

  const getTimelineDescription = (status) => {
    switch (status) {
      case "Query Submitted":
        return "We have received your insurance claim details. Our team will review your information shortly.";

      case "Under Initial Review":
        return "Our team is reviewing your submitted claim information.";

      case "Document Review":
        return "Our team is reviewing the submitted documents and claim details.";

      case "Claim Processing":
        return "Our claims team is processing the claim and taking the required action.";

      case "Resolution":
        return "The claim query has reached its final resolution.";

      default:
        return "Your query has been updated.";
    }
  };

  /*
  =========================================================
  LOADING
  =========================================================
  */

  if (isLoading) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="pointer-events-none absolute -left-32 top-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />

          <p className="font-medium text-slate-600">
            Loading query details...
          </p>
        </div>
      </section>
    );
  }

  /*
  =========================================================
  ERROR
  =========================================================
  */

  if (error || !query) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
        <div className="pointer-events-none absolute -left-32 top-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/80 bg-white/75 p-8 text-center shadow-xl shadow-blue-900/5 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Query Not Found
          </h2>

          <p className="mt-3 text-slate-600">
            {error ||
              "We could not find this query."}
          </p>

          <Link
            to="/my-queries"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to My Queries
          </Link>
        </div>
      </section>
    );
  }

  const progress = buildProgress();
  const updates = buildUpdates();

  const status = getStatusConfig(query.status);

  const latestUpdate =
    updates.length > 0
      ? updates[0]
      : null;

  const insuranceType =
    query.insuranceDetails?.insuranceType ||
    "—";

  const insuranceCompany =
    query.insuranceDetails?.insuranceCompany ||
    "—";

  const policyNumber =
    query.insuranceDetails?.policyNumber ||
    "—";

  const claimNumber =
    query.claimDetails?.claimNumber ||
    "—";

  const claimAmount =
    query.claimDetails?.claimAmount;

  const issueType =
    query.claimDetails?.issueType ||
    "—";

  const description =
    query.queryDetails?.issueDescription ||
    "No query description provided.";

  const additionalDetails =
    query.queryDetails?.additionalDetails ||
    "";

  /*
  =========================================================
  PAGE
  =========================================================
  */

  return (
    <>
      <section className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ================= BACK BUTTON ================= */}

          <motion.div
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
            }}
            className="mb-8"
          >
            <Link
              to="/my-queries"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300 group-hover:-translate-x-1 group-hover:border-blue-200">
                <ArrowLeft className="h-4 w-4" />
              </span>

              Back to My Queries
            </Link>
          </motion.div>

          {/* ================= HEADER ================= */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center"
          >
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold tracking-wide text-blue-600">
                  QUERY DETAILS
                </span>

                <span className="text-sm font-medium text-slate-500">
                  {query.queryId}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Your Claim{" "}
                <span className="text-blue-600">
                  Journey
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-slate-600">
                Track your claim progress, view updates, manage
                documents, and stay informed throughout the entire
                process.
              </p>
            </div>

            {/* STATUS */}

            <div className="flex items-center gap-3 rounded-2xl border border-blue-200/70 bg-blue-50/70 px-5 py-4 shadow-sm backdrop-blur-xl">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${status.icon}`}
              >
                {query.status === "Resolution" ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Current Status
                </p>

                <p className="font-bold text-slate-800">
                  {query.status}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ================= LATEST UPDATE ================= */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 0.1,
            }}
            className="relative mb-10 overflow-hidden rounded-3xl border border-white/80 bg-white/65 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8"
          >
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/25">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Latest Update
                </p>

                <h2 className="text-xl font-bold text-slate-900">
                  {latestUpdate?.title ||
                    getTimelineTitle(query.status)}
                </h2>

                <p className="mt-2 leading-relaxed text-slate-600">
                  {latestUpdate?.description ||
                    getTimelineDescription(query.status)}
                </p>
              </div>

              <div className="text-sm text-slate-500">
                Updated on{" "}
                <span className="font-semibold text-slate-700">
                  {formatDate(
                    query.updatedAt ||
                      query.createdAt
                  )}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ================= MAIN GRID ================= */}

          <div className="grid gap-8 xl:grid-cols-[1.6fr_1fr]">

            {/* ================= LEFT SIDE ================= */}

            <div className="space-y-8">

              {/* ================= PROGRESS TRACKER ================= */}

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8"
              >
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Claim Progress
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Track where your claim currently stands.
                    </p>
                  </div>

                  <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-blue-50 sm:flex">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                  </div>
                </div>

                <div className="relative">
                  {progress.map((step, index) => {
                    const isLast =
                      index === progress.length - 1;

                    return (
                      <div
                        key={step.title}
                        className="relative flex gap-5 pb-10 last:pb-0"
                      >
                        {!isLast && (
                          <div
                            className={`absolute left-5 top-11 h-[calc(100%-20px)] w-0.5 transition-colors duration-500 ${
                              step.completed
                                ? step.colors.line
                                : step.current
                                ? "bg-gradient-to-b from-amber-400 to-slate-200"
                                : "bg-slate-200"
                            }`}
                          />
                        )}

                        <div className="relative z-10">
                          {step.completed ? (
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ${step.colors.icon}`}
                            >
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            </div>
                          ) : step.current ? (
                            <div
                              className={`relative flex h-10 w-10 items-center justify-center rounded-full border-4 bg-white shadow-md ${step.colors.ring}`}
                            >
                              <span
                                className={`absolute inset-0 animate-ping rounded-full opacity-20 ${step.colors.dot}`}
                              />

                              <div
                                className={`relative h-3 w-3 rounded-full ${step.colors.dot} animate-pulse`}
                              />
                            </div>
                          ) : (
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-all duration-300 ${step.colors.pendingBorder}`}
                            >
                              <Circle
                                className={`h-4 w-4 ${step.colors.pendingIcon}`}
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 pb-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <h3
                              className={`font-bold transition-colors duration-300 ${
                                step.completed ||
                                step.current
                                  ? step.colors.text
                                  : "text-slate-700"
                              }`}
                            >
                              {step.title}
                            </h3>

                            <span
                              className={`text-sm transition-colors duration-300 ${
                                step.completed ||
                                step.current
                                  ? `font-semibold ${step.colors.date}`
                                  : "text-slate-400"
                              }`}
                            >
                              {step.date}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* ================= UPDATES TIMELINE ================= */}

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Updates & Activity
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Stay informed about every important action on
                    your query.
                  </p>
                </div>

                {updates.length > 0 ? (
                  <div className="space-y-6">
                    {updates.map((update, index) => (
                      <div
                        key={`${update.title}-${index}`}
                        className="group relative rounded-2xl border border-slate-100 bg-white/60 p-5 transition-all duration-300 hover:border-blue-100 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5"
                      >
                        <div className="flex gap-4">
                          <div
                            className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              update.type === "current"
                                ? "bg-blue-600"
                                : update.type === "success"
                                ? "bg-emerald-100"
                                : "bg-blue-50"
                            }`}
                          >
                            {update.type === "current" ? (
                              <Clock className="h-5 w-5 text-white" />
                            ) : update.type === "success" ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <FileCheck2 className="h-5 w-5 text-blue-600" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <h3 className="font-bold text-slate-900">
                                {update.title}
                              </h3>

                              <span className="text-xs text-slate-400">
                                {update.date}
                                {update.time
                                  ? ` • ${update.time}`
                                  : ""}
                              </span>
                            </div>

                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                              {update.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-100 bg-white/60 p-6 text-center">
                    <Clock className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm text-slate-500">
                      No activity updates are available yet.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}

            <div className="space-y-8">

              {/* ================= CLAIM SUMMARY ================= */}

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                }}
                className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl"
              >
                <h2 className="mb-6 text-xl font-bold text-slate-900">
                  Query Summary
                </h2>

                <div className="space-y-5">
                  <SummaryItem
                    icon={ShieldCheck}
                    label="Insurance Type"
                    value={insuranceType}
                  />

                  <SummaryItem
                    icon={FileText}
                    label="Claim Type"
                    value={issueType}
                  />

                  <SummaryItem
                    icon={Building2}
                    label="Insurance Company"
                    value={insuranceCompany}
                  />

                  <SummaryItem
                    icon={FileText}
                    label="Policy Number"
                    value={policyNumber}
                  />

                  <SummaryItem
                    icon={FileText}
                    label="Claim Number"
                    value={claimNumber}
                  />

                  <SummaryItem
                    icon={Calendar}
                    label="Submitted On"
                    value={formatDate(
                      query.createdAt
                    )}
                  />

                  <SummaryItem
                    icon={Clock}
                    label="Last Updated"
                    value={formatDate(
                      query.updatedAt ||
                        query.createdAt
                    )}
                  />

                  {claimAmount !== undefined &&
                    claimAmount !== null && (
                      <SummaryItem
                        icon={FileText}
                        label="Claim Amount"
                        value={`₹${Number(
                          claimAmount
                        ).toLocaleString("en-IN")}`}
                      />
                    )}
                </div>
              </motion.div>

              {/* ================= DOCUMENTS ================= */}

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                }}
                className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Documents
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Document details will appear here after
                      document integration.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openUpload}
                    aria-label="Upload document"
                    className="rounded-lg p-1 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Upload className="h-5 w-5" />
                  </button>
                </div>

                {isDocumentsLoading ? (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-400" />

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      Loading documents...
                    </p>
                  </div>
                ) : queryDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {queryDocuments.map((document) => (
                      <div
                        key={document._id}
                        className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                          <FileText className="h-5 w-5 text-blue-500" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {document.fileName}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {document.documentType}
                          </p>
                        </div>

                        {document.cloudinaryUrl && (
                          <>
                            <a
                              href={document.cloudinaryUrl}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`View ${document.fileName}`}
                              className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-white hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                            </a>

                            <a
                              href={document.cloudinaryUrl}
                              download={document.fileName}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Download ${document.fileName}`}
                              className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-white hover:text-blue-700"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-center">
                    <FileText className="mx-auto h-8 w-8 text-blue-400" />

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      No documents uploaded yet.
                    </p>

                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      Use the upload icon above to add a document to this query.
                    </p>
                  </div>
                )}

                {documentError && (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {documentError}
                  </div>
                )}
              </motion.div>

              {/* ================= ASSIGNED ADMIN ================= */}

              {query.assignedAdmin && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                  }}
                  className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Assigned Specialist
                      </h2>

                      <p className="text-sm text-slate-500">
                        Your query is assigned to
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white/70 p-4">
                    <p className="font-semibold text-slate-900">
                      {query.assignedAdmin.name}
                    </p>

                    {query.assignedAdmin.email && (
                      <p className="mt-1 break-all text-sm text-slate-500">
                        {query.assignedAdmin.email}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ================= HELP CARD ================= */}

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-blue-700 p-6 text-white shadow-xl shadow-blue-900/20"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                <div className="relative">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl">
                    <Phone className="h-6 w-6" />
                  </div>

                  <h2 className="text-xl font-bold">
                    Need Help?
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-blue-100">
                    Have questions regarding your claim? Our
                    support team is here to assist you.
                  </p>

                  <button
                    type="button"
                    onClick={handleContactSupport}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-50"
                  >
                    Contact Support

                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ================= QUERY DESCRIPTION ================= */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
            className="mt-8 rounded-3xl border border-white/80 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Query Description
                </h2>

                <p className="text-sm text-slate-500">
                  Details submitted by you
                </p>
              </div>
            </div>

            <p className="leading-relaxed text-slate-600">
              {description}
            </p>

            {additionalDetails && (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Additional Details
                </p>

                <p className="text-sm leading-relaxed text-slate-600">
                  {additionalDetails}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          UPLOAD MODAL
          IMPORTANT:
          Kept OUTSIDE the Documents motion.div so it does not
          collapse/overlap with the Documents or Help card.
      ========================================================= */}

      {isUploadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-8 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-document-title"
            className="w-full max-w-md rounded-3xl border border-white/80 bg-white p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3
                  id="upload-document-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Upload Document
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add a document to this query.
                </p>
              </div>

              <button
                type="button"
                onClick={closeUpload}
                disabled={isUploading}
                aria-label="Close upload"
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-2xl leading-none">
                  ×
                </span>
              </button>
            </div>

            <form
              onSubmit={handleDocumentUpload}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="document-type"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Document Type
                </label>

                <select
                  id="document-type"
                  value={documentType}
                  onChange={(event) =>
                    setDocumentType(event.target.value)
                  }
                  disabled={isUploading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <option value="">
                    Select document type
                  </option>

                  <option value="Required Document">
                    Required Document
                  </option>

                  <option value="Supporting Document">
                    Supporting Document
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="query-document"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Select File
                </label>

                <input
                  id="query-document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-blue-50 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-blue-600 hover:file:bg-blue-100 disabled:cursor-not-allowed"
                />

                <p className="mt-2 text-xs text-slate-400">
                  PDF, JPG, JPEG or PNG • Maximum 1 MB
                </p>
              </div>

              {selectedFile && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="truncate text-sm font-medium text-blue-700">
                    {selectedFile.name}
                  </p>
                </div>
              )}

              {documentError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {documentError}
                </div>
              )}

              {documentSuccess && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                  {documentSuccess}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeUpload}
                  disabled={isUploading}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default QueryDetails;