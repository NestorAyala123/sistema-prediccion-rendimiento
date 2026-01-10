import { IsString, IsNotEmpty, IsDate, IsEnum, MaxLength, IsArray, ValidateNested } from 'class-validator';
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

// DTO para asistencia individual dentro del lote
export class AsistenciaItemDto {
  @IsString()
  @IsNotEmpty()
  id_estudiante: string;

  @IsString()
  @IsNotEmpty()
  estado: string;
}

// DTO para crear asistencias en lote
export class CreateAsistenciaLoteDto {
  @IsString()
  @IsNotEmpty()
  id_asignatura: string;

  @IsString()
  @IsNotEmpty()
  fecha_clase: string;

  @IsString()
  @IsNotEmpty()
  periodo_academico: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AsistenciaItemDto)
  asistencias: AsistenciaItemDto[];
}
