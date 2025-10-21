import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              Sistema de Predicción Académica
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/estudiantes"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/estudiantes')
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              Estudiantes
            </Link>
            <Link
              to="/predicciones"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/predicciones')
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              Predicciones
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

