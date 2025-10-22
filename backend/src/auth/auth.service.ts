import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.usuariosRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear nuevo usuario
    const usuario = this.usuariosRepository.create({
      id_usuario: uuidv4(),
      email: registerDto.email,
      nombres: registerDto.nombres,
      apellidos: registerDto.apellidos,
      password: hashedPassword,
      rol: 'usuario',
    });

    await this.usuariosRepository.save(usuario);

    // Generar token JWT
    const token = this.jwtService.sign({
      sub: usuario.id_usuario,
      email: usuario.email,
      role: usuario.rol,
    });

    return {
      access_token: token,
      user: {
        id: usuario.id_usuario,
        email: usuario.email,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        rol: usuario.rol,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Buscar usuario por email
    const usuario = await this.usuariosRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Email o contraseña inválidos');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      usuario.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o contraseña inválidos');
    }

    // Generar token JWT
    const token = this.jwtService.sign({
      sub: usuario.id_usuario,
      email: usuario.email,
      role: usuario.rol,
    });

    return {
      access_token: token,
      user: {
        id: usuario.id_usuario,
        email: usuario.email,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        rol: usuario.rol,
      },
    };
  }

  async validateUser(id: string) {
    return this.usuariosRepository.findOne({
      where: { id_usuario: id },
    });
  }
}
