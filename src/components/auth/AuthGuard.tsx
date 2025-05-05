import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { authState } from './authStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authState.value.isAuthenticated;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 