import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

function VerifyResetOTP() {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a valid 6 digit OTP");
      return;
    }

    // Temporary frontend verification
    // Later backend se verify hoga

    navigate("/reset-password", {
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
          to="/forgot-password"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Card */}

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">

          {/* Icon */}

          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">

            <ShieldCheck className="h-8 w-8 text-blue-600" />

          </div>

          {/* Heading */}

          <h1 className="text-3xl font-bold text-slate-900">
            Verify Your Email
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">

            We've sent a 6-digit verification code to

            {email && (
              <span className="mt-1 block font-semibold text-slate-700">
                {email}
              </span>
            )}

          </p>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="mt-8"
          >

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Verification Code
            </label>

            <input
              type="text"
              value={otp}
              maxLength={6}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder="Enter 6 digit OTP"
              className="w-full rounded-xl border border-slate-200 px-4 py-4 text-center text-xl font-bold tracking-[0.5em] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Verify OTP
            </button>

          </form>

          {/* Resend */}

          <p className="mt-7 text-center text-sm text-slate-500">

            Didn't receive the code?

            <button
              type="button"
              className="ml-1 font-semibold text-blue-600 hover:text-blue-700"
            >
              Resend OTP
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default VerifyResetOTP;