import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getDashboardPath } from '../utils/roleUtils';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir al dashboard correspondiente según el rol
  const redirectByRole = (role: string) => {
    navigate(getDashboardPath(role));
  };

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
      const response = await fetch('http://localhost:4000/auth/login', {
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

      // 🔍 DEBUG: Verificar qué rol está llegando
      console.log('🔐 Login exitoso - Datos recibidos:', data);
      console.log('👤 Usuario:', data.user);
      console.log('🎭 Rol recibido:', data.user.role);

      // Usar la función login del contexto para actualizar el estado
      login(data.user, data.access_token);

      // Redirigir según el rol del usuario
      const userRole = data.user.role || data.user.rol || 'estudiante';
      console.log('🚀 Redirigiendo con rol:', userRole);
      redirectByRole(userRole);
    } catch (err: any) {
      // Por ahora, permitir login de demostración sin backend
      console.warn('Backend de autenticación no disponible, usando demo mode');

      // Determinar rol basado en el email
      let role = 'estudiante';
      if (email.includes('@admin.')) {
        role = 'admin';
      } else if (email.includes('@docente.') || email.includes('@profesor.')) {
        role = 'docente';
      }

      // Usar la función login del contexto para modo demo
      const demoUser = {
        email,
        nombres: email.split('@')[0],
        apellidos: 'Usuario',
        role: role,
      };
      login(demoUser, 'demo-token');

      // Redirigir según el rol
      redirectByRole(role);
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.passwordPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                aria-label={t('login.password')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
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
