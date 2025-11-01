# Mover botón de accesibilidad al lado derecho — Documentación paso a paso

Este documento describe los cambios realizados para mover el botón flotante de accesibilidad (FAB) al lado derecho de la aplicación y cómo personalizar sus offsets.

## Objetivo
Colocar el botón de accesibilidad en la esquina inferior derecha en móviles y centrado verticalmente a la derecha en pantallas medianas y grandes, con offsets configurables.

## Archivos modificados
- `frontend/src/components/AccessibilityMenu.tsx`
  - Se centralizó la lógica de posicionamiento en la clase `accessibility-fab` y se añadió un comentario explicativo.
- `frontend/src/styles/accessibility.css`
  - Se añadieron reglas para `.accessibility-fab` con variables CSS que controlan offsets y media queries para md y xl.

## Qué se cambió (pasos ejecutados)
1. Abrí `AccessibilityMenu.tsx` y localicé el botón flotante (FAB).
2. Reemplacé las clases utilitarias Tailwind relacionadas con posicionamiento (`bottom-5 right-5 md:top-1/2 md:right-5 md:-translate-y-1/2`) por una única clase: `accessibility-fab`.
   - Esto facilita ajustar offsets desde CSS en un único lugar.
3. Añadí un bloque de comentarios en `AccessibilityMenu.tsx` que documenta las variables CSS disponibles y el comportamiento.
4. Abrí `accessibility.css` y añadí reglas para `.accessibility-fab` con variables:
   - `--fab-bottom-mobile` (por defecto `1.25rem`)
   - `--fab-right-mobile` (por defecto `1.25rem`)
   - `--fab-top-md` (por defecto `50%`)
   - `--fab-right-md` (por defecto `1.25rem`)
   - `--fab-right-xl` (por defecto `2rem`)
   - Media queries aplican `top: var(--fab-top-md)` y transform translateY para centrar en md+, y aumentan `right` en xl.
5. Realicé una comprobación estática de errores en los archivos editados — sin errores reportados.

## Cómo ajustar offsets (ejemplos)
- Aumentar separación en pantallas grandes (xl):

```css
.accessibility-fab {
  --fab-right-xl: 3rem;
}
```

- Moverlo más lejos de la esquina en móviles:

```css
.accessibility-fab {
  --fab-bottom-mobile: 2rem;
  --fab-right-mobile: 1.5rem;
}
```

- Forzar posición fija en lugar de centrar vertical (si lo prefieres):

```css
@media (min-width: 768px) {
  .accessibility-fab {
    top: auto;
    bottom: 2rem;
    transform: none;
  }
}
```

## Cómo probar los cambios localmente
1. Abrir terminal (recomiendo Git Bash o WSL para evitar políticas de ejecución de PowerShell) y ejecutar:

```bash
cd frontend
npm install
npm start
```

2. Abrir la app en el navegador (normalmente `http://localhost:3000`) y verificar:
   - Móvil: botón en esquina inferior derecha.
   - Escritorio (md+): botón centrado vertical a la derecha.
   - Abrir el menú de accesibilidad: en md+ el botón se oculta para evitar solapamiento.

Si usas PowerShell y ves error con `npm` por políticas de ejecución, puedes temporalmente permitir scripts con:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
# luego ejecutar npm start en la carpeta frontend
```

## Notas finales
- El enfoque usa utilidades Tailwind para estilos visuales y CSS personalizado para posicionamiento y control fino.
- Si quieres, puedo:
  - Añadir un pequeño snippet en `README.md` con esta explicación.
  - Ajustar valores por defecto hasta que encaje visualmente con tu layout (puedes indicar valores exactos en px/rem).
  - Implementar una clase alternativa para versiones RTL si la app necesita soporte de lectura derecha-izquierda.

---
Documento generado automáticamente por cambios realizados en el repositorio.
