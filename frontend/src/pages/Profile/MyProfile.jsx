import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Pencil,
  User,
  Cake,
  Phone,
  Mail,
  ShieldCheck,
  LogOut,
  ChevronLeft,
} from "lucide-react";

function MyProfile() {
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);

  // Temporary data
  // Backend/Auth connect hone ke baad ye actual user data se replace hoga
  const user = {
    name: "User Name",
    age: null,
    phone: "+91 98765 43210",
    email: "user@gmail.com",
    photo: "https://ui-avatars.com/api/?name=User+Name&background=2563eb&color=fff&size=256",
    phoneVerified: false,
  };

  const handleLogout = () => {
    console.log("Logout clicked");

    // Backend/Auth connect hone ke baad:
    // 1. Token remove karenge
    // 2. User logout karenge
    // 3. Login page par redirect karenge
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 sm:py-16">

      {/* ================= BACKGROUND DECORATION ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/20 blur-3xl" />

      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* ================= PAGE HEADER ================= */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="mb-10 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-xl">
            <User className="h-4 w-4" />
            MY ACCOUNT
          </div>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            My{" "}
            <span className="text-blue-600">
              Profile
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Manage your personal information and account details.
          </p>
        </motion.div>


        {/* ================= PROFILE CARD ================= */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-xl shadow-blue-900/5 backdrop-blur-xl"
        >

          {/* ================= TOP PROFILE SECTION ================= */}

          <div className="relative px-6 pb-8 pt-10 sm:px-10">

            {/* Decorative top gradient */}

            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 opacity-95" />

            {/* Profile Content */}

            <div className="relative flex flex-col items-center text-center">

              {/* ================= PROFILE IMAGE ================= */}

              <div className="group relative mb-5">

                {/* Glow */}

                <div className="absolute -inset-2 rounded-full bg-blue-500/20 blur-xl transition-opacity duration-300 group-hover:bg-blue-500/30" />

                {/* Image */}

                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl sm:h-36 sm:w-36">

                  <img
                    src={user.photo}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />

                </div>


                {/* Edit Photo Button */}

                <button
                  type="button"
                  className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700"
                  aria-label="Edit profile photo"
                >
                  <Pencil className="h-4 w-4" />
                </button>

              </div>


              {/* ================= USER NAME ================= */}

              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {user.name}
              </h2>


              {/* Account Badge */}

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600">

                <ShieldCheck className="h-4 w-4" />

                Account Active

              </div>

            </div>

          </div>


          {/* ================= PROFILE DETAILS ================= */}

          <div className="border-t border-slate-100 px-6 py-8 sm:px-10">

            <div className="space-y-5">


              {/* ================= AGE ================= */}

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-100 hover:shadow-md"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Cake className="h-5 w-5" />
                  </div>

                  <div className="text-left">

                    <p className="text-sm font-medium text-slate-500">
                      Age
                    </p>

                    <p className="mt-0.5 font-semibold text-slate-900">
                      {user.age
                        ? `${user.age} years`
                        : "Not added yet"}
                    </p>

                  </div>

                </div>

              </motion.div>


              {/* ================= PHONE NUMBER ================= */}

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-4 rounded-2xl border border-white bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-100 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Phone className="h-5 w-5" />
                  </div>

                  <div>

                    <p className="text-sm font-medium text-slate-500">
                      Phone Number
                    </p>

                    <p className="mt-0.5 font-semibold text-slate-900">
                      {user.phone}
                    </p>

                  </div>

                </div>


                {/* PHONE VERIFY BUTTON */}

                {user.phoneVerified ? (

                  <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-600">

                    <ShieldCheck className="h-4 w-4" />

                    Verified

                  </div>

                ) : (

                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      setShowPhoneVerification(true)
                    }
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
                  >
                    Verify
                  </motion.button>

                )}

              </motion.div>


              {/* ================= EMAIL ================= */}

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-100 hover:shadow-md"
              >

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 text-left">

                    <p className="text-sm font-medium text-slate-500">
                      Email Address
                    </p>

                    <p className="mt-0.5 truncate font-semibold text-slate-900">
                      {user.email}
                    </p>

                  </div>

                </div>


                {/* EMAIL VERIFIED */}

                <div className="hidden items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600 sm:inline-flex">

                  <ShieldCheck className="h-4 w-4" />

                  Verified

                </div>

              </motion.div>


              {/* Mobile Email Verified */}

              <div className="flex items-center gap-2 px-2 text-sm font-semibold text-emerald-600 sm:hidden">

                <ShieldCheck className="h-4 w-4" />

                Email Verified

              </div>

            </div>


            {/* ================= LOGOUT ================= */}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 border-t border-slate-100 pt-8"
            >

              <motion.button
                type="button"
                onClick={handleLogout}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50 px-5 py-4 font-semibold text-red-600 transition-all duration-300 hover:border-red-200 hover:bg-red-100"
              >

                <LogOut className="h-5 w-5" />

                Logout from your account

              </motion.button>

            </motion.div>

          </div>

        </motion.div>


        {/* ================= PHONE OTP COMPONENT ================= */}

        <AnimatePresence>

          {showPhoneVerification && (

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 30,
              }}
              transition={{
                duration: 0.3,
              }}
              className="mt-8 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8"
            >

              {/* Back */}

              <button
                type="button"
                onClick={() =>
                  setShowPhoneVerification(false)
                }
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
              >

                <ChevronLeft className="h-4 w-4" />

                Back to Profile

              </button>


              {/* OTP CONTENT */}

              <div className="text-center">

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                  <Phone className="h-7 w-7" />

                </div>


                <h3 className="text-2xl font-bold text-slate-900">

                  Verify Phone Number

                </h3>


                <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-600">

                  We will send a verification OTP to{" "}

                  <span className="font-semibold text-slate-900">

                    {user.phone}

                  </span>

                </p>


                {/* OTP Input Placeholder */}

                <div className="mt-8 flex justify-center gap-3">

                  {[1, 2, 3, 4, 5, 6].map((item) => (

                    <input
                      key={item}
                      type="text"
                      maxLength="1"
                      className="h-12 w-10 rounded-xl border border-slate-200 bg-white text-center text-lg font-bold text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:h-14 sm:w-12"
                    />

                  ))}

                </div>


                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-8 rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
                >

                  Verify OTP

                </motion.button>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </div>

    </section>
  );
}

export default MyProfile;