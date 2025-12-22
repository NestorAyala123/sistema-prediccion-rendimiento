import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role || 'estudiante';

  if (!allowedRoles.includes(userRole)) {
    // Redirigir a la página apropiada según el rol del usuario
    switch (userRole) {
      case 'administrador':
        return <Navigate to="/admin/dashboard" replace />;
      case 'docente':
        return <Navigate to="/docente/dashboard" replace />;
      case 'estudiante':
        return <Navigate to="/estudiante/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
