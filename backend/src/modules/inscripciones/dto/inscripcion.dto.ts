import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateInscripcionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  id_estudiante: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  id_asignatura: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  periodo_academico: string; // Ej: "2025-01"
}

export class UpdateInscripcionDto {
  @IsString()
  @MaxLength(20)
  periodo_academico?: string;
}
