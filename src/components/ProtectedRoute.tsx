import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // For admin routes, check if the user has admin privileges
  if (adminOnly) {
    const isAdmin = user.app_metadata?.is_admin;
    if (!isAdmin) {
      return <Navigate to="/" />;
    }
  }



  return <>{children}</>;
}