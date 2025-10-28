import React, { useState, useEffect } from 'react';
import { LifebuoyIcon, QuestionMarkCircleIcon, EnvelopeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Soporte: React.FC = () => {
  const [tab, setTab] = useState<'faq' | 'contact' | 'tickets' | 'resources'>('faq');

  const { user } = useAuth();

  // Form state
  const [asunto, setAsunto] = useState('');
  const [correo, setCorreo] = useState(user?.email ?? '');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    if (tab === 'tickets') {
      fetchTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/soporte');
      if (res.data && res.data.success) setTickets(res.data.data || []);
    } catch (err) {
      console.error('Error fetching tickets', err);
    }
  };

  const submitForm = async () => {
    setLoading(true);
    setSuccess(null);
    try {
      const res = await api.post('/soporte', { asunto, correo, mensaje });
      if (res.data && res.data.success) {
        setSuccess('Tu solicitud fue enviada correctamente.');
        setAsunto('');
        setMensaje('');
      } else {
        setSuccess('No se pudo enviar la solicitud.');
      }
    } catch (err) {
      console.error(err);
      setSuccess('Error al enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const { t } = useLanguage();

  return (
    <div className="p-6">
      {/* Cabecera */}
      <div className="flex items-center flex-col sm:flex-row sm:items-center sm:justify-start gap-4 mb-6">
        <div className="bg-blue-500 rounded-lg p-3">
          <LifebuoyIcon className="w-8 h-8 text-white" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-800">{t('soporte.title')}</h1>
          <p className="text-sm text-gray-500">{t('soporte.subtitle')}</p>
        </div>
      </div>

      {/* Pestañas */}
      <div className="bg-white rounded-md shadow-sm">
        <div className="flex gap-2 p-2 bg-gray-50 rounded-t-md">
          <button
            onClick={() => setTab('faq')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none ${tab === 'faq' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <QuestionMarkCircleIcon className="w-4 h-4" />
            {t('soporte.tab.faq')}
          </button>

          <button
            onClick={() => setTab('contact')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none ${tab === 'contact' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <EnvelopeIcon className="w-4 h-4" />
            {t('soporte.tab.contact')}
          </button>

          <button
            onClick={() => setTab('tickets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none ${tab === 'tickets' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
              <path d="M7 12h10" />
            </svg>
            {t('soporte.tab.tickets')}
          </button>

          <button
            onClick={() => setTab('resources')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none ${tab === 'resources' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <DocumentTextIcon className="w-4 h-4" />
            {t('soporte.tab.resources')}
          </button>
        </div>

        <div className="p-4">
              {tab === 'faq' && (
            <div>
              <h2 className="text-lg font-semibold mb-2">{t('soporte.tab.faq')}</h2>
              <p className="text-sm text-gray-600">{t('soporte.subtitle')}</p>
              {/* Placeholder: lista de FAQ */}
              <ul className="mt-4 space-y-3">
                <li className="p-3 border rounded bg-gray-50">¿Cómo me registro? — Ve a la pantalla de registro.</li>
                <li className="p-3 border rounded bg-gray-50">¿Cómo solicito soporte técnico? — Usa el formulario de contacto.</li>
              </ul>
            </div>
          )}

          {tab === 'contact' && (
            <div>
              <h2 className="text-lg font-semibold mb-2">{t('soporte.tab.contact')}</h2>
              <p className="text-sm text-gray-600 mb-4">{t('soporte.subtitle')}</p>
              <form className="space-y-3 max-w-xl" onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
                <input value={asunto} onChange={(e) => setAsunto(e.target.value)} className="w-full border rounded px-3 py-2" placeholder={t('soporte.form.asunto')} required />
                <input value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full border rounded px-3 py-2" placeholder={t('soporte.form.correo')} type="email" required />
                <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} className="w-full border rounded px-3 py-2" rows={5} placeholder={t('soporte.form.mensaje')} required />
                <div>
                  <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {loading ? '...' : t('soporte.form.enviar')}
                  </button>
                </div>
                {success && <div className="text-sm text-green-600 mt-2">{success}</div>}
              </form>
            </div>
          )}

          {tab === 'tickets' && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Mis Tickets</h2>
              <p className="text-sm text-gray-600">Aquí aparecerán los tickets que hayas creado.</p>
              <div className="mt-4">
                {tickets.length === 0 ? (
                  <div className="text-sm text-gray-500">{t('soporte.tickets.empty')}</div>
                ) : (
                  <ul className="space-y-3">
                    {tickets.map((t) => (
                      <li key={t.id} className="p-3 border rounded bg-gray-50">
                        <div className="text-sm font-semibold">{t.asunto}</div>
                        <div className="text-xs text-gray-600">{new Date(t.created_at).toLocaleString()}</div>
                        <div className="mt-2 text-sm">{t.mensaje}</div>
                        <div className="mt-2 text-xs text-gray-500">Estado: {t.estado}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {tab === 'resources' && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Recursos</h2>
              <p className="text-sm text-gray-600">Documentación, guías y enlaces útiles.</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <button className="text-blue-600 hover:underline" onClick={() => { /* TODO: navegar a guía */ }}>
                    Guía de uso
                  </button>
                </li>
                <li>
                  <button className="text-blue-600 hover:underline" onClick={() => { /* TODO: navegar a documentación */ }}>
                    Documentación técnica
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Soporte;
