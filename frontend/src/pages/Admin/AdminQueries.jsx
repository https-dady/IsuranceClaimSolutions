import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  UserPlus,
  RotateCcw,
  ClipboardList,
  X,
  CalendarDays,
  User,
  ShieldCheck,
  ArrowUpRight,
  Settings2,
  LockKeyhole,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import { currentUser } from "../../utils/currentUser";

import AdminLayout from "../../components/layout/AdminLayout";

/* =========================================================
   INITIAL QUERIES
========================================================= */

const initialQueries = [
  {
    id: "CLM-2026-001",
    user: "Rahul Sharma",
    email: "rahul@example.com",
    type: "Health Insurance",
    amount: "₹2,50,000",
    status: "Pending Review",
    assignedTo: null,
    date: "08 Sep 2026",
    priority: "High",
  },
  {
    id: "CLM-2026-002",
    user: "Priya Verma",
    email: "priya@example.com",
    type: "Motor Insurance",
    amount: "₹1,80,000",
    status: "Under Review",
    assignedTo: "Secondary Admin",
    date: "08 Sep 2026",
    priority: "Medium",
  },
  {
    id: "CLM-2026-003",
    user: "Amit Patel",
    email: "amit@example.com",
    type: "Life Insurance",
    amount: "₹8,00,000",
    status: "Assigned",
    assignedTo: "Main Admin",
    date: "07 Sep 2026",
    priority: "High",
  },
  {
    id: "CLM-2026-004",
    user: "Sneha Gupta",
    email: "sneha@example.com",
    type: "Property Insurance",
    amount: "₹4,50,000",
    status: "Resolved",
    assignedTo: "Secondary Admin",
    date: "06 Sep 2026",
    priority: "Low",
  },
  {
    id: "CLM-2026-005",
    user: "Rohan Singh",
    email: "rohan@example.com",
    type: "Health Insurance",
    amount: "₹3,20,000",
    status: "Pending Review",
    assignedTo: null,
    date: "05 Sep 2026",
    priority: "Medium",
  },
  {
    id: "CLM-2026-006",
    user: "Anjali Sharma",
    email: "anjali@example.com",
    type: "Motor Insurance",
    amount: "₹95,000",
    status: "Assigned",
    assignedTo: "Main Admin",
    date: "04 Sep 2026",
    priority: "Low",
  },
];

const secondaryAdmins = [
  "Akash Admin",
  "Riya Admin",
  "Suresh Admin",
];

/* =========================================================
   STATUS STYLE
========================================================= */

