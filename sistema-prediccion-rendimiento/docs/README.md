# Sistema de Predicción de Rendimiento Académico

Sistema web para predecir el rendimiento académico de estudiantes.

## Requisitos

- Node.js 16+
- npm 8+

## Instalación Rápida

``powershell
cd "ruta\del\proyecto"
.\instalar.ps1

# Seleccionar opción: 4

``

## Acceso

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Prueba

Email: cualquiera
Contraseña: cualquiera

## Estructura

`sistema-prediccion-rendimiento/
├── backend/       # API NestJS + TypeORM + SQLite
├── frontend/      # React 19 + TypeScript + Tailwind
 docs/          # Documentación completa
 README.md      # Este archivo
 instalar.ps1   # Script de automatización`

## Tecnologías

Backend: NestJS, TypeORM, SQLite, JWT, bcrypt
Frontend: React 19, TypeScript, Tailwind CSS, React Router 6

## Características

- Autenticación con JWT
- Dashboard con KPIs
- CRUD de estudiantes
- Predicciones de riesgo
- Export CSV
- Responsive design
- Modo demo sin backend

## Comandos

``powershell

# Arrancar todo

.\instalar.ps1

# Backend solamente

cd backend
npm install
npm run start:dev

# Frontend solamente

cd frontend
npm install
npm start

# Limpiar e reinstalar

.\instalar.ps1

# Ver estado

.\instalar.ps1
``

## Documentación

Ver carpeta docs/ para documentación completa:

- INICIO_RAPIDO.md
- GUIA_PRUEBAS.md
- BACKEND_AUTH_SETUP.md
- ARQUITECTURA.md
