import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateAsignaturaDto {
  @IsNotEmpty()
  @IsString()
  id_asignatura: string; // Código de materia ej: "MAT-101"

  @IsNotEmpty()
  @IsString()
  nombre_asignatura: string;

  @IsNumber()
  @Min(1)
  creditos?: number;
}

export class UpdateAsignaturaDto {
  @IsString()
  nombre_asignatura?: string;

  @IsNumber()
  @Min(1)
  creditos?: number;
}
