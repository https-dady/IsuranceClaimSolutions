import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";

import OtpInput from "../../components/auth/OtpInput";
import { verifyResetOTP, forgotPassword } from "../../api/authApi";
import AuthLayout from "../../components/auth/AuthLayout";

function VerifyResetOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [seconds, setSeconds] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const otpValue = otp.join("");

  useEffect(() => {
    if (!email) navigate("/forgot-password", { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setIsVerifying(true);
      await verifyResetOTP({ email, otp: otpValue });
      setSuccess("OTP verified successfully!");

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email, otp: otpValue },
        });
      }, 800);
    } catch (err) {
      setError(err?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (seconds > 0 || isResending) return;
    setError("");
    setSuccess("");

    try {
      setIsResending(true);
      await forgotPassword(email);
      setOtp(Array(6).fill(""));
      setSeconds(60);
      setSuccess("A new verification code has been sent to your email.");
    } catch (err) {
      setError(err?.message || "Unable to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout backTo="/forgot-password" backLabel="Back to forgot password">
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 scale-125 rounded-full bg-blue-300/30 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900 to-blue-700 shadow-xl">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-sm font-semibold text-blue-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
          PASSWORD RESET
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Verify Your Email</h2>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-slate-500">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="mt-2 break-all font-semibold text-blue-700">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10">
        <OtpInput otp={otp} setOtp={setOtp} />
        <p className="mt-4 text-center text-sm text-slate-500">
          Enter the verification code sent to your email.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-600">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={otpValue.length !== 6 || isVerifying}
          className="group mt-8 flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 to-blue-700 text-base font-semibold text-white shadow-lg shadow-blue-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:from-slate-800 hover:to-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isVerifying ? "Verifying..." : "Verify OTP"}
          {!isVerifying && <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
        </button>
      </form>

      <div className="mt-8 text-center">
        {seconds > 0 ? (
          <p className="text-sm text-slate-500">
            Resend code in <span className="font-semibold text-slate-900">00:{String(seconds).padStart(2, "0")}</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
            {isResending ? "Sending..." : "Resend Verification Code"}
          </button>
        )}
      </div>

      <div className="mt-10 flex items-center justify-center gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4 text-blue-600" />
        Your information is securely protected
      </div>
    </AuthLayout>
  );
}

export default VerifyResetOTP;
