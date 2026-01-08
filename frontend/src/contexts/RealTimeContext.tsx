import React, { createContext, useContext, useEffect, useState } from 'react';
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
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    // Solo conectar si el usuario está autenticado
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Crear conexión de socket
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket.IO conectado');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket.IO desconectado');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error);
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, token]);

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
  const { on, off } = useRealTime();

  useEffect(() => {
    on(event, callback);
    return () => {
      off(event, callback);
    };
  }, [event, callback, on, off]);
};

export default RealTimeContext;
