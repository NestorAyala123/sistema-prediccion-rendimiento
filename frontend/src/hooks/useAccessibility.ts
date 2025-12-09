import { useState, useEffect, useCallback, useRef } from 'react';

// Utilidad de debounce para optimizar los cambios
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

interface ColorScheme {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
}

interface AccessibilitySettings {
  // Visual
  highContrast: boolean;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  textSize: number;
  fontType: string;
  customColors: boolean;
  colorScheme: ColorScheme;
  textToSpeech: boolean;
  linkHighlight: boolean;
  textSpacing: number;
  
  // Auditory
  subtitles: boolean;
  transcripts: boolean;
  audioControl: boolean;
  visualAlerts: boolean;
  signLanguage: boolean;
  
  // Motor
  keyboardNav: boolean;
  largeButtons: boolean;
  customShortcuts: boolean;
  voiceControl: boolean;
  blockAutoScroll: boolean;
  
  // System
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

interface UseAccessibilityReturn {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  resetSettings: () => void;
  applySettings: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isTextToSpeechActive: boolean;
  startVoiceControl: () => void;
  stopVoiceControl: () => void;
  isVoiceControlActive: boolean;
  showVisualAlert: (message: string) => void;
}

const defaultSettings: AccessibilitySettings = {
  // Visual
  highContrast: false,
  darkMode: false,
  fontSize: 'medium',
  textSize: 1, // Valor normal (1-5, donde 3 era el medio)
  fontType: 'Arial',
  customColors: false,
  colorScheme: {
    background: '#ffffff',
    text: '#000000',
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#8b5cf6',
    border: '#e5e7eb',
  },
  textToSpeech: false,
  linkHighlight: false,
  textSpacing: 1, // Valor normal (1-5, donde 3 era el medio)
  
  // Auditory
  subtitles: false,
  transcripts: false,
  audioControl: false,
  visualAlerts: false,
  signLanguage: false,
  
  // Motor
  keyboardNav: true,
  largeButtons: false,
  customShortcuts: false,
  voiceControl: false,
  blockAutoScroll: false,
  
  // System
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
};

export const useAccessibility = (): UseAccessibilityReturn => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Cargar configuración desde localStorage
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Sistema mejorado de detección de preferencias con exclusión mutua
  useEffect(() => {
    const mediaQueries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)'),
      darkMode: window.matchMedia('(prefers-color-scheme: dark)'),
    };

    const getInitialPreferences = () => {
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        // Asegurar exclusión mutua en las preferencias guardadas
        if (parsed.darkMode && parsed.highContrast) {
          parsed.highContrast = false; // Priorizar modo oscuro si ambos están activos
        }
        return parsed;
      }

      // Si no hay preferencias guardadas, usar preferencias del sistema
      const systemPrefersDark = mediaQueries.darkMode.matches;
      const systemPrefersHighContrast = mediaQueries.highContrast.matches;
      
