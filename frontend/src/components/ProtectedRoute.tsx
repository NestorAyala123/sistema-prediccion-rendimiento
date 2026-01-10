import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('🔒 ProtectedRoute:', { isLoading, isAuthenticated });

  if (isLoading) {
    console.log('⏳ Esperando carga de autenticación...');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ No autenticado, redirigiendo a login...');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Acceso autorizado');
  return <>{children}</>;
};

export default ProtectedRoute;
