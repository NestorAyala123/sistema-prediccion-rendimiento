import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type FormState = {
  // Auditiva
  subtitles: boolean;
  transcripts: boolean;
  audioControl: boolean;
  visualAlerts: boolean;
  signLanguage: boolean;
  // Visual
  highContrast: boolean;
  darkMode: boolean;
  textSize: number; // 1-5
  fontType: string;
  customColors: boolean;
  linkHighlight: boolean;
  textSpacing: number; // 1-5
  // Motriz
  keyboardNav: boolean;
  largeButtons: boolean;
  customShortcuts: boolean;
  voiceControl: boolean;
  blockAutoScroll: boolean;
  // Observaciones
  observations: string;
}

const defaultState: FormState = {
  subtitles: false,
  transcripts: false,
  audioControl: false,
  visualAlerts: false,
  signLanguage: false,
  highContrast: false,
  darkMode: false,
  textSize: 3,
  fontType: 'Arial',
  customColors: false,
  linkHighlight: false,
  textSpacing: 3,
  keyboardNav: true,
  largeButtons: false,
  customShortcuts: false,
  voiceControl: false,
  blockAutoScroll: false,
  observations: '',
}

const AccessibilityForm: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<FormState>(() => {
    try {
      const saved = localStorage.getItem('accessibility-form');
      return saved ? JSON.parse(saved) : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    // Persistir cambios automáticamente
    localStorage.setItem('accessibility-form', JSON.stringify(state));
  }, [state]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación simple: textSize y textSpacing deben estar en 1-5
    if (state.textSize < 1 || state.textSize > 5 || state.textSpacing < 1 || state.textSpacing > 5) {
      alert('Valores de tamaño deben estar entre 1 y 5');
      return;
    }

    alert('Formulario guardado en localStorage');
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Menú de accesibilidad (Formulario)</h1>

      <form onSubmit={handleSubmit}>
        {/* Auditiva */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Auditiva</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" checked={state.subtitles} onChange={(e) => update('subtitles', e.target.checked)} className="mr-2" />
              Subtítulos en videos
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={state.transcripts} onChange={(e) => update('transcripts', e.target.checked)} className="mr-2" />
              Transcripciones textuales automáticas
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={state.audioControl} onChange={(e) => update('audioControl', e.target.checked)} className="mr-2" />
              Control de audio (pausar/detener)
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={state.visualAlerts} onChange={(e) => update('visualAlerts', e.target.checked)} className="mr-2" />
              Alertas visuales en lugar de sonidos
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={state.signLanguage} onChange={(e) => update('signLanguage', e.target.checked)} className="mr-2" />
              Video-intérprete / avatar en lengua de señas
            </label>
          </div>
        </section>

        {/* Visual */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Visual</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" checked={state.highContrast} onChange={(e) => update('highContrast', e.target.checked)} className="mr-2" />
              Alto contraste
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={state.darkMode} onChange={(e) => update('darkMode', e.target.checked)} className="mr-2" />
              Modo oscuro
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Tamaño de texto</span>
              <input type="range" min={1} max={5} value={state.textSize} onChange={(e) => update('textSize', Number(e.target.value))} className="w-full" />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Tipo de fuente</span>
              <select value={state.fontType} onChange={(e) => update('fontType', e.target.value)} className="border rounded px-2 py-1 w-full">
                <option>Arial</option>
                <option>Helvetica</option>
                <option>Times New Roman</option>
                <option>Georgia</option>
                <option>Verdana</option>
                <option>Open Sans</option>
              </select>
            </label>

            <label className="flex items-center">
              <input type="checkbox" checked={state.customColors} onChange={(e) => update('customColors', e.target.checked)} className="mr-2" />
              Colores personalizados
            </label>

            <label className="flex items-center">
              <input type="checkbox" checked={state.linkHighlight} onChange={(e) => update('linkHighlight', e.target.checked)} className="mr-2" />
              Resaltado de enlaces y foco visible
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Espaciado entre letras y líneas</span>
              <input type="range" min={1} max={5} value={state.textSpacing} onChange={(e) => update('textSpacing', Number(e.target.value))} className="w-full" />
            </label>
          </div>
        </section>

        {/* Motriz */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Motriz</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" checked={state.keyboardNav} onChange={(e) => update('keyboardNav', e.target.checked)} className="mr-2" />
              Navegación por teclado (Tab, Enter, Esc)
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={state.largeButtons} onChange={(e) => update('largeButtons', e.target.checked)} className="mr-2" />
              Botones grandes
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={state.customShortcuts} onChange={(e) => update('customShortcuts', e.target.checked)} className="mr-2" />
              Atajos de teclado personalizados
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={state.voiceControl} onChange={(e) => update('voiceControl', e.target.checked)} className="mr-2" />
              Control por voz / dictado
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={state.blockAutoScroll} onChange={(e) => update('blockAutoScroll', e.target.checked)} className="mr-2" />
              Bloquear auto-scroll / auto-reproducción
            </label>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Observaciones / Prueba</h2>
          <textarea value={state.observations} onChange={(e) => update('observations', e.target.value)} className="w-full border rounded p-2 h-32" />
        </section>

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Volver</button>
        </div>
      </form>
    </div>
  );
};

export default AccessibilityForm;
