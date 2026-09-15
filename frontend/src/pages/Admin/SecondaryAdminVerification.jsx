import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const RESEND_COOLDOWN_SECONDS = 60;

const RESEND_COOLDOWN_STORAGE_KEY =
  "secondary_admin_verification_resend_available_at";

const AUTH_EASE = [0.22, 1, 0.36, 1];

const SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 22,
};

const BUTTON_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 24,
};

function SecondaryAdminVerification() {
  const location = useLocation();
  const navigate = useNavigate();

  const { isMainAdmin } = useAuth();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [otp, setOtp] = useState(
    Array(6).fill("")
  );

  const [isVerifying, setIsVerifying] =
    useState(false);

  const [isResending, setIsResending] =
    useState(false);

  const [resendCooldown, setResendCooldown] =
    useState(0);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const inputRefs = useRef([]);

  /* ---------------------------------
     Restore email from navigation state
  --------------------------------- */
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  /* ---------------------------------
     Restore resend cooldown
  --------------------------------- */
  useEffect(() => {
    const availableAt = Number(
      localStorage.getItem(
        RESEND_COOLDOWN_STORAGE_KEY
      )
    );

    if (!availableAt) {
      return;
    }

    const remainingSeconds = Math.max(
      0,
      Math.ceil(
        (availableAt - Date.now()) / 1000
      )
    );

    setResendCooldown(remainingSeconds);

    if (remainingSeconds === 0) {
      localStorage.removeItem(
        RESEND_COOLDOWN_STORAGE_KEY
      );
    }
  }, []);

  /* ---------------------------------
     Resend OTP countdown
  --------------------------------- */
  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setResendCooldown((previous) => {
        if (previous <= 1) {
          clearInterval(timer);

          localStorage.removeItem(
            RESEND_COOLDOWN_STORAGE_KEY
          );

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  /* ---------------------------------
     Start 60 second cooldown
  --------------------------------- */
  const startResendCooldown = () => {
    const availableAt =
      Date.now() +
      RESEND_COOLDOWN_SECONDS * 1000;

    localStorage.setItem(
      RESEND_COOLDOWN_STORAGE_KEY,
      String(availableAt)
    );

    setResendCooldown(
      RESEND_COOLDOWN_SECONDS
    );
  };

  /* ---------------------------------
     OTP input change
  --------------------------------- */
  const handleOtpChange = (index, value) => {
    const numericValue = value
      .replace(/\D/g, "")
      .slice(-1);

    setError("");
    setMessage("");

    setOtp((previous) => {
      const updated = [...previous];
      updated[index] = numericValue;
      return updated;
    });

    if (
      numericValue &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* ---------------------------------
     OTP keyboard controls
  --------------------------------- */
  const handleOtpKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      event.preventDefault();

      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < 5
    ) {
      event.preventDefault();

      inputRefs.current[index + 1]?.focus();
    }
  };

  /* ---------------------------------
     OTP paste
  --------------------------------- */
  const handleOtpPaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) {
      return;
    }

    const updatedOtp = Array(6).fill("");

    pastedValue
      .split("")
      .forEach((digit, index) => {
        updatedOtp[index] = digit;
      });

    setOtp(updatedOtp);
    setError("");
    setMessage("");

    const focusIndex = Math.min(
      pastedValue.length,
      5
    );

    inputRefs.current[focusIndex]?.focus();
  };

  /* ---------------------------------
     Verify OTP
  --------------------------------- */
  const handleVerify = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const enteredOtp = otp.join("");

    if (!email) {
      setError(
        "Secondary Admin email was not found. Please create the account again."
      );

      return;
    }

    if (!/^\d{6}$/.test(enteredOtp)) {
      setError(
        "Please enter the 6-digit verification code."
      );

      return;
    }

    try {
      setIsVerifying(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: enteredOtp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to verify Secondary Admin email."
        );
      }

      localStorage.removeItem(
        RESEND_COOLDOWN_STORAGE_KEY
      );

      navigate(
        "/admin/create-secondary-admin/success",
        {
          replace: true,
        }
      );
    } catch (requestError) {
      console.error(
        "Secondary Admin verification error:",
        requestError
      );

      setError(
        requestError?.message ||
          "Unable to verify the Secondary Admin."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  /* ---------------------------------
     Resend OTP
  --------------------------------- */
  const handleResend = async () => {
    if (
      !email ||
      resendCooldown > 0 ||
      isResending ||
      isVerifying
    ) {
      return;
    }

    setError("");
    setMessage("");

    try {
      setIsResending(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/resend-verification-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to resend verification code."
        );
      }

      setMessage(
        data?.message ||
          "A new verification code has been sent to the email."
      );

      setOtp(Array(6).fill(""));

      /* Start exact 60 second cooldown */
      startResendCooldown();

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    } catch (requestError) {
      console.error(
        "Secondary Admin resend OTP error:",
        requestError
      );

      setError(
        requestError?.message ||
          "Unable to resend verification code."
      );
    } finally {
      setIsResending(false);
    }
  };

  /* ---------------------------------
     Main Admin access guard
  --------------------------------- */
  if (!isMainAdmin) {
    return (
      <AdminLayout>
        <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={SPRING}
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600"
          >
            <ShieldCheck className="h-10 w-10" />
          </motion.div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Main Admin Access Required
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Only the Main Admin can verify a
            Secondary Admin account.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/admin-management")
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Management
          </button>

        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout role="main_admin">
      <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-white px-4 py-8 sm:px-6 lg:px-8">

        {/* Background animation */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1,
              ease: AUTH_EASE,
            }}
            className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-50 blur-3xl"
          />

          <div className="absolute bottom-[-200px] right-[-150px] h-[350px] w-[350px] rounded-full bg-slate-50 blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-lg">

          {/* Back button */}
          <motion.div
            initial={{
              opacity: 0,
              x: -10,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.45,
              ease: AUTH_EASE,
            }}
            className="mb-6"
          >
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/create-secondary-admin",
                  {
                    state: {
                      email,
                    },
                  }
                )
              }
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Create Secondary Admin
            </button>
          </motion.div>

          {/* Main card */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.55,
              ease: AUTH_EASE,
            }}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60"
          >

            {/* Header */}
            <div className="border-b border-slate-100 px-6 pb-7 pt-8 text-center sm:px-10">

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.7,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.12,
                  ...SPRING,
                }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25"
              >
                <KeyRound className="h-8 w-8" />
              </motion.div>

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.45,
                  ease: AUTH_EASE,
                }}
                className="mt-6 text-2xl font-bold tracking-tight text-slate-900"
              >
                Verify Secondary Admin
              </motion.h1>

              <motion.p
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.28,
                  duration: 0.45,
                  ease: AUTH_EASE,
                }}
                className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500"
              >
                We've sent a 6-digit verification
                code to the email address below.
              </motion.p>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.35,
                  duration: 0.45,
                  ease: AUTH_EASE,
                }}
                className="mx-auto mt-5 flex max-w-sm items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3"
              >
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />

                <span className="break-all text-sm font-medium text-slate-700">
                  {email || "Email not available"}
                </span>
              </motion.div>

            </div>

            {/* Verification form */}
            <div className="px-6 py-7 sm:px-10 sm:py-8">

              {/* Error */}
              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700"
                >
                  {error}
                </motion.div>
              )}

              {/* Success message */}
              {message && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700"
                >
                  {message}
                </motion.div>
              )}

              <form onSubmit={handleVerify}>

                {/* OTP */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.38,
                    duration: 0.45,
                    ease: AUTH_EASE,
                  }}
                >
                  <label className="mb-4 block text-center text-sm font-semibold text-slate-700">
                    Enter Verification Code
                  </label>

                  <div
                    className="flex justify-center gap-2 sm:gap-3"
                    onPaste={handleOtpPaste}
                  >
                    {otp.map((digit, index) => (
                      <motion.input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] =
                            element;
                        }}
                        initial={{
                          opacity: 0,
                          y: 12,
                          scale: 0.9,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        transition={{
                          delay:
                            0.42 + index * 0.05,
                          ...SPRING,
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={
                          index === 0
                            ? "one-time-code"
                            : "off"
                        }
                        maxLength={1}
                        value={digit}
                        onChange={(event) =>
                          handleOtpChange(
                            index,
                            event.target.value
                          )
                        }
                        onKeyDown={(event) =>
                          handleOtpKeyDown(
                            index,
                            event
                          )
                        }
                        disabled={isVerifying}
                        aria-label={`Verification digit ${
                          index + 1
                        }`}
                        className="h-12 w-11 rounded-xl border border-slate-200 bg-slate-50 text-center text-xl font-bold text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:h-14 sm:w-14"
                      />
                    ))}
                  </div>

                  <p className="mt-4 text-center text-xs text-slate-400">
                    Enter the 6-digit code sent to
                    your email.
                  </p>
                </motion.div>

                {/* Verify button */}
                <motion.button
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.55,
                    duration: 0.45,
                    ease: AUTH_EASE,
                  }}
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  type="submit"
                  disabled={
                    isVerifying ||
                    otp.join("").length !== 6
                  }
                  className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Verify Email
                    </>
                  )}
                </motion.button>

              </form>

              {/* Resend OTP */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.62,
                  duration: 0.45,
                  ease: AUTH_EASE,
                }}
                className="mt-7 text-center"
              >
                <p className="text-sm text-slate-500">
                  Didn't receive the code?
                </p>

                <motion.button
                  whileHover={
                    resendCooldown <= 0
                      ? { y: -1 }
                      : undefined
                  }
                  whileTap={
                    resendCooldown <= 0
                      ? { scale: 0.98 }
                      : undefined
                  }
                  type="button"
                  onClick={handleResend}
                  disabled={
                    resendCooldown > 0 ||
                    isVerifying ||
                    isResending
                  }
                  className={`mt-2 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    resendCooldown > 0
                      ? "cursor-not-allowed text-slate-400"
                      : "text-blue-600 hover:bg-blue-50"
                  } disabled:opacity-60`}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isResending
                        ? "animate-spin"
                        : ""
                    }`}
                  />

                  {isResending
                    ? "Sending..."
                    : resendCooldown > 0
                    ? `Resend available in ${resendCooldown}s`
                    : "Resend verification code"}
                </motion.button>
              </motion.div>

              {/* Security note */}
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.7,
                  duration: 0.45,
                  ease: AUTH_EASE,
                }}
                className="mt-7 border-t border-slate-100 pt-6 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="h-4 w-4" />
                  Your verification code is temporary
                  and should never be shared.
                </div>
              </motion.div>

            </div>

          </motion.div>

        </div>
      </main>
    </AdminLayout>
  );
}

export default SecondaryAdminVerification;