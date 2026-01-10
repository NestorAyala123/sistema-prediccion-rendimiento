import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface RealTimeContextType {
  socket: Socket | null;
  connected: boolean;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined);

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000';

export const RealTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated, token, isLoading } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log('🔄 RealTimeContext - useEffect ejecutado', { isLoading, isAuthenticated, hasToken: !!token });
    
    // No conectar si aún está cargando la autenticación
    if (isLoading) {
      console.log('⏳ Esperando carga de autenticación...');
      return;
    }

    // Solo conectar si el usuario está autenticado
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        console.log('🔌 Desconectando socket por logout...');
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      } else {
        console.log('⚠️ No autenticado, no se creará socket');
      }
      return;
    }

    // Evitar crear múltiples conexiones - verificar si ya existe un socket
    if (socketRef.current) {
      // Si el socket ya existe y está conectado, mantener
      if (socketRef.current.connected) {
        console.log('♻️ Socket ya conectado, manteniendo conexión...');
        return;
      }
      // Si el socket existe pero no está conectado, intentar reconectar
      console.log('🔄 Reconectando socket existente...');
      socketRef.current.connect();
      return;
    }

    console.log('🔌 Creando nueva conexión Socket.IO...');

    // Crear conexión de socket
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket.IO conectado');
      setConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO desconectado:', reason);
      setConnected(false);
      
      // Si la desconexión fue por el servidor, intentar reconectar
      if (reason === 'io server disconnect') {
        console.log('🔄 Servidor desconectó, reconectando...');
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error.message);
      setConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconectado después de ${attemptNumber} intentos`);
      setConnected(true);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Intento de reconexión #${attemptNumber}...`);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Error al reconectar:', error.message);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Falló la reconexión después de todos los intentos');
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      console.log('🧹 Limpiando conexión Socket.IO');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]); // Solo depender de autenticación, NO de socket

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  };

  const emit = (event: string, ...args: any[]) => {
    if (socket && connected) {
      socket.emit(event, ...args);
    }
  };

  return (
    <RealTimeContext.Provider value={{ socket, connected, on, off, emit }}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime debe usarse dentro de RealTimeProvider');
  }
  return context;
};

// Hook personalizado para escuchar eventos específicos
export const useRealTimeEvent = (event: string, callback: (...args: any[]) => void) => {
  const { socket } = useRealTime();

  useEffect(() => {
    if (!socket) return;

    // Registrar el listener
    socket.on(event, callback);

    // Limpiar al desmontar
    return () => {
      socket.off(event, callback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, event]); // No incluir callback para evitar re-renders constantes
};

export default RealTimeContext;
