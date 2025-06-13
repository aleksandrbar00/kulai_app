import React from "react";
import { Navigate, useLocation } from "react-router";
import { authState, isAuthReady } from "./authStore";
import { useSignals } from "@preact/signals-react/runtime";

type TProps = {
  children: React.ReactNode;
};

export const AuthGuard: React.FC<TProps> = ({ children }) => {
  useSignals();
  const location = useLocation();
  const isAuthenticated = authState.value.isAuthenticated;

  if (!isAuthReady.value) return null;

  if (!isAuthenticated && isAuthReady.value) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
