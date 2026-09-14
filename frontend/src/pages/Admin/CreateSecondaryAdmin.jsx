import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";

import AdminLayout from "../../components/layout/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import {
  createSecondaryAdmin,
} from "../../api/adminApi";


function CreateSecondaryAdmin() {
  const navigate = useNavigate();

  const { isMainAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(
        "All fields are required."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response =
        await createSecondaryAdmin(
          formData
        );

      setSuccess(
        response?.message ||
          "Secondary Admin created successfully."
      );

      navigate("/verify-email", {
        state: {
          email:
            response?.email ||
            formData.email
              .trim()
              .toLowerCase(),
          fromAdminCreation: true,
        },
      });

    } catch (requestError) {
      console.error(
        "Create Secondary Admin error:",
        requestError
      );

      setError(
        requestError?.message ||
          "Unable to create Secondary Admin."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


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
            Only the Main Admin can create a
            Secondary Admin.
          </p>

          <Link
            to="/admin/admin-management"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Management
          </Link>
        </div>
      </AdminLayout>
    );
  }


  return (
    <AdminLayout role="main_admin">
      <div className="mx-auto max-w-2xl">

        <div className="mb-6">
          <Link
            to="/admin/admin-management"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Management
          </Link>
        </div>


        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

          <div className="border-b border-slate-100 p-6 sm:p-8">
            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20">
                <UserPlus className="h-6 w-6 text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Create Secondary Admin
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new Secondary Admin account.
                </p>
              </div>

            </div>
          </div>


          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8"
          >

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                {success}
              </div>
            )}


            <div className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-400 disabled:bg-slate-50"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-400 disabled:bg-slate-50"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-400 disabled:bg-slate-50"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-blue-400 disabled:bg-slate-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-blue-400 disabled:bg-slate-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>
              </div>

            </div>


            <div className="mt-8 flex gap-3">

              <Link
                to="/admin/admin-management"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create Secondary Admin"}
              </button>

            </div>

          </form>

        </motion.div>
      </div>
    </AdminLayout>
  );
}

export default CreateSecondaryAdmin;