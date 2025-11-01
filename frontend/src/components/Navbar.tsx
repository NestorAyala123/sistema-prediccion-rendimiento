import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ProfileModal from './ProfileModal';

type NavbarProps = {
  onToggleSidebar?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      // if click happens outside dropdown/button, close
      const menuEl = document.getElementById('user-menu');
      const btnEl = document.getElementById('user-menu-button');
      if (menuEl && btnEl && !menuEl.contains(target) && !btnEl.contains(target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showMenu]);
  const { lang, setLang, t } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nota: ayuda y mensaje de sesión removidos para una interfaz más limpia

  return (
    <header className="bg-white border-b">
      <div className="w-full px-0">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {/* Botón hamburguesa visible en pantallas pequeñas */}
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Abrir menú"
            >
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex items-center gap-3 pl-2">
              <img
                src="/logo192.png"
                alt="logo"
                className="w-8 h-8 rounded-sm"
              />
              <div className="hidden sm:block">
                <div className="text-gray-900 font-semibold">{t('navbar.systemTitle')}</div>
                <div className="text-xs text-gray-500">{t('navbar.systemSubtitle')}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4">
            <label htmlFor="site-search" className="sr-only">
              {t('navbar.search.placeholder')}
            </label>
            <div className="relative w-full max-w-lg">
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder={t('navbar.search.placeholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Buscar"
              />
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {/* Language selector */}
              <>
                <span className="text-sm text-gray-600">{t('navbar.language')}</span>
                <select
                  aria-label={t('navbar.language')}
                  value={lang}
                  onChange={(e) => setLang(e.target.value as 'es' | 'en')}
                  className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="es">ES</option>
                  <option value="en">EN</option>
                </select>
              </>
            </div>

            <div className="hidden md:flex items-center space-x-2 relative">
              <button
                id="user-menu-button"
                onClick={() => setShowMenu((v) => !v)}
                className="text-sm text-gray-700 px-2 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                aria-haspopup="true"
                aria-expanded={showMenu}
              >
                <span>{user?.nombres} {user?.apellidos}</span>
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1l-4.25 4.657a.75.75 0 01-1.07 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {showMenu && (
                <div id="user-menu" className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => { setShowProfile(true); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Editar perfil
                  </button>
                  <button
                    onClick={() => { handleLogout(); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Salir
                  </button>
                </div>
              )}

              {/* Ayuda eliminado para simplificar la interfaz */}

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
                {t('navbar.logout')}
              </button>
            </div>

            {/* Mensaje de sesión ocultado para mantener la barra limpia */}
          </div>
          {/* Profile modal */}
          <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
