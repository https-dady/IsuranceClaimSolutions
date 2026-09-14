import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  ShieldCheck,
  UserCog,
  Eye,
  Clock,
  AlertTriangle,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";

import { useAuth } from "../../context/AuthContext";

import { getUsers } from "../../api/userApi";
import { getAdminQueries } from "../../api/queryApi";

function formatDate(date) {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name) {
  if (!name) {
    return "U";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getUserId(user) {
  return user?._id || user?.id || "";
}

function getRoleLabel(role) {
  if (role === "main_admin") {
    return "Main Admin";
  }

  if (role === "secondary_admin") {
    return "Secondary Admin";
  }

  return "User";
}

function AdminUsers() {
  const { isMainAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [queries, setQueries] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  /* =======================================================
     FETCH USERS + QUERY DATA
  ======================================================= */

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [usersResponse, queriesResponse] =
        await Promise.all([
          getUsers(),
          getAdminQueries(),
        ]);

      setUsers(
        Array.isArray(usersResponse?.users)
          ? usersResponse.users
          : []
      );

      setQueries(
        Array.isArray(queriesResponse?.queries)
          ? queriesResponse.queries
          : []
      );
    } catch (error) {
      console.error(
        "Fetch admin users error:",
        error
      );

      setUsers([]);
      setQueries([]);

      setErrorMessage(
        error.message ||
          "Failed to fetch users."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isMainAdmin) {
      setIsLoading(false);
      return;
    }

    fetchUsers();
  }, [isMainAdmin]);

  /* =======================================================
     QUERY COUNT BY USER
  ======================================================= */

  const queryCountByUser = useMemo(() => {
    const counts = {};

    queries.forEach((query) => {
      const userId =
        getUserId(query?.user);

      if (!userId) {
        return;
      }

      counts[userId] =
        (counts[userId] || 0) + 1;
    });

    return counts;
  }, [queries]);

  /* =======================================================
     FILTER USERS
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const name =
        user?.name?.toLowerCase() || "";

      const email =
        user?.email?.toLowerCase() || "";

      const phone =
        user?.phone?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        phone.includes(normalizedSearch);

      const matchesRole =
        roleFilter === "all" ||
        user?.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [
    users,
    searchTerm,
    roleFilter,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const totalUsers = users.length;

  const normalUsers = users.filter(
    (user) => user?.role === "user"
  ).length;

  const secondaryAdmins = users.filter(
    (user) =>
      user?.role === "secondary_admin"
  ).length;

  const mainAdmins = users.filter(
    (user) =>
      user?.role === "main_admin"
  ).length;

  /* =======================================================
     NON MAIN-ADMIN ACCESS
  ======================================================= */

  if (!isMainAdmin) {
    return (
      <AdminLayout>
        <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600">
            <ShieldCheck className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Main Admin Access Required
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            User management is available only to the
            Main Admin.
          </p>
        </div>
      </AdminLayout>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <AdminLayout role="main_admin">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
            <Clock className="h-5 w-5 animate-spin" />
            Loading users...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout role="main_admin">
      <div className="w-full">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Manage and view all registered users
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Users
          </h1>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <p className="text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          </div>
        )}

        {/* =================================================
            STATS
        ================================================= */}

        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Users */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {totalUsers}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-6 w-6" />
              </div>

            </div>
          </div>

          {/* Normal Users */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Normal Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {normalUsers}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Users className="h-6 w-6" />
              </div>

            </div>
          </div>

          {/* Secondary Admins */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Secondary Admins
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {secondaryAdmins}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <UserCog className="h-6 w-6" />
              </div>

            </div>
          </div>

          {/* Main Admin */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Main Admin
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {mainAdmins}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ShieldCheck className="h-6 w-6" />
              </div>

            </div>
          </div>

        </div>

        {/* =================================================
            USER MANAGEMENT
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* =================================================
              TOP SECTION
          ================================================= */}

          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                All Users
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View registered users and their roles
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Search */}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 sm:w-64"
                />
              </div>

              {/* Role Filter */}

              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(
                    event.target.value
                  )
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-500"
              >
                <option value="all">
                  All Roles
                </option>

                <option value="user">
                  Users
                </option>

                <option value="secondary_admin">
                  Secondary Admins
                </option>

                <option value="main_admin">
                  Main Admin
                </option>
              </select>

            </div>
          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-slate-100 bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Queries
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map(
                  (user) => {
                    const userId =
                      getUserId(user);

                    const queryCount =
                      queryCountByUser[
                        userId
                      ] || 0;

                    return (
                      <tr
                        key={userId}
                        className="border-b border-slate-100 last:border-none hover:bg-slate-50/70"
                      >

                        {/* User */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                              {getInitials(
                                user.name
                              )}
                            </div>

                            <div className="min-w-0">

                              <p className="font-semibold text-slate-900">
                                {user.name ||
                                  "Unnamed User"}
                              </p>

                              <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-500">
                                ID:{" "}
                                {userId ||
                                  "N/A"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Contact */}

                        <td className="px-6 py-5">

                          <p className="text-sm text-slate-700">
                            {user.email ||
                              "N/A"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {user.phone ||
                              "N/A"}
                          </p>

                        </td>

                        {/* Role */}

                        <td className="px-6 py-5">

                          {user.role ===
                            "main_admin" && (
                            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                              Main Admin
                            </span>
                          )}

                          {user.role ===
                            "secondary_admin" && (
                            <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">
                              Secondary Admin
                            </span>
                          )}

                          {user.role ===
                            "user" && (
                            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                              User
                            </span>
                          )}

                          {![
                            "main_admin",
                            "secondary_admin",
                            "user",
                          ].includes(
                            user.role
                          ) && (
                            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                              {getRoleLabel(
                                user.role
                              )}
                            </span>
                          )}

                        </td>

                        {/* Queries */}

                        <td className="px-6 py-5">

                          <span className="text-sm font-semibold text-slate-700">
                            {queryCount}
                          </span>

                        </td>

                        {/* Joined */}

                        <td className="px-6 py-5">

                          <span className="text-sm text-slate-600">
                            {formatDate(
                              user.createdAt
                            )}
                          </span>

                        </td>

                        {/* Action */}

                        <td className="px-6 py-5 text-right">

                          <button
                            type="button"
                            disabled
                            title="User details"
                            className="inline-flex h-10 w-10 cursor-default items-center justify-center rounded-xl border border-slate-200 text-slate-400"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {filteredUsers.length === 0 && (
              <div className="py-16 text-center">

                <Users className="mx-auto h-10 w-10 text-slate-300" />

                <h3 className="mt-4 font-semibold text-slate-700">
                  No users found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filter.
                </p>

              </div>
            )}

          </div>

        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;