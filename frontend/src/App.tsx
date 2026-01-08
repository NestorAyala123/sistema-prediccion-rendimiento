import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import './styles/accessibility.css';

// Componentes principales
import Dashboard from './components/Dashboard';
import Estudiantes from './components/Estudiantes';
import Predicciones from './components/Predicciones';
import Soporte from './components/Soporte';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import EstudianteDashboard from './components/EstudianteDashboard';
import DocenteDashboard from './components/DocenteDashboard';
import RegistroCalificaciones from './components/RegistroCalificaciones';
import AsistenciaRegistro from './components/AsistenciaRegistro';
import EstudiantesList from './components/EstudiantesList';
import ToastNotification from './components/ToastNotification';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SearchProvider } from './contexts/SearchContext';
import { RealTimeProvider } from './contexts/RealTimeContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RealTimeProvider>
          <LanguageProvider>
            <SearchProvider>
              <ToastNotification />
              <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas para Estudiantes */}
            <Route
              path="/estudiante/*"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={['estudiante']}>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<EstudianteDashboard />} />
                        <Route path="*" element={<Navigate to="/estudiante/dashboard" replace />} />
                      </Routes>
                    </Layout>
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Rutas para Docentes */}
            <Route
              path="/docente/*"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={['docente']}>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<DocenteDashboard />} />
                        <Route path="/calificaciones" element={<RegistroCalificaciones />} />
                        <Route path="/asistencia" element={<AsistenciaRegistro />} />
                        <Route path="/estudiantes" element={<EstudiantesList />} />
                        <Route path="*" element={<Navigate to="/docente/dashboard" replace />} />
                      </Routes>
                    </Layout>
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Rutas para Administradores */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={['administrador', 'admin']}>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/estudiantes" element={<Estudiantes />} />
                        <Route path="/predicciones" element={<Predicciones />} />
                        <Route path="/calificaciones" element={<RegistroCalificaciones />} />
                        <Route path="/soporte" element={<Soporte />} />
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                      </Routes>
                    </Layout>
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Redirección raíz según rol */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              }
            />

            {/* Ruta de fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SearchProvider>
        </LanguageProvider>
        </RealTimeProvider>
      </AuthProvider>
    </Router>
  );
}

// Componente auxiliar para redirigir según el rol
const RoleBasedRedirect: React.FC = () => {
  const { useAuth } = require('./contexts/AuthContext');
  const { user } = useAuth();
  const { normalizeRole, getDashboardPath } = require('./utils/roleUtils');
  
  const userRole = normalizeRole((user as any)?.role || (user as any)?.rol);
  const dashboardPath = getDashboardPath(userRole);
  
  return <Navigate to={dashboardPath} replace />;
};

export default App;
