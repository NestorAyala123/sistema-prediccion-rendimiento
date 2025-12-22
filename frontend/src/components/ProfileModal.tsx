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
  const [form, setForm] = useState({ nombres: '', apellidos: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
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
      // Intentar persistir en el backend si está disponible
      const res = await authService.updateProfile({ nombres: form.nombres, apellidos: form.apellidos, email: form.email });
      if (res?.user) {
        updateProfile(res.user);
      } else {
        // Fallback local
        updateProfile({ nombres: form.nombres, apellidos: form.apellidos, email: form.email });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg z-60 w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">{t('profile.title')}</h3>
        {message && (
          <div className="mb-3 p-2 bg-green-100 text-green-800 rounded">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">{t('profile.nombres')}</label>
            <input name="nombres" value={form.nombres} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">{t('profile.apellidos')}</label>
            <input name="apellidos" value={form.apellidos} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">{t('profile.email')}</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            <button type="button" onClick={onClose} className="px-3 py-2 bg-gray-100 rounded">{t('common.cancelar')}</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? t('common.guardando') : t('common.guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
