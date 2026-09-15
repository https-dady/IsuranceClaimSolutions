import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const { loginUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const successMessage = location.state?.successMessage || "";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await login(formData);

      // Store authentication state centrally
      loginUser(response);

      // Redirect after successful login
      navigate("/");
    } catch (err) {
      setError(
        err?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7fbff] px-4 py-16 sm:px-6 lg:px-8">

      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />

        <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

        {/* Dot Pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(59,130,246,0.22) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white/60 shadow-[0_20px_60px_rgba(37,99,235,0.12)] backdrop-blur-xl lg:grid-cols-2"
        >

          {/* Left Side */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">

            {/* Decorative Glow */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />

            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

            {/* Brand */}
            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
                  <ShieldCheck className="h-6 w-6 text-blue-300" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Insurance Claim Solution
                  </h2>

                  <p className="text-sm text-blue-200">
                    The Legal Consultant
                  </p>
                </div>

              </div>

              <h1 className="max-w-md text-4xl font-bold leading-tight">
                Your claim deserves the
                <span className="block text-blue-300">
                  right support.
                </span>
              </h1>

              <p className="mt-6 max-w-md leading-relaxed text-slate-300">
                Access your account, track your insurance claim queries,
                and stay updated throughout the process.
              </p>
            </div>

            {/* Bottom Info */}
            <div className="relative z-10 mt-10 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm leading-relaxed text-slate-300">
                "We help policyholders navigate rejected, delayed, and
                disputed insurance claims with professional guidance."
              </p>
            </div>

          </div>

          {/* Right Side - Form */}
          <div className="bg-white/50 p-8 sm:p-12">

            <div className="mx-auto max-w-md">

              {/* Mobile Logo */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-blue-700 shadow-lg">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Insurance Claim Solution
                  </h2>

                  <p className="text-sm text-blue-700">
                    The Legal Consultant
                  </p>
                </div>

              </div>

              {/* Heading */}
              <div className="mb-8">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-sm font-semibold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  SECURE LOGIN
                </div>

                <h2 className="text-3xl font-bold text-slate-900">
                  Welcome Back 👋
                </h2>

                <p className="mt-3 leading-relaxed text-slate-500">
                  Login to manage your insurance claim queries and stay
                  updated on their progress.
                </p>

              </div>

              {successMessage && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  {successMessage}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="h-14 w-full rounded-xl border border-slate-200 bg-white/70 pl-12 pr-4 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />

                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-blue-700 transition-colors hover:text-slate-900"
                    >
                      Forgot Password?
                    </Link>

                  </div>

                  <div className="relative">

                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="h-14 w-full rounded-xl border border-slate-200 bg-white/70 pl-12 pr-12 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>

                  </div>
                </div>

                {/* Remember Me */}
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">

                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  Remember me

                </label>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 to-blue-700 text-base font-semibold text-white shadow-lg shadow-blue-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:from-slate-800 hover:to-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isLoading ? "Logging in..." : "Login"}

                  {!isLoading && (
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </button>

              </form>

              {/* Divider */}
              <div className="my-8 flex items-center gap-4">

                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-sm text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />

              </div>

              {/* Signup */}
              <p className="text-center text-sm text-slate-600">
                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="font-semibold text-blue-700 transition-colors hover:text-slate-900"
                >
                  Create an account
                </Link>

              </p>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default Login;