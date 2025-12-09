import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  performSearch: (term: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType>({
  searchTerm: '',
  setSearchTerm: () => {},
  performSearch: () => {},
  clearSearch: () => {},
});

export const useSearch = () => useContext(SearchContext);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const performSearch = useCallback((term: string) => {
    setSearchTerm(term);
    
    // Si estamos en login o no hay término, no hacer nada
    if (location.pathname === '/login' || !term.trim()) {
      return;
    }

    // Determinar a dónde navegar basado en el término de búsqueda
    const termLower = term.toLowerCase();

    // Palabras clave para estudiantes
    if (termLower.includes('estudiante') || 
        termLower.includes('alumno') || 
        termLower.includes('student') ||
        termLower.match(/^\d{10}$/)) { // ID de estudiante (10 dígitos)
      navigate('/estudiantes');
    }
    // Palabras clave para predicciones
    else if (termLower.includes('prediccion') || 
             termLower.includes('prediction') || 
             termLower.includes('riesgo') || 
             termLower.includes('risk')) {
      navigate('/predicciones');
    }
    // Palabras clave para soporte
    else if (termLower.includes('ayuda') || 
             termLower.includes('soporte') || 
             termLower.includes('help') || 
             termLower.includes('support')) {
      navigate('/soporte');
    }
    // Si ya estamos en una página específica, mantener la búsqueda ahí
    // Si no, ir al dashboard
    else if (location.pathname === '/') {
      // En el dashboard, podrías mostrar resultados generales
      return;
    }
  }, [location.pathname, navigate]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, performSearch, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};
