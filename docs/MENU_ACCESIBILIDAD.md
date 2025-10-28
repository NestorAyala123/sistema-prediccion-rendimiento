# Menú de Accesibilidad - Sistema de Predicción Académica

## Descripción General

Se ha implementado un menú de accesibilidad completo que cumple con los criterios WCAG 2.2 y las pautas de accesibilidad web. El menú incluye funcionalidades para usuarios con discapacidades auditivas, visuales y motrices.

## Características Implementadas

### 1. Accesibilidad Auditiva
- **Subtítulos en videos**: Generación automática de subtítulos para contenido multimedia
- **Transcripciones textuales**: Transcripción automática del contenido de la página
- **Control de audio**: Opciones para pausar/detener contenido de audio
- **Alertas visuales**: Reemplazo de alertas sonoras por notificaciones visuales
- **Video-intérprete en lengua de señas**: Preparado para integración futura

### 2. Accesibilidad Visual
- **Alto contraste**: Modo de alto contraste para mejor visibilidad
- **Modo oscuro**: Tema oscuro para reducir fatiga visual
- **Tamaño de texto**: Control deslizante para ajustar el tamaño del texto (5 niveles)
- **Tipo de fuente**: Selección entre diferentes fuentes accesibles
- **Colores personalizados**: Opción para personalizar esquemas de color
- **Lectura por voz**: Text-to-speech integrado
- **Resaltado de enlaces**: Mejora de la visibilidad de enlaces y elementos de foco
- **Espaciado de texto**: Ajuste del espaciado entre letras y líneas

### 3. Accesibilidad Motriz
- **Navegación por teclado**: Navegación completa usando solo el teclado
- **Botones grandes**: Aumento del tamaño de botones para facilitar la interacción
- **Atajos de teclado personalizados**: Atajos configurables para funciones comunes
- **Control por voz**: Navegación mediante comandos de voz
- **Bloqueo de auto-scroll**: Prevención de desplazamiento automático

## Componentes Implementados

### 1. AccessibilityMenu.tsx
Componente principal del menú de accesibilidad con:
- Botón flotante con icono de accesibilidad
- Panel lateral expandible
- Controles para todas las funcionalidades
- Persistencia de configuraciones

### 2. useAccessibility.ts
Hook personalizado que maneja:
- Estado de configuraciones
- Aplicación de estilos CSS
- Funcionalidades de text-to-speech
- Control por voz
- Atajos de teclado
- Alertas visuales

### 3. TranscriptProvider.tsx
Proveedor de transcripciones que:
- Genera transcripciones automáticas del contenido
- Proporciona botón flotante para mostrar transcripciones
- Integra funcionalidad de lectura por voz

### 4. VideoSubtitles.tsx
Manejador de subtítulos para videos que:
- Crea tracks de subtítulos automáticamente
- Proporciona controles de subtítulos
- Permite ajustar tamaño de subtítulos

### 5. accessibility.css
Estilos CSS que incluyen:
- Variables CSS para personalización
- Estilos para modo oscuro y alto contraste
- Mejoras para navegación por teclado
- Estilos para botones grandes
- Mejoras de contraste y visibilidad

## Atajos de Teclado Implementados

- **Ctrl + Alt + A**: Abrir menú de accesibilidad
- **Ctrl + Alt + S**: Activar/desactivar text-to-speech
- **Ctrl + Alt + D**: Activar/desactivar modo oscuro
- **Ctrl + Alt + C**: Activar/desactivar alto contraste
- **Escape**: Cerrar menús abiertos

## Cumplimiento de Estándares

### WCAG 2.2 Guidelines Implementadas

#### Auditivas (POUR: Perceptible y Comprensible)
- **1.2.2 Subtítulos**: Subtítulos automáticos para videos
- **1.2.3 Transcripción**: Transcripciones textuales del contenido
- **1.4.2 Control de audio**: Control de reproducción de audio
- **2.2.2 Pausa/detener**: Control de pausa para contenido automático
- **3.1.5 Lenguaje claro**: Uso de lenguaje claro y comprensible

#### Visuales (POUR: Perceptible y Operable)
- **1.4.3 Contraste AA**: Alto contraste para mejor visibilidad
- **1.4.4 Cambio de tamaño de texto**: Control del tamaño de texto
- **1.4.12 Espaciado de texto**: Ajuste del espaciado de texto
- **2.4.7 Foco visible**: Indicadores de foco claros
- **4.1.2 Rol/nombre/valor**: Semántica apropiada para lectores de pantalla

#### Motrices (POUR: Operable y Robusto)
- **2.1.1 Teclado**: Navegación completa por teclado
- **2.4.7 Foco visible**: Indicadores de foco para navegación
- **2.5.5 Tamaño del objetivo**: Botones de tamaño adecuado
- **2.1.4 Atajos**: Atajos de teclado personalizables
- **2.5.1 Gestos del puntero**: Alternativas a gestos complejos
- **2.2.2 Pausar, detener, ocultar**: Control de contenido automático
- **4.1.2 Nombre, rol, valor**: Semántica apropiada

## Uso del Menú

### Acceso al Menú
1. Busque el botón flotante con icono de accesibilidad en la esquina inferior derecha
2. Haga clic en el botón o use el atajo Ctrl + Alt + A
3. El menú se abrirá como un panel lateral desde la derecha

### Configuración de Opciones
1. **Sección Auditiva**: Active las opciones para subtítulos, transcripciones y alertas visuales
2. **Sección Visual**: Ajuste contraste, modo oscuro, tamaño de texto y fuente
3. **Sección Motriz**: Configure navegación por teclado, botones grandes y atajos

### Aplicación de Cambios
- Los cambios se aplican automáticamente al modificar las opciones
- Use el botón "Aplicar" para confirmar los cambios
- Use el botón "Restablecer" para volver a la configuración por defecto

## Persistencia de Configuraciones

Las configuraciones se guardan automáticamente en el localStorage del navegador y se restauran al recargar la página.

## Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (versiones modernas)
- **Dispositivos**: Desktop, tablet, móvil
- **Lectores de pantalla**: NVDA, JAWS, VoiceOver
- **Tecnologías**: HTML5, CSS3, JavaScript ES6+, React

## Pruebas de Accesibilidad

Para probar la accesibilidad:

1. **Navegación por teclado**: Use solo Tab, Enter, Escape para navegar
2. **Lectores de pantalla**: Active un lector de pantalla y verifique la navegación
3. **Alto contraste**: Active el modo de alto contraste y verifique la visibilidad
4. **Text-to-speech**: Active la lectura por voz y verifique la funcionalidad
5. **Tamaño de texto**: Ajuste el tamaño y verifique la legibilidad

## Mantenimiento

- Las configuraciones se almacenan en `localStorage` con la clave `accessibilitySettings`
- Los estilos se aplican mediante variables CSS y clases dinámicas
- El menú es completamente responsive y se adapta a diferentes tamaños de pantalla

## Futuras Mejoras

- Integración con video-intérprete en lengua de señas
- Más opciones de personalización de colores
- Soporte para más idiomas en text-to-speech
- Integración con APIs de accesibilidad del sistema operativo
