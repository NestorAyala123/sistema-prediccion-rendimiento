import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ 
    nombres: '', 
    apellidos: '', 
    email: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isEstudiante = user?.role === 'estudiante';

  useEffect(() => {
    if (user) {
      setForm({
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        telefono: (user as any).telefono || '',
        direccion: (user as any).direccion || '',
        fecha_nacimiento: (user as any).fecha_nacimiento ? new Date((user as any).fecha_nacimiento).toISOString().split('T')[0] : ''
      });
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Preparar datos según el rol
      const updateData: any = { 
        nombres: form.nombres, 
        apellidos: form.apellidos
      };

      // Solo estudiantes pueden actualizar estos campos adicionales
      if (isEstudiante) {
        updateData.telefono = form.telefono;
        updateData.direccion = form.direccion;
        if (form.fecha_nacimiento) {
          updateData.fecha_nacimiento = form.fecha_nacimiento;
        }
      }

      const res = await authService.updateProfile(updateData);
      if (res?.user) {
        updateProfile(res.user);
      } else {
        updateProfile(updateData);
      }
      setMessage(t('profile.actualizado'));
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 900);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || t('profile.errorActualizar');
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">{t('profile.title')}</h3>
        {message && (
          <div className="mb-3 p-2 bg-green-100 text-green-800 rounded">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">{t('profile.nombres')}</label>
            <input 
              name="nombres" 
              value={form.nombres} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">{t('profile.apellidos')}</label>
            <input 
              name="apellidos" 
              value={form.apellidos} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">{t('profile.email')}</label>
            <input 
              name="email" 
              value={form.email} 
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed" 
            />
            <p className="text-xs text-gray-500 mt-1">{t('profile.emailNoEditable')}</p>
          </div>

          {isEstudiante && (
            <>
              <div>
                <label className="block text-sm text-gray-700 mb-1">{t('profile.telefono')}</label>
                <input 
                  name="telefono" 
                  type="tel"
                  value={form.telefono} 
                  onChange={handleChange} 
                  placeholder="0991234567"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">{t('profile.direccion')}</label>
                <input 
                  name="direccion" 
                  value={form.direccion} 
                  onChange={handleChange} 
                  placeholder="Av. Principal 123"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">{t('profile.fechaNacimiento')}</label>
                <input 
                  name="fecha_nacimiento" 
                  type="date"
                  value={form.fecha_nacimiento} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-xs text-blue-700">
                  ℹ️ {t('profile.camposNoEditables')}
                </p>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-3">
            <button type="button" onClick={onClose} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">{t('common.cancelar')}</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {loading ? t('common.guardando') : t('common.guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
