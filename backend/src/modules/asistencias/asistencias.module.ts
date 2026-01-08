import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AsistenciasController } from './asistencias.controller';
import { AsistenciasService } from './asistencias.service';
import { Asistencia, AsistenciaSchema } from '../../schemas/asistencia.schema';
import { Inscripcion, InscripcionSchema } from '../../schemas/inscripcion.schema';
import { Estudiante, EstudianteSchema } from '../../schemas/estudiante.schema';
import { Asignatura, AsignaturaSchema } from '../../schemas/asignatura.schema';
import { EventsModule } from '../../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Asistencia.name, schema: AsistenciaSchema },
      { name: Inscripcion.name, schema: InscripcionSchema },
      { name: Estudiante.name, schema: EstudianteSchema },
      { name: Asignatura.name, schema: AsignaturaSchema },
    ]),
    EventsModule,
  ],
  controllers: [AsistenciasController],
  providers: [AsistenciasService],
  exports: [AsistenciasService],
})
export class AsistenciasModule {}
