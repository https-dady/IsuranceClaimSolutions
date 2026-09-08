import { Link, useParams } from "react-router-dom";
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
} from "lucide-react";

import { motion } from "framer-motion";

const queryData = {
  id: "ICS-2026-00124",
  status: "Under Review",

  insuranceType: "Health Insurance",
  claimType: "Cashless Claim Rejection",
  insuranceCompany: "ABC Insurance Company",

  submittedDate: "05 September 2026",
  lastUpdated: "08 September 2026",

  description:
    "My cashless health insurance claim was rejected by the insurance company. I would like assistance in reviewing the rejection and helping me proceed with the claim.",

  progress: [
    {
      title: "Query Submitted",
      description: "Your query has been successfully submitted.",
      date: "05 Sep 2026",
      completed: true,

      colors: {
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
    },

    {
      title: "Under Initial Review",
      description:
        "Our team is currently reviewing your claim details and submitted information.",
      date: "06 Sep 2026",
      completed: true,

      colors: {
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
    },

    {
      title: "Document Review",
      description:
        "Required documents will be reviewed and verified by our team.",
      date: "In Progress",
      current: true,

      colors: {
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
    },

    {
      title: "Claim Processing",
      description:
        "Our legal and claims team will proceed with the required action.",
      date: "Pending",

      colors: {
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
    },

    {
      title: "Resolution",
      description:
        "The final update and resolution of your claim will be provided.",
      date: "Pending",

      colors: {
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
    },
  ],

  updates: [
    {
      title: "Your query has been submitted successfully",
      description:
        "We have received your insurance claim details. Our team will review your information shortly.",
      date: "05 September 2026",
      time: "10:30 AM",
      type: "success",
    },

    {
      title: "Query assigned to our review team",
      description:
        "A claims specialist has been assigned to review your submitted claim information.",
      date: "06 September 2026",
      time: "02:15 PM",
      type: "review",
    },

    {
      title: "Documents are currently being reviewed",
      description:
        "Our team is reviewing your submitted documents and claim details before proceeding further.",
      date: "08 September 2026",
      time: "11:40 AM",
      type: "current",
    },
  ],

  documents: [
    {
      name: "Insurance Policy Document.pdf",
      date: "05 September 2026",
      status: "Verified",
    },

    {
      name: "Claim Rejection Letter.pdf",
      date: "05 September 2026",
      status: "Under Review",
    },

    {
      name: "Medical Documents.pdf",
      date: "06 September 2026",
      status: "Verified",
    },
  ],
};

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

  return (
    <section className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= BACK BUTTON ================= */}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
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
                {queryData.id}
              </span>

            </div>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Your Claim{" "}
              <span className="text-blue-600">
                Journey
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Track your claim progress, view updates, manage documents,
              and stay informed throughout the entire process.
            </p>

          </div>


          {/* STATUS */}

          <div className="flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 px-5 py-4 shadow-sm backdrop-blur-xl">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
              <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
            </div>

            <div>

              <p className="text-xs font-medium text-slate-500">
                Current Status
              </p>

              <p className="font-bold text-amber-700">
                {queryData.status}
              </p>

            </div>

          </div>

        </motion.div>


        {/* ================= LATEST UPDATE ================= */}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
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
                Documents are currently being reviewed
              </h2>

              <p className="mt-2 leading-relaxed text-slate-600">
                Our claims team is reviewing your submitted documents and
                insurance details. You will be notified when the next action
                is required.
              </p>

            </div>


            <div className="text-sm text-slate-500">

              Updated on{" "}

              <span className="font-semibold text-slate-700">
                {queryData.lastUpdated}
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
              viewport={{ once: true, amount: 0.2 }}
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


              {/* ================= PROGRESS STEPS ================= */}

              <div className="relative">

                {queryData.progress.map((step, index) => {

                  const isLast =
                    index === queryData.progress.length - 1;

                  const previousStep =
                    index > 0
                      ? queryData.progress[index - 1]
                      : null;

                  return (
                    <div
                      key={step.title}
                      className="relative flex gap-5 pb-10 last:pb-0"
                    >


                      {/* ================= CONNECTING LINE ================= */}

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


                      {/* ================= STEP ICON ================= */}

                      <div className="relative z-10">

                        {/* COMPLETED */}

                        {step.completed ? (

                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ${step.colors.icon}`}
                          >
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>

                        ) : step.current ? (

                          /* CURRENT */

                          <div
                            className={`relative flex h-10 w-10 items-center justify-center rounded-full border-4 bg-white shadow-md ${step.colors.ring}`}
                          >

                            {/* Animated Ring */}

                            <span
                              className={`absolute inset-0 animate-ping rounded-full opacity-20 ${step.colors.dot}`}
                            />

                            {/* Inner Dot */}

                            <div
                              className={`relative h-3 w-3 rounded-full ${step.colors.dot} animate-pulse`}
                            />

                          </div>

                        ) : (

                          /* PENDING */

                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-all duration-300 ${step.colors.pendingBorder}`}
                          >
                            <Circle
                              className={`h-4 w-4 ${step.colors.pendingIcon}`}
                            />
                          </div>

                        )}

                      </div>


                      {/* ================= STEP CONTENT ================= */}

                      <div className="flex-1 pb-1">

                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">


                          {/* TITLE */}

                          <h3
                            className={`font-bold transition-colors duration-300 ${
                              step.completed || step.current
                                ? step.colors.text
                                : "text-slate-700"
                            }`}
                          >
                            {step.title}
                          </h3>


                          {/* DATE / STATUS */}

                          <span
                            className={`text-sm transition-colors duration-300 ${
                              step.completed || step.current
                                ? `font-semibold ${step.colors.date}`
                                : "text-slate-400"
                            }`}
                          >
                            {step.date}
                          </span>

                        </div>


                        {/* DESCRIPTION */}

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
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8"
            >

              <div className="mb-8">

                <h2 className="text-2xl font-bold text-slate-900">
                  Updates & Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Stay informed about every important action on your query.
                </p>

              </div>


              <div className="space-y-6">

                {queryData.updates.map((update, index) => (

                  <div
                    key={index}
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
                            {update.date} • {update.time}
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

            </motion.div>

          </div>


          {/* ================= RIGHT SIDEBAR ================= */}

          <div className="space-y-8">


            {/* ================= CLAIM SUMMARY ================= */}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl"
            >

              <h2 className="mb-6 text-xl font-bold text-slate-900">
                Query Summary
              </h2>


              <div className="space-y-5">

                <SummaryItem
                  icon={ShieldCheck}
                  label="Insurance Type"
                  value={queryData.insuranceType}
                />

                <SummaryItem
                  icon={FileText}
                  label="Claim Type"
                  value={queryData.claimType}
                />

                <SummaryItem
                  icon={Building2}
                  label="Insurance Company"
                  value={queryData.insuranceCompany}
                />

                <SummaryItem
                  icon={Calendar}
                  label="Submitted On"
                  value={queryData.submittedDate}
                />

              </div>

            </motion.div>


            {/* ================= DOCUMENTS ================= */}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl"
            >

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Documents
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {queryData.documents.length} documents
                  </p>

                </div>

                <Upload className="h-5 w-5 text-blue-600" />

              </div>


              <div className="space-y-3">

                {queryData.documents.map((document) => (

                  <div
                    key={document.name}
                    className="rounded-2xl border border-slate-100 bg-white/70 p-4 transition-all hover:border-blue-100 hover:shadow-md"
                  >

                    <div className="flex gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">

                        <FileText className="h-5 w-5 text-red-500" />

                      </div>


                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-slate-800">
                          {document.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {document.date}
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            document.status === "Verified"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {document.status}
                        </span>

                      </div>

                    </div>


                    <div className="mt-4 flex gap-2">

                      <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600">

                        <Eye className="h-4 w-4" />

                        View

                      </button>


                      <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600">

                        <Download className="h-4 w-4" />

                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </motion.div>


            {/* ================= HELP CARD ================= */}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
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

                  Have questions regarding your claim? Our support team is
                  here to assist you.

                </p>


                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-50">

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
          viewport={{ once: true }}
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
            {queryData.description}
          </p>

        </motion.div>

      </div>
    </section>
  );
}


/* ================= SUMMARY ITEM ================= */

function SummaryItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">

        <Icon className="h-4 w-4 text-blue-600" />

      </div>


      <div>

        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          {value}
        </p>

      </div>

    </div>
  );
}


export default QueryDetails;