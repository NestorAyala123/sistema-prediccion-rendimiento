import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    settings,
    updateSetting,
    resetSettings,
    speakText,
    stopSpeaking,
    isTextToSpeechActive,
    startVoiceControl,
    stopVoiceControl,
    isVoiceControlActive,
    showVisualAlert,
  } = useAccessibility();
  const navigate = useNavigate();
  const { setLang, t } = useLanguage();
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (settings.visualAlerts) {
      showVisualAlert(isOpen ? t('accessibility.closed') : t('accessibility.opened'));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleTextToSpeech = () => {
    if (isTextToSpeechActive) {
      stopSpeaking();
      showVisualAlert(t('accessibility.readingStopped'));
      return;
    }

    // Obtener selección o contenido principal
    let text = '';
    try {
      text = window.getSelection()?.toString() || '';
    } catch (err) {
      text = '';
    }

    if (!text) {
      const main = document.querySelector('main');
      text = main?.innerText || document.body.innerText || '';
    }

    if (!text || text.trim().length === 0) {
      speakText(t('accessibility.noTextSelected'));
      showVisualAlert(t('accessibility.noTextSelected'));
      return;
    }

    // Limitar longitud para evitar problemas con speechSynthesis
    const MAX_LEN = 3000;
    const toSpeak = text.length > MAX_LEN ? text.slice(0, MAX_LEN) + '...' : text;
    speakText(toSpeak);
    showVisualAlert(t('accessibility.readingStarted'));
  };

  const handleVoiceControl = () => {
    if (!settings.voiceControl) return;

    if (isVoiceControlActive) {
      stopVoiceControl();
      showVisualAlert(t('accessibility.voiceDeactivated'));
    } else {
      startVoiceControl();
      showVisualAlert(t('accessibility.voiceActivated'));
    }
  };

  useEffect(() => {
    const handler = (e: any) => {
      const command: string = e.detail?.command || '';
      if (!command) return;

      // Navegación básica basada en palabras clave
      if (command.includes('estudiantes')) {
        navigate('/estudiantes');
        showVisualAlert(t('accessibility.navigateEstudiantes') ?? '');
      } else if (command.includes('soporte')) {
        navigate('/soporte');
        showVisualAlert(t('accessibility.navigateSoporte') ?? '');
      } else if (command.includes('predicciones')) {
        navigate('/predicciones');
        showVisualAlert(t('accessibility.navigatePredicciones') ?? '');
      } else if (command.includes('panel') || command.includes('inicio') || command.includes('dashboard')) {
        navigate('/');
        showVisualAlert(t('accessibility.navigatePanel') ?? '');
      } else if (command.includes('salir') || command.includes('cerrar sesión') || command.includes('cerrar sesion')) {
        try { logout(); } catch {};
        showVisualAlert(t('accessibility.cerrandoSesion') ?? '');
        navigate('/login');
      } else if (command.includes('inglés') || command.includes('ingles') || command.includes('english')) {
        setLang('en');
        showVisualAlert(t('accessibility.idiomaIngles') ?? '');
      } else if (command.includes('español') || command.includes('espanol') || command.includes('spanish')) {
        setLang('es');
        showVisualAlert(t('accessibility.idiomaEspanol') ?? '');
      } else if (command.includes('leer')) {
        // Activar lectura del texto seleccionado
        const selected = window.getSelection()?.toString() || '';
        if (selected) {
          speakText(selected);
          showVisualAlert(t('accessibility.leyendoSeleccion') ?? '');
        } else {
          speakText(t('accessibility.noTextSelected'));
        }
      }
    };

    window.addEventListener('voicecommand', handler as EventListener);
    return () => window.removeEventListener('voicecommand', handler as EventListener);
  }, [navigate, speakText, showVisualAlert, setLang, logout, isVoiceControlActive, t]);

  return (
    <>
      {/* Botón flotante de accesibilidad */}
      {/*
        Accessibility FAB (Floating Action Button)
        - La clase `accessibility-fab` controla la posición (offsets) mediante variables CSS definidas en `src/styles/accessibility.css`.
        - Variables disponibles (por defecto en `.accessibility-fab`):
          --fab-bottom-mobile: espacio desde el bottom en móviles (ej. 1.25rem)
          --fab-right-mobile: espacio desde la derecha en móviles
          --fab-top-md: posición top en pantallas md+ (usado para centrar verticalmente, valor por defecto 50%)
          --fab-right-md: espacio desde la derecha en pantallas md+
          --fab-right-xl: espacio desde la derecha en pantallas xl+
        - Comportamiento: móvil => esquina inferior derecha; md+ => centrado vertical a la derecha.
        - Ocultación: cuando el panel de accesibilidad está abierto (`isOpen`), el botón aplica `md:hidden` para evitar solapamiento en pantallas md+.
        - Para ajustar offsets, modifica las variables en `.accessibility-fab` o añade una regla específica en `accessibility.css` o en tu hoja de estilos de la página.
      */}
      <button
        onClick={toggleMenu}
        onKeyDown={handleKeyDown}
        aria-pressed={isOpen}
        aria-label={
          isVoiceControlActive
            ? `${t('accessibility.openMenu')} - ${t('accessibility.voiceActivated')}`
            : t('accessibility.openMenu')
        }
        title={t('accessibility.title')}
        /* Posición controlada por la clase accessibility-fab (variables CSS para ajustar offsets). */
        className={`accessibility-fab fixed z-50 text-white p-1 w-10 h-10 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-150 transform ${
          isVoiceControlActive ? 'bg-blue-700' : 'bg-blue-600'
        } ${isOpen ? 'md:hidden' : ''}`}
      >
        {/* Ícono de discapacidad (más discreto) */}
        <span className="sr-only">{t('accessibility.title')}</span>
        <span className="text-sm leading-none" aria-hidden>
          ♿
        </span>

        {/* Badge sutil cuando el control por voz está activo */}
        <span
          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ring-1 ring-white ${
            isVoiceControlActive ? 'bg-red-400 animate-pulse' : 'bg-transparent'
          }`}
          aria-hidden
        />
      </button>

      {/* Menú lateral expandible */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-labelledby="accessibility-title"
        aria-modal="true"
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header del menú */}
          <div className="flex items-center justify-between mb-6">
            <h2 id="accessibility-title" className="text-xl font-bold text-gray-800">
              {t('accessibility.title')}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label={t('accessibility.closeMenu')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sección Auditiva */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              {t('accessibility.auditiva')}
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.subtitles')}</span>
                <input
                  type="checkbox"
                  checked={settings.subtitles}
                  onChange={(e) => updateSetting('subtitles', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.transcripts')}</span>
                <input
                  type="checkbox"
                  checked={settings.transcripts}
                  onChange={(e) => updateSetting('transcripts', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.audioControl')}</span>
                <input
                  type="checkbox"
                  checked={settings.audioControl}
                  onChange={(e) => updateSetting('audioControl', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.visualAlerts')}</span>
                <input
                  type="checkbox"
                  checked={settings.visualAlerts}
                  onChange={(e) => updateSetting('visualAlerts', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.signLanguage')}</span>
                <input
                  type="checkbox"
                  checked={settings.signLanguage}
                  onChange={(e) => updateSetting('signLanguage', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          </section>

          {/* Sección Visual */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {t('accessibility.visual')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.highContrast')}</span>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.darkMode')}</span>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => updateSetting('darkMode', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Tamaño de texto</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={settings.textSize}
                  onChange={(e) => updateSetting('textSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{t('accessibility.small')}</span>
                  <span>{t('accessibility.large')}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">{t('accessibility.fontType')}</label>
                <select
                  value={settings.fontType}
                  onChange={(e) => updateSetting('fontType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Open Sans">Open Sans</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.customColors')}</span>
                <input
                  type="checkbox"
                  checked={settings.customColors}
                  onChange={(e) => updateSetting('customColors', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              {/* Panel de Colores Personalizados */}
              {settings.customColors && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    {t('accessibility.colorCustomization')}
                  </h4>

                  {/* Paletas Predefinidas */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">
                      {t('accessibility.colorPresets')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => updateSetting('colorScheme', {
                          background: '#ffffff',
                          text: '#000000',
                          primary: '#3b82f6',
                          secondary: '#64748b',
                          accent: '#8b5cf6',
                          border: '#e5e7eb',
                        })}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-100 text-xs"
                        title="Default"
                      >
                        <div className="flex gap-1 mb-1">
                          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        </div>
                        <span className="text-xs">Default</span>
                      </button>

                      <button
                        onClick={() => updateSetting('colorScheme', {
                          background: '#1a1a1a',
                          text: '#ffffff',
                          primary: '#60a5fa',
                          secondary: '#94a3b8',
                          accent: '#a78bfa',
                          border: '#374151',
                        })}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-100 text-xs"
                        title="Dark Blue"
                      >
                        <div className="flex gap-1 mb-1">
                          <div className="w-4 h-4 bg-gray-900 rounded"></div>
                          <div className="w-4 h-4 bg-blue-400 rounded"></div>
                        </div>
                        <span className="text-xs">Oscuro</span>
                      </button>

                      <button
                        onClick={() => updateSetting('colorScheme', {
                          background: '#fffef2',
                          text: '#2d2d2d',
                          primary: '#d97706',
                          secondary: '#78716c',
                          accent: '#ea580c',
                          border: '#e7e5e4',
                        })}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-100 text-xs"
                        title="Warm"
                      >
                        <div className="flex gap-1 mb-1">
                          <div className="w-4 h-4 bg-amber-50 border border-gray-300 rounded"></div>
                          <div className="w-4 h-4 bg-orange-600 rounded"></div>
                        </div>
                        <span className="text-xs">Cálido</span>
                      </button>

                      <button
                        onClick={() => updateSetting('colorScheme', {
                          background: '#f0fdf4',
                          text: '#14532d',
                          primary: '#16a34a',
                          secondary: '#6b7280',
                          accent: '#059669',
                          border: '#d1fae5',
                        })}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-100 text-xs"
                        title="Nature"
                      >
                        <div className="flex gap-1 mb-1">
                          <div className="w-4 h-4 bg-green-50 border border-gray-300 rounded"></div>
                          <div className="w-4 h-4 bg-green-600 rounded"></div>
                        </div>
                        <span className="text-xs">Natura</span>
                      </button>

                      <button
                        onClick={() => updateSetting('colorScheme', {
                          background: '#000000',
                          text: '#ffff00',
                          primary: '#ffff00',
                          secondary: '#ffffff',
                          accent: '#00ffff',
                          border: '#ffff00',
                        })}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-100 text-xs"
                        title="High Contrast Yellow"
                      >
                        <div className="flex gap-1 mb-1">
                          <div className="w-4 h-4 bg-black rounded"></div>
                          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                        </div>
                        <span className="text-xs">Alto C.</span>
                      </button>

                      <button
                        onClick={() => updateSetting('colorScheme', {
                          background: '#fdf2f8',
                          text: '#831843',
                          primary: '#db2777',
                          secondary: '#9333ea',
                          accent: '#c026d3',
                          border: '#f9a8d4',
                        })}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-100 text-xs"
                        title="Pink Purple"
                      >
                        <div className="flex gap-1 mb-1">
                          <div className="w-4 h-4 bg-pink-50 border border-gray-300 rounded"></div>
                          <div className="w-4 h-4 bg-pink-600 rounded"></div>
                        </div>
                        <span className="text-xs">Rosa</span>
                      </button>
                    </div>
                  </div>

                  {/* Selectores de Color Individuales */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {t('accessibility.backgroundColor')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.colorScheme?.background || '#ffffff'}
                          onChange={(e) => updateSetting('colorScheme', {
                            ...settings.colorScheme,
                            background: e.target.value,
                          })}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.colorScheme?.background || '#ffffff'}
                          onChange={(e) => updateSetting('colorScheme', {
                            ...settings.colorScheme,
                            background: e.target.value,
                          })}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {t('accessibility.textColor')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.colorScheme?.text || '#000000'}
                          onChange={(e) => updateSetting('colorScheme', {
                            ...settings.colorScheme,
                            text: e.target.value,
                          })}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.colorScheme?.text || '#000000'}
                          onChange={(e) => updateSetting('colorScheme', {
                            ...settings.colorScheme,
                            text: e.target.value,
                          })}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {t('accessibility.primaryColor')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.colorScheme?.primary || '#3b82f6'}
                          onChange={(e) => updateSetting('colorScheme', {
                            ...settings.colorScheme,
                            primary: e.target.value,
                          })}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.colorScheme?.primary || '#3b82f6'}
                          onChange={(e) => updateSetting('colorScheme', {
                            ...settings.colorScheme,
                            primary: e.target.value,
                          })}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {t('accessibility.accentColor')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.colorScheme?.accent || '#8b5cf6'}
                          onChange={(e) => updateSetting('colorScheme', {
                            ...settings.colorScheme,
                            accent: e.target.value,
                          })}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.colorScheme?.accent || '#8b5cf6'}
                          onChange={(e) => updateSetting('colorScheme', {
                            ...settings.colorScheme,
                            accent: e.target.value,
                          })}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {t('accessibility.borderColor')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.colorScheme?.border || '#e5e7eb'}
                          onChange={(e) => updateSetting('colorScheme', {
                            ...settings.colorScheme,
                            border: e.target.value,
                          })}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.colorScheme?.border || '#e5e7eb'}
                          onChange={(e) => updateSetting('colorScheme', {
                            ...settings.colorScheme,
                            border: e.target.value,
                          })}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {t('accessibility.secondaryColor')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.colorScheme?.secondary || '#64748b'}
                          onChange={(e) => updateSetting('colorScheme', {
                            ...settings.colorScheme,
                            secondary: e.target.value,
                          })}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.colorScheme?.secondary || '#64748b'}
                          onChange={(e) => updateSetting('colorScheme', {
                            ...settings.colorScheme,
                            secondary: e.target.value,
                          })}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vista Previa */}
                  <div className="mt-4 p-3 rounded border"
                    style={{
                      backgroundColor: settings.colorScheme?.background,
                      color: settings.colorScheme?.text,
                      borderColor: settings.colorScheme?.border,
                    }}
                  >
                    <p className="text-sm mb-2">{t('accessibility.colorPreview')}</p>
                    <button
                      className="px-3 py-1 rounded text-sm"
                      style={{
                        backgroundColor: settings.colorScheme?.primary,
                        color: '#ffffff',
                      }}
                    >
                      {t('accessibility.primaryButton')}
                    </button>
                    {' '}
                    <button
                      className="px-3 py-1 rounded text-sm"
                      style={{
                        backgroundColor: settings.colorScheme?.accent,
                        color: '#ffffff',
                      }}
                    >
                      {t('accessibility.accentButton')}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.textToSpeech')}</span>
                <input
                  type="checkbox"
                  checked={settings.textToSpeech}
                  onChange={(e) => updateSetting('textToSpeech', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.linkHighlight')}</span>
                <input
                  type="checkbox"
                  checked={settings.linkHighlight}
                  onChange={(e) => updateSetting('linkHighlight', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Espaciado entre letras y líneas</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={settings.textSpacing}
                  onChange={(e) => updateSetting('textSpacing', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{t('accessibility.compact') ?? 'Compacto'}</span>
                  <span>{t('accessibility.spacious') ?? 'Espacioso'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Sección Motriz */}
          <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('accessibility.motriz')}
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.keyboardNav')}</span>
                <input
                  type="checkbox"
                  checked={settings.keyboardNav}
                  onChange={(e) => updateSetting('keyboardNav', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.largeButtons')}</span>
                <input
                  type="checkbox"
                  checked={settings.largeButtons}
                  onChange={(e) => updateSetting('largeButtons', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.customShortcuts')}</span>
                <input
                  type="checkbox"
                  checked={settings.customShortcuts}
                  onChange={(e) => updateSetting('customShortcuts', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.voiceControl')}</span>
                <input
                  type="checkbox"
                  checked={settings.voiceControl}
                  onChange={(e) => updateSetting('voiceControl', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('accessibility.blockAutoScroll')}</span>
                <input
                  type="checkbox"
                  checked={settings.blockAutoScroll}
                  onChange={(e) => updateSetting('blockAutoScroll', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          </section>

          {/* Botones de acción */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              onClick={resetSettings}
              className="flex-1 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {t('accessibility.reset')}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {t('accessibility.apply')}
            </button>
          </div>
          
          {/* Botones de funcionalidades especiales */}
          <div className="flex space-x-2 pt-3">
            <button
              onClick={handleTextToSpeech}
              className="flex-1 px-3 py-2 text-xs text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!settings.textToSpeech}
            >
              {isTextToSpeechActive ? t('accessibility.stopReading') : t('accessibility.readText')}
            </button>
            <button
              onClick={handleVoiceControl}
              className="flex-1 px-3 py-2 text-xs text-green-600 bg-green-50 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!settings.voiceControl}
            >
              {t('accessibility.voiceControlButton')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessibilityMenu;
