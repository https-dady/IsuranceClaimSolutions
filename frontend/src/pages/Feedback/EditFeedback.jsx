import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Save,
  Star,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  getMyFeedbackById,
  updateMyFeedback,
} from "../../api/feedbackApi";

function EditFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getMyFeedbackById(id);

        const feedbackData =
          response?.feedback ||
          response?.data?.feedback ||
          response?.feedbacks?.[0] ||
          response?.data?.feedbacks?.[0] ||
          null;

        if (!feedbackData) {
          setError("Feedback not found.");
          return;
        }

        setFeedback(feedbackData);
        setRating(Number(feedbackData.rating) || 0);
        setMessage(feedbackData.message || "");
      } catch (error) {
        console.error("Get feedback error:", error);

        setError(
          error?.message ||
            "Failed to load feedback."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFeedback();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5.");
      return;
    }

    if (!message.trim()) {
      setError("Please enter your feedback message.");
      return;
    }

    try {
      setIsSaving(true);

      await updateMyFeedback(id, {
        rating,
        message: message.trim(),
      });

      setSuccess("Feedback updated successfully.");

      setTimeout(() => {
        navigate("/my-feedbacks");
      }, 800);
    } catch (error) {
      console.error("Update feedback error:", error);

      setError(
        error?.message ||
          "Failed to update feedback."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/70 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/80 bg-white/70 px-6 py-16 text-center shadow-xl shadow-blue-900/5 backdrop-blur-xl">
            <RefreshCw className="mx-auto h-9 w-9 animate-spin text-blue-600" />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Loading Feedback...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we fetch your feedback.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!feedback) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/70 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-red-100 bg-red-50/80 px-6 py-12 text-center shadow-lg">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

            <h2 className="mt-4 text-xl font-bold text-red-800">
              Feedback Not Found
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error || "The requested feedback could not be found."}
            </p>

            <Link
              to="/my-feedbacks"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Feedbacks
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/70 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/my-feedbacks"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Feedbacks
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-xl">
            <MessageSquare className="h-4 w-4" />
            EDIT FEEDBACK
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Edit Your <span className="text-blue-600">Feedback</span>
          </h1>

          <p className="mt-3 text-slate-600">
            Update the rating or message associated with your feedback.
          </p>
        </motion.div>

        {/* FORM */}

        <motion.form
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8"
        >
          {/* ERROR */}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-700">
                {success}
              </p>
            </div>
          )}

          {/* QUERY INFO */}

          <div className="mb-8 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Feedback For
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {typeof feedback.query === "object"
                ? feedback.query?.queryId || "Insurance Claim"
                : feedback.query || "Insurance Claim"}
            </p>
          </div>

          {/* RATING */}

          <div className="mb-8">
            <label className="mb-3 block text-sm font-semibold text-slate-800">
              Your Rating
            </label>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="rounded-lg p-1 transition hover:bg-yellow-50"
                  aria-label={`Rate ${star} star${
                    star > 1 ? "s" : ""
                  }`}
                >
                  <Star
                    className={`h-8 w-8 transition ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}

              <span className="ml-2 text-sm font-semibold text-slate-600">
                {rating}/5
              </span>
            </div>
          </div>

          {/* MESSAGE */}

          <div className="mb-8">
            <label
              htmlFor="feedback-message"
              className="mb-3 block text-sm font-semibold text-slate-800"
            >
              Your Feedback
            </label>

            <textarea
              id="feedback-message"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              rows={7}
              placeholder="Share your experience..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* ACTIONS */}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/my-feedbacks"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

export default EditFeedback;