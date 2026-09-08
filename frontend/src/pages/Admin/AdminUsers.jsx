import { useState } from "react";
import { Search, Users, ShieldCheck, UserCog, Eye } from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";

const usersData = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    role: "user",
    joined: "12 Aug 2026",
    queries: 3,
  },
  {
    id: 2,
    name: "Amit Verma",
    email: "amit@example.com",
    phone: "+91 98765 12345",
    role: "secondary_admin",
    joined: "18 Jul 2026",
    queries: 8,
  },
  {
    id: 3,
    name: "Admin Name",
    email: "admin@example.com",
    phone: "+91 99999 99999",
    role: "main_admin",
    joined: "01 Jan 2026",
    queries: 12,
  },
  {
    id: 4,
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "+91 87654 32109",
    role: "user",
    joined: "25 Aug 2026",
    queries: 1,
  },
];

function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalUsers = usersData.length;

  const normalUsers = usersData.filter(
    (user) => user.role === "user"
  ).length;

  const secondaryAdmins = usersData.filter(
    (user) => user.role === "secondary_admin"
  ).length;

  return (
    <AdminLayout role="main_admin">
      {/* ================= PAGE HEADER ================= */}

      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          Manage and view all registered users
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Users
        </h1>
      </div>

      {/* ================= STATS ================= */}

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
                1
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck className="h-6 w-6" />
            </div>

          </div>
        </div>

      </div>

      {/* ================= USER MANAGEMENT ================= */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Top Section */}

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Users
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage registered users
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 sm:w-64"
              />
            </div>

            {/* Role Filter */}

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-500"
            >
              <option value="all">All Roles</option>

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

        {/* ================= TABLE ================= */}

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

              {filteredUsers.map((user) => (

                <tr
                  key={user.id}
                  className="border-b border-slate-100 last:border-none hover:bg-slate-50/70"
                >

                  {/* User */}

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                        {user.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>

                        <p className="font-semibold text-slate-900">
                          {user.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          ID: #{user.id}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Contact */}

                  <td className="px-6 py-5">

                    <p className="text-sm text-slate-700">
                      {user.email}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {user.phone}
                    </p>

                  </td>

                  {/* Role */}

                  <td className="px-6 py-5">

                    {user.role === "main_admin" && (
                      <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                        Main Admin
                      </span>
                    )}

                    {user.role === "secondary_admin" && (
                      <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">
                        Secondary Admin
                      </span>
                    )}

                    {user.role === "user" && (
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                        User
                      </span>
                    )}

                  </td>

                  {/* Queries */}

                  <td className="px-6 py-5">

                    <span className="text-sm font-semibold text-slate-700">
                      {user.queries}
                    </span>

                  </td>

                  {/* Joined */}

                  <td className="px-6 py-5">

                    <span className="text-sm text-slate-600">
                      {user.joined}
                    </span>

                  </td>

                  {/* Action */}

                  <td className="px-6 py-5 text-right">

                    <button
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      title="View User"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* Empty State */}

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
    </AdminLayout>
  );
}

export default AdminUsers;