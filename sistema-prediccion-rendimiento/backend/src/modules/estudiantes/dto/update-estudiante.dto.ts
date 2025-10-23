import { IsString, IsEmail, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateEstudianteDto {
  @IsString()
  @IsOptional()
  nombres?: string;

  @IsString()
  @IsOptional()
  apellidos?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  semestre_actual?: number;

  @IsString()
  @IsOptional()
  id_usuario?: string;
}
