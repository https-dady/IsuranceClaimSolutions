import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email address");
      return;
    }

    // Temporary frontend flow
    // Later backend se OTP send hoga

    navigate("/verify-reset-otp", {
      state: {
        email,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-md">

        {/* Back */}

        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        {/* Card */}

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">

          {/* Icon */}

          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
          </div>

          {/* Heading */}

          <h1 className="text-3xl font-bold text-slate-900">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Don't worry. Enter your registered email address and we'll send you
            a verification code to reset your password.
          </p>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >

            {/* Email */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="relative">

                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

              </div>
            </div>

            {/* Submit */}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Send Verification Code
            </button>

          </form>

          {/* Login */}

          <p className="mt-8 text-center text-sm text-slate-500">
            Remember your password?{" "}

            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;