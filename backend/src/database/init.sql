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

INSERT OR IGNORE INTO estudiantes (id_estudiante, nombres, apellidos, email, semestre_actual, id_usuario) VALUES 
('1234567890', 'Juan', 'Pérez', 'juan.perez@universidad.edu', 3, 'consejero-001'),
('0987654321', 'Ana', 'García', 'ana.garcia@universidad.edu', 2, 'consejero-001'),
('1122334455', 'Luis', 'Martínez', 'luis.martinez@universidad.edu', 4, 'consejero-001');

INSERT OR IGNORE INTO asignaturas (id_asignatura, nombre_asignatura, creditos) VALUES 
('MAT-101', 'Cálculo I', 4),
('FIS-101', 'Física I', 3),
('PROG-101', 'Programación I', 4),
('ING-101', 'Inglés I', 2),
('HIS-101', 'Historia', 2),
('MAT-102', 'Cálculo II', 4),
('QUI-101', 'Química General', 3),
('EST-101', 'Estadística', 3);

-- Inscripciones de estudiantes a asignaturas
INSERT OR IGNORE INTO inscripciones (id_inscripcion, id_estudiante, id_asignatura, periodo_academico) VALUES
-- Juan Pérez (Semestre 3)
('insc-001', '1234567890', 'MAT-101', '2025-01'),
('insc-002', '1234567890', 'FIS-101', '2025-01'),
('insc-003', '1234567890', 'PROG-101', '2025-01'),
('insc-004', '1234567890', 'ING-101', '2025-01'),
-- Ana García (Semestre 2)
('insc-005', '0987654321', 'MAT-101', '2025-01'),
('insc-006', '0987654321', 'QUI-101', '2025-01'),
('insc-007', '0987654321', 'ING-101', '2025-01'),
('insc-008', '0987654321', 'HIS-101', '2025-01'),
-- Luis Martínez (Semestre 4)
('insc-009', '1122334455', 'MAT-102', '2025-01'),
('insc-010', '1122334455', 'FIS-101', '2025-01'),
('insc-011', '1122334455', 'EST-101', '2025-01'),
('insc-012', '1122334455', 'PROG-101', '2025-01');

-- Calificaciones
INSERT OR IGNORE INTO calificaciones (id_calificacion, id_inscripcion, tipo_evaluacion, nota) VALUES
-- Juan Pérez - Cálculo I
('calif-001', 'insc-001', 'Parcial 1', 7.50),
('calif-002', 'insc-001', 'Deber 1', 8.00),
('calif-003', 'insc-001', 'Parcial 2', 6.80),
-- Juan Pérez - Física I
('calif-004', 'insc-002', 'Parcial 1', 8.50),
('calif-005', 'insc-002', 'Laboratorio 1', 9.00),
-- Juan Pérez - Programación I
('calif-006', 'insc-003', 'Proyecto 1', 9.20),
('calif-007', 'insc-003', 'Examen 1', 8.50),
-- Ana García - Cálculo I
('calif-008', 'insc-005', 'Parcial 1', 5.50),
('calif-009', 'insc-005', 'Deber 1', 6.00),
('calif-010', 'insc-005', 'Parcial 2', 5.80),
-- Ana García - Química
('calif-011', 'insc-006', 'Parcial 1', 7.00),
('calif-012', 'insc-006', 'Laboratorio 1', 8.50),
-- Luis Martínez - Cálculo II
('calif-013', 'insc-009', 'Parcial 1', 9.00),
('calif-014', 'insc-009', 'Deber 1', 9.50),
('calif-015', 'insc-009', 'Parcial 2', 8.80),
-- Luis Martínez - Física I
('calif-016', 'insc-010', 'Parcial 1', 8.00),
('calif-017', 'insc-010', 'Laboratorio 1', 8.50);

-- Asistencias
INSERT OR IGNORE INTO asistencias (id_asistencia, id_inscripcion, fecha_clase, estado) VALUES
-- Juan Pérez - Cálculo I (80% asistencia)
('asist-001', 'insc-001', '2025-01-15', 'Presente'),
('asist-002', 'insc-001', '2025-01-17', 'Presente'),
('asist-003', 'insc-001', '2025-01-20', 'Ausente'),
('asist-004', 'insc-001', '2025-01-22', 'Presente'),
('asist-005', 'insc-001', '2025-01-24', 'Presente'),
-- Ana García - Cálculo I (60% asistencia - en riesgo)
('asist-006', 'insc-005', '2025-01-15', 'Ausente'),
('asist-007', 'insc-005', '2025-01-17', 'Presente'),
('asist-008', 'insc-005', '2025-01-20', 'Ausente'),
('asist-009', 'insc-005', '2025-01-22', 'Presente'),
('asist-010', 'insc-005', '2025-01-24', 'Ausente'),
-- Luis Martínez - Cálculo II (100% asistencia)
('asist-011', 'insc-009', '2025-01-15', 'Presente'),
('asist-012', 'insc-009', '2025-01-17', 'Presente'),
('asist-013', 'insc-009', '2025-01-20', 'Presente'),
('asist-014', 'insc-009', '2025-01-22', 'Presente'),
('asist-015', 'insc-009', '2025-01-24', 'Presente');

-- Hábitos de estudio
INSERT OR IGNORE INTO habitos_estudio (id_habito, id_estudiante, fecha_encuesta, horas_estudio_semanales, lugar_estudio, usa_tecnicas_estudio) VALUES
('habito-001', '1234567890', '2025-01-10', 15, 'Biblioteca', 1),
('habito-002', '0987654321', '2025-01-10', 8, 'Casa', 0),
('habito-003', '1122334455', '2025-01-10', 20, 'Grupo', 1);

-- Predicciones de riesgo
INSERT OR IGNORE INTO predicciones_riesgo (id_prediccion, id_estudiante, nivel_riesgo, factores_clave, estado_prediccion) VALUES
('pred-001', '1234567890', 'Bajo', 'Buen rendimiento general, asistencia regular (80%), buenas notas promedio (8.0)', 'Completado'),
('pred-002', '0987654321', 'Alto', 'Bajo rendimiento en Cálculo I (promedio 5.7), inasistencia frecuente (60%), pocas horas de estudio (8h)', 'Completado'),
('pred-003', '1122334455', 'Bajo', 'Excelente rendimiento (promedio 9.0), asistencia perfecta (100%), alto compromiso académico', 'Completado');

