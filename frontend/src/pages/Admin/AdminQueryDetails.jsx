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

import { currentUser } from "../../utils/currentUser";

/* =========================================================
   QUERY DATA
========================================================= */

const queryData = {
  "CLM-2026-001": {
    id: "CLM-2026-001",

    user: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
    },

    type: "Health Insurance",

    amount: "₹2,50,000",

    status: "Query Submitted",

    priority: "High",

    assignedTo: null,

    createdAt: "08 Sep 2026",

    description:
      "The user has submitted a health insurance claim for medical treatment expenses and requested claim verification.",

    policy: {
      policyNumber: "HLT-2026-1001",
      provider: "ABC Health Insurance",
      policyType: "Health Insurance",
    },

    documents: [
      {
        name: "Medical_Report.pdf",
        type: "PDF",
      },
      {
        name: "Hospital_Bill.pdf",
        type: "PDF",
      },
    ],

    timeline: [
      {
        title: "Query Submitted",
        date: "08 Sep 2026",
        description:
          "The user submitted the insurance claim.",
      },
    ],
  },

  "CLM-2026-002": {
    id: "CLM-2026-002",

    user: {
      name: "Priya Verma",
      email: "priya@example.com",
      phone: "+91 98765 43211",
    },

    type: "Motor Insurance",

    amount: "₹1,80,000",

    status: "Under Initial Review",

    priority: "Medium",

    assignedTo: "Secondary Admin",

    createdAt: "08 Sep 2026",

    description:
      "The user submitted a motor insurance claim after vehicle damage caused by an accident.",

    policy: {
      policyNumber: "MTR-2026-2045",
      provider: "XYZ Motor Insurance",
      policyType: "Motor Insurance",
    },

    documents: [
      {
        name: "Vehicle_Photos.zip",
        type: "Images",
      },
      {
        name: "Accident_Report.pdf",
        type: "PDF",
      },
      {
        name: "Repair_Estimate.pdf",
        type: "PDF",
      },
    ],

    timeline: [
      {
        title: "Query Submitted",
        date: "08 Sep 2026",
        description:
          "The motor insurance claim was submitted.",
      },
      {
        title: "Assigned to Secondary Admin",
        date: "08 Sep 2026",
        description:
          "The query was assigned for review.",
      },
      {
        title: "Under Initial Review",
        date: "08 Sep 2026",
        description:
          "The assigned admin started reviewing the claim.",
      },
    ],
  },

  "CLM-2026-003": {
    id: "CLM-2026-003",

    user: {
      name: "Amit Patel",
      email: "amit@example.com",
      phone: "+91 98765 43212",
    },

    type: "Life Insurance",

    amount: "₹8,00,000",

    status: "Document Review",

    priority: "High",

    assignedTo: "Main Admin",

    createdAt: "07 Sep 2026",

    description:
      "The user submitted a life insurance related claim and requested claim verification.",

    policy: {
      policyNumber: "LIF-2026-3021",
      provider: "Secure Life Insurance",
      policyType: "Life Insurance",
    },

    documents: [
      {
        name: "Policy_Document.pdf",
        type: "PDF",
      },
      {
        name: "Identity_Proof.pdf",
        type: "PDF",
      },
    ],

    timeline: [
      {
        title: "Query Submitted",
        date: "07 Sep 2026",
        description:
          "The insurance claim was submitted.",
      },
      {
        title: "Assigned to Main Admin",
        date: "07 Sep 2026",
        description:
          "The query was assigned to Main Admin.",
      },
      {
        title: "Under Initial Review",
        date: "07 Sep 2026",
        description:
          "Initial review was completed.",
      },
      {
        title: "Document Review",
        date: "07 Sep 2026",
        description:
          "Required documents are currently being reviewed.",
      },
    ],
  },

  "CLM-2026-004": {
    id: "CLM-2026-004",

    user: {
      name: "Sneha Gupta",
      email: "sneha@example.com",
      phone: "+91 98765 43213",
    },

    type: "Property Insurance",

    amount: "₹4,50,000",

    status: "Resolution",

    priority: "Low",

    assignedTo: "Secondary Admin",

    createdAt: "06 Sep 2026",

    description:
      "The user submitted a property insurance claim for property damage.",

    policy: {
      policyNumber: "PRP-2026-4050",
      provider: "National Property Insurance",
      policyType: "Property Insurance",
    },

    documents: [
      {
        name: "Property_Photos.zip",
        type: "Images",
      },
      {
        name: "Damage_Report.pdf",
        type: "PDF",
      },
    ],

    timeline: [
      {
        title: "Query Submitted",
        date: "06 Sep 2026",
        description:
          "The property insurance claim was submitted.",
      },
      {
        title: "Assigned to Secondary Admin",
        date: "06 Sep 2026",
        description:
          "The claim was assigned for review.",
      },
      {
        title: "Under Initial Review",
        date: "06 Sep 2026",
        description:
          "Initial claim review was completed.",
      },
      {
        title: "Document Review",
        date: "06 Sep 2026",
        description:
          "Required documents were reviewed.",
      },
      {
        title: "Claim Processing",
        date: "07 Sep 2026",
        description:
          "The claim was processed by the claims team.",
      },
      {
        title: "Resolution",
        date: "07 Sep 2026",
        description:
          "The final claim resolution was completed.",
      },
    ],
  },

  "CLM-2026-005": {
    id: "CLM-2026-005",

    user: {
      name: "Rohan Singh",
      email: "rohan@example.com",
      phone: "+91 98765 43214",
    },

    type: "Health Insurance",

    amount: "₹3,20,000",

    status: "Query Submitted",

    priority: "Medium",

    assignedTo: null,

    createdAt: "05 Sep 2026",

    description:
      "The user submitted a health insurance claim for treatment expenses.",

    policy: {
      policyNumber: "HLT-2026-5012",
      provider: "ABC Health Insurance",
      policyType: "Health Insurance",
    },

    documents: [
      {
        name: "Medical_Bills.pdf",
        type: "PDF",
      },
    ],

    timeline: [
      {
        title: "Query Submitted",
        date: "05 Sep 2026",
        description:
          "The user submitted the claim.",
      },
    ],
  },

  "CLM-2026-006": {
    id: "CLM-2026-006",

    user: {
      name: "Anjali Sharma",
      email: "anjali@example.com",
      phone: "+91 98765 43215",
    },

    type: "Motor Insurance",

    amount: "₹95,000",

    status: "Claim Processing",

    priority: "Low",

    assignedTo: "Main Admin",

    createdAt: "04 Sep 2026",

    description:
      "The user submitted a motor insurance claim for vehicle repair expenses.",

    policy: {
      policyNumber: "MTR-2026-6034",
      provider: "XYZ Motor Insurance",
      policyType: "Motor Insurance",
    },

    documents: [
      {
        name: "Vehicle_Images.zip",
        type: "Images",
      },
      {
        name: "Repair_Bill.pdf",
        type: "PDF",
      },
    ],

    timeline: [
      {
        title: "Query Submitted",
        date: "04 Sep 2026",
        description:
          "The claim was submitted.",
      },
      {
        title: "Assigned to Main Admin",
        date: "04 Sep 2026",
        description:
          "The query was assigned to Main Admin.",
      },
      {
        title: "Under Initial Review",
        date: "04 Sep 2026",
        description:
          "Initial review was completed.",
      },
      {
        title: "Document Review",
        date: "04 Sep 2026",
        description:
          "Documents were reviewed and verified.",
      },
      {
        title: "Claim Processing",
        date: "04 Sep 2026",
        description:
          "The claim is currently being processed.",
      },
    ],
  },
};

