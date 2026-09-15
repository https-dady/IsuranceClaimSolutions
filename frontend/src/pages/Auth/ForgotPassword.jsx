import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";

import { forgotPassword } from "../../api/authApi";
import AuthLayout from "../../components/auth/AuthLayout";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await forgotPassword(email.trim());

      navigate("/verify-reset-otp", {
        state: {
          email: response?.email || email.trim().toLowerCase(),
        },
      });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to send verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout backTo="/login" backLabel="Back to Login">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-sm font-semibold text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          PASSWORD RESET
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          Forgot Password?
        </h2>

        <p className="mt-3 leading-relaxed text-slate-500">
          Enter your registered email address and we&apos;ll send you a
          verification code to reset your password.
        </p>
      </div>

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
        <ShieldCheck className="h-7 w-7 text-blue-600" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="forgot-email"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Email Address
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="Enter your registered email"
              className="h-14 w-full rounded-xl border border-slate-200 bg-white/70 pl-12 pr-4 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 to-blue-700 text-base font-semibold text-white shadow-lg shadow-blue-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:from-slate-800 hover:to-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isLoading ? "Sending Verification Code..." : "Send Verification Code"}
          {!isLoading && (
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Remember your password?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="font-semibold text-blue-700 transition-colors hover:text-slate-900"
        >
          Login
        </button>
      </p>
    </AuthLayout>
  );
}

export default ForgotPassword;
