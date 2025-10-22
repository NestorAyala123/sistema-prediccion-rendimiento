import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHelp = () => {
    alert(
      'Centro de ayuda:\n- Contacto: soporte@universidad.edu\n- Teléfono: +593 XXXX XXXX'
    );
  };

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <img
              src="/logo192.png"
              alt="logo"
              className="w-10 h-10 rounded-sm"
            />
            <div>
              <div className="text-gray-900 font-semibold">
                Sistema de Predicción
              </div>
              <div className="text-xs text-gray-500">
                Académica — Interfaz limpia
              </div>
            </div>
          </div>

          <div className="flex-1 px-4">
            <label htmlFor="site-search" className="sr-only">
              Buscar
            </label>
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="Buscar..."
              className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Buscar"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Idioma</span>
              <select
                aria-label="Seleccionar idioma"
                className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                defaultValue="es"
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
              </select>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <div className="text-sm text-gray-700 px-2">
                {user?.nombres} {user?.apellidos}
              </div>

              <button
                onClick={handleHelp}
                className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Ayuda"
              >
                <svg
                  className="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 14v.01M12 6a6 6 0 100 12 6 6 0 000-12z"
                  />
                </svg>
                Ayuda
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Salir"
              >
                <svg
                  className="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                  />
                </svg>
                Salir
              </button>
            </div>

            <div className="ml-2 text-sm text-green-600 hidden md:block">
              Sesión iniciada correctamente.
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
