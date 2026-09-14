import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquareHeart,
  Send,
  Star,
  User,
  Mail,
  Quote,
  CalendarDays,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ClipboardList,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getFeedbackEligibleQueries,
  createFeedback,
} from "../../api/feedbackApi";

function Feedback() {
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
    queryId: "",
  });

  const [eligibleQueries, setEligibleQueries] = useState([]);

  const [isLoadingQueries, setIsLoadingQueries] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      name: user?.name || "",
      email: user?.email || "",
    }));
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchEligibleQueries = async () => {
      if (!isAuthenticated) {
        setEligibleQueries([]);
        return;
      }

      try {
        setIsLoadingQueries(true);
        setError("");

        const response = await getFeedbackEligibleQueries();

        const queries =
          response?.queries ||
          response?.data?.queries ||
          [];

        const queryList = Array.isArray(queries)
          ? queries
          : [];

        setEligibleQueries(queryList);

        if (queryList.length === 1) {
          setFormData((prev) => ({
            ...prev,
            queryId: queryList[0]?.queryId || "",
          }));
        }
      } catch (error) {
        console.error(
          "Get feedback eligible queries error:",
          error
        );

        setError(
          error?.message ||
            "Failed to load your eligible queries."
        );

        setEligibleQueries([]);
      } finally {
        setIsLoadingQueries(false);
      }
    };

    fetchEligibleQueries();
  }, [isAuthenticated]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRating = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const getQueryId = (query) => {
    return query?.queryId || "";
  };

  const getQueryType = (query) => {
    return (
      query?.insuranceDetails?.insuranceType ||
      "Insurance Claim"
    );
  };

  const getQueryStatus = (query) => {
    return query?.status || "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitted(false);

    if (!isAuthenticated) {
      setError(
        "Please login to submit feedback."
      );
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (
      !formData.email.trim() ||
      !validateEmail(formData.email)
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.queryId) {
      setError(
        "Please select the claim/query for which you want to submit feedback."
      );
      return;
    }

    if (!formData.message.trim()) {
      setError("Please enter your feedback message.");
      return;
    }

    if (formData.rating === 0) {
      setError(
        "Please select a rating from 1 to 5 stars."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await createFeedback({
        queryId: formData.queryId,
        rating: formData.rating,
        message: formData.message.trim(),
      });

      setFormData((prev) => ({
        ...prev,
        message: "",
        rating: 0,
      }));

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch (error) {
      console.error(
        "Create feedback error:",
        error
      );

      setError(
        error?.message ||
          "Failed to submit feedback."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() =>
              interactive && handleRating(star)
            }
            className={`h-7 w-7 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300"
            } ${
              interactive
                ? "cursor-pointer transition-all duration-200 hover:scale-110"
                : ""
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7fbff] py-20 sm:py-24">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute -left-40 top-20 h-[550px] w-[550px] rounded-full bg-blue-200/35 blur-[150px]" />

      <div className="absolute -right-40 bottom-20 h-[600px] w-[600px] rounded-full bg-sky-200/40 blur-[160px]" />

      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.25) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADING ================= */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600">
              <MessageSquareHeart className="h-4 w-4 text-white" />
            </div>

            <span className="text-xs font-bold tracking-wide text-slate-700">
              CLIENT FEEDBACK
            </span>
          </div>

          <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Share Your{" "}
            <span className="text-blue-600">
              Feedback
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Your opinion matters to us. Help us serve you
            better by sharing your experience with our claim
            settlement services.
          </p>

          <div className="mx-auto mt-7 h-1.5 w-20 rounded-full bg-blue-600" />
        </motion.div>

        {/* ================= FEEDBACK FORM ================= */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="relative mx-auto mb-24 max-w-5xl overflow-hidden rounded-[30px] border border-white/80 bg-white/65 p-6 shadow-2xl shadow-blue-900/5 backdrop-blur-xl sm:p-10"
        >
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-200/25 blur-[120px]" />

          <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-sky-200/30 blur-[120px]" />

          <div className="relative">

            {/* FORM HEADER */}

            <div className="mb-9 flex flex-col gap-5 border-b border-slate-200/70 pb-7 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
                <MessageSquareHeart className="h-8 w-8" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Tell Us About Your Experience
                </h2>

                <p className="mt-2 text-slate-500">
                  We value every opinion and use it to improve
                  our services.
                </p>
              </div>
            </div>

            {/* LOGIN REQUIRED */}

            {!isAuthenticated && (
              <div className="mb-7 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 p-5 text-blue-800">
                <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-blue-600" />

                <div>
                  <p className="font-semibold">
                    Login Required
                  </p>

                  <p className="mt-1 text-sm text-blue-700">
                    Please login to submit feedback for one
                    of your claims.
                  </p>
                </div>
              </div>
            )}

            {/* ERROR */}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  className="mb-7 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-red-800 backdrop-blur-sm"
                >
                  <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />

                  <p className="text-sm font-medium">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUCCESS */}

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  className="mb-7 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50/80 p-4 text-green-800 backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600" />

                  <div>
                    <p className="font-semibold">
                      Feedback Submitted!
                    </p>

                    <p className="text-sm text-green-700">
                      Thank you for sharing your experience
                      with us.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-7"
            >

              {/* NAME + EMAIL */}

              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name *
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      disabled={!isAuthenticated}
                      className="w-full rounded-xl border border-slate-200/80 bg-white/70 py-3.5 pl-12 pr-4 text-slate-900 outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/70 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address *
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      disabled={!isAuthenticated}
                      className="w-full rounded-xl border border-slate-200/80 bg-white/70 py-3.5 pl-12 pr-4 text-slate-900 outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/70 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>

              </div>

              {/* QUERY */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Select Claim / Query *
                </label>

                <div className="relative">
                  <ClipboardList className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <select
                    name="queryId"
                    value={formData.queryId}
                    onChange={handleChange}
                    disabled={
                      !isAuthenticated ||
                      isLoadingQueries ||
                      eligibleQueries.length === 0
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200/80 bg-white/70 py-3.5 pl-12 pr-4 text-slate-900 outline-none backdrop-blur-sm transition-all duration-300 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/70 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">
                      {isLoadingQueries
                        ? "Loading your queries..."
                        : eligibleQueries.length === 0
                        ? "No eligible queries available"
                        : "Select a claim/query"}
                    </option>

                    {eligibleQueries.map((query) => (
                      <option
                        key={getQueryId(query)}
                        value={getQueryId(query)}
                      >
                        {getQueryId(query)} —{" "}
                        {getQueryType(query)}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.queryId && (
                  <p className="mt-2 text-sm text-slate-500">
                    Selected Query: {formData.queryId}
                  </p>
                )}
              </div>

              {/* RATING */}

              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Rating *
                </label>

                <div className="inline-flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm">
                  {renderStars(
                    formData.rating,
                    true
                  )}

                  {formData.rating > 0 && (
                    <motion.span
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      className="border-l border-slate-200 pl-4 font-bold text-blue-600"
                    >
                      {formData.rating}/5
                    </motion.span>
                  )}
                </div>
              </div>

              {/* FEEDBACK MESSAGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Your Feedback *
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Share your experience with us..."
                  disabled={!isAuthenticated}
                  className="w-full resize-none rounded-xl border border-slate-200/80 bg-white/70 px-4 py-4 text-slate-900 outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/70 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              {/* SUBMIT BUTTON */}

              <motion.button
                type="submit"
                disabled={
                  !isAuthenticated ||
                  isSubmitting ||
                  isLoadingQueries ||
                  eligibleQueries.length === 0
                }
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.99,
                }}
                className="group inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Feedback

                    <Send className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>

            </form>
          </div>
        </motion.div>

        {/* ================= CLIENT FEEDBACKS ================= */}

        <div>

          {/* SECTION HEADING */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mb-12 flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left"
          >
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl">
                <ShieldCheck className="h-4 w-4 text-blue-600" />

                <span className="text-xs font-bold tracking-wide text-slate-700">
                  CLIENT REVIEWS
                </span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                What Our Clients Say
              </h2>

              <p className="mt-3 text-slate-600">
                Client reviews are available through the
                authenticated feedback management area.
              </p>
            </div>
          </motion.div>

          {/* PUBLIC REVIEWS NOT AVAILABLE FROM BACKEND */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="rounded-[28px] border border-dashed border-slate-300 bg-white/60 p-12 text-center shadow-sm backdrop-blur-xl"
          >
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-100 bg-blue-50">
              <MessageSquareHeart className="h-9 w-9 text-blue-500" />
            </div>

            <h3 className="text-2xl font-bold text-slate-800">
              Your Feedback Matters
            </h3>

            <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-500">
              Submit feedback for your claim or query above.
              Submitted feedback can be viewed and managed
              from your My Feedbacks section.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Feedback;