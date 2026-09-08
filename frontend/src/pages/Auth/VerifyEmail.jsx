import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MailCheck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import OtpInput from "../../components/auth/OtpInput";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState(
    Array(6).fill("")
  );

  const [seconds, setSeconds] = useState(60);

  const otpValue = otp.join("");

  // Prevent direct access without email
  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  // Countdown
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleVerify = (event) => {
    event.preventDefault();

    if (otpValue.length !== 6) {
      alert("Please enter the complete 6-digit OTP.");
      return;
    }

    // Backend integration later
    console.log("OTP:", otpValue);

    // Temporary navigation
    navigate("/login");
  };

  const handleResendOtp = () => {
    if (seconds > 0) return;

    // Backend integration later
    console.log("Resending OTP to:", email);

    setOtp(Array(6).fill(""));
    setSeconds(60);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7fbff] px-4 py-16 sm:px-6">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Glow */}
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

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-lg rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_20px_60px_rgba(37,99,235,0.12)] backdrop-blur-xl sm:p-12"
      >

        {/* Back */}
        <Link
          to="/signup"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to signup
        </Link>

        {/* Icon */}
        <div className="mb-8 flex justify-center">

          <div className="relative">

            {/* Glow */}
            <div className="absolute inset-0 scale-125 rounded-full bg-blue-300/30 blur-2xl" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900 to-blue-700 shadow-xl">

              <MailCheck className="h-10 w-10 text-white" />

            </div>

          </div>

        </div>

        {/* Heading */}
        <div className="text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-sm font-semibold text-blue-700">

            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />

            EMAIL VERIFICATION

          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Verify Your Email
          </h1>

          <p className="mx-auto mt-4 max-w-sm leading-relaxed text-slate-500">

            We've sent a 6-digit verification code to

          </p>

          <p className="mt-2 break-all font-semibold text-blue-700">
            {email}
          </p>

        </div>

        {/* OTP Form */}
        <form
          onSubmit={handleVerify}
          className="mt-10"
        >

          {/* OTP Inputs */}
          <OtpInput
            otp={otp}
            setOtp={setOtp}
          />

          <p className="mt-4 text-center text-sm text-slate-500">
            Enter the verification code sent to your email.
          </p>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={otpValue.length !== 6}
            className="group mt-8 flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 to-blue-700 text-base font-semibold text-white shadow-lg shadow-blue-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:from-slate-800 hover:to-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >

            Verify Email

            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />

          </button>

        </form>

        {/* Resend */}
        <div className="mt-8 text-center">

          {seconds > 0 ? (
            <p className="text-sm text-slate-500">

              Resend code in{" "}

              <span className="font-semibold text-slate-900">
                00:
                {String(seconds).padStart(2, "0")}
              </span>

            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-slate-900"
            >

              <RefreshCw className="h-4 w-4" />

              Resend Verification Code

            </button>
          )}

        </div>

        {/* Security Info */}
        <div className="mt-10 flex items-center justify-center gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400">

          <ShieldCheck className="h-4 w-4 text-blue-600" />

          Your information is securely protected

        </div>

      </motion.div>

    </section>
  );
}

export default VerifyEmail;