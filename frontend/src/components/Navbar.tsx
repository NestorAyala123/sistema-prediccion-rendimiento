import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSearch } from '../contexts/SearchContext';
import { 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  XMarkIcon,
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import ProfileModal from './ProfileModal';

interface SearchSuggestion {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  keywords: string[];
}

type NavbarProps = {
  onToggleSidebar?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { setSearchTerm, performSearch, clearSearch } = useSearch();
  const [localSearch, setLocalSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Definir sugerencias de navegación
  const suggestions: SearchSuggestion[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Vista general del sistema',
      route: '/',
      icon: <HomeIcon className="w-4 h-4" />,
      keywords: ['inicio', 'home', 'dashboard', 'principal', 'resumen']
    },
    {
      id: 'estudiantes',
      title: 'Estudiantes',
      description: 'Gestión de estudiantes',
      route: '/estudiantes',
      icon: <UserGroupIcon className="w-4 h-4" />,
      keywords: ['estudiantes', 'alumnos', 'students', 'gestión', 'lista']
    },
    {
      id: 'predicciones',
      title: 'Predicciones',
      description: 'Análisis de riesgo con IA',
      route: '/predicciones',
      icon: <ChartBarIcon className="w-4 h-4" />,
      keywords: ['predicciones', 'predictions', 'riesgo', 'risk', 'análisis', 'ia', 'inteligencia']
    },
    {
      id: 'soporte',
      title: 'Soporte',
      description: 'Centro de ayuda',
      route: '/soporte',
      icon: <QuestionMarkCircleIcon className="w-4 h-4" />,
      keywords: ['soporte', 'support', 'ayuda', 'help', 'asistencia']
    }
  ];

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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filtrar sugerencias basadas en el input
  useEffect(() => {
    if (!localSearch.trim()) {
      setFilteredSuggestions(suggestions);
      setShowSuggestions(false);
      return;
    }

    const searchLower = localSearch.toLowerCase();
    const filtered = suggestions.filter(suggestion => 
      suggestion.title.toLowerCase().includes(searchLower) ||
      suggestion.description.toLowerCase().includes(searchLower) ||
      suggestion.keywords.some(keyword => keyword.includes(searchLower))
    );

    setFilteredSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [localSearch]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredSuggestions.length > 0) {
      const suggestion = selectedIndex >= 0 
        ? filteredSuggestions[selectedIndex] 
        : filteredSuggestions[0];
      navigateToSuggestion(suggestion);
    } else {
      performSearch(localSearch);
    }
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    clearSearch();
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearchTerm(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const navigateToSuggestion = (suggestion: SearchSuggestion) => {
    navigate(suggestion.route);
    setLocalSearch('');
    clearSearch();
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (localSearch.trim()) {
      setShowSuggestions(filteredSuggestions.length > 0);
    }
  };

  // Atajo de teclado Ctrl+K para enfocar búsqueda
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const { lang, setLang, t } = useLanguage();

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

          <div className="flex-1 px-4 max-w-md">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <label htmlFor="site-search" className="sr-only">
                Buscar en el sistema
              </label>
              <div className="relative w-full" ref={searchRef}>
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10" />
                <input
                  ref={inputRef}
                  id="site-search"
                  name="q"
                  type="text"
                  value={localSearch}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleInputFocus}
                  placeholder="Buscar secciones..."
                  className="w-full pl-9 pr-16 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                  aria-label="Buscar en el sistema"
                  autoComplete="off"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {localSearch ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                      aria-label="Limpiar búsqueda"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded font-mono">
                      ⌘K
                    </span>
                  )}
                </div>

                {/* Panel de Sugerencias - Estilo VS Code */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-xl z-50 overflow-hidden border border-gray-200">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onClick={() => navigateToSuggestion(suggestion)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full px-3 py-2 text-left flex items-center gap-2.5 transition-all border-l-2 ${
                          selectedIndex === index 
                            ? 'bg-blue-50/80 border-l-blue-500' 
                            : 'border-l-transparent hover:bg-gray-50'
                        }`}
                      >
                        <div className={`flex-shrink-0 ${
                          selectedIndex === index ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {suggestion.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className={`text-[13px] ${
                              selectedIndex === index ? 'text-gray-900 font-medium' : 'text-gray-700'
                            }`}>
                              {suggestion.title}
                            </span>
                            <span className="text-gray-400 text-[11px]">-</span>
                            <span className="text-[11px] text-gray-500 truncate">
                              {suggestion.description}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Sin resultados */}
                {showSuggestions && filteredSuggestions.length === 0 && localSearch.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-2xl z-50 border border-gray-100">
                    <div className="px-4 py-6 text-center text-gray-400">
                      <MagnifyingGlassIcon className="w-6 h-6 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No se encontraron resultados</p>
                    </div>
                  </div>
                )}
              </div>
            </form>
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
