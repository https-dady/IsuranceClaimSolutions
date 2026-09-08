import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  ClipboardList,
  ListChecks,
  Users,
  UserCog,
  FileText,
  MessageSquare,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
} from "lucide-react";

import { currentUser } from "../../utils/currentUser";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "All Queries",
    path: "/admin/queries",
    icon: ClipboardList,
  },
  {
    name: "My Assigned Queries",
    path: "/admin/my-assigned-queries",
    icon: ListChecks,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Documents",
    path: "/admin/documents",
    icon: FileText,
  },
  {
    name: "Feedbacks",
    path: "/admin/feedbacks",
    icon: MessageSquare,
  },
];

function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const isMainAdmin = currentUser.role === "main_admin";

  // ================= ACTIVE MENU =================

  const isActive = (path) => {
    // Dashboard
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    // All Queries
    if (path === "/admin/queries") {
      return (
        location.pathname === "/admin/queries" ||
        location.pathname.startsWith("/admin/queries/")
      );
    }

    // My Assigned Queries
    if (path === "/admin/my-assigned-queries") {
      return location.pathname === "/admin/my-assigned-queries";
    }

    // Other Pages
    return location.pathname.startsWith(path);
  };

  // ================= ADMIN INITIALS =================

  const adminInitials = currentUser.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ================= LOGO ================= */}

        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link
            to="/admin"
            className="flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                ICS Admin
              </h2>

              <p className="text-xs text-slate-500">
                Insurance Claim Solution
              </p>
            </div>
          </Link>

          {/* Mobile Close Button */}

          <button
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* ================= ADMIN PROFILE ================= */}

        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            {/* Avatar */}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-md">
              {adminInitials}
            </div>

            {/* Admin Details */}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {currentUser.name}
              </p>

              <div className="mt-0.5 flex items-center gap-1">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isMainAdmin
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                />

                <p className="text-xs text-slate-500">
                  {isMainAdmin
                    ? "Main Admin"
                    : "Secondary Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= NAVIGATION ================= */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Management
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const active = isActive(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                      active
                        ? "text-blue-600"
                        : "text-slate-400"
                    }`}
                  />

                  <span>{item.name}</span>

                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ================= MAIN ADMIN ONLY ================= */}

          {isMainAdmin && (
            <>
              <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Administration
              </p>

              <div className="space-y-1">
                <Link
                  to="/admin/admin-management"
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    location.pathname ===
                    "/admin/admin-management"
                      ? "bg-amber-50 text-amber-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <UserCog
                    className={`h-5 w-5 ${
                      location.pathname ===
                      "/admin/admin-management"
                        ? "text-amber-500"
                        : "text-slate-400"
                    }`}
                  />

                  <span>Admin Management</span>

                  {location.pathname ===
                    "/admin/admin-management" && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-amber-500" />
                  )}
                </Link>
              </div>
            </>
          )}
        </nav>

        {/* ================= BOTTOM ================= */}

        <div className="border-t border-slate-100 p-4">
          {/* Back to Website */}

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
          >
            <Settings className="h-5 w-5 text-slate-400" />

            <span>Back to Website</span>
          </Link>

          {/* Logout */}

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
            <LogOut className="h-5 w-5" />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;