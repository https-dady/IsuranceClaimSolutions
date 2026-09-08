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

import { currentUser } from "../utils/currentUser";


function AppRoutes() {

  // ================= USER ROLE CHECKS =================

  const isAdmin = currentUser?.type === "admin";

  const isMainAdmin =
    currentUser?.type === "admin" &&
    currentUser?.role === "main_admin";


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


      {/* ================= NORMAL USER ROUTES ================= */}

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


      {/* ================= ADMIN ROUTES ================= */}


      {/* ADMIN DASHBOARD */}

      <Route
        path="/admin"
        element={
          isAdmin
            ? <AdminDashboard />
            : <Navigate to="/" replace />
        }
      />


      {/* ALL QUERIES */}

      <Route
        path="/admin/queries"
        element={
          isAdmin
            ? <AdminQueries />
            : <Navigate to="/" replace />
        }
      />


      {/* MY ASSIGNED QUERIES */}

      <Route
        path="/admin/my-assigned-queries"
        element={
          isAdmin
            ? <AdminQueries />
            : <Navigate to="/" replace />
        }
      />


      {/* ADMIN QUERY DETAILS */}

      <Route
        path="/admin/queries/:id"
        element={
          isAdmin
            ? <AdminQueryDetails />
            : <Navigate to="/" replace />
        }
      />


      {/* ================= MAIN ADMIN ONLY ================= */}

      <Route
        path="/admin/admin-management"
        element={
          isMainAdmin
            ? <AdminManagement />
            : <Navigate to="/admin" replace />
        }
      />


      {/* ================= OTHER ADMIN PAGES ================= */}

      <Route
        path="/admin/users"
        element={
          isAdmin
            ? <AdminUsers />
            : <Navigate to="/" replace />
        }
      />

      <Route
        path="/admin/documents"
        element={
          isAdmin
            ? <AdminDocuments />
            : <Navigate to="/" replace />
        }
      />

      <Route
        path="/admin/feedbacks"
        element={
          isAdmin
            ? <AdminFeedbacks />
            : <Navigate to="/" replace />
        }
      />


      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default AppRoutes;