import { IsNotEmpty, IsString, IsNumber, Min, Max, IsUUID } from 'class-validator';

export class CreateCalificacionDto {
  @IsNotEmpty()
  @IsUUID()
  id_inscripcion: string;

  @IsNotEmpty()
  @IsString()
  tipo_evaluacion: string; // 'Parcial 1', 'Deber', 'Examen Final', etc.

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  nota: number;
}

export class CreateCalificacionPorPeriodoDto {
  @IsNotEmpty()
  @IsString()
  id_estudiante: string;

  @IsNotEmpty()
  @IsString()
  id_asignatura: string;

  @IsNotEmpty()
  @IsString()
  periodo_academico: string; // Ej: "2025-01", "2025-02"

  @IsNotEmpty()
  @IsString()
  tipo_evaluacion: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  nota: number;
}

export class UpdateCalificacionDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  nota?: number;

  @IsString()
  tipo_evaluacion?: string;
}
