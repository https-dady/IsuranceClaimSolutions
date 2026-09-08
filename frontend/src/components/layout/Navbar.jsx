import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import {
  Menu,
  X,
  ChevronDown,
  User,
  ClipboardList,
  FileText,
  MessageSquare,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { currentUser } from "../../utils/currentUser";

const navLinks = [
  {
    name: "Home",
    path: "/",
    label: "Return to Homepage",
  },
  {
    name: "Services",
    path: "/services",
    label: "View Our Services",
  },
  {
    name: "About",
    path: "/about",
    label: "About Our Company",
  },
  {
    name: "Claims",
    path: "/claims",
    label: "File a Claim",
  },
  {
    name: "Gallery",
    path: "/gallery",
    label: "View Photo Gallery",
  },
  {
    name: "Feedback",
    path: "/feedback",
    label: "Leave Feedback",
  },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Temporary login state
  // Current user data comes from currentUser.js
  const [user, setUser] = useState(currentUser);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();

  // ================= ROLE CHECKS =================

  const isAdmin = user?.type === "admin";

  const isSecondaryAdmin =
    isAdmin && user?.role === "secondary_admin";

  const isMainAdmin =
    isAdmin && user?.role === "main_admin";

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setUser(null);
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/70 bg-white/75 shadow-lg shadow-blue-900/5 backdrop-blur-xl"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= MAIN NAVBAR ================= */}

        <div className="flex h-20 items-center justify-between">

          {/* ================= LOGO ================= */}

          <Link
            to="/"
            className="group flex items-center gap-3"
            aria-label="Insurance Claim Solution Homepage"
          >
            <div className="relative h-14 w-14 shrink-0">
              <img
                src="https://horizons-cdn.hostinger.com/8d54c3b0-4875-49a6-9539-c0b315c4378f/2bac004dd5ae3ee796251ecdc4ae86bc.png"
                alt="Insurance Claim Solution Logo"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight text-slate-900 sm:text-xl">
                Insurance Claim Solution, India
              </h1>

              <span className="text-xs font-semibold tracking-wide text-blue-600 sm:text-sm">
                The Legal Consultant
              </span>
            </div>
          </Link>

          {/* ================= DESKTOP NAVIGATION ================= */}

          <div className="hidden items-center gap-1 lg:flex">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                aria-label={link.label}
                className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-white/80 hover:text-blue-600"
                }`}
              >
                {link.name}

                {isActive(link.path) && (
                  <motion.span
                    layoutId="activeNavLink"
                    className="absolute bottom-1 left-1/2 h-1 w-1 rounded-full bg-blue-600"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            ))}

            <div className="mx-4 h-8 w-px bg-slate-200/80" />

            {/* ================= AUTH / USER SECTION ================= */}

            {!user ? (
              <>
                <Link to="/login" aria-label="Login to your account">
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl border border-blue-100 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Login
                  </motion.div>
                </Link>

                <Link to="/signup" aria-label="Create a new account">
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors duration-300 hover:bg-blue-700"
                  >
                    Sign Up
                  </motion.div>
                </Link>
              </>
            ) : (

              <div
                className="relative"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                {/* ================= USER BUTTON ================= */}

                <button
                  type="button"
                  onClick={() =>
                    setIsProfileOpen(!isProfileOpen)
                  }
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 py-1.5 pl-2 pr-3 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-blue-600 text-sm font-bold text-white shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="hidden text-left xl:block">
                    <p className="max-w-[120px] truncate text-sm font-semibold text-slate-800">
                      {user.name}
                    </p>

                    <p className="max-w-[140px] truncate text-xs text-slate-500">
                      {user.email || ""}
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* ================= DROPDOWN ================= */}

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -10,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-2xl shadow-blue-900/10 backdrop-blur-xl"
                    >

                      {/* ================= USER INFO ================= */}

                      <div className="border-b border-slate-100 p-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-blue-600 font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-slate-900">
                              {user.name}
                            </p>

                            <p className="truncate text-sm text-slate-500">
                              {user.email || ""}
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* ================= DROPDOWN LINKS ================= */}

                      <div className="p-2">

                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600"
                        >
                          <User className="h-5 w-5" />

                          My Profile
                        </Link>

                        {/* ================= NORMAL USER MENU ================= */}

                        {!isAdmin && (
                          <>
                            <Link
                              to="/my-queries"
                              onClick={() =>
                                setIsProfileOpen(false)
                              }
                              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600"
                            >
                              <ClipboardList className="h-5 w-5" />

                              My Queries
                            </Link>

                            <Link
                              to="/my-documents"
                              onClick={() =>
                                setIsProfileOpen(false)
                              }
                              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600"
                            >
                              <FileText className="h-5 w-5" />

                              My Documents
                            </Link>

                            <Link
                              to="/my-feedbacks"
                              onClick={() =>
                                setIsProfileOpen(false)
                              }
                              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600"
                            >
                              <MessageSquare className="h-5 w-5" />

                              My Feedbacks
                            </Link>
                          </>
                        )}

                        {/* ================= SECONDARY ADMIN MENU ================= */}

                        {isSecondaryAdmin && (
                          <>
                            <Link
                              to="/admin/my-assigned-queries"
                              onClick={() =>
                                setIsProfileOpen(false)
                              }
                              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600"
                            >
                              <ClipboardList className="h-5 w-5" />

                              Assigned Queries
                            </Link>

                            <Link
                              to="/admin"
                              onClick={() =>
                                setIsProfileOpen(false)
                              }
                              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600"
                            >
                              <LayoutDashboard className="h-5 w-5" />

                              Admin Dashboard
                            </Link>
                          </>
                        )}

                        {/* ================= MAIN ADMIN MENU ================= */}

                        {isMainAdmin && (
                          <>
                            <Link
                              to="/admin/queries"
                              onClick={() =>
                                setIsProfileOpen(false)
                              }
                              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600"
                            >
                              <ClipboardList className="h-5 w-5" />

                              All Queries
                            </Link>

                            <Link
                              to="/admin"
                              onClick={() =>
                                setIsProfileOpen(false)
                              }
                              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600"
                            >
                              <LayoutDashboard className="h-5 w-5" />

                              Admin Dashboard
                            </Link>
                          </>
                        )}

                      </div>

                      {/* ================= LOGOUT ================= */}

                      <div className="border-t border-slate-100 p-2">

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 transition-all hover:bg-red-50 hover:text-red-600"
                        >
                          <LogOut className="h-5 w-5" />

                          Logout
                        </button>

                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}

          </div>

          {/* ================= MOBILE MENU BUTTON ================= */}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 lg:hidden"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

        </div>

        {/* ================= MOBILE MENU ================= */}

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="overflow-hidden lg:hidden"
            >
              <motion.div
                initial={{
                  y: -10,
                }}
                animate={{
                  y: 0,
                }}
                exit={{
                  y: -10,
                }}
                className="mb-4 rounded-2xl border border-white/80 bg-white/80 p-3 shadow-xl shadow-blue-900/5 backdrop-blur-xl"
              >

                {/* ================= MOBILE NAV LINKS ================= */}

                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.25,
                    }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      aria-label={link.label}
                      className={`mb-1 flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive(link.path)
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      <span
                        className={`mr-3 h-2 w-2 rounded-full ${
                          isActive(link.path)
                            ? "bg-blue-600"
                            : "bg-slate-300"
                        }`}
                      />

                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* ================= MOBILE AUTH / USER ================= */}

                {!user ? (
                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex h-12 items-center justify-center rounded-xl border border-blue-100 bg-white text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                        Login
                      </div>
                    </Link>

                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex h-12 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700">
                        Sign Up
                      </div>
                    </Link>

                  </div>
                ) : (
                  <div className="mt-4 border-t border-slate-100 pt-4">

                    {/* ================= USER INFO ================= */}

                    <div className="mb-3 flex items-center gap-3 px-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-blue-600 font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-semibold text-slate-900">
                          {user.name}
                        </p>

                        <p className="truncate text-sm text-slate-500">
                          {user.email || ""}
                        </p>

                      </div>

                    </div>

                    {/* ================= USER MENU ================= */}

                    <div className="space-y-1">

                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <User className="h-5 w-5" />

                        My Profile
                      </Link>

                      {/* ================= NORMAL USER ================= */}

                      {!isAdmin && (
                        <>
                          <Link
                            to="/my-queries"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ClipboardList className="h-5 w-5" />

                            My Queries
                          </Link>

                          <Link
                            to="/my-documents"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <FileText className="h-5 w-5" />

                            My Documents
                          </Link>

                          <Link
                            to="/my-feedbacks"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <MessageSquare className="h-5 w-5" />

                            My Feedbacks
                          </Link>
                        </>
                      )}

                      {/* ================= SECONDARY ADMIN ================= */}

                      {isSecondaryAdmin && (
                        <>
                          <Link
                            to="/admin/my-assigned-queries"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ClipboardList className="h-5 w-5" />

                            Assigned Queries
                          </Link>

                          <Link
                            to="/admin"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <LayoutDashboard className="h-5 w-5" />

                            Admin Dashboard
                          </Link>
                        </>
                      )}

                      {/* ================= MAIN ADMIN ================= */}

                      {isMainAdmin && (
                        <>
                          <Link
                            to="/admin/queries"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ClipboardList className="h-5 w-5" />

                            All Queries
                          </Link>

                          <Link
                            to="/admin"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <LayoutDashboard className="h-5 w-5" />

                            Admin Dashboard
                          </Link>
                        </>
                      )}

                      {/* ================= LOGOUT ================= */}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
                      >
                        <LogOut className="h-5 w-5" />

                        Logout
                      </button>

                    </div>

                  </div>
                )}

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  );
}

export default Navbar;