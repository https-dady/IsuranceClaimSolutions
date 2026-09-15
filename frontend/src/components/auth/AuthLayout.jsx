import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";

function AuthLayout({ children, backTo, backLabel }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7fbff] px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
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
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white/60 shadow-[0_20px_60px_rgba(37,99,235,0.12)] backdrop-blur-xl lg:grid-cols-2"
        >
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
                  <ShieldCheck className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Insurance Claim Solution</h2>
                  <p className="text-sm text-blue-200">The Legal Consultant</p>
                </div>
              </div>

              <h1 className="max-w-md text-4xl font-bold leading-tight">
                Your claim deserves the
                <span className="block text-blue-300">right support.</span>
              </h1>

              <p className="mt-6 max-w-md leading-relaxed text-slate-300">
                Access your account, track your insurance claim queries,
                and stay updated throughout the process.
              </p>
            </div>

            <div className="relative z-10 mt-10 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm leading-relaxed text-slate-300">
                &quot;We help policyholders navigate rejected, delayed, and
                disputed insurance claims with professional guidance.&quot;
              </p>
            </div>
          </div>

          <div className="bg-white/50 p-8 sm:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-blue-700 shadow-lg">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Insurance Claim Solution</h2>
                  <p className="text-sm text-blue-700">The Legal Consultant</p>
                </div>
              </div>

              {backTo && (
                <Link
                  to={backTo}
                  className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {backLabel}
                </Link>
              )}

              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AuthLayout;
