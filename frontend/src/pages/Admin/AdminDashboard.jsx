import {
  ClipboardList,
  Clock3,
  SearchCheck,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import AdminLayout from "../../components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";

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

function formatAmount(amount) {
  if (amount === null || amount === undefined || amount === "") {
    return "—";
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return String(amount);
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeRecentStatus(status, assignedTo) {
  if (assignedTo) return "Assigned";

  const statusMap = {
    "Query Submitted": "Pending Review",
    "Under Initial Review": "Under Review",
    "Document Review": "Under Review",
    "Claim Processing": "Under Review",
    Resolution: "Resolved",
  };

  return statusMap[status] || status || "—";
}

function AdminDashboard() {
  const { user, isMainAdmin } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getAdminDashboard();

        if (isMounted) {
          setDashboard(response);
        }
      } catch (requestError) {
        console.error("Failed to load admin dashboard:", requestError);

        if (isMounted) {
          setError(
            requestError?.message ||
              "Unable to load dashboard data. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      title: "Total Queries",
      value: dashboard?.stats?.totalQueries ?? 0,
      change: "",
      description: "From all submitted claims",
      icon: ClipboardList,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      changeColor: "text-emerald-600",
    },
    {
      title: "Pending Review",
      value: dashboard?.stats?.pendingReview ?? 0,
      change: "Needs attention",
      description: "Waiting for initial review",
      icon: Clock3,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      changeColor: "text-amber-600",
    },
    {
      title: "Under Review",
      value: dashboard?.stats?.underReview ?? 0,
      change: "",
      description: "Currently being processed",
      icon: SearchCheck,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      changeColor: "text-purple-600",
    },
    {
      title: "Assigned Queries",
      value: dashboard?.stats?.assignedQueries ?? 0,
      change: "",
      description: "Currently assigned to admins",
      icon: UserCheck,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      changeColor: "text-cyan-600",
    },
    {
      title: "Resolved Claims",
      value: dashboard?.stats?.resolvedClaims ?? 0,
      change: "",
      description: "Successfully completed",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      changeColor: "text-emerald-600",
    },
  ];

  const recentQueries = (dashboard?.recentQueries || []).map((query) => ({
    ...query,
    type: query.type || "—",
    amount: formatAmount(query.amount),
    status: normalizeRecentStatus(query.status, query.assignedTo),
    date: formatDate(query.date),
  }));

  const statusOverview = (dashboard?.statusOverview || []).map((status) => {
    const colorMap = {
      "Pending Review": "bg-amber-500",
      "Under Review": "bg-purple-500",
      Assigned: "bg-blue-500",
      Resolved: "bg-emerald-500",
    };

    return {
      name: status.label,
      count: status.count,
      percentage: status.percentage,
      color: colorMap[status.label] || "bg-slate-500",
    };
  });

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
            Loading live dashboard data...
          </div>
        )}

        {/* ================= PAGE HEADING ================= */}

        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                System Active
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back, {user?.name || "Admin"} 👋
            </h1>

            <p className="mt-2 text-slate-500">
              Here&apos;s what&apos;s happening with insurance claims today.
            </p>
          </div>

          <Link
            to="/admin/queries"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            View All Queries

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

        </div>

        {/* ================= STATS ================= */}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-5 flex items-start justify-between">

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-slate-300 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>

                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <div className="mt-2 flex items-end justify-between gap-2">

                  <h2 className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </h2>

                  <span
                    className={`mb-1 text-xs font-semibold ${stat.changeColor}`}
                  >
                    {stat.change}
                  </span>

                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {stat.description}
                </p>

              </div>
            );
          })}

        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.6fr_0.8fr]">

          {/* ================= RECENT QUERIES ================= */}

          <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Queries
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest insurance claim submissions
                </p>
              </div>

              <Link
                to="/admin/queries"
                className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                View all
              </Link>

            </div>

            {/* Desktop Table */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Claim ID
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      User
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Insurance
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {recentQueries.map((query) => (
                    <tr
                      key={query.id}
                      className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/70"
                    >

                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {query.id}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {query.date}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <p className="text-sm font-medium text-slate-700">
                          {query.user}
                        </p>
                      </td>

                      <td className="px-4 py-5">
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {query.type}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {query.amount}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            query.status
                          )}`}
                        >
                          {query.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          to={`/admin/queries/${query.id}`}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          aria-label={`View ${query.id}`}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            {/* Mobile Cards */}

            <div className="space-y-3 p-4 md:hidden">

              {recentQueries.map((query) => (
                <Link
                  key={query.id}
                  to={`/admin/queries/${query.id}`}
                  className="block rounded-xl border border-slate-100 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <p className="font-semibold text-slate-900">
                        {query.id}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {query.user}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                        query.status
                      )}`}
                    >
                      {query.status}
                    </span>

                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      {query.type}
                    </span>

                    <span className="font-semibold text-slate-700">
                      {query.amount}
                    </span>

                  </div>

                </Link>
              ))}

            </div>

          </section>

          {/* ================= STATUS OVERVIEW ================= */}

          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Claim Status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current query distribution
                </p>
              </div>

              <TrendingUp className="h-5 w-5 text-blue-500" />

            </div>

            <div className="mt-8 space-y-7">

              {statusOverview.map((status) => (
                <div key={status.name}>

                  <div className="mb-3 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${status.color}`}
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {status.name}
                      </span>

                    </div>

                    <span className="text-sm font-bold text-slate-900">
                      {status.count}
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className={`h-full rounded-full ${status.color}`}
                      style={{
                        width: `${status.percentage}%`,
                      }}
                    />

                  </div>

                </div>
              ))}

            </div>

            {/* Footer */}

            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4">

              <div className="flex gap-3">

                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    {dashboard?.stats?.pendingReview ?? 0} queries need attention
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-blue-700">
                    These claims are waiting for an admin to begin the
                    initial review process.
                  </p>
                </div>

              </div>

            </div>

          </section>

        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="mt-8">

          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Quickly manage important tasks
            </p>
          </div>

          <div
            className={`grid gap-4 sm:grid-cols-2 ${
              isMainAdmin ? "lg:grid-cols-3" : ""
            }`}
          >

            {/* Review Queries */}

            <Link
              to="/admin/queries"
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <ClipboardList className="h-8 w-8 text-blue-600" />

              <h3 className="mt-4 font-bold text-slate-900">
                Review Queries
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Check and manage submitted claims.
              </p>

              <div className="mt-4 flex items-center text-sm font-semibold text-blue-600">
                Open queries

                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Manage Users */}

            <Link
              to="/admin/users"
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <UserCheck className="h-8 w-8 text-purple-600" />

              <h3 className="mt-4 font-bold text-slate-900">
                Manage Users
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                View users and their submitted queries.
              </p>

              <div className="mt-4 flex items-center text-sm font-semibold text-blue-600">
                View users

                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* ================= MAIN ADMIN ONLY ================= */}

            {isMainAdmin && (
              <Link
                to="/admin/admin-management"
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg"
              >
                <UserCheck className="h-8 w-8 text-amber-600" />

                <h3 className="mt-4 font-bold text-slate-900">
                  Admin Management
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Manage secondary admin access.
                </p>

                <div className="mt-4 flex items-center text-sm font-semibold text-amber-600">
                  Manage admins

                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )}

          </div>

        </section>

      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;