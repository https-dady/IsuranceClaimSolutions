import { CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/layout/AdminLayout";
import { useAuth } from "../../context/AuthContext";

function SecondaryAdminSuccess() {
  const navigate = useNavigate();

  const { isMainAdmin } = useAuth();

  if (!isMainAdmin) {
    return (
      <AdminLayout>
        <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600">
            <ShieldCheck className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Main Admin Access Required
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Only the Main Admin can access this page.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/admin-management")
            }
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Admin Management
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout role="main_admin">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.94,
            y: 16,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
          }}
          className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12"
        >

          <motion.div
            initial={{
              scale: 0,
              rotate: -12,
            }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              delay: 0.15,
              type: "spring",
              stiffness: 300,
              damping: 18,
            }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
          >
            <CheckCircle2 className="h-11 w-11" />
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
              delay: 0.25,
            }}
            className="mt-7 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Secondary Admin Created Successfully
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
              delay: 0.35,
            }}
            className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500"
          >
            The Secondary Admin email has been verified
            and the account is now active.
          </motion.p>

          <motion.button
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.45,
            }}
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            whileHover={{
              y: -1,
            }}
            whileTap={{
              scale: 0.98,
            }}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ShieldCheck className="h-4 w-4" />
            Back to Admin Dashboard
          </motion.button>

        </motion.div>
      </div>
    </AdminLayout>
  );
}

export default SecondaryAdminSuccess;