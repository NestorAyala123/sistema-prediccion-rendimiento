import React, { useEffect, useState } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

interface VideoSubtitlesProps {
  children: React.ReactNode;
}

const VideoSubtitles: React.FC<VideoSubtitlesProps> = ({ children }) => {
  const { settings } = useAccessibility();
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);

  useEffect(() => {
    if (settings.screenReader) {
      enableSubtitles();
    } else {
      disableSubtitles();
    }
  }, [settings.screenReader]);

  const enableSubtitles = () => {
    const videos = document.querySelectorAll('video');
    
    videos.forEach((video, index) => {
      // Crear track para subtítulos si no existe
      let track = video.querySelector('track[kind="captions"]');
      
      if (!track) {
        const trackElement = document.createElement('track') as HTMLTrackElement;
        trackElement.kind = 'captions';
        trackElement.label = 'Subtítulos en español';
        trackElement.srclang = 'es';
        trackElement.default = true;
        
        // Crear archivo VTT básico para subtítulos
        const vttContent = `WEBVTT

00:00:00.000 --> 00:00:05.000
Sistema de Predicción Académica

00:00:05.000 --> 00:00:10.000
Bienvenido al sistema de gestión estudiantil

00:00:10.000 --> 00:00:15.000
Aquí podrá gestionar estudiantes y predicciones

00:00:15.000 --> 00:00:20.000
Utilice las opciones de accesibilidad para personalizar su experiencia`;
        
        const blob = new Blob([vttContent], { type: 'text/vtt' });
        const url = URL.createObjectURL(blob);
        trackElement.src = url;
        
        video.appendChild(trackElement);
      }
      
      // Activar subtítulos
      video.textTracks[0].mode = 'showing';
      
      // Añadir controles de subtítulos
      const controlsContainer = video.parentElement;
      if (controlsContainer && !controlsContainer.querySelector('.subtitle-controls')) {
        const subtitleControls = document.createElement('div');
        subtitleControls.className = 'subtitle-controls absolute bottom-2 right-2 flex space-x-2';
        subtitleControls.innerHTML = `
          <button 
            class="subtitle-toggle bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm hover:bg-opacity-75"
            onclick="toggleSubtitles(this)"
          >
            Subtítulos
          </button>
          <button 
            class="subtitle-size bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm hover:bg-opacity-75"
            onclick="changeSubtitleSize(this)"
          >
            A+
          </button>
        `;
        
        controlsContainer.style.position = 'relative';
        controlsContainer.appendChild(subtitleControls);
      }
    });
    
    setSubtitlesEnabled(true);
  };

  const disableSubtitles = () => {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
      const tracks = video.querySelectorAll('track[kind="captions"]');
      tracks.forEach(track => {
        const trackElement = track as HTMLTrackElement;
        if (trackElement.src && trackElement.src.startsWith('blob:')) {
          URL.revokeObjectURL(trackElement.src);
        }
        track.remove();
      });
      
      // Remover controles de subtítulos
      const controlsContainer = video.parentElement;
      if (controlsContainer) {
        const subtitleControls = controlsContainer.querySelector('.subtitle-controls');
        if (subtitleControls) {
          subtitleControls.remove();
        }
      }
    });
    
    setSubtitlesEnabled(false);
  };

  // Funciones globales para los controles de subtítulos
  useEffect(() => {
    (window as any).toggleSubtitles = (button: HTMLElement) => {
      const video = button.closest('.relative')?.querySelector('video');
      if (video && video.textTracks.length > 0) {
        const track = video.textTracks[0];
        track.mode = track.mode === 'showing' ? 'hidden' : 'showing';
        button.textContent = track.mode === 'showing' ? 'Ocultar' : 'Subtítulos';
      }
    };

    (window as any).changeSubtitleSize = (button: HTMLElement) => {
      const video = button.closest('.relative')?.querySelector('video');
      if (video) {
        const currentSize = video.style.getPropertyValue('--subtitle-size') || '1';
        const newSize = currentSize === '1' ? '1.2' : currentSize === '1.2' ? '1.4' : '1';
        video.style.setProperty('--subtitle-size', newSize);
        button.textContent = newSize === '1' ? 'A+' : newSize === '1.2' ? 'A++' : 'A';
      }
    };

    return () => {
      delete (window as any).toggleSubtitles;
      delete (window as any).changeSubtitleSize;
    };
  }, []);

  return (
    <>
      {children}
      
      {/* Estilos para subtítulos */}
      {settings.screenReader && (
        <style>
          {`
            video::cue {
              font-size: calc(1rem * var(--subtitle-size, 1));
              color: white;
              background-color: rgba(0, 0, 0, 0.8);
              padding: 4px 8px;
              border-radius: 4px;
              font-family: Arial, sans-serif;
              line-height: 1.4;
            }
            
            .subtitle-controls {
              z-index: 10;
            }
          `}
        </style>
      )}
    </>
  );
};

export default VideoSubtitles;
