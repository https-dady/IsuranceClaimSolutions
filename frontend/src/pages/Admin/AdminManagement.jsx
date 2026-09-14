import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Search,
  UserPlus,
  UserMinus,
  Users,
  ClipboardList,
  Check,
  AlertTriangle,
  Clock,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import AdminLayout from "../../components/layout/AdminLayout";

import { useAuth } from "../../context/AuthContext";

import {
  getAdmins,
  removeSecondaryAdmin,
} from "../../api/adminApi";

import { getAdminQueries } from "../../api/queryApi";


function getId(item) {
  return item?._id || item?.id || "";
}


function getInitials(name) {
  if (!name) {
    return "A";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) =>
      word.charAt(0)
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();
}


function AdminManagement() {
  const navigate = useNavigate();

  const { isMainAdmin } = useAuth();

  const [admins, setAdmins] = useState([]);
  const [queries, setQueries] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");


  /*
  =======================================================
  FETCH ADMIN MANAGEMENT DATA
  =======================================================
  */

  const fetchAdminManagementData =
    async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [
          adminsResponse,
          queriesResponse,
        ] = await Promise.all([
          getAdmins(),
          getAdminQueries(),
        ]);

        setAdmins(
          Array.isArray(
            adminsResponse?.admins
          )
            ? adminsResponse.admins
            : []
        );

        setQueries(
          Array.isArray(
            queriesResponse?.queries
          )
            ? queriesResponse.queries
            : []
        );

      } catch (error) {
        console.error(
          "Fetch admin management data error:",
          error
        );

        setErrorMessage(
          error.message ||
            "Failed to load admin management data."
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

    fetchAdminManagementData();
  }, [isMainAdmin]);


  /*
  =======================================================
  ASSIGNED QUERY COUNT
  =======================================================
  */

  const assignedQueryCountByAdmin =
    useMemo(() => {
      const counts = {};

      queries.forEach((query) => {
        const adminId =
          getId(
            query?.assignedAdmin
          );

        if (!adminId) {
          return;
        }

        counts[adminId] =
          (counts[adminId] || 0) + 1;
      });

      return counts;
    }, [queries]);


  /*
  =======================================================
  SEARCH ADMINS
  =======================================================
  */

  const filteredAdmins = useMemo(() => {
    const normalizedSearch =
      searchTerm
        .trim()
        .toLowerCase();

    return admins.filter((admin) => {
      const name =
        admin?.name?.toLowerCase() ||
        "";

      const email =
        admin?.email?.toLowerCase() ||
        "";

      return (
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch)
      );
    });
  }, [admins, searchTerm]);


  /*
  =======================================================
  STATS
  =======================================================
  */

  const secondaryAdmins =
    admins.filter(
      (admin) =>
        admin?.role ===
        "secondary_admin"
    );

  const totalAssignedQueries =
    queries.filter(
      (query) =>
        !!query?.assignedAdmin
    ).length;


  /*
  =======================================================
  REMOVE SECONDARY ADMIN
  =======================================================
  */

  const handleRemoveAdmin =
    async (adminId) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to remove this Secondary Admin?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        await removeSecondaryAdmin(
          adminId
        );

        setSuccessMessage(
          "Secondary Admin removed successfully."
        );

        await fetchAdminManagementData();

      } catch (error) {
        console.error(
          "Remove admin error:",
          error
        );

        setErrorMessage(
          error.message ||
            "Failed to remove Secondary Admin."
        );
      } finally {
        setActionLoading(false);
      }
    };


  /*
  =======================================================
  ACCESS CONTROL
  =======================================================
  */

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
            Admin management is available only to
            the Main Admin.
          </p>

        </div>
      </AdminLayout>
    );
  }


  /*
  =======================================================
  LOADING
  =======================================================
  */

  if (isLoading) {
    return (
      <AdminLayout role="main_admin">

        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">

          <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">

            <Clock className="h-5 w-5 animate-spin" />

            Loading admin management...

          </div>

        </div>

      </AdminLayout>
    );
  }


  return (
    <AdminLayout role="main_admin">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20">

                <ShieldCheck className="h-6 w-6 text-white" />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Admin Management
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage secondary admins and their access.
                </p>

              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/create-secondary-admin"
              )
            }
            disabled={actionLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <UserPlus className="h-5 w-5" />

            Make Admin

          </button>

        </div>


        {/* =================================================
            MESSAGES
        ================================================= */}

        {successMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

            <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

            <p className="text-sm font-medium text-emerald-700">
              {successMessage}
            </p>

          </div>
        )}


        {errorMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <p className="text-sm font-medium text-red-700">
              {errorMessage}
            </p>

          </div>
        )}


        {/* =================================================
            STATS
        ================================================= */}

        <div className="mt-8 grid gap-5 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                <Users className="h-6 w-6 text-blue-600" />

              </div>

              <span className="text-sm font-medium text-slate-400">
                Current
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {secondaryAdmins.length}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-600">
              Secondary Admins
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">

                <ClipboardList className="h-6 w-6 text-purple-600" />

              </div>

              <span className="text-sm font-medium text-slate-400">
                Total
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {totalAssignedQueries}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-600">
              Assigned Queries
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">

                <UserPlus className="h-6 w-6 text-slate-600" />

              </div>

              <span className="text-sm font-medium text-slate-400">
                Action
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              +
            </p>

            <p className="mt-1 text-sm font-medium text-slate-600">
              Create New Secondary Admin
            </p>

          </div>

        </div>


        {/* =================================================
            ADMIN LIST
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-5 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Secondary Admins
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage admin access and assigned workload.
              </p>

            </div>


            <div className="relative w-full md:w-72">

              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search admin..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />

            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50/60 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Admin
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Assigned Queries
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredAdmins.map(
                  (admin) => {

                    const adminId =
                      getId(admin);

                    const assignedQueries =
                      assignedQueryCountByAdmin[
                        adminId
                      ] || 0;

                    return (
                      <tr
                        key={adminId}
                        className="border-b border-slate-50 last:border-none hover:bg-slate-50/70"
                      >

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">

                              {getInitials(
                                admin?.name
                              )}

                            </div>

                            <div>

                              <p className="text-sm font-bold text-slate-800">
                                {admin?.name ||
                                  "Unnamed Admin"}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {admin?.email ||
                                  "N/A"}
                              </p>

                            </div>

                          </div>

                        </td>


                        <td className="px-6 py-5">

                          <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                            Secondary Admin
                          </span>

                        </td>


                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <ClipboardList className="h-4 w-4 text-slate-400" />

                            <span className="text-sm font-semibold text-slate-700">
                              {assignedQueries}
                            </span>

                          </div>

                        </td>


                        <td className="px-6 py-5 text-right">

                          <button
                            type="button"
                            disabled={
                              actionLoading
                            }
                            onClick={() =>
                              handleRemoveAdmin(
                                adminId
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            <UserMinus className="h-4 w-4" />

                            Remove

                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>


          {filteredAdmins.length === 0 && (
            <div className="py-16 text-center">

              <Users className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 font-semibold text-slate-700">
                No Secondary Admins found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Try searching with a different name.
              </p>

            </div>
          )}

        </div>

      </div>

    </AdminLayout>
  );
}


export default AdminManagement;