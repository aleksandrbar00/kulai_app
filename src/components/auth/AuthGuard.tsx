import React from "react";
import { Navigate, useLocation } from "react-router";
import { authState } from "./authStore";

type TProps = {
  children: React.ReactNode;
};

export const AuthGuard: React.FC<TProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authState.value.isAuthenticated;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
