import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';

type Props = {
  expanded?: boolean;
  onToggleExpand?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  className?: string;
};

const Sidebar: React.FC<Props> = ({
  expanded = true,
  onToggleExpand,
  mobileOpen = false,
  onCloseMobile,
  className = '',
}) => {
  const location = useLocation();
  const { t } = useTranslation();

  const items = [
    { to: '/', label: t('dashboard'), icon: 'M3 12h18' },
    { to: '/estudiantes', label: t('students'), icon: 'M5 3v4' },
    { to: '/predicciones', label: t('predictions'), icon: 'M12 6v6' },
  ];

  // Mobile overlay
  if (className && mobileOpen) {
    return (
      <div className={`fixed inset-0 z-50 ${className}`}>
        <div
          className="absolute inset-0 bg-black opacity-40"
          onClick={onCloseMobile}
        ></div>
        <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-gray-800">Menu</div>
            <button onClick={onCloseMobile} className="text-gray-600">
              {t('cancel')}
            </button>
          </div>
          <nav className="space-y-1">
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  location.pathname === it.to
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500"
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
                <span>{it.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    );
  }

  return (
    <aside
      className={`bg-white dark:bg-gray-800 border-r transition-width duration-200 ${
        expanded ? 'w-56' : 'w-16'
      } ${className}`}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-3">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Menu
          </div>
          <button
            aria-label="Toggle menu"
            onClick={() => onToggleExpand && onToggleExpand()}
            className="text-gray-600 hover:bg-gray-100 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {expanded ? '«' : '»'}
          </button>
        </div>

        <nav className="flex-1 px-1 space-y-1" aria-label="Main">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-md mx-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                location.pathname === it.to
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200'
              }`}
            >
              <svg
                className="w-5 h-5 text-gray-500"
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
              {expanded && <span>{it.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 text-xs text-gray-500 dark:text-gray-400">
          Shortcuts: <br />
          <span className="text-gray-700 dark:text-gray-200">D</span>ashboard ·{' '}
          <span className="text-gray-700 dark:text-gray-200">S</span>tudents
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
