import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id?: string;
  nombres?: string;
  apellidos?: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos al iniciar - usar sessionStorage para mantener ventanas independientes
  useEffect(() => {
    console.log('🔄 Inicializando AuthContext...');
    
    // Primero intentar cargar desde sessionStorage (específico de esta ventana)
    let savedToken = sessionStorage.getItem('token');
    let savedUser = sessionStorage.getItem('user');

    console.log('📦 SessionStorage:', savedToken ? '✅ Token encontrado' : '❌ No hay token');

    // Si no hay datos en sessionStorage, intentar desde localStorage (primera carga)
    if (!savedToken) {
      savedToken = localStorage.getItem('token');
      savedUser = localStorage.getItem('user');
      
      console.log('📦 LocalStorage:', savedToken ? '✅ Token encontrado' : '❌ No hay token');
      
      // Si encontramos datos en localStorage, copiarlos a sessionStorage
      if (savedToken && savedUser) {
        sessionStorage.setItem('token', savedToken);
        sessionStorage.setItem('user', savedUser);
        console.log('✅ Token copiado de localStorage a sessionStorage');
      }
    }

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        console.log('✅ Usuario autenticado desde storage');
      } catch (err) {
        console.error('❌ Error al cargar datos de sesión', err);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('⚠️ No hay sesión guardada');
    }

    setIsLoading(false);
    console.log('✅ AuthContext inicializado');
  }, []);

  // Escuchar cambios en localStorage para sincronizar logout entre ventanas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Si se eliminó el token de localStorage, significa que otra ventana cerró sesión
      if (e.key === 'token' && e.newValue === null) {
        // console.log('🔔 Logout detectado en otra ventana');
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
      // Si se agregó un token nuevo, otra ventana inició sesión
      else if (e.key === 'token' && e.newValue && !token) {
        // console.log('🔔 Login detectado en otra ventana');
        const newUser = localStorage.getItem('user');
        if (newUser) {
          try {
            setToken(e.newValue);
            setUser(JSON.parse(newUser));
            sessionStorage.setItem('token', e.newValue);
            sessionStorage.setItem('user', newUser);
          } catch (err) {
            console.error('Error al sincronizar login:', err);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token]);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    // Guardar en ambos: localStorage (para compartir entre ventanas nuevas) y sessionStorage (esta ventana)
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', authToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const updateProfile = (data: Partial<User>) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...data } as User;
      try {
        // Actualizar en ambos storages
        localStorage.setItem('user', JSON.stringify(updated));
        sessionStorage.setItem('user', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving updated user', err);
      }
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Limpiar sessionStorage de esta ventana
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    // Limpiar localStorage solo si no hay otras ventanas activas
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
