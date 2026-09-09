import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

function ResetPassword() {
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Temporary frontend success
    // Later backend password update karega

    alert("Password reset successfully!");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">

      <div className="mx-auto w-full max-w-md">

        {/* Card */}

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">

          {/* Icon */}

          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">

            <CheckCircle2 className="h-8 w-8 text-green-600" />

          </div>

          {/* Heading */}

          <h1 className="text-3xl font-bold text-slate-900">
            Create New Password
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your new password must be different from your previous password.
          </p>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* New Password */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                New Password
              </label>

              <div className="relative">

                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >

                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}

                </button>

              </div>

            </div>

            {/* Confirm Password */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>

              <div className="relative">

                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >

                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}

                </button>

              </div>

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Reset Password
            </button>

          </form>

          {/* Login */}

          <p className="mt-8 text-center text-sm text-slate-500">

            Remember your password?

            <Link
              to="/login"
              className="ml-1 font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;