/* =========================================================
   PROGRESS STATUS OPTIONS

   EXACT USER SIDE FLOW
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
   PRIORITY STYLE
========================================================= */

function getPriorityStyle(priority) {
  const styles = {
    High:
      "border border-red-200 bg-red-50 text-red-600",

    Medium:
      "border border-amber-200 bg-amber-50 text-amber-600",

    Low:
      "border border-slate-200 bg-slate-100 text-slate-600",
  };

  return styles[priority];
}

/* =========================================================
   ADMIN QUERY DETAILS
========================================================= */

function AdminQueryDetails() {
  const { id } = useParams();

  const location = useLocation();

  const query = queryData[id];

  /* =======================================================
     BACK NAVIGATION
  ======================================================= */

  const fromAssignedQueries =
    location.state?.fromAssignedQueries === true;

  const backPath =
    location.state?.from ||
    "/admin/queries";

  /* =======================================================
     ROLE
  ======================================================= */

  const isMainAdmin =
    currentUser.role === "main_admin";

  /* =======================================================
     ACCESS

     Main Admin:
     Can manage every query.

     Secondary Admin:
     Can manage only queries assigned to them.
  ======================================================= */

  const isAssignedAdmin =
    currentUser.role === "secondary_admin" &&
    query?.assignedTo === currentUser.name;

  const canManage =
    isMainAdmin || isAssignedAdmin;

  const isViewOnly =
    !canManage;

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [status, setStatus] = useState(
    query?.status || ""
  );

  const [adminNote, setAdminNote] =
    useState("");

  const [savedNote, setSavedNote] =
    useState("");

  const [savedStatus, setSavedStatus] =
    useState(query?.status || "");

  const [isSaving, setIsSaving] =
    useState(false);

  /* =======================================================
     LOAD SAVED STATUS

     Temporary frontend storage
  ======================================================= */

  useEffect(() => {
    if (!query) {
      return;
    }

    const savedData =
      localStorage.getItem(
        `query-management-${query.id}`
      );

    if (!savedData) {
      return;
    }

    try {
      const parsedData =
        JSON.parse(savedData);

      if (parsedData.status) {
        setStatus(parsedData.status);

        setSavedStatus(
          parsedData.status
        );
      }

      if (parsedData.adminNote) {
        setAdminNote(
          parsedData.adminNote
        );

        setSavedNote(
          parsedData.adminNote
        );
      }
    } catch (error) {
      console.error(
        "Unable to load query management data",
        error
      );
    }
  }, [query]);

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!query) {
    return (
      <AdminLayout role={currentUser.role}>
        <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500">
            <AlertTriangle className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Query Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The requested query does not exist.
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
     SAVE CHANGES
  ======================================================= */

  const handleSave = () => {
    if (isViewOnly) {
      return;
    }

    setIsSaving(true);

    const updatedData = {
      status,
      adminNote,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      `query-management-${query.id}`,
      JSON.stringify(updatedData)
    );

    setTimeout(() => {
      setSavedStatus(status);

      setSavedNote(adminNote);

      setIsSaving(false);
    }, 500);
  };

  return (
    <AdminLayout role={currentUser.role}>
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
                    {query.id}
                  </h1>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getPriorityStyle(
                      query.priority
                    )}`}
                  >
                    {query.priority} Priority
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Submitted on {query.createdAt}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">

                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                      savedStatus
                    )}`}
                  >
                    {savedStatus}
                  </span>

                  {query.assignedTo ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      <UserCheck className="h-3.5 w-3.5" />

                      Assigned to {query.assignedTo}
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

        {isViewOnly && (
          <div className="mb-6 flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Eye className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-amber-800">
                View Only Access
              </h3>

              <p className="mt-1 text-sm leading-6 text-amber-700">
                This query is not assigned to you. You can
                view all query information, but you cannot
                update the status or add management notes.
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
                    {query.type}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Claim Amount
                  </p>

                  <div className="mt-2 flex items-center gap-1">

                    <IndianRupee className="h-4 w-4 text-slate-500" />

                    <p className="font-bold text-slate-900">
                      {query.amount.replace("₹", "")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                </p>

                <p className="mt-3 leading-7 text-slate-600">
                  {query.description}
                </p>
              </div>
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

              <div className="grid gap-5 sm:grid-cols-3">

                <div>

                  <p className="text-xs font-medium text-slate-400">
                    Policy Number
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {query.policy.policyNumber}
                  </p>
                </div>

                <div>

                  <p className="text-xs font-medium text-slate-400">
                    Provider
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {query.policy.provider}
                  </p>
                </div>

                <div>

                  <p className="text-xs font-medium text-slate-400">
                    Policy Type
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {query.policy.policyType}
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

              <div className="space-y-3">

                {query.documents.map(
                  (document, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
                          <FileText className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-slate-800">
                            {document.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {document.type}
                          </p>
                        </div>
                      </div>

                      <button className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50">
                        View
                      </button>
                    </div>
                  )
                )}
              </div>
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

              <div className="space-y-6">

                {query.timeline.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="relative flex gap-4"
                    >
                      {index !==
                        query.timeline.length - 1 && (
                        <div className="absolute left-5 top-10 h-[calc(100%-10px)] w-px bg-slate-200" />
                      )}

                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">

                        {index ===
                        query.timeline.length - 1 ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>

                      <div className="pb-2">

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-sm font-bold text-slate-800">
                            {item.title}
                          </h3>

                          <span className="text-xs text-slate-400">
                            {item.date}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
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
                  {query.user.name
                    .split(" ")
                    .map((word) =>
                      word.charAt(0)
                    )
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>

                  <p className="font-bold text-slate-900">
                    {query.user.name}
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
                      {query.user.email}
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
                      {query.user.phone}
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

              {isViewOnly ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">

                  <div className="flex items-start gap-3">

                    <Lock className="mt-0.5 h-4 w-4 text-slate-400" />

                    <div>

                      <p className="text-sm font-bold text-slate-700">
                        View Only
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Only the assigned admin or Main Admin
                        can manage this query.
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
                            key={statusOption}
                            value={statusOption}
                          >
                            {statusOption}
                          </option>
                        )
                      )}
                    </select>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      This progress status follows the same
                      5-step claim flow shown to the user.
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
                          {savedStatus}
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

            {/* CURRENT ADMIN */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Admin
              </p>

              <div className="mt-4 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-md">

                  {currentUser.name
                    .split(" ")
                    .map((word) =>
                      word.charAt(0)
                    )
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>

                  <p className="text-sm font-bold text-slate-900">
                    {currentUser.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {isMainAdmin
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