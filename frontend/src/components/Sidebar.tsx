import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { HomeIcon, UsersIcon, ChartBarIcon, LifebuoyIcon, XMarkIcon } from '@heroicons/react/24/outline';

type SidebarProps = {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, setMobileOpen }) => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const items = [
    { to: '/', label: t('sidebar.panel'), icon: 'home' },
    { to: '/predicciones', label: t('sidebar.predicciones'), icon: 'chart' },
    { to: '/estudiantes', label: t('sidebar.estudiantes'), icon: 'users' },
    { to: '/soporte', label: t('sidebar.soporte'), icon: 'support' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Derivar un nombre de usuario para mostrar: preferir email localpart, sino nombres
  const displayedUser = user?.email ? user.email.split('@')[0] : (user?.nombres ? `${user.nombres} ${user.apellidos ?? ''}` : 'Usuario');

  return (
    <>
      {/* Overlay para móvil cuando el sidebar está abierto */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setMobileOpen && setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`bg-white border-r h-screen flex-shrink-0 z-40 transition-transform duration-200 ${
          mobileOpen ? 'fixed left-0 top-0 w-64 transform translate-x-0' : 'md:static md:translate-x-0'
        } ${expanded ? 'w-56' : 'w-16'}`}
        aria-label="Barra lateral principal"
      >
        <div className="h-full flex flex-col">
          {/* Header: logo y control expandir */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white rounded-md w-9 h-9 flex items-center justify-center font-bold">SP</div>
              {expanded && (
                <div>
                  <div className="text-sm font-semibold text-gray-800">{t('navbar.systemTitle')}</div>
                  <div className="text-xs text-gray-500">Unidad Educativa</div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Pequeña X para contraer (como en la página) */}
              {expanded && (
                <button
                  aria-label="Contraer menú"
                  onClick={() => setExpanded(false)}
                  className="text-gray-500 hover:bg-gray-100 p-1 rounded focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Cerrar en móvil */}
              <button
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className="md:hidden text-gray-600 p-1 rounded hover:bg-gray-100 focus:outline-none"
                aria-label="Cerrar menú móvil"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Perfil breve */}
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                {user?.nombres ? (user.nombres.charAt(0) + (user.apellidos ? user.apellidos.charAt(0) : '')) : 'U'}
              </div>
              {expanded && (
                <div className="flex-1">
                  {/* Mostrar username si existe, si no usar email localpart o nombres */}
                  <div className="text-sm font-semibold text-gray-800">{displayedUser}</div>
                  <div className="text-xs text-green-600">{user?.role ?? 'User'}</div>
                </div>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-1 py-3" aria-label="Navegación principal">
            {items.map((it) => {
              const active = location.pathname === it.to;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 mx-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {/* Iconos simples tipo Heroicons inline */}
                  {it.icon === 'home' && <HomeIcon className="w-5 h-5 text-gray-500" />}
                  {it.icon === 'users' && <UsersIcon className="w-5 h-5 text-gray-500" />}
                  {it.icon === 'chart' && <ChartBarIcon className="w-5 h-5 text-gray-500" />}
                  {it.icon === 'support' && <LifebuoyIcon className="w-5 h-5 text-gray-500" />}

                  {expanded && <span>{it.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer del sidebar */}
          <div className="px-4 py-3 border-t">
            <div className="flex items-center justify-between">
              {expanded && <div className="text-xs text-gray-600">{t('sidebar.opcionesRapidas')}</div>}
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 text-sm focus:outline-none"
              >
                {expanded ? t('navbar.logout') : t('navbar.logout')}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
