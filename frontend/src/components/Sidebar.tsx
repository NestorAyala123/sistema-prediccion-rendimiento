import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const items = [
    { to: '/', label: 'Dashboard', icon: 'M3 12h18' },
    { to: '/estudiantes', label: 'Estudiantes', icon: 'M5 3v4' },
    { to: '/predicciones', label: 'Predicciones', icon: 'M12 6v6' },
  ];

  return (
    <aside
      className={`bg-white border-r ${
        expanded ? 'w-56' : 'w-16'
      } transition-width duration-200`}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-3">
          <div className="text-sm font-semibold text-gray-800">Menú</div>
          <button
            aria-label="Expandir menú"
            onClick={() => setExpanded(!expanded)}
            className="text-gray-600 hover:bg-gray-100 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {expanded ? '«' : '»'}
          </button>
        </div>

        <nav className="flex-1 px-1 space-y-1" aria-label="Principal">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-md mx-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
              {expanded && <span>{it.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 text-xs text-gray-500">
          Atajos: <br />
          <span className="text-gray-700">D</span>ashboard ·{' '}
          <span className="text-gray-700">E</span>studiantes
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
