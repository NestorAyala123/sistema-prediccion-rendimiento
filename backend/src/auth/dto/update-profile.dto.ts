import { IsEmail, IsOptional, IsString, MinLength, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  nombres?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  apellidos?: string;

  // Campos adicionales para estudiantes
  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;
}
