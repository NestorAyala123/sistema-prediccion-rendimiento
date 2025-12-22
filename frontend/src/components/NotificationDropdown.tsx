import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';

interface Notification {
  id: string;
  tipo: 'calificacion' | 'asistencia' | 'prediccion' | 'aviso' | 'tarea';
  titulo: string;
  mensaje: string;
  fecha: Date;
  leida: boolean;
  prioridad: 'alta' | 'media' | 'baja';
}

const NotificationDropdown: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar notificaciones desde el backend
  const cargarNotificaciones = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await api.get(`/notificaciones/estudiante/${user.id}`);
      
      // Mapear las notificaciones del backend al formato del frontend
      const notificacionesMapeadas = response.data.map((n: any) => ({
        id: n._id,
        tipo: n.tipo,
        titulo: n.titulo,
        mensaje: n.mensaje,
        fecha: new Date(n.createdAt),
        leida: n.leida,
        prioridad: n.prioridad,
      }));

      setNotifications(notificacionesMapeadas);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      // Mantener las notificaciones actuales si hay error
    } finally {
      setLoading(false);
    }
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Cargar notificaciones al montar y cada 30 segundos
  useEffect(() => {
    cargarNotificaciones();
    const interval = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.leida).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notificaciones/${id}/leer`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, leida: true } : n
      ));
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await api.patch(`/notificaciones/estudiante/${user.id}/leer-todas`);
      setNotifications(notifications.map(n => ({ ...n, leida: true })));
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await api.delete(`/notificaciones/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  const getNotificationIcon = (tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'calificacion':
        return '📊';
      case 'asistencia':
        return '✅';
      case 'prediccion':
        return '⚠️';
      case 'aviso':
        return '📢';
      case 'tarea':
        return '📝';
      default:
        return '🔔';
    }
  };

  const getPriorityColor = (prioridad: Notification['prioridad']) => {
    switch (prioridad) {
      case 'alta':
        return 'border-red-500 bg-red-50';
      case 'media':
        return 'border-yellow-500 bg-yellow-50';
      case 'baja':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Ahora';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  // Solo mostrar para estudiantes
  if (user?.role !== 'estudiante') {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de notificaciones */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notificaciones"
      >
        {unreadCount > 0 ? (
          <BellSolidIcon className="h-6 w-6 text-blue-600" />
        ) : (
          <BellIcon className="h-6 w-6" />
        )}
        
        {/* Badge de contador */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500">{unreadCount} sin leer</p>
              )}
            </div>
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.leida ? 'bg-blue-50' : ''
                    } border-l-4 ${getPriorityColor(notification.prioridad)}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icono */}
                      <div className="flex-shrink-0 text-2xl">
                        {getNotificationIcon(notification.tipo)}
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              !notification.leida ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {notification.titulo}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.mensaje}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatTimeAgo(notification.fecha)}
                            </p>
                          </div>

                          {/* Botón eliminar */}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Eliminar notificación"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Botón marcar como leída */}
                        {!notification.leida && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Marcar como leída
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