      // Priorizar alto contraste sobre modo oscuro si el sistema prefiere ambos
      return {
        darkMode: systemPrefersHighContrast ? false : systemPrefersDark,
        highContrast: systemPrefersHighContrast,
      };
    };

    const handleChange = () => {
      setSettings(prev => {
        const preferences = getInitialPreferences();
        const newSettings = {
          ...prev,
          reducedMotion: mediaQueries.reducedMotion.matches,
          highContrast: preferences.highContrast,
          darkMode: preferences.darkMode,
        };
        
        // Persistir solo si hay cambios
        const currentSettings = JSON.parse(localStorage.getItem('accessibility-settings') || '{}');
        if (JSON.stringify(newSettings) !== JSON.stringify(currentSettings)) {
          localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
        }
        
        return newSettings;
      });
    };

    // Configurar listeners optimizados
    const debouncedChange = debounce(handleChange, 150);
    Object.values(mediaQueries).forEach(mq => {
      mq.addEventListener('change', debouncedChange);
      mq.addEventListener('change', handleChange);
    });

    // Aplicar preferencias iniciales
    handleChange();

    return () => {
      Object.values(mediaQueries).forEach(mq => {
        mq.removeEventListener('change', handleChange);
      });
    };
  }, []);

  // Aplicar configuración al DOM
  const applySettings = useCallback(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Sistema robusto de gestión del tema
    const applyTheme = (darkMode: boolean) => {
      // Limpiar clases y atributos anteriores
      root.classList.remove('dark', 'light');
      body.classList.remove('dark-mode', 'light-mode');
      
      // Aplicar nuevo tema
      const theme = darkMode ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      
      // Actualizar meta tema para dispositivos móviles
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', darkMode ? '#111827' : '#ffffff');
      }
      
      // Emitir evento personalizado para componentes que necesiten reaccionar al cambio
      window.dispatchEvent(new CustomEvent('themechange', { 
        detail: { theme, darkMode } 
      }));
      
      // Persistir preferencia
      localStorage.setItem('theme-preference', theme);
    };
    
    applyTheme(settings.darkMode);
    
    // Aplicar contraste alto
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Aplicar tamaño de fuente
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${settings.fontSize}`);
    
    // Verificar si hay configuraciones personalizadas
    const hasCustomSettings = settings.textSize > 1 || settings.textSpacing > 1 || settings.fontType !== 'Arial';
    
    if (hasCustomSettings) {
      root.classList.add('accessibility-enhanced');
    } else {
      root.classList.remove('accessibility-enhanced');
    }

    // Aplicar tamaño de texto personalizado con límites seguros
    const MIN_TEXT_SIZE = 0.8; // 80% del tamaño original
    const MAX_TEXT_SIZE = 2.0; // 200% del tamaño original
    
    if (settings.textSize >= 1) {
      // Mapear el rango 1-5 a MIN_TEXT_SIZE-MAX_TEXT_SIZE
      const textSizeMultiplier = MIN_TEXT_SIZE + ((settings.textSize - 1) / 4) * (MAX_TEXT_SIZE - MIN_TEXT_SIZE);
      root.style.setProperty('--text-size-multiplier', textSizeMultiplier.toString());
      root.classList.add('custom-text-size');
    } else {
      // Nunca permitir que sea menor que el mínimo
      root.style.setProperty('--text-size-multiplier', MIN_TEXT_SIZE.toString());
      root.classList.add('custom-text-size');
    }

    // Aplicar tipo de fuente (solo si no es Arial por defecto)
    if (settings.fontType !== 'Arial') {
      root.style.setProperty('--font-family', settings.fontType);
    } else {
      root.style.removeProperty('--font-family');
    }

    // Aplicar espaciado de texto (solo si es mayor a 1)
    if (settings.textSpacing > 1) {
      const spacingMultiplier = settings.textSpacing / 5;
      root.style.setProperty('--line-height', `${1.2 + (spacingMultiplier * 0.4)}`);
      root.style.setProperty('--letter-spacing', `${spacingMultiplier * 0.1}em`);
    } else {
      root.style.removeProperty('--line-height');
      root.style.removeProperty('--letter-spacing');
    }

    // Aplicar colores personalizados
    if (settings.customColors && settings.colorScheme) {
      const scheme = settings.colorScheme;
      root.style.setProperty('--custom-bg', scheme.background);
      root.style.setProperty('--custom-text', scheme.text);
      root.style.setProperty('--custom-primary', scheme.primary);
      root.style.setProperty('--custom-secondary', scheme.secondary);
      root.style.setProperty('--custom-accent', scheme.accent);
      root.style.setProperty('--custom-border', scheme.border);
      root.classList.add('custom-colors');
    } else {
      root.style.removeProperty('--custom-bg');
      root.style.removeProperty('--custom-text');
      root.style.removeProperty('--custom-primary');
      root.style.removeProperty('--custom-secondary');
      root.style.removeProperty('--custom-accent');
      root.style.removeProperty('--custom-border');
      root.classList.remove('custom-colors');
    }

    // Aplicar resaltado de enlaces
    if (settings.linkHighlight) {
      root.classList.add('link-highlight');
    } else {
      root.classList.remove('link-highlight');
    }

    // Aplicar botones grandes
    if (settings.largeButtons) {
      root.classList.add('large-buttons');
    } else {
      root.classList.remove('large-buttons');
    }

    // Aplicar movimiento reducido
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.classList.add('reduced-motion');
    } else {
      root.style.removeProperty('--animation-duration');
      root.classList.remove('reduced-motion');
    }

    // Aplicar navegación por teclado
    if (settings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
    
    // Aplicar bloqueo de auto-scroll
    if (settings.blockAutoScroll) {
      root.classList.add('block-auto-scroll');
    } else {
      root.classList.remove('block-auto-scroll');
    }
  }, [settings]);

  // Actualizar configuración con manejo de exclusión mutua
  const updateSetting = useCallback((key: keyof AccessibilitySettings, value: boolean | string | number) => {
    setSettings(prev => {
      let newSettings = { ...prev };

      // Manejar exclusión mutua entre modo oscuro y alto contraste
      if (key === 'darkMode' && value === true) {
        newSettings.highContrast = false; // Desactivar alto contraste si se activa modo oscuro
      } else if (key === 'highContrast' && value === true) {
        newSettings.darkMode = false; // Desactivar modo oscuro si se activa alto contraste
      }

      // Aplicar el nuevo valor con tipado seguro
      newSettings = {
        ...newSettings,
        [key]: value
      };

      // Persistir los cambios
      localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
      
      // Emitir evento de cambio de tema para notificar a otros componentes
      window.dispatchEvent(new CustomEvent('accessibilitychange', { 
        detail: { 
          darkMode: newSettings.darkMode,
          highContrast: newSettings.highContrast,
          timestamp: Date.now()
        } 
      }));

      return newSettings;
    });
  }, []);

  // Resetear configuración
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
  }, []);

  // Aplicar configuración cuando cambie
  useEffect(() => {
    applySettings();
  }, [applySettings]);

  // Funciones de text-to-speech
  const [isTextToSpeechActive, setIsTextToSpeechActive] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);
  const [isVoiceControlActive, setIsVoiceControlActive] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const speakText = useCallback((text: string) => {
    if (speechSynthesis && settings.textToSpeech) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsTextToSpeechActive(true);
      utterance.onend = () => setIsTextToSpeechActive(false);
      utterance.onerror = () => setIsTextToSpeechActive(false);
      
      speechSynthesis.speak(utterance);
    }
  }, [speechSynthesis, settings.textToSpeech]);

  const stopSpeaking = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsTextToSpeechActive(false);
    }
  }, [speechSynthesis]);

  // Función de control por voz
  const startVoiceControl = useCallback(() => {
    try {
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
      if (isVoiceControlActive) return; // already active

      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log('Comando de voz:', command);

        // Emitir evento global para que la UI reaccione (navegación, acciones)
        window.dispatchEvent(new CustomEvent('voicecommand', { detail: { command } }));
      };

      recognition.onstart = () => setIsVoiceControlActive(true);
      recognition.onend = () => setIsVoiceControlActive(false);
      recognition.onerror = () => setIsVoiceControlActive(false);

      recognition.start();
      recognitionRef.current = recognition;
      setIsVoiceControlActive(true);
    } catch (err) {
      console.error('Error starting voice recognition', err);
    }
  }, [isVoiceControlActive]);

  const stopVoiceControl = useCallback(() => {
    try {
      const rec = recognitionRef.current;
      if (rec && typeof rec.stop === 'function') {
        rec.stop();
      }
      recognitionRef.current = null;
      setIsVoiceControlActive(false);
    } catch (err) {
      console.error('Error stopping voice recognition', err);
    }
  }, []);

  // Función de alertas visuales
  const showVisualAlert = useCallback((message: string) => {
    if (settings.visualAlerts) {
      const alertDiv = document.createElement('div');
      alertDiv.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      alertDiv.textContent = message;
      document.body.appendChild(alertDiv);
      
      setTimeout(() => {
        alertDiv.remove();
      }, 3000);
    }
  }, [settings.visualAlerts]);

  return {
    settings,
    updateSetting,
    resetSettings,
    applySettings,
    speakText,
    stopSpeaking,
    isTextToSpeechActive,
    startVoiceControl,
    stopVoiceControl,
    isVoiceControlActive,
    showVisualAlert,
  };
};


// Hook para detectar si el usuario está usando un lector de pantalla
export const useScreenReader = (): boolean => {
  const [isScreenReader, setIsScreenReader] = useState(false);

  useEffect(() => {
    // Detectar lectores de pantalla comunes
    const screenReaderIndicators = [
      'speechSynthesis' in window,
      'speechRecognition' in window,
      navigator.userAgent.includes('NVDA'),
      navigator.userAgent.includes('JAWS'),
      navigator.userAgent.includes('VoiceOver'),
      navigator.userAgent.includes('TalkBack'),
    ];

    setIsScreenReader(screenReaderIndicators.some(indicator => indicator));
  }, []);

  return isScreenReader;
};

// Hook para navegación por teclado
export const useKeyboardNavigation = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
};
