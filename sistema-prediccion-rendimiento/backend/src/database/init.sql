-- Script SQL para inicializar la base de datos SQLite
-- Sistema de Predicción de Rendimiento Académico

-- Tabla de Usuarios (Administradores, Profesores, Consejeros)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario VARCHAR(36) PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('Admin', 'Consejero', 'Profesor')),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
    id_estudiante VARCHAR(20) PRIMARY KEY, -- Cédula o ID único
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    semestre_actual INTEGER,
    promedio_notas REAL,
    porcentaje_asistencia REAL,
    id_usuario VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla de Asignaturas
CREATE TABLE IF NOT EXISTS asignaturas (
    id_asignatura VARCHAR(20) PRIMARY KEY, -- Código de materia
    nombre_asignatura VARCHAR(200) NOT NULL,
    creditos INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Inscripciones (Tabla intermedia)
CREATE TABLE IF NOT EXISTS inscripciones (
    id_inscripcion VARCHAR(36) PRIMARY KEY, -- UUID
    id_estudiante VARCHAR(20) NOT NULL,
    id_asignatura VARCHAR(20) NOT NULL,
    periodo_academico VARCHAR(20) NOT NULL, -- Ej: "2025-01"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante),
    FOREIGN KEY (id_asignatura) REFERENCES asignaturas(id_asignatura),
    UNIQUE(id_estudiante, id_asignatura, periodo_academico)
);

-- Tabla de Calificaciones
CREATE TABLE IF NOT EXISTS calificaciones (
    id_calificacion VARCHAR(36) PRIMARY KEY, -- UUID
    id_inscripcion VARCHAR(36) NOT NULL,
    tipo_evaluacion VARCHAR(50) NOT NULL, -- 'Parcial 1', 'Deber', 'Examen Final'
    nota DECIMAL(3,2) NOT NULL CHECK (nota >= 0 AND nota <= 10),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_inscripcion) REFERENCES inscripciones(id_inscripcion)
);

-- Tabla de Asistencias
CREATE TABLE IF NOT EXISTS asistencias (
    id_asistencia VARCHAR(36) PRIMARY KEY, -- UUID
    id_inscripcion VARCHAR(36) NOT NULL,
    fecha_clase DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Presente' CHECK (estado IN ('Presente', 'Ausente', 'Justificado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_inscripcion) REFERENCES inscripciones(id_inscripcion)
);

-- Tabla de Hábitos de Estudio
CREATE TABLE IF NOT EXISTS habitos_estudio (
    id_habito VARCHAR(36) PRIMARY KEY, -- UUID
    id_estudiante VARCHAR(20) NOT NULL,
    fecha_encuesta DATE NOT NULL,
    horas_estudio_semanales INTEGER NOT NULL CHECK (horas_estudio_semanales >= 0),
    lugar_estudio VARCHAR(100), -- 'Biblioteca', 'Casa', 'Grupo'
    usa_tecnicas_estudio BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante)
);

-- Tabla de Predicciones de Riesgo
CREATE TABLE IF NOT EXISTS predicciones_riesgo (
    id_prediccion VARCHAR(36) PRIMARY KEY, -- UUID
    id_estudiante VARCHAR(20) NOT NULL,
    fecha_prediccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nivel_riesgo VARCHAR(20) NOT NULL DEFAULT 'Bajo' CHECK (nivel_riesgo IN ('Bajo', 'Medio', 'Alto')),
    factores_clave TEXT NOT NULL, -- Ej: "Bajas notas en Cálculo, 30% de inasistencia"
    estado_prediccion VARCHAR(20) NOT NULL DEFAULT 'Calculando' CHECK (estado_prediccion IN ('Calculando', 'Completado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_estudiantes_email ON estudiantes(email);
CREATE INDEX IF NOT EXISTS idx_estudiantes_usuario ON estudiantes(id_usuario);
CREATE INDEX IF NOT EXISTS idx_inscripciones_estudiante ON inscripciones(id_estudiante);
CREATE INDEX IF NOT EXISTS idx_inscripciones_asignatura ON inscripciones(id_asignatura);
CREATE INDEX IF NOT EXISTS idx_inscripciones_periodo ON inscripciones(periodo_academico);
CREATE INDEX IF NOT EXISTS idx_calificaciones_inscripcion ON calificaciones(id_inscripcion);
CREATE INDEX IF NOT EXISTS idx_asistencias_inscripcion ON asistencias(id_inscripcion);
CREATE INDEX IF NOT EXISTS idx_asistencias_fecha ON asistencias(fecha_clase);
CREATE INDEX IF NOT EXISTS idx_habitos_estudiante ON habitos_estudio(id_estudiante);
CREATE INDEX IF NOT EXISTS idx_predicciones_estudiante ON predicciones_riesgo(id_estudiante);
CREATE INDEX IF NOT EXISTS idx_predicciones_fecha ON predicciones_riesgo(fecha_prediccion);
CREATE INDEX IF NOT EXISTS idx_predicciones_nivel ON predicciones_riesgo(nivel_riesgo);

-- Datos de ejemplo para testing
INSERT OR IGNORE INTO usuarios (id_usuario, nombre_usuario, rol, password_hash) VALUES 
('admin-001', 'Administrador Principal', 'Admin', '$2b$10$example_hash_admin'),
('consejero-001', 'María González', 'Consejero', '$2b$10$example_hash_consejero'),
('profesor-001', 'Carlos Rodríguez', 'Profesor', '$2b$10$example_hash_profesor');

INSERT OR IGNORE INTO asignaturas (id_asignatura, nombre_asignatura, creditos) VALUES 
('MAT-101', 'Cálculo I', 4),
('FIS-101', 'Física I', 3),
('PROG-101', 'Programación I', 4),
('ING-101', 'Inglés I', 2),
('HIS-101', 'Historia', 2);

