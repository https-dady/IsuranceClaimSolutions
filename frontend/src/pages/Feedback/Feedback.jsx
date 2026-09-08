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
} from "lucide-react";

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedFeedbacks = JSON.parse(
      localStorage.getItem("allFeedbacks") || "[]"
    );

    setFeedbacks(savedFeedbacks);
  }, []);

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!formData.message.trim()) {
      alert("Please enter your feedback message.");
      return;
    }

    if (formData.rating === 0) {
      alert("Please select a rating from 1 to 5 stars.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newFeedback = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        message: formData.message,
        rating: formData.rating,
        date: new Date().toISOString(),
      };

      const updatedFeedbacks = [
        newFeedback,
        ...feedbacks,
      ];

      setFeedbacks(updatedFeedbacks);

      localStorage.setItem(
        "allFeedbacks",
        JSON.stringify(updatedFeedbacks)
      );

      setFormData({
        name: "",
        email: "",
        message: "",
        rating: 0,
      });

      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    }, 600);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
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
          {/* Badge */}

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
            Your opinion matters to us. Help us serve you better by sharing
            your experience with our claim settlement services.
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

          {/* Glow */}

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
                  We value every opinion and use it to improve our services.
                </p>
              </div>
            </div>


            {/* SUCCESS MESSAGE */}

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
                      Thank you for sharing your experience with us.
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
                      className="w-full rounded-xl border border-slate-200/80 bg-white/70 py-3.5 pl-12 pr-4 text-slate-900 outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/70"
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
                      className="w-full rounded-xl border border-slate-200/80 bg-white/70 py-3.5 pl-12 pr-4 text-slate-900 outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/70"
                    />
                  </div>
                </div>

              </div>


              {/* RATING */}

              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Rating *
                </label>

                <div className="inline-flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm">

                  {renderStars(formData.rating, true)}

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
                  className="w-full resize-none rounded-xl border border-slate-200/80 bg-white/70 px-4 py-4 text-slate-900 outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/70"
                />
              </div>


              {/* SUBMIT BUTTON */}

              <motion.button
                type="submit"
                disabled={isSubmitting}
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
                Real experiences shared by our clients.
              </p>
            </div>


            {/* REVIEW COUNT */}

            {feedbacks.length > 0 && (
              <div className="rounded-full border border-blue-100 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-xl">
                {feedbacks.length}{" "}
                {feedbacks.length === 1
                  ? "Review"
                  : "Reviews"}
              </div>
            )}

          </motion.div>


          {/* ================= FEEDBACK CARDS ================= */}

          {feedbacks.length > 0 ? (

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.1,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
              className="grid gap-7 md:grid-cols-2 lg:grid-cols-3"
            >

              {feedbacks.map((feedback) => (

                <motion.div
                  key={feedback.id}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut",
                      },
                    },
                  }}
                  whileHover={{
                    y: -7,
                  }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/80 bg-white/65 p-7 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-shadow duration-300 hover:shadow-xl hover:shadow-blue-900/10"
                >

                  {/* Glow */}

                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-200/20 blur-[70px]" />

                  {/* Quote */}

                  <Quote className="absolute right-6 top-6 h-10 w-10 text-blue-100 transition-transform duration-300 group-hover:scale-110" />


                  {/* USER */}

                  <div className="relative mb-5 pr-10">

                    <h3 className="text-lg font-bold text-slate-900">
                      {feedback.name}
                    </h3>

                    <p className="mt-1 truncate text-sm text-slate-400">
                      {feedback.email}
                    </p>

                  </div>


                  {/* RATING */}

                  <div className="relative mb-5">
                    {renderStars(feedback.rating)}
                  </div>


                  {/* MESSAGE */}

                  <p className="relative flex-grow leading-relaxed text-slate-600">
                    "{feedback.message}"
                  </p>


                  {/* DATE */}

                  <div className="relative mt-7 flex items-center gap-2 border-t border-slate-200/70 pt-5 text-sm text-slate-400">
                    <CalendarDays className="h-4 w-4 text-blue-500" />

                    {formatDate(feedback.date)}
                  </div>

                </motion.div>
              ))}

            </motion.div>

          ) : (

            /* ================= EMPTY STATE ================= */

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
                No Feedback Yet
              </h3>

              <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-500">
                Be the first to share your experience with us. Your feedback
                helps us improve and serve our clients better.
              </p>

            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}

export default Feedback;