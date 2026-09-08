import { useState } from "react";
import {
  ShieldCheck,
  Search,
  UserPlus,
  UserMinus,
  Users,
  ClipboardList,
  X,
  Check,
  MoreVertical,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";

const initialAdmins = [
  {
    id: 1,
    name: "Akash Mathuriya",
    email: "akash@example.com",
    role: "Secondary Admin",
    assignedQueries: 8,
    status: "Active",
  },
  {
    id: 2,
    name: "Deepak Kumar",
    email: "deepak@example.com",
    role: "Secondary Admin",
    assignedQueries: 5,
    status: "Active",
  },
  {
    id: 3,
    name: "Swati Sarathe",
    email: "swati@example.com",
    role: "Secondary Admin",
    assignedQueries: 3,
    status: "Active",
  },
];

const normalUsers = [
  {
    id: 101,
    name: "Rahul Sharma",
    email: "rahul@example.com",
  },
  {
    id: 102,
    name: "Priya Verma",
    email: "priya@example.com",
  },
  {
    id: 103,
    name: "Amit Patel",
    email: "amit@example.com",
  },
  {
    id: 104,
    name: "Sneha Gupta",
    email: "sneha@example.com",
  },
];

function AdminManagement() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const filteredAdmins = admins.filter((admin) =>
    `${admin.name} ${admin.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const availableUsers = normalUsers.filter(
    (user) => !admins.some((admin) => admin.email === user.email)
  );

  const handleMakeAdmin = () => {
    if (!selectedUser) return;

    const user = normalUsers.find(
      (item) => item.id === Number(selectedUser)
    );

    if (!user) return;

    const newAdmin = {
      ...user,
      role: "Secondary Admin",
      assignedQueries: 0,
      status: "Active",
    };

    setAdmins((prev) => [...prev, newAdmin]);

    setSelectedUser("");
    setIsAddAdminOpen(false);
  };

  const handleRemoveAdmin = (adminId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this admin?"
    );

    if (!confirmRemove) return;

    setAdmins((prev) =>
      prev.filter((admin) => admin.id !== adminId)
    );
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

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
            onClick={() => setIsAddAdminOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700"
          >
            <UserPlus className="h-5 w-5" />
            Make Admin
          </button>

        </div>

        {/* ================= STATS ================= */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Admins */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>

              <span className="text-sm font-medium text-slate-400">
                Secondary
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {admins.length}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-600">
              Secondary Admins
            </p>

          </div>

          {/* Active Admins */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>

              <span className="text-sm font-medium text-emerald-500">
                Active
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
              {
                admins.filter(
                  (admin) => admin.status === "Active"
                ).length
              }
            </p>

            <p className="mt-1 text-sm font-medium text-slate-600">
              Active Admins
            </p>

          </div>

          {/* Assigned Queries */}

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
              {admins.reduce(
                (total, admin) =>
                  total + admin.assignedQueries,
                0
              )}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-600">
              Assigned Queries
            </p>

          </div>

        </div>

        {/* ================= ADMIN LIST ================= */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Top */}

          <div className="flex flex-col gap-5 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Secondary Admins
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage admin access and assigned workload.
              </p>
            </div>

            {/* Search */}

            <div className="relative w-full md:w-72">

              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search admin..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />

            </div>

          </div>

          {/* ================= TABLE ================= */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px]">

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

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredAdmins.map((admin) => (

                  <tr
                    key={admin.id}
                    className="border-b border-slate-50 last:border-none hover:bg-slate-50/70"
                  >

                    {/* Admin */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">

                          {admin.name.charAt(0)}

                        </div>

                        <div>

                          <p className="text-sm font-bold text-slate-800">
                            {admin.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {admin.email}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Role */}

                    <td className="px-6 py-5">

                      <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                        {admin.role}
                      </span>

                    </td>

                    {/* Queries */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2">

                        <ClipboardList className="h-4 w-4 text-slate-400" />

                        <span className="text-sm font-semibold text-slate-700">
                          {admin.assignedQueries}
                        </span>

                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-6 py-5">

                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        {admin.status}

                      </span>

                    </td>

                    {/* Action */}

                    <td className="px-6 py-5 text-right">

                      <button
                        onClick={() =>
                          handleRemoveAdmin(admin.id)
                        }
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >

                        <UserMinus className="h-4 w-4" />

                        Remove

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Empty State */}

          {filteredAdmins.length === 0 && (

            <div className="py-16 text-center">

              <Users className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 font-semibold text-slate-700">
                No admins found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Try searching with a different name.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* ================= MAKE ADMIN MODAL ================= */}

      {isAddAdminOpen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-100 p-6">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Make Secondary Admin
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a registered user to grant admin access.
                </p>

              </div>

              <button
                onClick={() => {
                  setIsAddAdminOpen(false);
                  setSelectedUser("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >

                <X className="h-5 w-5" />

              </button>

            </div>

            {/* Modal Body */}

            <div className="p-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Select User
              </label>

              <select
                value={selectedUser}
                onChange={(e) =>
                  setSelectedUser(e.target.value)
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-400"
              >

                <option value="">
                  Select a registered user
                </option>

                {availableUsers.map((user) => (

                  <option
                    key={user.id}
                    value={user.id}
                  >

                    {user.name} — {user.email}

                  </option>

                ))}

              </select>

              {availableUsers.length === 0 && (

                <p className="mt-3 text-sm text-slate-500">
                  No users are currently available to make admin.
                </p>

              )}

            </div>

            {/* Modal Footer */}

            <div className="flex gap-3 border-t border-slate-100 p-6">

              <button
                onClick={() => {
                  setIsAddAdminOpen(false);
                  setSelectedUser("");
                }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleMakeAdmin}
                disabled={!selectedUser}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Make Admin
              </button>

            </div>

          </div>

        </div>

      )}

    </AdminLayout>
  );
}

export default AdminManagement;