import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalificacionesController } from './calificaciones.controller';
import { CalificacionesService } from './calificaciones.service';
import { Calificacion, CalificacionSchema } from '../../schemas/calificacion.schema';
import { Inscripcion, InscripcionSchema } from '../../schemas/inscripcion.schema';
import { Estudiante, EstudianteSchema } from '../../schemas/estudiante.schema';
import { Asignatura, AsignaturaSchema } from '../../schemas/asignatura.schema';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { EventsModule } from '../../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Calificacion.name, schema: CalificacionSchema },
      { name: Inscripcion.name, schema: InscripcionSchema },
      { name: Estudiante.name, schema: EstudianteSchema },
      { name: Asignatura.name, schema: AsignaturaSchema },
    ]),
    NotificacionesModule,
    EventsModule,
  ],
  controllers: [CalificacionesController],
  providers: [CalificacionesService],
  exports: [CalificacionesService],
})
export class CalificacionesModule {}
