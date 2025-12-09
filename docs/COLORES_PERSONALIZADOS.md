# Sistema de Colores Personalizados - Accesibilidad

## 📋 Descripción

El sistema de colores personalizados permite a los usuarios adaptar completamente la paleta de colores de la interfaz según sus necesidades de accesibilidad visual, preferencias personales o condiciones específicas como daltonismo, fotosensibilidad, o baja visión.

## ✨ Características

### 1. **Paletas Predefinidas**
Se incluyen 6 paletas diseñadas para diferentes necesidades:

- **Default**: Esquema original del sistema (azul/blanco)
- **Oscuro**: Fondo oscuro con colores suaves (ideal para baja luz)
- **Cálido**: Tonos ámbar y naranja (reduce fatiga visual)
- **Natura**: Verdes suaves (relajante para los ojos)
- **Alto Contraste**: Negro/amarillo (para personas con baja visión)
- **Rosa**: Tonos rosados/púrpura (alternativa estética)

### 2. **Personalización Individual**
Cada usuario puede ajustar 6 elementos de color:

| Color | Uso en la Interfaz |
|-------|-------------------|
| **Fondo** | Color de fondo principal de toda la aplicación |
| **Texto** | Color del texto en todo el sistema |
| **Primario** | Botones principales, enlaces importantes |
| **Secundario** | Elementos de soporte, etiquetas |
| **Acento** | Botones de acción, elementos destacados |
| **Bordes** | Separadores, contornos de cajas |

### 3. **Selectores Duales**
- **Color Picker**: Selector visual HTML5
- **Input Hex**: Campo de texto para valores hexadecimales (#RRGGBB)

### 4. **Vista Previa en Tiempo Real**
Panel de vista previa que muestra:
- Texto de muestra con el color de fondo y texto seleccionado
- Botón primario con el color primario
- Botón de acento con el color de acento

## 🎨 Casos de Uso

### Para Daltonismo
**Recomendación**: Paleta Alto Contraste o personalizar con:
- Fondo: `#FFFFFF` (blanco)
- Texto: `#000000` (negro)
- Primario: `#0000FF` (azul puro)
- Acento: `#FFD700` (dorado)
- Bordes: `#000000` (negro)

### Para Dislexia
**Recomendación**: Paleta Cálido o personalizar con:
- Fondo: `#FDFCF4` (crema)
- Texto: `#2D2D2D` (gris oscuro)
- Primario: `#D97706` (naranja)
- Bordes: `#E7E5E4` (beige)

### Para Fotosensibilidad
**Recomendación**: Paleta Oscuro o personalizar con:
- Fondo: `#1A1A1A` (gris muy oscuro)
- Texto: `#E5E5E5` (gris claro)
- Primario: `#4B5563` (gris medio)
- Acento: `#6B7280` (gris azulado)

### Para Baja Visión
**Recomendación**: Alto Contraste
- Fondo: `#000000` (negro puro)
- Texto: `#FFFF00` (amarillo brillante)
- Primario: `#FFFF00` (amarillo)
- Acento: `#00FFFF` (cyan)
- Bordes: `#FFFF00` (amarillo)

## 💻 Implementación Técnica

### Variables CSS Aplicadas
Cuando se activan los colores personalizados, el sistema inyecta las siguientes variables CSS:

```css
:root {
  --custom-bg: #ffffff;
  --custom-text: #000000;
  --custom-primary: #3b82f6;
  --custom-secondary: #64748b;
  --custom-accent: #8b5cf6;
  --custom-border: #e5e7eb;
}
```

### Clases Aplicadas
Se aplican automáticamente estilos a:

- **Fondos**: `.bg-white`, `.bg-gray-50`, `.bg-gray-100`
- **Textos**: `.text-gray-*`, `.text-black`, `.text-blue-*`
- **Botones**: `button`, `.btn-primary`, `[role="button"]`
- **Inputs**: `input`, `textarea`, `select`
- **Navegación**: `nav`, `.card`, `.panel`
- **Tablas**: `table`, `th`, `td`

### Persistencia
Los ajustes se guardan en `localStorage` con la clave `accessibility-settings` y se restauran automáticamente al volver a cargar la página.

## 🔧 Uso desde el Menú

1. Click en el **botón de accesibilidad** (esquina inferior derecha)
2. Navegar a la sección **"Accesibilidad Visual"**
3. Activar el switch **"Colores personalizados"**
4. El panel de personalización se despliega automáticamente
5. Seleccionar una **paleta predefinida** O ajustar colores individualmente
6. Los cambios se aplican **instantáneamente** en toda la interfaz
7. Click en **"Aplicar"** para confirmar (opcional, ya se aplican en tiempo real)

## 🎯 Atajos de Teclado

- **Abrir menú de accesibilidad**: `Alt + A`
- **Navegar entre campos**: `Tab` / `Shift + Tab`
- **Cerrar menú**: `Escape`

## 🌐 Soporte de Idiomas

Todas las etiquetas y descripciones están traducidas en:
- ✅ Español
- ✅ Inglés

## 📊 Paletas de Colores (Valores Hex)

### Default
```json
{
  "background": "#ffffff",
  "text": "#000000",
  "primary": "#3b82f6",
  "secondary": "#64748b",
  "accent": "#8b5cf6",
  "border": "#e5e7eb"
}
```

### Oscuro
```json
{
  "background": "#1a1a1a",
  "text": "#ffffff",
  "primary": "#60a5fa",
  "secondary": "#94a3b8",
  "accent": "#a78bfa",
  "border": "#374151"
}
```

### Cálido
```json
{
  "background": "#fffef2",
  "text": "#2d2d2d",
  "primary": "#d97706",
  "secondary": "#78716c",
  "accent": "#ea580c",
  "border": "#e7e5e4"
}
```

### Natura
```json
{
  "background": "#f0fdf4",
  "text": "#14532d",
  "primary": "#16a34a",
  "secondary": "#6b7280",
  "accent": "#059669",
  "border": "#d1fae5"
}
```

### Alto Contraste
```json
{
  "background": "#000000",
  "text": "#ffff00",
  "primary": "#ffff00",
  "secondary": "#ffffff",
  "accent": "#00ffff",
  "border": "#ffff00"
}
```

### Rosa
```json
{
  "background": "#fdf2f8",
  "text": "#831843",
  "primary": "#db2777",
  "secondary": "#9333ea",
  "accent": "#c026d3",
  "border": "#f9a8d4"
}
```

## ⚠️ Consideraciones

1. **Contraste**: Asegúrese de mantener suficiente contraste entre fondo y texto (ratio mínimo 4.5:1 según WCAG 2.1 AA)
2. **Legibilidad**: Evite combinaciones que dificulten la lectura (ej: rojo sobre verde)
3. **Coherencia**: Mantenga la coherencia visual entre colores primarios y de acento
4. **Pruebas**: Pruebe la paleta en todas las secciones de la aplicación

## 🔗 Referencias

- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Color Blind Safe Palettes](https://www.color-blindness.com/color-name-hue/)
- [Material Design Color System](https://material.io/design/color/the-color-system.html)

---

**Versión**: 1.0  
**Última actualización**: Diciembre 2025
