import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  nombres: string;

  @IsString()
  @MinLength(2)
  apellidos: string;

  @IsString()
  @MinLength(6)
  password: string;
}
