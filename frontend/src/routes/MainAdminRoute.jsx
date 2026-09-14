import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function MainAdminRoute() {
  const {
    isAuthenticated,
    isMainAdmin,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isMainAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default MainAdminRoute;