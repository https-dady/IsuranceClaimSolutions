import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

import { resetPassword } from "../../api/authApi";
import AuthLayout from "../../components/auth/AuthLayout";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !otp) {
      setError("Password reset session is missing. Please restart the password reset process.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword({
        email,
        otp,
        newPassword: password,
        confirmPassword,
      });
      setIsUpdated(true);

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { successMessage: "Password updated successfully. Please login to continue." },
        });
      }, 1200);
    } catch (err) {
      setError(err?.message || "Unable to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isUpdated) {
    return (
      <AuthLayout>
        <div className="py-8 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 scale-125 rounded-full bg-green-300/30 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-green-500 shadow-xl">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            PASSWORD UPDATED
          </div>

          <h2 className="text-3xl font-bold text-slate-900">
            Password Updated Successfully
          </h2>

          <p className="mt-4 leading-relaxed text-slate-500">
            Your password has been changed successfully. Redirecting you to the login page...
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            Your information is securely protected
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout backTo="/verify-reset-otp" backLabel="Back to verification">
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 scale-125 rounded-full bg-blue-300/30 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900 to-blue-700 shadow-xl">
            <LockKeyhole className="h-10 w-10 text-white" />
          </div>
        </div>
      </div>

      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-sm font-semibold text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          NEW PASSWORD
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Create New Password</h2>
        <p className="mt-3 leading-relaxed text-slate-500">
          Set a new password for your Insurance Claim Solution account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="new-password" className="mb-2 block text-sm font-semibold text-slate-700">
            New Password
          </label>
          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Enter new password"
              className="h-14 w-full rounded-xl border border-slate-200 bg-white/70 pl-12 pr-12 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-slate-700">
            Confirm Password
          </label>
          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setError("");
              }}
              placeholder="Confirm new password"
              className="h-14 w-full rounded-xl border border-slate-200 bg-white/70 pl-12 pr-12 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-700"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 to-blue-700 text-base font-semibold text-white shadow-lg shadow-blue-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:from-slate-800 hover:to-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isLoading ? "Updating Password..." : "Update Password"}
          {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
        </button>
      </form>

      <div className="mt-10 flex items-center justify-center gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4 text-blue-600" />
        Your information is securely protected
      </div>
    </AuthLayout>
  );
}

export default ResetPassword;
