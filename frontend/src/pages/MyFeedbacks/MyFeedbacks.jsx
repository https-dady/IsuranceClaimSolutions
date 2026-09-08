import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquarePlus,
  Pencil,
  Star,
  MessageSquare,
  ClipboardList,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";

const feedbacks = [
  {
    id: 1,
    subject: "Excellent Claim Support",
    regarding: "Health Insurance Claim",
    queryId: "ICS-2026-1024",
    rating: 5,
    message:
      "The team was very supportive and guided me throughout the claim process. I really appreciate the quick responses and professional assistance.",
    date: "September 5, 2026",
  },
  {
    id: 2,
    subject: "Good Overall Experience",
    regarding: "Motor Insurance Claim",
    queryId: "ICS-2026-0897",
    rating: 4,
    message:
      "The process was smooth and the team explained everything clearly. The response time could be slightly faster, but overall the experience was good.",
    date: "August 28, 2026",
  },
];

function MyFeedbacks() {
  const [userFeedbacks] = useState(feedbacks);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/70 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-xl">
              <MessageSquare className="h-4 w-4" />
              YOUR FEEDBACK
            </div>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              My <span className="text-blue-600">Feedbacks</span>
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              View, manage and update the feedback you have shared with us.
            </p>
          </div>

          {/* New Feedback Button */}
          <Link to="/feedback">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
            >
              <MessageSquarePlus className="h-5 w-5" />
              New Feedback
            </motion.div>
          </Link>
        </motion.div>

        {/* ================= EMPTY STATE ================= */}

        {userFeedbacks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/80 bg-white/70 px-6 py-16 text-center shadow-xl shadow-blue-900/5 backdrop-blur-xl"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
              <MessageSquare className="h-10 w-10 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              No Feedback Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-600">
              You haven't submitted any feedback yet. Your feedback helps us
              improve our services and provide you with a better experience.
            </p>

            <Link
              to="/feedback/new"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
            >
              <MessageSquarePlus className="h-5 w-5" />
              Give Your Feedback
            </Link>
          </motion.div>
        ) : (
          <>
            {/* ================= SUMMARY ================= */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 grid gap-4 sm:grid-cols-3"
            >
              <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-lg shadow-blue-900/5 backdrop-blur-xl">
                <p className="text-sm font-medium text-slate-500">
                  Total Feedbacks
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {userFeedbacks.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-lg shadow-blue-900/5 backdrop-blur-xl">
                <p className="text-sm font-medium text-slate-500">
                  Average Rating
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <p className="text-3xl font-bold text-slate-900">
                    {(
                      userFeedbacks.reduce(
                        (total, feedback) =>
                          total + feedback.rating,
                        0
                      ) / userFeedbacks.length
                    ).toFixed(1)}
                  </p>

                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-lg shadow-blue-900/5 backdrop-blur-xl">
                <p className="text-sm font-medium text-slate-500">
                  Latest Feedback
                </p>

                <p className="mt-2 truncate text-lg font-bold text-slate-900">
                  {userFeedbacks[0].regarding}
                </p>
              </div>
            </motion.div>

            {/* ================= FEEDBACK LIST ================= */}

            <div className="space-y-6">
              {userFeedbacks.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.15 + index * 0.1,
                  }}
                  className="group rounded-3xl border border-white/80 bg-white/75 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                    {/* LEFT CONTENT */}
                    <div className="flex-1">

                      {/* Rating + Date */}
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={`h-5 w-5 ${
                                starIndex < feedback.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>

                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />

                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <CalendarDays className="h-4 w-4" />
                          {feedback.date}
                        </div>
                      </div>

                      {/* Subject */}
                      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                        {feedback.subject}
                      </h2>

                      {/* Regarding */}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                          <ClipboardList className="h-4 w-4" />
                          {feedback.regarding}
                        </div>

                        <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600">
                          Query ID: {feedback.queryId}
                        </span>
                      </div>

                      {/* Feedback Message */}
                      <p className="mt-5 max-w-4xl leading-relaxed text-slate-600">
                        {feedback.message}
                      </p>
                    </div>

                    {/* EDIT BUTTON */}
                    <Link to={`/feedback/edit/${feedback.id}`}>
                      <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit Feedback
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default MyFeedbacks;