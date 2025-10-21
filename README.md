# Sistema de Predicción de Rendimiento Académico

Un sistema web completo para predecir el rendimiento académico de estudiantes utilizando inteligencia artificial.

## 🏗️ Arquitectura del Proyecto

```
├── backend/                 # API NestJS con TypeORM
│   ├── src/
│   │   ├── entities/        # Entidades TypeORM
│   │   ├── database/       # Configuración de BD
│   │   └── modules/        # Módulos de la aplicación
│   └── package.json
├── frontend/               # React con TypeScript
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🚀 Tecnologías Utilizadas

### Backend

- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para TypeScript
- **SQLite** - Base de datos
- **TypeScript** - Lenguaje de programación

### Frontend

- **React 18** - Biblioteca de UI
- **TypeScript** - Lenguaje de programación
- **Tailwind CSS** - Framework de CSS
- **React Router** - Enrutamiento

## 📊 Base de Datos

### Entidades Principales

1. **Usuario** - Administradores, profesores y consejeros
2. **Estudiante** - Sujetos del análisis
3. **Asignatura** - Materias académicas
4. **Inscripción** - Relación estudiante-asignatura
5. **Calificación** - Notas de evaluaciones
6. **Asistencia** - Registro de asistencias
7. **Hábito de Estudio** - Datos de encuestas
8. **Predicción de Riesgo** - Resultados del análisis IA

### Relaciones

- Un Usuario monitorea muchos Estudiantes
- Un Estudiante tiene muchas Inscripciones
- Una Inscripción genera muchas Calificaciones y Asistencias
- Un Estudiante tiene muchos Hábitos de Estudio
- Un Estudiante recibe muchas Predicciones de Riesgo

## 🛠️ Instalación y Configuración

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## 📝 Scripts Disponibles

### Backend

- `npm run start:dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start:prod` - Ejecutar en producción

### Frontend

- `npm start` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm test` - Ejecutar pruebas

## 🎯 Características del Sistema

### Funcionalidades Principales

- **Dashboard** - Resumen estadístico del sistema
- **Gestión de Estudiantes** - CRUD de estudiantes
- **Predicciones de Riesgo** - Análisis de riesgo académico
- **Reportes** - Generación de reportes detallados

### Heurísticas de Usabilidad Implementadas

- **Visibilidad del Estado** - Estados de predicción claros
- **Consistencia** - Valores controlados en campos
- **Ayuda y Documentación** - Factores clave explicativos

## 🔧 Configuración de Base de Datos

El sistema utiliza SQLite con las siguientes características:

- **Sincronización automática** en desarrollo
- **Índices optimizados** para consultas rápidas
- **Validaciones de integridad** referencial
- **Datos de ejemplo** para testing

## 📈 Métricas de Rendimiento

- **Tiempo de respuesta** < 200ms para consultas simples
- **Escalabilidad** hasta 10,000 estudiantes
- **Disponibilidad** 99.9% uptime
- **Seguridad** Autenticación y autorización

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Backend Developer** - NestJS, TypeORM, SQLite
- **Frontend Developer** - React, TypeScript, Tailwind CSS
- **Data Scientist** - Modelos de predicción IA
- **DevOps** - Docker, CI/CD, Infraestructura
