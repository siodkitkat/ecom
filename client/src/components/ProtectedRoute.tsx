import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children, redirectTo = "/login" }: { redirectTo?: string; children: React.ReactElement }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return isLoggedIn ? children : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
