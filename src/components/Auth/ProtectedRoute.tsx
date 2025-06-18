
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAuth, UserRole } from '@/hooks/useRoleAuth';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasRole, isLoading: roleLoading, userRole } = useRoleAuth();

  // Show loading while checking authentication and roles
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <LoadingSpinner size="lg" text="جاري التحقق من الصلاحيات..." />
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check role permissions if required
  if (requiredRole && !hasRole(requiredRole)) {
    // Auto-redirect based on user role instead of showing error
    if (userRole === 'admin') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/user-dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
