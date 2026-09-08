import { useState } from "react";

import {
  MessageSquare,
  Search,
  Star,
  Calendar,
  User,
  ClipboardList,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";

const feedbacksData = [
  {
    id: 1,
    userName: "Rahul Sharma",
    email: "rahul@example.com",
    queryId: "QRY-1001",
    queryTitle: "Vehicle Insurance Claim",
    rating: 5,
    message:
      "The claim process was smooth and the support team was very helpful.",
    submittedOn: "08 Sep 2026",
  },
  {
    id: 2,
    userName: "Priya Singh",
    email: "priya@example.com",
    queryId: "QRY-1002",
    queryTitle: "Health Insurance Claim",
    rating: 4,
    message:
      "Overall experience was good. The process could be a little faster.",
    submittedOn: "07 Sep 2026",
  },
  {
    id: 3,
    userName: "Amit Verma",
    email: "amit@example.com",
    queryId: "QRY-1003",
    queryTitle: "Car Accident Claim",
    rating: 3,
    message:
      "The service was okay but I had to wait longer than expected.",
    submittedOn: "06 Sep 2026",
  },
  {
    id: 4,
    userName: "Sneha Patil",
    email: "sneha@example.com",
    queryId: "QRY-1004",
    queryTitle: "Property Insurance Claim",
    rating: 5,
    message:
      "Excellent support and clear communication throughout the process.",
    submittedOn: "05 Sep 2026",
  },
];

function AdminFeedbacks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filteredFeedbacks = feedbacksData.filter((feedback) => {
    const matchesSearch =
      feedback.userName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      feedback.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      feedback.queryId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === "all" ||
      feedback.rating === Number(ratingFilter);

    return matchesSearch && matchesRating;
  });

  const totalFeedbacks = feedbacksData.length;

  const averageRating =
    feedbacksData.reduce(
      (total, feedback) => total + feedback.rating,
      0
    ) / totalFeedbacks;

  const fiveStarFeedbacks = feedbacksData.filter(
    (feedback) => feedback.rating === 5
  ).length;

  const lowRatingFeedbacks = feedbacksData.filter(
    (feedback) => feedback.rating <= 3
  ).length;

  return (
    <AdminLayout role="main_admin">
      {/* ================= PAGE HEADER ================= */}

      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          View feedback submitted by users
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          User Feedbacks
        </h1>
      </div>

      {/* ================= STATS ================= */}

      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Feedbacks */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Feedbacks
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalFeedbacks}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Average Rating */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Average Rating
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {averageRating.toFixed(1)}
                <span className="ml-1 text-base text-slate-400">
                  /5
                </span>
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Star className="h-6 w-6 fill-current" />
            </div>
          </div>
        </div>

        {/* 5 Star */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                5 Star Feedbacks
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {fiveStarFeedbacks}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Star className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Low Rating */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Needs Attention
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {lowRatingFeedbacks}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= FEEDBACK LIST ================= */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* TOP */}

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Feedbacks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Feedback submitted by registered users
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 sm:w-64"
              />
            </div>

            {/* Rating Filter */}

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-500"
            >
              <option value="all">All Ratings</option>

              <option value="5">5 Stars</option>

              <option value="4">4 Stars</option>

              <option value="3">3 Stars</option>

              <option value="2">2 Stars</option>

              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* ================= FEEDBACK CARDS ================= */}

        <div className="divide-y divide-slate-100">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="p-5 transition hover:bg-slate-50/60 sm:p-6"
            >
              {/* TOP ROW */}

              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                {/* LEFT */}

                <div className="flex gap-4">
                  {/* Avatar */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                    {feedback.userName
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div>
                    {/* User */}

                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">
                        {feedback.userName}
                      </h3>

                      {/* Rating */}

                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= feedback.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {feedback.email}
                    </p>

                    {/* Query */}

                    <div className="mt-3 flex flex-wrap gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <ClipboardList className="h-4 w-4" />

                        <span className="font-semibold text-slate-700">
                          {feedback.queryId}
                        </span>

                        <span>
                          • {feedback.queryTitle}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DATE */}

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />

                  {feedback.submittedOn}
                </div>
              </div>

              {/* MESSAGE */}

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-600">
                  {feedback.message}
                </p>
              </div>
            </div>
          ))}

          {/* EMPTY STATE */}

          {filteredFeedbacks.length === 0 && (
            <div className="py-16 text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 font-semibold text-slate-700">
                No feedbacks found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminFeedbacks;