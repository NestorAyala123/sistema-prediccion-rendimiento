import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError(t('login.completeCampos'));
      setLoading(false);
      return;
    }

    try {
      // Intentar login con el backend real
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message || t('login.errorIniciar'));
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Usar la función login del contexto para actualizar el estado
      login(data.user, data.access_token);

      // Navegar después de actualizar el contexto
      navigate('/');
    } catch (err: any) {
      // Por ahora, permitir login de demostración sin backend
      console.warn('Backend de autenticación no disponible, usando demo mode');

      // Usar la función login del contexto para modo demo
      const demoUser = {
        email,
        nombres: email.split('@')[0],
        apellidos: 'Usuario',
        role: 'usuario',
      };
      login(demoUser, 'demo-token');

      // Navegar después de actualizar el contexto
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'es' | 'en')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              aria-label={t('navbar.language')}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('navbar.systemTitle')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('navbar.systemSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t('login.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label={t('login.email')}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t('login.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.passwordPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label={t('login.password')}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? t('login.iniciando') : t('login.iniciarSesion')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {t('login.noTienesCuenta')}{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              {t('login.registrateAqui')}
            </Link>
          </p>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
          <strong>{t('login.demo')}:</strong> {t('login.demoDescription')}
        </div>
      </div>
    </div>
  );
};

export default Login;
