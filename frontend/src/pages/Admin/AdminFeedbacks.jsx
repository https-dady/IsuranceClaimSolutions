import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  MessageSquare,
  Users,
  Award,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";
import { getAdminFeedbacks } from "../../api/feedbackApi";

function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    fiveStarFeedbacks: 0,
    needsAttention: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeedbacks = async ({
    search = searchTerm,
    rating = ratingFilter,
  } = {}) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAdminFeedbacks({
        search,
        rating,
      });

      const feedbackList =
        response?.feedbacks ||
        response?.data?.feedbacks ||
        [];

      const backendStats =
        response?.stats ||
        response?.data?.stats ||
        {};

      setFeedbacks(
        Array.isArray(feedbackList)
          ? feedbackList
          : []
      );

      setStats({
        totalFeedbacks:
          Number(backendStats.totalFeedbacks) || 0,

        averageRating:
          Number(backendStats.averageRating) || 0,

        fiveStarFeedbacks:
          Number(backendStats.fiveStarFeedbacks) || 0,

        needsAttention:
          Number(backendStats.needsAttention) || 0,
      });
    } catch (error) {
      console.error("Get admin feedbacks error:", error);

      setError(
        error?.message ||
          "Failed to load feedbacks."
      );

      setFeedbacks([]);
      setStats({
        totalFeedbacks: 0,
        averageRating: 0,
        fiveStarFeedbacks: 0,
        needsAttention: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeedbacks({
        search: searchTerm,
        rating: ratingFilter,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, ratingFilter]);

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFeedbackId = (feedback) => {
    return feedback?._id || feedback?.id;
  };

  const getUserName = (feedback) => {
    return (
      feedback?.user?.name ||
      feedback?.name ||
      "Unknown User"
    );
  };

  const getUserEmail = (feedback) => {
    return (
      feedback?.user?.email ||
      feedback?.email ||
      "—"
    );
  };

  const getQueryId = (feedback) => {
    if (typeof feedback?.query === "string") {
      return feedback.query;
    }

    return (
      feedback?.query?.queryId ||
      feedback?.queryId ||
      "—"
    );
  };

  const getQueryType = (feedback) => {
    return (
      feedback?.query?.insuranceDetails?.insuranceType ||
      feedback?.insuranceType ||
      "Insurance Claim"
    );
  };

  return (
    <AdminLayout role="main_admin">
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                <MessageSquare className="h-4 w-4" />
                FEEDBACK MANAGEMENT
              </div>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Customer Feedbacks
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Review feedback submitted by users.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchFeedbacks()}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* ================= STATS ================= */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Feedbacks
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.totalFeedbacks}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
          </motion.div>

          {/* Average Rating */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Average Rating
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <p className="text-3xl font-bold text-slate-900">
                    {Number(stats.averageRating).toFixed(1)}
                  </p>

                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>

              <div className="rounded-xl bg-yellow-50 p-3 text-yellow-600">
                <Star className="h-5 w-5" />
              </div>
            </div>
          </motion.div>

          {/* Five Star */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  5-Star Feedbacks
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.fiveStarFeedbacks}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </motion.div>

          {/* Needs Attention */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Needs Attention
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.needsAttention}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================= FILTERS ================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">

            {/* Search */}

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search feedbacks..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Rating */}

            <select
              value={ratingFilter}
              onChange={(event) =>
                setRatingFilter(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Ratings
              </option>

              <option value="5">
                5 Stars
              </option>

              <option value="4">
                4 Stars
              </option>

              <option value="3">
                3 Stars
              </option>

              <option value="2">
                2 Stars
              </option>

              <option value="1">
                1 Star
              </option>
            </select>
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-5"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

              <div>
                <h3 className="font-semibold text-red-800">
                  Unable to Load Feedbacks
                </h3>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= LOADING ================= */}

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600" />

            <p className="mt-4 font-semibold text-slate-900">
              Loading feedbacks...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while we fetch the latest feedbacks.
            </p>
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!isLoading &&
          !error &&
          feedbacks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <MessageSquare className="h-8 w-8 text-slate-400" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No Feedbacks Found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                No feedbacks match the current search or rating filter.
              </p>
            </motion.div>
          )}

        {/* ================= FEEDBACK LIST ================= */}

        {!isLoading &&
          !error &&
          feedbacks.length > 0 && (
            <div className="space-y-5">
              {feedbacks.map((feedback, index) => {
                const feedbackId = getFeedbackId(feedback);
                const userName = getUserName(feedback);
                const userEmail = getUserEmail(feedback);
                const queryId = getQueryId(feedback);
                const queryType = getQueryType(feedback);

                return (
                  <motion.div
                    key={feedbackId || index}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.05,
                    }}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5">

                      {/* TOP */}

                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                        {/* USER */}

                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Users className="h-5 w-5" />
                          </div>

                          <div>
                            <h2 className="font-bold text-slate-900">
                              {userName}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                              {userEmail}
                            </p>
                          </div>
                        </div>

                        {/* RATING */}

                        <div className="flex items-center gap-1 rounded-xl bg-slate-50 px-3 py-2">
                          {[...Array(5)].map(
                            (_, starIndex) => (
                              <Star
                                key={starIndex}
                                className={`h-5 w-5 ${
                                  starIndex <
                                  Number(feedback.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-300"
                                }`}
                              />
                            )
                          )}

                          <span className="ml-2 text-sm font-semibold text-slate-700">
                            {feedback.rating}/5
                          </span>
                        </div>
                      </div>

                      {/* QUERY */}

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                          {queryType}
                        </span>

                        <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600">
                          Query ID: {queryId}
                        </span>

                        <span className="text-sm text-slate-400">
                          {formatDate(
                            feedback.createdAt ||
                              feedback.submittedAt ||
                              feedback.date
                          )}
                        </span>
                      </div>

                      {/* MESSAGE */}

                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                          Feedback
                        </div>

                        <p className="leading-relaxed text-slate-600">
                          {feedback.message || "—"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
      </div>
    </AdminLayout>
  );
}

export default AdminFeedbacks;