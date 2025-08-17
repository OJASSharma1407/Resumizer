import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    // Not authenticated → redirect to login
    return <Navigate to="/login" replace />;
  }

  // Authenticated → render nested routes
  return <Outlet />;
}