function getStatusStyle(status) {
  const styles = {
    "Pending Review":
      "border border-amber-200 bg-amber-50 text-amber-700",

    "Under Review":
      "border border-purple-200 bg-purple-50 text-purple-700",

    Assigned:
      "border border-blue-200 bg-blue-50 text-blue-700",

    Resolved:
      "border border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return styles[status] || "bg-slate-100 text-slate-600";
}

/* =========================================================
   PRIORITY STYLE
========================================================= */

function getPriorityStyle(priority) {
  const styles = {
    High: "border border-red-200 bg-red-50 text-red-600",

    Medium:
      "border border-amber-200 bg-amber-50 text-amber-600",

    Low:
      "border border-slate-200 bg-slate-100 text-slate-600",
  };

  return styles[priority];
}

/* =========================================================
   ADMIN QUERIES
========================================================= */

function AdminQueries() {
  const location = useLocation();

  const isMyAssignedQueriesPage =
    location.pathname === "/admin/my-assigned-queries";

  const [queries, setQueries] = useState(initialQueries);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [showFilters, setShowFilters] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [assignAdmin, setAssignAdmin] = useState("");

  /* =======================================================
     ROLE
  ======================================================= */

  const isMainAdmin =
    currentUser.role === "main_admin";

  /* =======================================================
     ACCESS CHECK
  ======================================================= */

  const canManageQuery = (query) => {
    if (isMainAdmin) {
      return true;
    }

    return query.assignedTo === currentUser.name;
  };

  /* =======================================================
     FILTERED QUERIES
  ======================================================= */

  const filteredQueries = useMemo(() => {
    return queries.filter((query) => {
      const matchesSearch =
        query.id
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        query.user
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        query.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        query.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        query.type === typeFilter;

      const matchesAssignedQueries =
        !isMyAssignedQueriesPage ||
        query.assignedTo === currentUser.name;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesAssignedQueries
      );
    });
  }, [
    queries,
    search,
    statusFilter,
    typeFilter,
    isMyAssignedQueriesPage,
  ]);

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
  };

  /* =======================================================
     ASSIGN QUERY
  ======================================================= */

  const handleAssign = () => {
    if (!assignAdmin || !selectedQuery) {
      return;
    }

    setQueries((previousQueries) =>
      previousQueries.map((query) =>
        query.id === selectedQuery.id
          ? {
              ...query,
              assignedTo: assignAdmin,
              status: "Assigned",
            }
          : query
      )
    );

    setSelectedQuery(null);
    setAssignAdmin("");
  };

  /* =======================================================
     UNASSIGN QUERY
  ======================================================= */

  const handleUnassign = () => {
    if (!selectedQuery) {
      return;
    }

    setQueries((previousQueries) =>
      previousQueries.map((query) =>
        query.id === selectedQuery.id
          ? {
              ...query,
              assignedTo: null,
              status: "Pending Review",
            }
          : query
      )
    );

    setSelectedQuery(null);
    setAssignAdmin("");
  };

  /* =======================================================
     PAGE CONTENT
  ======================================================= */

  return (
    <AdminLayout role={currentUser.role}>
      <div className="mx-auto w-full max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                <ClipboardList className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Query Management
                </p>

                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {isMyAssignedQueriesPage
                    ? "My Assigned Queries"
                    : "All Queries"}
                </h1>
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {isMyAssignedQueriesPage
                ? "Manage only the queries assigned to you."
                : "View, assign and manage all insurance queries."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-500">
                Total Showing
              </p>

              <p className="text-lg font-bold text-slate-900">
                {filteredQueries.length}
              </p>
            </div>

            {isMainAdmin && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-xs text-blue-500">
                  Access Level
                </p>

                <p className="text-sm font-bold text-blue-700">
                  Full Management
                </p>
              </div>
            )}

            {!isMainAdmin && (
              <div className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-3">
                <p className="text-xs text-purple-500">
                  Access Level
                </p>

                <p className="text-sm font-bold text-purple-700">
                  Assigned Queries Only
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            SEARCH + FILTERS
        ================================================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

            {/* SEARCH */}

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search by claim ID, user name or email..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* FILTER BUTTON */}

            <button
              onClick={() =>
                setShowFilters((previous) => !previous)
              }
              className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-all ${
                showFilters
                  ? "border-blue-200 bg-blue-50 text-blue-600"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />

              Filters

              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {(search ||
              statusFilter !== "All" ||
              typeFilter !== "All") && (
              <button
                onClick={clearFilters}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
              >
                <RotateCcw className="h-4 w-4" />

                Reset
              </button>
            )}
          </div>

          {/* FILTER PANEL */}

          {showFilters && (
            <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="All">
                    All Status
                  </option>

                  <option value="Pending Review">
                    Pending Review
                  </option>

                  <option value="Under Review">
                    Under Review
                  </option>

                  <option value="Assigned">
                    Assigned
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Insurance Type
                </label>

                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="All">
                    All Types
                  </option>

                  <option value="Health Insurance">
                    Health Insurance
                  </option>

                  <option value="Motor Insurance">
                    Motor Insurance
                  </option>

                  <option value="Life Insurance">
                    Life Insurance
                  </option>

                  <option value="Property Insurance">
                    Property Insurance
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Query
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Assigned To
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredQueries.map((query) => {
                  const canManage =
                    canManageQuery(query);

                  return (
                    <tr
                      key={query.id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      {/* QUERY */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <ClipboardList className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {query.id}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                              <CalendarDays className="h-3.5 w-3.5" />

                              {query.date}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* USER */}

                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium text-slate-800">
                            {query.user}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {query.email}
                          </p>
                        </div>
                      </td>

                      {/* TYPE */}

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-slate-700">
                          {query.type}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {query.amount}
                        </p>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                            query.status
                          )}`}
                        >
                          {query.status}
                        </span>
                      </td>

                      {/* ASSIGNED */}

                      <td className="px-6 py-5">
                        {query.assignedTo ? (
                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                              {query.assignedTo
                                .split(" ")
                                .map((word) =>
                                  word.charAt(0)
                                )
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>

                            <p className="text-sm font-medium text-slate-700">
                              {query.assignedTo}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            Not Assigned
                          </span>
                        )}
                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">

                          {/* ASSIGN - MAIN ADMIN ONLY */}

                          {isMainAdmin && (
                            <button
                              onClick={() => {
                                setSelectedQuery(query);
                                setAssignAdmin(
                                  query.assignedTo || ""
                                );
                              }}
                              className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <UserPlus className="h-4 w-4" />

                              Assign
                            </button>
                          )}

                          {/* MANAGE / VIEW */}

                          <Link
                            to={`/admin/queries/${query.id}`}
                            state={{
                              from:
                                isMyAssignedQueriesPage
                                  ? "/admin/my-assigned-queries"
                                  : "/admin/queries",

                              fromAssignedQueries:
                                isMyAssignedQueriesPage,

                              canManage,
                            }}
                            className={`flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition-colors ${
                              canManage
                                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {canManage ? (
                              <Settings2 className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}

                            {canManage
                              ? "Manage"
                              : "View"}
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* EMPTY STATE */}

          {filteredQueries.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No queries found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* =================================================
            MOBILE CARDS
        ================================================= */}

        <div className="space-y-4 lg:hidden">

          {filteredQueries.map((query) => {
            const canManage =
              canManageQuery(query);

            return (
              <div
                key={query.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                {/* TOP */}

                <div className="flex items-start justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <ClipboardList className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">

                      <p className="truncate font-bold text-slate-900">
                        {query.id}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {query.user}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getPriorityStyle(
                      query.priority
                    )}`}
                  >
                    {query.priority}
                  </span>
                </div>

                {/* DETAILS */}

                <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-xs font-medium text-slate-400">
                      Insurance
                    </span>

                    <span className="text-right text-sm font-semibold text-slate-700">
                      {query.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-xs font-medium text-slate-400">
                      Amount
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {query.amount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-xs font-medium text-slate-400">
                      Status
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                        query.status
                      )}`}
                    >
                      {query.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-xs font-medium text-slate-400">
                      Assigned
                    </span>

                    <span className="text-right text-sm font-semibold text-slate-700">
                      {query.assignedTo ||
                        "Not Assigned"}
                    </span>
                  </div>
                </div>

                {/* ACTION */}

                <div className="mt-5 flex gap-3">

                  {isMainAdmin && (
                    <button
                      onClick={() => {
                        setSelectedQuery(query);
                        setAssignAdmin(
                          query.assignedTo || ""
                        );
                      }}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <UserPlus className="h-4 w-4" />

                      Assign
                    </button>
                  )}

                  <Link
                    to={`/admin/queries/${query.id}`}
                    state={{
                      from:
                        isMyAssignedQueriesPage
                          ? "/admin/my-assigned-queries"
                          : "/admin/queries",

                      fromAssignedQueries:
                        isMyAssignedQueriesPage,

                      canManage,
                    }}
                    className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
                      canManage
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {canManage ? (
                      <Settings2 className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}

                    {canManage
                      ? "Manage"
                      : "View"}
                  </Link>
                </div>
              </div>
            );
          })}

          {filteredQueries.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No queries found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your filters.
              </p>
            </div>
          )}
        </div>

        {/* =================================================
            ASSIGN MODAL
        ================================================= */}

        {selectedQuery && isMainAdmin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            {/* OVERLAY */}

            <div
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
              onClick={() => {
                setSelectedQuery(null);
                setAssignAdmin("");
              }}
            />

            {/* MODAL */}

            <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <UserPlus className="h-6 w-6" />
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-slate-900">
                    Assign Query
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Assign{" "}
                    <span className="font-semibold text-slate-700">
                      {selectedQuery.id}
                    </span>{" "}
                    to a secondary admin.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedQuery(null);
                    setAssignAdmin("");
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* SELECT */}

              <div className="mt-6">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Select Secondary Admin
                </label>

                <select
                  value={assignAdmin}
                  onChange={(event) =>
                    setAssignAdmin(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">
                    Select Admin
                  </option>

                  {secondaryAdmins.map((admin) => (
                    <option
                      key={admin}
                      value={admin}
                    >
                      {admin}
                    </option>
                  ))}
                </select>
              </div>

              {/* BUTTONS */}

              <div className="mt-6 flex gap-3">

                {selectedQuery.assignedTo && (
                  <button
                    onClick={handleUnassign}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                  >
                    <LockKeyhole className="h-4 w-4" />

                    Unassign
                  </button>
                )}

                <button
                  onClick={handleAssign}
                  disabled={!assignAdmin}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4" />

                  Save Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminQueries;