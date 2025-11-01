import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateEstudianteDto {
  @IsString()
  @IsNotEmpty()
  id_estudiante: string;

  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  semestre_actual?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  promedio_notas?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  porcentaje_asistencia?: number;

  @IsString()
  @IsOptional()
  id_usuario?: string;
}
