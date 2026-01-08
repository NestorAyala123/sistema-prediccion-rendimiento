import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { normalizeRole, hasRole, getDashboardPath } from '../utils/roleUtils';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Obtener y normalizar el rol del usuario
  const userRole = normalizeRole((user as any)?.role || (user as any)?.rol);
  
  // Verificar si el usuario tiene permiso
  if (!hasRole(userRole, allowedRoles)) {
    // Redirigir al dashboard correspondiente del usuario
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
