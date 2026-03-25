import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2Icon } from 'lucide-react';
interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}
export function PrivateRoute({
  children,
  adminOnly = false
}: PrivateRouteProps) {
  const {
    isAuthenticated,
    loading,
    user
  } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="w-10 h-10 text-cyan-500 animate-spin" />
          <p className="text-slate-400 animate-pulse">Authenticating...</p>
        </div>
      </div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (adminOnly && user?.role !== 'ADMIN') {
    // Redirect non-admin users to user dashboard if they try to access admin routes
    return <Navigate to="/app/user-dashboard" replace />;
  }
  return <>{children}</>;
}