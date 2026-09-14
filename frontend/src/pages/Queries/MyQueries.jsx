import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Clock3,
  ChevronRight,
  SearchX,
  CalendarDays,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { getMyQueries } from "../../api/queryApi";
import { useAuth } from "../../context/AuthContext";

const statusStyles = {
  "Query Submitted": {
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-500",
  },

  "Under Initial Review": {
    badge: "bg-blue-50 text-blue-600 border-blue-100",
    dot: "bg-blue-500",
  },

  "Document Review": {
    badge: "bg-amber-50 text-amber-600 border-amber-100",
    dot: "bg-amber-500",
  },

  "Claim Processing": {
    badge: "bg-violet-50 text-violet-600 border-violet-100",
    dot: "bg-violet-500",
  },

  Resolution: {
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
    dot: "bg-emerald-500",
  },
};

function MyQueries() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  =========================================================
  FETCH MY QUERIES
  =========================================================
  */

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchQueries = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getMyQueries();

        setQueries(
          Array.isArray(response?.queries)
            ? response.queries
            : []
        );
      } catch (err) {
        console.error("Failed to fetch queries:", err);

        if (err?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err?.message ||
            "Unable to load your queries. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueries();
  }, [isAuthenticated, navigate]);

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
  ACTIVE QUERIES
  =========================================================
  */

  const activeQueries = queries.filter(
    (query) => query.status !== "Resolution"
  );

  /*
  =========================================================
  RECENT UPDATES
  =========================================================
  */

  const recentUpdates = queries.filter((query) => {
    if (!query.updatedAt) {
      return false;
    }

    const createdAt = new Date(query.createdAt);
    const updatedAt = new Date(query.updatedAt);

    if (
      Number.isNaN(createdAt.getTime()) ||
      Number.isNaN(updatedAt.getTime())
    ) {
      return false;
    }

    return updatedAt.getTime() > createdAt.getTime();
  });

  /*
  =========================================================
  LOADING STATE
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
            Loading your queries...
          </p>
        </div>
      </section>
    );
  }

  /*
  =========================================================
  ERROR STATE
  =========================================================
  */

  if (error) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
        <div className="pointer-events-none absolute -left-32 top-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/80 bg-white/75 p-8 text-center shadow-xl shadow-blue-900/5 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Unable to Load Queries
          </h2>

          <p className="mt-3 text-slate-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 sm:py-16">
      {/* ================= BACKGROUND DECORATIONS ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          {/* Left */}

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-xl">
              <FileText className="h-4 w-4" />

              MY QUERIES
            </div>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Your Claim{" "}
              <span className="text-blue-600">
                Queries
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-slate-600">
              Track your submitted insurance claim queries and
              stay updated with every step of the process.
            </p>
          </div>

          {/* New Query Button */}

          <Link to="/claims">
            <motion.div
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />

              New Query
            </motion.div>
          </Link>
        </motion.div>

        {/* ================= QUICK STATS ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="mb-10 grid gap-5 sm:grid-cols-3"
        >
          {/* Total */}

          <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-lg shadow-blue-900/5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Queries
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {queries.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Active */}

          <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-lg shadow-blue-900/5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active Queries
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {activeQueries.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Clock3 className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Updates */}

          <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-lg shadow-blue-900/5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Recent Updates
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {recentUpdates.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= QUERIES SECTION ================= */}

        {queries.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="rounded-3xl border border-white/80 bg-white/65 p-5 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-7"
          >
            {/* Section Header */}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  All Queries
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage and track your submitted queries.
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600">
                {queries.length} Total
              </span>
            </div>

            {/* ================= QUERY LIST ================= */}

            <div className="space-y-4">
              <AnimatePresence>
                {queries.map((query, index) => {
                  const style =
                    statusStyles[query.status] ||
                    statusStyles["Query Submitted"];

                  const queryTitle =
                    query.queryDetails?.issueDescription ||
                    "Insurance Claim Query";

                  const insuranceType =
                    query.insuranceDetails?.insuranceType ||
                    "Insurance Query";

                  return (
                    <motion.div
                      key={query.queryId}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.08,
                      }}
                    >
                      <Link
                        to={`/my-queries/${query.queryId}`}
                        className="group block"
                      >
                        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 sm:p-6">
                          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            {/* Query Info */}

                            <div className="flex min-w-0 gap-4">
                              {/* Icon */}

                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-105">
                                <FileText className="h-6 w-6" />
                              </div>

                              {/* Content */}

                              <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold tracking-wide text-slate-600">
                                    {query.queryId}
                                  </span>

                                  <span
                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                                    />

                                    {query.status}
                                  </span>
                                </div>

                                <h3 className="max-w-2xl truncate text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 sm:text-xl">
                                  {queryTitle}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                  {insuranceType}
                                </p>
                              </div>
                            </div>

                            {/* Dates + View */}

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                              {/* Dates */}

                              <div className="flex gap-5 text-sm text-slate-500">
                                {/* Submitted */}

                                <div className="flex items-start gap-2">
                                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                                  <div>
                                    <p className="text-xs text-slate-400">
                                      Submitted
                                    </p>

                                    <p className="mt-0.5 whitespace-nowrap font-medium text-slate-600">
                                      {formatDate(
                                        query.createdAt
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {/* Updated */}

                                <div className="hidden items-start gap-2 md:flex">
                                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                                  <div>
                                    <p className="text-xs text-slate-400">
                                      Updated
                                    </p>

                                    <p className="mt-0.5 whitespace-nowrap font-medium text-slate-600">
                                      {formatDate(
                                        query.updatedAt ||
                                          query.createdAt
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Arrow */}

                              <div className="flex h-10 w-10 items-center justify-center self-end rounded-xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white sm:self-auto">
                                <ChevronRight className="h-5 w-5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {queries.length === 0 && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="rounded-3xl border border-white/80 bg-white/70 px-6 py-16 text-center shadow-xl shadow-blue-900/5 backdrop-blur-xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <SearchX className="h-8 w-8" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No Queries Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-600">
              You haven't submitted any insurance claim queries
              yet. Start by submitting your first query.
            </p>

            <Link
              to="/claims"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />

              Submit New Query
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default MyQueries;