import { IsString, IsNotEmpty, IsDate, IsEnum, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export enum EstadoAsistencia {
  PRESENTE = 'Presente',
  AUSENTE = 'Ausente',
  JUSTIFICADO = 'Justificado',
}

export class CreateAsistenciaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  id_inscripcion: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fecha_clase: Date;

  @IsEnum(EstadoAsistencia)
  @IsNotEmpty()
  estado: EstadoAsistencia;
}

export class UpdateAsistenciaDto {
  @IsEnum(EstadoAsistencia)
  estado?: EstadoAsistencia;

  @IsDate()
  @Type(() => Date)
  fecha_clase?: Date;
}
