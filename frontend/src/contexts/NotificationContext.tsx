import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useRealTime } from './RealTimeContext';

export interface Notification {
  id: string;
  tipo: 'calificacion' | 'asistencia' | 'prediccion' | 'aviso' | 'tarea';
  titulo: string;
  mensaje: string;
  fecha: Date;
  leida: boolean;
  prioridad: 'alta' | 'media' | 'baja';
  datos?: any; // Datos adicionales de la notificación (ej: predicción completa)
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'fecha' | 'leida'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { socket } = useRealTime();
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Cargar notificaciones guardadas en sessionStorage (específico de esta ventana)
    const userId = (user as any)?._id || (user as any)?.id || 'guest';
    const saved = sessionStorage.getItem(`notifications_${userId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((n: any) => ({
          ...n,
          fecha: new Date(n.fecha),
        }));
      } catch (error) {
        return [];
      }
    }
    return [];
  });

  // Guardar notificaciones en sessionStorage cuando cambien (específico de cada ventana)
  useEffect(() => {
    const userId = (user as any)?._id || (user as any)?.id;
    if (userId) {
      sessionStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Limpiar notificaciones al cerrar sesión
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  // Escuchar predicciones en tiempo real
  useEffect(() => {
    if (!socket || !user) return;

    const handlePrediccionCreada = (prediccion: any) => {
      // Verificar si la predicción es para este usuario
      const userId = (user as any)?._id || (user as any)?.id || (user as any)?.id_estudiante;
      if (prediccion.id_estudiante === userId) {
        // console.log('🔮 Nueva predicción recibida - agregando a notificaciones:', prediccion);
        
        const nivelRiesgo = prediccion.nivel_riesgo?.toLowerCase() || 'medio';
        const prioridad = nivelRiesgo === 'alto' ? 'alta' : nivelRiesgo === 'medio' ? 'media' : 'baja';
        
        addNotification({
          tipo: 'prediccion',
          titulo: `Nueva Predicción de Riesgo: ${prediccion.nivel_riesgo}`,
          mensaje: `Se ha generado una nueva evaluación de tu rendimiento académico. ${
            prediccion.factores_clave ? 'Factores: ' + prediccion.factores_clave : ''
          }`,
          prioridad: prioridad,
          datos: prediccion,
        });
      }
    };

    const handleCalificacionCreada = (calificacion: any) => {
      const userId = (user as any)?._id || (user as any)?.id || (user as any)?.id_estudiante;
      if (calificacion.id_estudiante === userId) {
        addNotification({
          tipo: 'calificacion',
          titulo: 'Nueva Calificación Registrada',
          mensaje: `Has recibido una calificación en ${calificacion.asignatura_nombre || 'una materia'}: ${calificacion.nota}`,
          prioridad: 'media',
          datos: calificacion,
        });
      }
    };

    const handleAsistenciaCreada = (asistencia: any) => {
      const userId = (user as any)?._id || (user as any)?.id || (user as any)?.id_estudiante;
      if (asistencia.id_estudiante === userId) {
        addNotification({
          tipo: 'asistencia',
          titulo: asistencia.asistio ? 'Asistencia Registrada' : 'Inasistencia Registrada',
          mensaje: `Tu asistencia ha sido ${asistencia.asistio ? 'confirmada' : 'marcada como ausente'} en ${asistencia.asignatura_nombre || 'una materia'}`,
          prioridad: asistencia.asistio ? 'baja' : 'media',
          datos: asistencia,
        });
      }
    };

    socket.on('prediccion:created', handlePrediccionCreada);
    socket.on('calificacion:created', handleCalificacionCreada);
    socket.on('asistencia:created', handleAsistenciaCreada);

    return () => {
      socket.off('prediccion:created', handlePrediccionCreada);
      socket.off('calificacion:created', handleCalificacionCreada);
      socket.off('asistencia:created', handleAsistenciaCreada);
    };
  }, [socket, user]);

  const addNotification = (notification: Omit<Notification, 'id' | 'fecha' | 'leida'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      fecha: new Date(),
      leida: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.leida).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
