import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home/Home";
import Services from "../pages/Services/Services";
import About from "../pages/About/About";
import Claims from "../pages/Claims/Claims";
import Gallery from "../pages/Gallery/Gallery";
import Feedback from "../pages/Feedback/Feedback";

import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import VerifyEmail from "../pages/Auth/VerifyEmail";

import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerifyResetOTP from "../pages/Auth/VerifyResetOTP";
import ResetPassword from "../pages/Auth/ResetPassword";

import MyProfile from "../pages/Profile/MyProfile";
import MyQueries from "../pages/Queries/MyQueries";
import QueryDetails from "../pages/MyQueries/QueryDetails";
import MyDocuments from "../pages/MyDocuments/MyDocuments";
import MyFeedbacks from "../pages/MyFeedbacks/MyFeedbacks";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminQueries from "../pages/Admin/AdminQueries";
import AdminQueryDetails from "../pages/Admin/AdminQueryDetails";
import AdminManagement from "../pages/Admin/AdminManagement";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminDocuments from "../pages/Admin/AdminDocuments";
import AdminFeedbacks from "../pages/Admin/AdminFeedbacks";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import MainAdminRoute from "./MainAdminRoute";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/services"
        element={<Services />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/claims"
        element={<Claims />}
      />

      <Route
        path="/gallery"
        element={<Gallery />}
      />

      <Route
        path="/feedback"
        element={<Feedback />}
      />


      {/* ================= AUTH ROUTES ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/verify-reset-otp"
        element={<VerifyResetOTP />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* ================= NORMAL USER ROUTES ================= */}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/profile"
          element={<MyProfile />}
        />

        <Route
          path="/my-queries"
          element={<MyQueries />}
        />

        <Route
          path="/my-queries/:id"
          element={<QueryDetails />}
        />

        <Route
          path="/my-documents"
          element={<MyDocuments />}
        />

        <Route
          path="/my-feedbacks"
          element={<MyFeedbacks />}
        />

      </Route>


      {/* ================= ADMIN ROUTES ================= */}

      <Route element={<AdminRoute />}>

        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* ALL QUERIES */}

        <Route
          path="/admin/queries"
          element={<AdminQueries />}
        />

        {/* MY ASSIGNED QUERIES */}

        <Route
          path="/admin/my-assigned-queries"
          element={<AdminQueries />}
        />

        {/* ADMIN QUERY DETAILS */}

        <Route
          path="/admin/queries/:id"
          element={<AdminQueryDetails />}
        />

        {/* OTHER ADMIN PAGES */}

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        <Route
          path="/admin/documents"
          element={<AdminDocuments />}
        />

        <Route
          path="/admin/feedbacks"
          element={<AdminFeedbacks />}
        />

      </Route>


      {/* ================= MAIN ADMIN ONLY ================= */}

      <Route element={<MainAdminRoute />}>

        <Route
          path="/admin/admin-management"
          element={<AdminManagement />}
        />

      </Route>


      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default AppRoutes;