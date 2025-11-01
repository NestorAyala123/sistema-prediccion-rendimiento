import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n/useTranslation';
import AccessibilityMenuInline from './AccessibilityMenuInline';

type Props = {
  onOpenMobile?: () => void;
  onToggleSidebar?: () => void;
  onToggleDark?: () => void;
  sidebarExpanded?: boolean;
  darkMode?: boolean;
};

const Navbar: React.FC<Props> = ({
  onOpenMobile,
  onToggleSidebar,
  onToggleDark,
  sidebarExpanded = true,
  darkMode = false,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHelp = () => {
    alert(
      'Help center:\n- Contact: soporte@universidad.edu\n- Phone: +593 XXXX XXXX'
    );
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b py-3 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Botón menú móvil */}
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6 text-gray-700 dark:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Botón para sidebar */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:inline-flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                sidebarExpanded
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>

        <Link to="/" className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {t('app.name')}
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Usuario y botones solo visibles en pantallas medianas */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="text-sm text-gray-700 px-2">
            {user?.nombres} {user?.apellidos}
          </div>

          <button
            onClick={handleHelp}
            className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Help"
          >
            {t('nav.help')}
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Logout"
          >
            {t('nav.logout')}
          </button>
        </div>

        {/* Modo oscuro */}
        <button
          onClick={onToggleDark}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg
              className="w-5 h-5 text-yellow-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m8.66-9H21M3 12H4.34M18.36 6.64l-.7.7M6.34 18.66l-.7.7M18.36 17.36l-.7-.7M6.34 5.34l-.7-.7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              />
            </svg>
          )}
        </button>

  {/* Selector de idioma */}
        <label htmlFor="lang-select" className="sr-only">
          {t('nav.language')}
        </label>
        <select
          id="lang-select"
          aria-label="Select language"
          value={lang}
          onChange={(e) => setLang(e.target.value as 'es' | 'en')}
          className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-900"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>

        {/* Menú de accesibilidad en la esquina superior derecha, junto al selector de idioma */}
        <AccessibilityMenuInline />
      </div>
    </header>
  );
};

export default Navbar;
