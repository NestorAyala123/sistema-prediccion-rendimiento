import React, { useEffect, useState } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

interface TranscriptProviderProps {
  children: React.ReactNode;
}

const TranscriptProvider: React.FC<TranscriptProviderProps> = ({ children }) => {
  const { settings, speakText } = useAccessibility();
  const [transcriptVisible, setTranscriptVisible] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');

  // Generar transcripción automática del contenido
  useEffect(() => {
    if (settings.transcripts) {
      const generateTranscript = () => {
        const mainContent = document.querySelector('main');
        if (mainContent) {
          const textContent = mainContent.innerText;
          setTranscriptText(textContent);
        }
      };

      generateTranscript();
      
      // Regenerar transcripción cuando cambie el contenido
      const observer = new MutationObserver(generateTranscript);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });

      return () => observer.disconnect();
    }
  }, [settings.transcripts]);

  const toggleTranscript = () => {
    setTranscriptVisible(!transcriptVisible);
  };

  const readTranscript = () => {
    if (transcriptText) {
      speakText(transcriptText);
    }
  };

  if (!settings.transcripts) return <>{children}</>;

  return (
    <>
      {children}
      
      {/* Botón de transcripción flotante */}
      <button
        onClick={toggleTranscript}
        className="fixed bottom-20 right-6 z-40 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-200"
        aria-label="Mostrar transcripción del contenido"
        title="Transcripción del Contenido"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>

      {/* Panel de transcripción */}
      {transcriptVisible && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleTranscript} />
      )}
      
      <div 
        className={`fixed top-0 left-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          transcriptVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-labelledby="transcript-title"
        aria-modal="true"
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 id="transcript-title" className="text-lg font-bold text-gray-800">
              Transcripción del Contenido
            </h2>
            <button
              onClick={toggleTranscript}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Cerrar transcripción"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <button
              onClick={readTranscript}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Leer Transcripción
            </button>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {transcriptText || 'Generando transcripción del contenido...'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TranscriptProvider;
