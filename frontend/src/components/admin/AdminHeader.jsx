import { Menu, Bell, Search } from "lucide-react";

function AdminHeader({
  setIsSidebarOpen,
  role,
  adminName,
}) {
  const isMainAdmin = role === "main_admin";

  const adminInitials = adminName
    ? adminName
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/80 px-5 backdrop-blur-xl sm:px-8">
      
      {/* Left */}

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Admin Panel
          </p>

          <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        <button className="hidden h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-400 transition-colors hover:border-blue-200 md:flex">
          <Search className="h-4 w-4" />
          Search
        </button>

        <button
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Avatar */}

        <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:flex">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white ${
              isMainAdmin
                ? "bg-amber-500"
                : "bg-blue-600"
            }`}
          >
            {adminInitials}
          </div>

          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-slate-900">
              {adminName}
            </p>

            <p className="text-[11px] text-slate-500">
              {isMainAdmin
                ? "Main Admin"
                : "Secondary Admin"}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default AdminHeader;