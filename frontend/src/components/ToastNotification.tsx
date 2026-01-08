import React, { useState, useEffect } from 'react';
import { useRealTimeEvent } from '../contexts/RealTimeContext';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  duration?: number;
}

const ToastNotification: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Escuchar eventos de calificaciones
  useRealTimeEvent('calificacion:created', (data) => {
    addToast({
      type: 'success',
      message: `📝 Nueva calificación registrada: ${data.asignatura_nombre} - Nota: ${data.nota}`,
      duration: 5000,
    });
  });

  // Escuchar eventos de asistencias en lote
  useRealTimeEvent('asistencia:lote', (data) => {
    addToast({
      type: 'info',
      message: `📊 Asistencia registrada: ${data.asignatura_nombre} - ${data.exitosos} estudiantes`,
      duration: 5000,
    });
  });

  // Escuchar eventos de predicciones
  useRealTimeEvent('prediccion:created', (data) => {
    addToast({
      type: 'warning',
      message: `🔮 Nueva predicción generada para ${data.estudiante_nombre}`,
      duration: 5000,
    });
  });

  // Escuchar notificaciones generales
  useRealTimeEvent('notification', (notification) => {
    addToast({
      type: notification.type,
      message: notification.message,
      duration: 5000,
    });
  });

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, ...toast };
    setToasts((prev) => [...prev, newToast]);

    // Auto-remover después de la duración
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} px-6 py-4 rounded-lg shadow-lg animate-slide-in pointer-events-auto max-w-md`}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white hover:text-gray-200 transition-colors flex-shrink-0"
              aria-label="Cerrar notificación"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
