import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

/**
 * ProtectedRoute Component
 * 
 * A reusable component that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page.
 * 
 * Requirements: 2.5
 */

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  isAuthenticated, 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
