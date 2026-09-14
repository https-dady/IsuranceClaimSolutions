import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Pencil,
  User,
  Cake,
  Phone,
  Mail,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  Save,
  X,
  Loader2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getMyProfile,
  updateMyProfile,
  updateProfilePhoto,
} from "../../api/profileApi";

import { useAuth } from "../../context/AuthContext";

function MyProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { logoutUser } = useAuth();

  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    phone: "",
  });

  const [showPhoneVerification, setShowPhoneVerification] =
    useState(false);

  /*
  =========================================================
  FETCH PROFILE
  =========================================================
  */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getMyProfile();

        if (response?.profile) {
          setUser(response.profile);

          setEditData({
            name: response.profile.name || "",
            phone: response.profile.phone || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);

        if (err?.status === 401) {
          logoutUser();
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err?.message ||
            "Unable to load your profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [logoutUser, navigate]);

  /*
  =========================================================
  CLEAR MESSAGES
  =========================================================
  */

  useEffect(() => {
    if (!success && !error) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [success, error]);

  /*
  =========================================================
  EDIT PROFILE
  =========================================================
  */

  const handleEditStart = () => {
    if (!user) return;

    setEditData({
      name: user.name || "",
      phone: user.phone || "",
    });

    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    if (!user) return;

    setEditData({
      name: user.name || "",
      phone: user.phone || "",
    });

    setError("");
    setIsEditing(false);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSaveProfile = async () => {
    const trimmedName = editData.name.trim();
    const trimmedPhone = editData.phone.trim();

    if (!trimmedName) {
      setError("Name cannot be empty.");
      return;
    }

    if (!trimmedPhone) {
      setError("Phone number cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const response = await updateMyProfile({
        name: trimmedName,
        phone: trimmedPhone,
      });

      if (response?.profile) {
        setUser(response.profile);

        setEditData({
          name: response.profile.name || "",
          phone: response.profile.phone || "",
        });
      }

      setIsEditing(false);
      setSuccess(
        response?.message || "Profile updated successfully."
      );
    } catch (err) {
      console.error("Failed to update profile:", err);

      if (err?.status === 401) {
        logoutUser();
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  /*
  =========================================================
  PROFILE PHOTO
  =========================================================
  */

  const handlePhotoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
    Basic frontend validation.
    Backend still remains the final validation layer.
    */

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setError("");
      setSuccess("");

      const response = await updateProfilePhoto(file);

      if (response?.profilePhoto?.url) {
        setUser((prev) => ({
          ...prev,
          profilePhotoUrl: response.profilePhoto.url,
        }));
      }

      setSuccess(
        response?.message ||
          "Profile photo updated successfully."
      );
    } catch (err) {
      console.error("Failed to update profile photo:", err);

      if (err?.status === 401) {
        logoutUser();
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err?.message ||
          "Unable to update profile photo. Please try again."
      );
    } finally {
      setIsUploadingPhoto(false);

      /*
      Allows selecting the same file again later.
      */
      event.target.value = "";
    }
  };

  /*
  =========================================================
  LOGOUT
  =========================================================
  */

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  /*
  =========================================================
  LOADING STATE
  =========================================================
  */

  if (isLoading) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />

          <p className="font-medium text-slate-600">
            Loading your profile...
          </p>
        </div>
      </section>
    );
  }

  /*
  =========================================================
  PROFILE NOT AVAILABLE
  =========================================================
  */

  if (!user) {
    return (
      <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/80 bg-white/80 p-8 text-center shadow-xl backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <User className="h-7 w-7" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Unable to load profile
          </h2>

          <p className="mt-3 text-slate-600">
            {error ||
              "Something went wrong while loading your profile."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  /*
  =========================================================
  PROFILE PHOTO FALLBACK
  =========================================================
  */

  const profilePhoto =
    user.profilePhotoUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name || "User"
    )}&background=2563eb&color=fff&size=256`;

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 sm:py-16">
      {/* ================= BACKGROUND DECORATION ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* ================= PAGE HEADER ================= */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="mb-10 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-xl">
            <User className="h-4 w-4" />
            MY ACCOUNT
          </div>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            My{" "}
            <span className="text-blue-600">
              Profile
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Manage your personal information and account details.
          </p>
        </motion.div>

        {/* ================= SUCCESS MESSAGE ================= */}

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= ERROR MESSAGE ================= */}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= PROFILE CARD ================= */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-xl shadow-blue-900/5 backdrop-blur-xl"
        >
          {/* ================= TOP PROFILE SECTION ================= */}

          <div className="relative px-6 pb-8 pt-10 sm:px-10">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 opacity-95" />

            <div className="relative flex flex-col items-center text-center">
              {/* ================= PROFILE IMAGE ================= */}

              <div className="group relative mb-5">
                <div className="absolute -inset-2 rounded-full bg-blue-500/20 blur-xl transition-opacity duration-300 group-hover:bg-blue-500/30" />

                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl sm:h-36 sm:w-36">
                  <img
                    src={profilePhoto}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />

                  {isUploadingPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}
                </div>

                {/* ================= EDIT PHOTO BUTTON ================= */}

                <button
                  type="button"
                  onClick={handlePhotoButtonClick}
                  disabled={isUploadingPhoto}
                  className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Edit profile photo"
                >
                  {isUploadingPhoto ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Pencil className="h-4 w-4" />
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {/* ================= USER NAME ================= */}

              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {user.name}
              </h2>

              {/* Account Badge */}

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600">
                <ShieldCheck className="h-4 w-4" />
                Account Active
              </div>
            </div>
          </div>

          {/* ================= PROFILE DETAILS ================= */}

          <div className="border-t border-slate-100 px-6 py-8 sm:px-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Personal Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Keep your account information up to date.
                </p>
              </div>

              {!isEditing && (
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEditStart}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </motion.button>
              )}
            </div>

            <div className="space-y-5">
              {/* ================= NAME ================= */}

              {isEditing ? (
                <div className="rounded-2xl border border-blue-100 bg-white/70 p-5 shadow-sm">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-500"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={editData.name}
                    onChange={handleEditChange}
                    disabled={isSaving}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-100 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <User className="h-5 w-5" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-500">
                        Full Name
                      </p>

                      <p className="mt-0.5 font-semibold text-slate-900">
                        {user.name}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================= AGE ================= */}

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-100 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Cake className="h-5 w-5" />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-500">
                      Age
                    </p>

                    <p className="mt-0.5 font-semibold text-slate-900">
                      Not added yet
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ================= PHONE NUMBER ================= */}

              {isEditing ? (
                <div className="rounded-2xl border border-blue-100 bg-white/70 p-5 shadow-sm">
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-slate-500"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={editData.phone}
                    onChange={handleEditChange}
                    disabled={isSaving}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Changing your phone number will require phone
                    verification again.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-4 rounded-2xl border border-white bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-100 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Phone className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Phone Number
                      </p>

                      <p className="mt-0.5 font-semibold text-slate-900">
                        {user.phone}
                      </p>
                    </div>
                  </div>

                  {/* PHONE VERIFY BUTTON */}

                  {user.phoneVerified ? (
                    <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-600">
                      <ShieldCheck className="h-4 w-4" />
                      Verified
                    </div>
                  ) : (
                    <motion.button
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        setShowPhoneVerification(true)
                      }
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
                    >
                      Verify
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* ================= EMAIL ================= */}

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-100 hover:shadow-md"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 text-left">
                    <p className="text-sm font-medium text-slate-500">
                      Email Address
                    </p>

                    <p className="mt-0.5 truncate font-semibold text-slate-900">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="hidden items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600 sm:inline-flex">
                  <ShieldCheck className="h-4 w-4" />
                  Verified
                </div>
              </motion.div>

              {/* Mobile Email Verified */}

              <div className="flex items-center gap-2 px-2 text-sm font-semibold text-emerald-600 sm:hidden">
                <ShieldCheck className="h-4 w-4" />
                Email Verified
              </div>
            </div>

            {/* ================= EDIT ACTIONS ================= */}

            {isEditing && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ================= LOGOUT ================= */}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 border-t border-slate-100 pt-8"
            >
              <motion.button
                type="button"
                onClick={handleLogout}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50 px-5 py-4 font-semibold text-red-600 transition-all duration-300 hover:border-red-200 hover:bg-red-100"
              >
                <LogOut className="h-5 w-5" />

                Logout from your account
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* ================= PHONE OTP COMPONENT ================= */}

        <AnimatePresence>
          {showPhoneVerification && (
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 30,
              }}
              transition={{
                duration: 0.3,
              }}
              className="mt-8 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8"
            >
              {/* Back */}

              <button
                type="button"
                onClick={() =>
                  setShowPhoneVerification(false)
                }
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
              >
                <ChevronLeft className="h-4 w-4" />

                Back to Profile
              </button>

              {/* OTP CONTENT */}

              <div className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Phone className="h-7 w-7" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Phone Verification
                </h3>

                <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-600">
                  Phone OTP verification will be enabled once the
                  SMS/WhatsApp OTP provider is connected to the
                  backend.
                </p>

                <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-700">
                  Phone verification is currently unavailable.
                  Please try again after the verification provider
                  is configured.
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPhoneVerification(false)
                  }
                  className="mt-6 rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
                >
                  Back to Profile
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default MyProfile;