import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Usuario } from '../schemas/usuario.schema';
import { Estudiante } from '../schemas/estudiante.schema';
import { Asignatura } from '../schemas/asignatura.schema';
import { Inscripcion } from '../schemas/inscripcion.schema';
import { Calificacion } from '../schemas/calificacion.schema';
import { Asistencia } from '../schemas/asistencia.schema';
import { HabitoEstudio } from '../schemas/habito-estudio.schema';
import { PrediccionRiesgo } from '../schemas/prediccion-riesgo.schema';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usuarioModel = app.get(getModelToken(Usuario.name));
  const estudianteModel = app.get(getModelToken(Estudiante.name));
  const asignaturaModel = app.get(getModelToken(Asignatura.name));
  const inscripcionModel = app.get(getModelToken(Inscripcion.name));
  const calificacionModel = app.get(getModelToken(Calificacion.name));
  const asistenciaModel = app.get(getModelToken(Asistencia.name));
  const habitoModel = app.get(getModelToken(HabitoEstudio.name));
  const prediccionModel = app.get(getModelToken(PrediccionRiesgo.name));

  console.log('🌱 Iniciando seed de la base de datos...\n');

  // Limpiar colecciones existentes
  await Promise.all([
    usuarioModel.deleteMany({}),
    estudianteModel.deleteMany({}),
    asignaturaModel.deleteMany({}),
    inscripcionModel.deleteMany({}),
    calificacionModel.deleteMany({}),
    asistenciaModel.deleteMany({}),
    habitoModel.deleteMany({}),
    prediccionModel.deleteMany({}),
  ]);
  console.log('✓ Colecciones limpiadas');

  // Hash de contraseñas
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin2025!', 10);
  const carlosPasswordHash = await bcrypt.hash('Carlos@2024', 10);
  const mariaPasswordHash = await bcrypt.hash('Maria#Docente', 10);

  // 1. Usuarios
  console.log('\n📝 Creando usuarios...');
  const usuarios = await usuarioModel.insertMany([
    {
      nombres: 'Administrador',
      apellidos: 'Principal',
      rol: 'admin',
      password: adminPasswordHash,
      email: 'admin@universidad.edu',
      activo: true,
    },
    {
      nombres: 'Carlos',
      apellidos: 'Rodríguez',
      rol: 'docente',
      password: carlosPasswordHash,
      email: 'carlos.rodriguez@universidad.edu',
      activo: true,
    },
    {
      nombres: 'María',
      apellidos: 'González',
      rol: 'docente',
      password: mariaPasswordHash,
      email: 'maria.gonzalez@universidad.edu',
      activo: true,
    },
  ]);
  console.log(`✓ ${usuarios.length} usuarios creados`);

  // 2. Estudiantes
  console.log('\n👨‍🎓 Creando estudiantes...');
  const estudiantes = await estudianteModel.insertMany([
    {
      id_estudiante: '1234567890',
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan.perez@universidad.edu',
      password: passwordHash,
      telefono: '0991234567',
      semestre_actual: 3,
      carrera: 'Ingeniería en Sistemas',
      promedio_general: 8.0,
      activo: true,
      fecha_ingreso: new Date('2024-03-01'),
    },
    {
      id_estudiante: '0987654321',
      nombres: 'Ana',
      apellidos: 'García',
      email: 'ana.garcia@universidad.edu',
      password: passwordHash,
      telefono: '0987654321',
      semestre_actual: 2,
      carrera: 'Ingeniería en Sistemas',
      promedio_general: 6.5,
      activo: true,
      fecha_ingreso: new Date('2024-09-01'),
    },
    {
      id_estudiante: '1122334455',
      nombres: 'Luis',
      apellidos: 'Martínez',
      email: 'luis.martinez@universidad.edu',
      password: passwordHash,
      telefono: '0991122334',
      semestre_actual: 4,
      carrera: 'Ingeniería en Sistemas',
      promedio_general: 9.0,
      activo: true,
      fecha_ingreso: new Date('2023-09-01'),
    },
  ]);
  console.log(`✓ ${estudiantes.length} estudiantes creados`);

  // 3. Asignaturas
  console.log('\n📚 Creando asignaturas...');
  const asignaturas = await asignaturaModel.insertMany([
    {
      id_asignatura: 'MAT-101',
      nombre_asignatura: 'Cálculo I',
      creditos: 4,
      descripcion: 'Introducción al cálculo diferencial e integral',
      semestre: 1,
      departamento: 'Matemáticas',
      activo: true,
    },
    {
      id_asignatura: 'MAT-102',
      nombre_asignatura: 'Cálculo II',
      creditos: 4,
      descripcion: 'Cálculo avanzado y ecuaciones diferenciales',
      semestre: 2,
      prerequisitos: ['MAT-101'],
      departamento: 'Matemáticas',
      activo: true,
    },
    {
      id_asignatura: 'FIS-101',
      nombre_asignatura: 'Física I',
      creditos: 3,
      descripcion: 'Mecánica clásica',
      semestre: 1,
      departamento: 'Física',
      activo: true,
    },
    {
      id_asignatura: 'PROG-101',
      nombre_asignatura: 'Programación I',
      creditos: 4,
      descripcion: 'Fundamentos de programación',
      semestre: 1,
      departamento: 'Computación',
      activo: true,
    },
    {
      id_asignatura: 'QUI-101',
      nombre_asignatura: 'Química General',
      creditos: 3,
      descripcion: 'Introducción a la química',
      semestre: 1,
      departamento: 'Química',
      activo: true,
    },
    {
      id_asignatura: 'EST-101',
      nombre_asignatura: 'Estadística',
      creditos: 3,
      descripcion: 'Estadística descriptiva e inferencial',
      semestre: 2,
      departamento: 'Matemáticas',
      activo: true,
    },
    {
      id_asignatura: 'ING-101',
      nombre_asignatura: 'Inglés I',
      creditos: 2,
      descripcion: 'Inglés básico',
      semestre: 1,
      departamento: 'Idiomas',
      activo: true,
    },
    {
      id_asignatura: 'HIS-101',
      nombre_asignatura: 'Historia',
      creditos: 2,
      descripcion: 'Historia universal',
      semestre: 1,
      departamento: 'Humanidades',
      activo: true,
    },
  ]);
  console.log(`✓ ${asignaturas.length} asignaturas creadas`);

  // 4. Inscripciones
  console.log('\n📝 Creando inscripciones...');
  const inscripciones = await inscripcionModel.insertMany([
    // Juan Pérez
    { id_estudiante: '1234567890', id_asignatura: 'MAT-101', periodo_academico: '2025-01', estado: 'cursando' },
    { id_estudiante: '1234567890', id_asignatura: 'FIS-101', periodo_academico: '2025-01', estado: 'cursando' },
    { id_estudiante: '1234567890', id_asignatura: 'PROG-101', periodo_academico: '2025-01', estado: 'cursando' },
    { id_estudiante: '1234567890', id_asignatura: 'ING-101', periodo_academico: '2025-01', estado: 'cursando' },
    // Ana García
    { id_estudiante: '0987654321', id_asignatura: 'MAT-101', periodo_academico: '2025-01', estado: 'cursando' },
    { id_estudiante: '0987654321', id_asignatura: 'QUI-101', periodo_academico: '2025-01', estado: 'cursando' },
    { id_estudiante: '0987654321', id_asignatura: 'ING-101', periodo_academico: '2025-01', estado: 'cursando' },
    { id_estudiante: '0987654321', id_asignatura: 'HIS-101', periodo_academico: '2025-01', estado: 'cursando' },
    // Luis Martínez
    { id_estudiante: '1122334455', id_asignatura: 'MAT-102', periodo_academico: '2025-01', estado: 'cursando' },
    { id_estudiante: '1122334455', id_asignatura: 'FIS-101', periodo_academico: '2025-01', estado: 'cursando' },
    { id_estudiante: '1122334455', id_asignatura: 'EST-101', periodo_academico: '2025-01', estado: 'cursando' },
    { id_estudiante: '1122334455', id_asignatura: 'PROG-101', periodo_academico: '2025-01', estado: 'cursando' },
  ]);
  console.log(`✓ ${inscripciones.length} inscripciones creadas`);

  // 5. Calificaciones
  console.log('\n📊 Creando calificaciones...');
  const calificaciones = await calificacionModel.insertMany([
    // Juan Pérez - Cálculo I
    { id_estudiante: '1234567890', id_asignatura: 'MAT-101', periodo_academico: '2025-01', tipo_evaluacion: 'Parcial 1', nota: 7.5, porcentaje: 30 },
    { id_estudiante: '1234567890', id_asignatura: 'MAT-101', periodo_academico: '2025-01', tipo_evaluacion: 'Deber 1', nota: 8.0, porcentaje: 10 },
    { id_estudiante: '1234567890', id_asignatura: 'MAT-101', periodo_academico: '2025-01', tipo_evaluacion: 'Parcial 2', nota: 6.8, porcentaje: 30 },
    // Juan Pérez - Física I
    { id_estudiante: '1234567890', id_asignatura: 'FIS-101', periodo_academico: '2025-01', tipo_evaluacion: 'Parcial 1', nota: 8.5, porcentaje: 30 },
    { id_estudiante: '1234567890', id_asignatura: 'FIS-101', periodo_academico: '2025-01', tipo_evaluacion: 'Laboratorio 1', nota: 9.0, porcentaje: 20 },
    // Juan Pérez - Programación I
    { id_estudiante: '1234567890', id_asignatura: 'PROG-101', periodo_academico: '2025-01', tipo_evaluacion: 'Proyecto 1', nota: 9.2, porcentaje: 40 },
    { id_estudiante: '1234567890', id_asignatura: 'PROG-101', periodo_academico: '2025-01', tipo_evaluacion: 'Examen 1', nota: 8.5, porcentaje: 30 },
    // Ana García - Cálculo I (rendimiento bajo)
    { id_estudiante: '0987654321', id_asignatura: 'MAT-101', periodo_academico: '2025-01', tipo_evaluacion: 'Parcial 1', nota: 5.5, porcentaje: 30 },
    { id_estudiante: '0987654321', id_asignatura: 'MAT-101', periodo_academico: '2025-01', tipo_evaluacion: 'Deber 1', nota: 6.0, porcentaje: 10 },
    { id_estudiante: '0987654321', id_asignatura: 'MAT-101', periodo_academico: '2025-01', tipo_evaluacion: 'Parcial 2', nota: 5.8, porcentaje: 30 },
    // Ana García - Química
    { id_estudiante: '0987654321', id_asignatura: 'QUI-101', periodo_academico: '2025-01', tipo_evaluacion: 'Parcial 1', nota: 7.0, porcentaje: 30 },
    { id_estudiante: '0987654321', id_asignatura: 'QUI-101', periodo_academico: '2025-01', tipo_evaluacion: 'Laboratorio 1', nota: 8.5, porcentaje: 20 },
    // Luis Martínez - Cálculo II (rendimiento excelente)
    { id_estudiante: '1122334455', id_asignatura: 'MAT-102', periodo_academico: '2025-01', tipo_evaluacion: 'Parcial 1', nota: 9.0, porcentaje: 30 },
    { id_estudiante: '1122334455', id_asignatura: 'MAT-102', periodo_academico: '2025-01', tipo_evaluacion: 'Deber 1', nota: 9.5, porcentaje: 10 },
    { id_estudiante: '1122334455', id_asignatura: 'MAT-102', periodo_academico: '2025-01', tipo_evaluacion: 'Parcial 2', nota: 8.8, porcentaje: 30 },
    // Luis Martínez - Física I
    { id_estudiante: '1122334455', id_asignatura: 'FIS-101', periodo_academico: '2025-01', tipo_evaluacion: 'Parcial 1', nota: 8.0, porcentaje: 30 },
    { id_estudiante: '1122334455', id_asignatura: 'FIS-101', periodo_academico: '2025-01', tipo_evaluacion: 'Laboratorio 1', nota: 8.5, porcentaje: 20 },
  ]);
  console.log(`✓ ${calificaciones.length} calificaciones creadas`);

  // 6. Asistencias
  console.log('\n✅ Creando asistencias...');
  const asistencias = [];
  const fechasClase = ['2025-01-15', '2025-01-17', '2025-01-20', '2025-01-22', '2025-01-24'];
  
  // Juan Pérez - 80% asistencia
  fechasClase.forEach((fecha, index) => {
    asistencias.push({
      id_estudiante: '1234567890',
      id_asignatura: 'MAT-101',
      periodo_academico: '2025-01',
      fecha_clase: new Date(fecha),
      estado: index === 2 ? 'Ausente' : 'Presente',
    });
  });

  // Ana García - 60% asistencia (en riesgo)
  fechasClase.forEach((fecha, index) => {
    asistencias.push({
      id_estudiante: '0987654321',
      id_asignatura: 'MAT-101',
      periodo_academico: '2025-01',
      fecha_clase: new Date(fecha),
      estado: index % 2 === 0 ? 'Ausente' : 'Presente',
    });
  });

  // Luis Martínez - 100% asistencia
  fechasClase.forEach((fecha) => {
    asistencias.push({
      id_estudiante: '1122334455',
      id_asignatura: 'MAT-102',
      periodo_academico: '2025-01',
      fecha_clase: new Date(fecha),
      estado: 'Presente',
    });
  });

  await asistenciaModel.insertMany(asistencias);
  console.log(`✓ ${asistencias.length} asistencias creadas`);

  // 7. Hábitos de Estudio
  console.log('\n📖 Creando hábitos de estudio...');
  const habitos = await habitoModel.insertMany([
    {
      id_estudiante: '1234567890',
      fecha_encuesta: new Date('2025-01-10'),
      horas_estudio_semanales: 15,
      lugar_estudio: 'Biblioteca',
      usa_tecnicas_estudio: true,
      tecnicas_utilizadas: ['Resumen', 'Mapas mentales'],
      horario_preferido: 'Mañana',
      motivacion: 'Alta',
      apoyo_familiar: true,
      trabaja: false,
    },
    {
      id_estudiante: '0987654321',
      fecha_encuesta: new Date('2025-01-10'),
      horas_estudio_semanales: 8,
      lugar_estudio: 'Casa',
      usa_tecnicas_estudio: false,
      horario_preferido: 'Noche',
      distracciones: ['Redes sociales', 'TV'],
      motivacion: 'Media',
      apoyo_familiar: true,
      trabaja: true,
      horas_trabajo_semanales: 20,
    },
    {
      id_estudiante: '1122334455',
      fecha_encuesta: new Date('2025-01-10'),
      horas_estudio_semanales: 20,
      lugar_estudio: 'Grupo',
      usa_tecnicas_estudio: true,
      tecnicas_utilizadas: ['Pomodoro', 'Fichas', 'Explicar a otros'],
      horario_preferido: 'Tarde',
      motivacion: 'Alta',
      apoyo_familiar: true,
      trabaja: false,
    },
  ]);
  console.log(`✓ ${habitos.length} hábitos de estudio creados`);

  // 8. Predicciones de Riesgo
  console.log('\n🔮 Creando predicciones de riesgo...');
  const predicciones = await prediccionModel.insertMany([
    {
      id_estudiante: '1234567890',
      periodo_academico: '2025-01',
      nivel_riesgo: 'Bajo',
      probabilidad_desercion: 15,
      factores_riesgo: {
        promedio_bajo: false,
        asistencia_baja: false,
        habitos_inadecuados: false,
        problemas_economicos: false,
        falta_motivacion: false,
      },
      factores_clave: 'Buen rendimiento general, asistencia regular (80%), buenas notas promedio (8.0)',
      metricas: {
        promedio_actual: 8.0,
        porcentaje_asistencia: 80,
        materias_reprobadas: 0,
        horas_estudio: 15,
      },
      recomendaciones: ['Mantener el ritmo de estudio', 'Continuar con técnicas efectivas'],
      estado_prediccion: 'Completado',
      modelo_usado: 'Random Forest v1.0',
    },
    {
      id_estudiante: '0987654321',
      periodo_academico: '2025-01',
      nivel_riesgo: 'Alto',
      probabilidad_desercion: 65,
      factores_riesgo: {
        promedio_bajo: true,
        asistencia_baja: true,
        habitos_inadecuados: true,
        problemas_economicos: false,
        falta_motivacion: true,
      },
      factores_clave: 'Bajo rendimiento en Cálculo I (promedio 5.7), inasistencia frecuente (60%), pocas horas de estudio (8h), trabaja 20h semanales',
      metricas: {
        promedio_actual: 6.5,
        porcentaje_asistencia: 60,
        materias_reprobadas: 0,
        horas_estudio: 8,
      },
      recomendaciones: [
        'Tutoría académica urgente en Matemáticas',
        'Reducir horas de trabajo si es posible',
        'Establecer horario fijo de estudio',
        'Mejorar asistencia a clases',
        'Aprender técnicas de estudio efectivas',
      ],
      estado_prediccion: 'Completado',
      modelo_usado: 'Random Forest v1.0',
    },
    {
      id_estudiante: '1122334455',
      periodo_academico: '2025-01',
      nivel_riesgo: 'Bajo',
      probabilidad_desercion: 5,
      factores_riesgo: {
        promedio_bajo: false,
        asistencia_baja: false,
        habitos_inadecuados: false,
        problemas_economicos: false,
        falta_motivacion: false,
      },
      factores_clave: 'Excelente rendimiento (promedio 9.0), asistencia perfecta (100%), alto compromiso académico',
      metricas: {
        promedio_actual: 9.0,
        porcentaje_asistencia: 100,
        materias_reprobadas: 0,
        horas_estudio: 20,
      },
      recomendaciones: ['Excelente desempeño, continuar así', 'Considerar participar en proyectos de investigación'],
      estado_prediccion: 'Completado',
      modelo_usado: 'Random Forest v1.0',
    },
  ]);
  console.log(`✓ ${predicciones.length} predicciones creadas`);

  console.log('\n✅ Seed completado exitosamente!\n');
  console.log('📊 Resumen:');
  console.log(`   - ${usuarios.length} usuarios`);
  console.log(`   - ${estudiantes.length} estudiantes`);
  console.log(`   - ${asignaturas.length} asignaturas`);
  console.log(`   - ${inscripciones.length} inscripciones`);
  console.log(`   - ${calificaciones.length} calificaciones`);
  console.log(`   - ${asistencias.length} asistencias`);
  console.log(`   - ${habitos.length} hábitos de estudio`);
  console.log(`   - ${predicciones.length} predicciones\n`);

  await app.close();
}

seed()
  .then(() => {
    console.log('👋 Proceso finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  });
