import { useEffect, useMemo, useState } from "react";
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
  ShieldCheck,
  Settings2,
  LockKeyhole,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import {
  getAdminQueries,
  assignQuery,
  unassignQuery,
} from "../../api/queryApi";

import { getAdmins } from "../../api/adminApi";

import { useAuth } from "../../context/AuthContext";

import AdminLayout from "../../components/layout/AdminLayout";

/* =========================================================
   BACKEND -> FRONTEND STATUS
========================================================= */

const statusMap = {
  "Query Submitted": "Pending Review",
  "Under Initial Review": "Under Review",
  "Document Review": "Under Review",
  "Claim Processing": "Under Review",
  Resolution: "Resolved",
};

/* =========================================================
   BACKEND -> FRONTEND INSURANCE TYPE
========================================================= */

const insuranceTypeMap = {
  Health: "Health Insurance",
  Motor: "Motor Insurance",
  Life: "Life Insurance",
  Property: "Property Insurance",
  Travel: "Travel Insurance",
  Other: "Other",
};

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
   FORMAT QUERY
========================================================= */

function formatQuery(query) {
  const insuranceType =
    query?.insuranceDetails?.insuranceType || "";

  const claimAmount =
    query?.claimDetails?.claimAmount;

  const amount =
    claimAmount !== undefined &&
    claimAmount !== null &&
    claimAmount !== ""
      ? `₹${Number(claimAmount).toLocaleString("en-IN")}`
      : "—";

  const createdAt = query?.createdAt
    ? new Date(query.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "—";

  return {
    ...query,

    id: query?.queryId || query?._id,

    user:
      query?.personalDetails?.fullName ||
      query?.user?.name ||
      "Unknown User",

    email:
      query?.personalDetails?.email ||
      query?.user?.email ||
      "—",

    type:
      insuranceTypeMap[insuranceType] ||
      insuranceType ||
      "—",

    amount,

    status:
      statusMap[query?.status] ||
      query?.status ||
      "—",

    assignedTo:
      query?.assignedAdmin?.name ||
      null,

    assignedAdminId:
      query?.assignedAdmin?._id ||
      null,

    date: createdAt,
  };
}

/* =========================================================
   ADMIN QUERIES
========================================================= */

function AdminQueries() {
  const location = useLocation();

  const { user, isMainAdmin } = useAuth();

  const isMyAssignedQueriesPage =
    location.pathname === "/admin/my-assigned-queries";

  /* =======================================================
     STATE
  ======================================================= */

  const [queries, setQueries] = useState([]);

  const [secondaryAdmins, setSecondaryAdmins] =
    useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedQuery, setSelectedQuery] =
    useState(null);

  const [assignAdmin, setAssignAdmin] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isLoadingAdmins, setIsLoadingAdmins] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH QUERIES
  ======================================================= */

  const loadQueries = async () => {
    try {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (statusFilter !== "All") {
        params.set("status", statusFilter);
      }

      if (typeFilter !== "All") {
        const backendType =
          typeFilter === "Health Insurance"
            ? "Health"
            : typeFilter === "Motor Insurance"
            ? "Motor"
            : typeFilter === "Life Insurance"
            ? "Life"
            : typeFilter === "Property Insurance"
            ? "Property"
            : typeFilter === "Travel Insurance"
            ? "Travel"
            : typeFilter;

        params.set("type", backendType);
      }

      const response = await getAdminQueries(
        params.toString()
      );

      const backendQueries =
        Array.isArray(response?.queries)
          ? response.queries
          : [];

      setQueries(
        backendQueries.map(formatQuery)
      );
    } catch (requestError) {
      console.error(
        "Failed to load admin queries:",
        requestError
      );

      setError(
        requestError?.message ||
          "Failed to load queries."
      );

      setQueries([]);
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================================================
     FETCH SECONDARY ADMINS
  ======================================================= */

  const loadSecondaryAdmins = async () => {
    if (!isMainAdmin) {
      return;
    }

    try {
      setIsLoadingAdmins(true);

      const response = await getAdmins();

      const admins = Array.isArray(
        response?.admins
      )
        ? response.admins
        : Array.isArray(response)
        ? response
        : [];

      setSecondaryAdmins(
        admins.filter(
          (admin) =>
            admin?.type === "admin" &&
            admin?.role === "secondary_admin"
        )
      );
    } catch (requestError) {
      console.error(
        "Failed to load secondary admins:",
        requestError
      );

      setSecondaryAdmins([]);
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  /* =======================================================
     INITIAL / FILTER LOAD
  ======================================================= */

  useEffect(() => {
    loadQueries();
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    loadSecondaryAdmins();
  }, [isMainAdmin]);

  /* =======================================================
     ACCESS CHECK
  ======================================================= */

  const canManageQuery = (query) => {
    if (isMainAdmin) {
      return true;
    }

    if (
      !user ||
      user.type !== "admin" ||
      user.role !== "secondary_admin"
    ) {
      return false;
    }

    return (
      query?.assignedAdminId &&
      query.assignedAdminId === user.id
    );
  };

  /* =======================================================
     MY ASSIGNED QUERIES
  ======================================================= */

  const filteredQueries = useMemo(() => {
    if (!isMyAssignedQueriesPage) {
      return queries;
    }

    if (!user?.id) {
      return [];
    }

    return queries.filter(
      (query) =>
        query?.assignedAdminId === user.id
    );
  }, [
    queries,
    isMyAssignedQueriesPage,
    user?.id,
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
     OPEN ASSIGN MODAL
  ======================================================= */

  const openAssignModal = (query) => {
    setSelectedQuery(query);

    setAssignAdmin(
      query?.assignedAdminId || ""
    );

    setError("");
  };

  /* =======================================================
     CLOSE ASSIGN MODAL
  ======================================================= */

  const closeAssignModal = () => {
    if (isSaving) {
      return;
    }

    setSelectedQuery(null);
    setAssignAdmin("");
  };

  /* =======================================================
     ASSIGN QUERY
  ======================================================= */

  const handleAssign = async () => {
    if (
      !selectedQuery ||
      !assignAdmin ||
      isSaving
    ) {
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      await assignQuery(
        selectedQuery.id,
        assignAdmin
      );

      await loadQueries();

      setSelectedQuery(null);
      setAssignAdmin("");
    } catch (requestError) {
      console.error(
        "Failed to assign query:",
        requestError
      );

      setError(
        requestError?.message ||
          "Failed to assign query."
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     UNASSIGN QUERY
  ======================================================= */

  const handleUnassign = async () => {
    if (
      !selectedQuery ||
      isSaving
    ) {
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      await unassignQuery(
        selectedQuery.id
      );

      await loadQueries();

      setSelectedQuery(null);
      setAssignAdmin("");
    } catch (requestError) {
      console.error(
        "Failed to unassign query:",
        requestError
      );

      setError(
        requestError?.message ||
          "Failed to unassign query."
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     PAGE CONTENT
  ======================================================= */

  return (
    <AdminLayout
      role={user?.role}
    >
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
                {isLoading
                  ? "..."
                  : filteredQueries.length}
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
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

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
                setShowFilters(
                  (previous) => !previous
                )
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
                  showFilters
                    ? "rotate-180"
                    : ""
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
                    setStatusFilter(
                      event.target.value
                    )
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
                    setTypeFilter(
                      event.target.value
                    )
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

                  <option value="Travel Insurance">
                    Travel Insurance
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-5 text-sm font-medium text-slate-500">
              Loading queries...
            </p>
          </div>
        )}

        {/* =================================================
            TABLE
        ================================================= */}

        {!isLoading && (
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

                  {filteredQueries.map(
                    (query) => {
                      const canManage =
                        canManageQuery(query);

                      return (
                        <tr
                          key={
                            query.id
                          }
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
                                    .map(
                                      (
                                        word
                                      ) =>
                                        word.charAt(
                                          0
                                        )
                                    )
                                    .join("")
                                    .slice(
                                      0,
                                      2
                                    )
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

                              {isMainAdmin && (
                                <button
                                  onClick={() =>
                                    openAssignModal(
                                      query
                                    )
                                  }
                                  className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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
                    }
                  )}
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

                {(search ||
                  statusFilter !==
                    "All" ||
                  typeFilter !==
                    "All") && (
                  <button
                    onClick={
                      clearFilters
                    }
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* =================================================
            MOBILE CARDS
        ================================================= */}

        {!isLoading && (
          <div className="space-y-4 lg:hidden">

            {filteredQueries.map(
              (query) => {
                const canManage =
                  canManageQuery(
                    query
                  );

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
                          onClick={() =>
                            openAssignModal(
                              query
                            )
                          }
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
              }
            )}

            {filteredQueries.length ===
              0 && (
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
        )}

        {/* =================================================
            ASSIGN MODAL
        ================================================= */}

        {selectedQuery &&
          isMainAdmin && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

              {/* OVERLAY */}

              <div
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
                onClick={
                  closeAssignModal
                }
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
                        {
                          selectedQuery.id
                        }
                      </span>{" "}
                      to a secondary admin.
                    </p>
                  </div>

                  <button
                    onClick={
                      closeAssignModal
                    }
                    disabled={isSaving}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                      setAssignAdmin(
                        event.target.value
                      )
                    }
                    disabled={
                      isLoadingAdmins ||
                      isSaving
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                  >
                    <option value="">
                      {isLoadingAdmins
                        ? "Loading Admins..."
                        : "Select Admin"}
                    </option>

                    {secondaryAdmins.map(
                      (admin) => (
                        <option
                          key={
                            admin._id
                          }
                          value={
                            admin._id
                          }
                        >
                          {admin.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* BUTTONS */}

                <div className="mt-6 flex gap-3">

                  {selectedQuery.assignedAdminId && (
                    <button
                      onClick={
                        handleUnassign
                      }
                      disabled={isSaving}
                      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <LockKeyhole className="h-4 w-4" />

                      {isSaving
                        ? "Saving..."
                        : "Unassign"}
                    </button>
                  )}

                  <button
                    onClick={
                      handleAssign
                    }
                    disabled={
                      !assignAdmin ||
                      isSaving
                    }
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShieldCheck className="h-4 w-4" />

                    {isSaving
                      ? "Saving..."
                      : "Save Assignment"}
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