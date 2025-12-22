import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfig } from './database/mongodb.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudiantesModule } from './modules/estudiantes/estudiantes.module';
import { AuthModule } from './auth/auth.module';
import { SoporteModule } from './modules/soporte/soporte.module';
import { PrediccionesModule } from './modules/predicciones/predicciones.module';
import { CalificacionesModule } from './modules/calificaciones/calificaciones.module';
import { AsignaturasModule } from './modules/asignaturas/asignaturas.module';
import { InscripcionesModule } from './modules/inscripciones/inscripciones.module';
import { AsistenciasModule } from './modules/asistencias/asistencias.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { NotificacionesModule } from './modules/notificaciones/notificaciones.module';
import { Usuario, UsuarioSchema } from './schemas/usuario.schema';
import { Estudiante, EstudianteSchema } from './schemas/estudiante.schema';
import { Asignatura, AsignaturaSchema } from './schemas/asignatura.schema';
import { Inscripcion, InscripcionSchema } from './schemas/inscripcion.schema';
import { Calificacion, CalificacionSchema } from './schemas/calificacion.schema';
import { Asistencia, AsistenciaSchema } from './schemas/asistencia.schema';
import { HabitoEstudio, HabitoEstudioSchema } from './schemas/habito-estudio.schema';
import { PrediccionRiesgo, PrediccionRiesgoSchema } from './schemas/prediccion-riesgo.schema';

@Module({
  imports: [
    // Conexión a MongoDB (base de datos principal)
    MongooseModule.forRoot(mongoConfig.uri, mongoConfig.options),
    
    // Registrar todos los schemas globalmente
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Estudiante.name, schema: EstudianteSchema },
      { name: Asignatura.name, schema: AsignaturaSchema },
      { name: Inscripcion.name, schema: InscripcionSchema },
      { name: Calificacion.name, schema: CalificacionSchema },
      { name: Asistencia.name, schema: AsistenciaSchema },
      { name: HabitoEstudio.name, schema: HabitoEstudioSchema },
      { name: PrediccionRiesgo.name, schema: PrediccionRiesgoSchema },
    ]),
    
    // Módulos de la aplicación
    AuthModule,
    EstudiantesModule,
    AsignaturasModule,
    InscripcionesModule,
    CalificacionesModule,
    AsistenciasModule,
    PrediccionesModule,
    SoporteModule,
    AuditoriaModule,
    NotificacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
