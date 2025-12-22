import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../schemas/usuario.schema';
import { Estudiante } from '../schemas/estudiante.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,
    @InjectModel(Estudiante.name)
    private estudianteModel: Model<Estudiante>,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe en usuarios o estudiantes
    const existingUser = await this.usuarioModel.findOne({
      email: registerDto.email,
    }).exec();
    const existingEstudiante = await this.estudianteModel.findOne({
      email: registerDto.email,
    }).exec();

    if (existingUser || existingEstudiante) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Determinar rol basado en el email
    let rol: 'admin' | 'docente' | 'estudiante' = 'estudiante'; // Por defecto estudiante
    
    if (registerDto.email.includes('@admin.')) {
      rol = 'admin';
    } else if (registerDto.email.includes('@docente.') || registerDto.email.includes('@profesor.')) {
      rol = 'docente';
    }

    // Si es estudiante, crear en colección de estudiantes
    if (rol === 'estudiante') {
      const estudiante = new this.estudianteModel({
        id_estudiante: registerDto.email.split('@')[0], // Usar parte del email como ID temporal
        email: registerDto.email,
        nombres: registerDto.nombres,
        apellidos: registerDto.apellidos,
        password: hashedPassword,
        activo: true,
      });

      await estudiante.save();

      // Generar token JWT
      const token = this.jwtService.sign({
        sub: estudiante._id.toString(),
        email: estudiante.email,
        role: 'estudiante',
      });

      return {
        access_token: token,
        user: {
          id: estudiante._id.toString(),
          email: estudiante.email,
          nombres: estudiante.nombres,
          apellidos: estudiante.apellidos,
          role: 'estudiante',
        },
      };
    }

    // Si es admin o docente, crear en colección de usuarios
    const usuario = new this.usuarioModel({
      email: registerDto.email,
      nombres: registerDto.nombres,
      apellidos: registerDto.apellidos,
      password: hashedPassword,
      rol: rol as 'admin' | 'docente',
      activo: true,
    });

    await usuario.save();

    // Generar token JWT
    const token = this.jwtService.sign({
      sub: usuario._id.toString(),
      email: usuario.email,
      role: usuario.rol,
    });

    return {
      access_token: token,
      user: {
        id: usuario._id.toString(),
        email: usuario.email,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        role: usuario.rol,
      },
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const usuario = await this.usuarioModel.findById(userId).exec();
    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Si se intenta cambiar email, verificar unicidad
    if (dto.email && dto.email !== usuario.email) {
      const exists = await this.usuarioModel.findOne({ email: dto.email }).exec();
      if (exists) {
        throw new ConflictException('El email ya está registrado');
      }
      usuario.email = dto.email;
    }

    if (dto.nombres) usuario.nombres = dto.nombres;
    if (dto.apellidos) usuario.apellidos = dto.apellidos;

    await usuario.save();

    return {
      user: {
        id: usuario._id.toString(),
        email: usuario.email,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        role: usuario.rol,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Buscar en usuarios (admin/docente)
    const usuario = await this.usuarioModel.findOne({
      email: loginDto.email,
    }).exec();

    if (usuario) {
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
        sub: usuario._id.toString(),
        email: usuario.email,
        role: usuario.rol,
      });

      return {
        access_token: token,
        user: {
          id: usuario._id.toString(),
          email: usuario.email,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          role: usuario.rol,
        },
      };
    }

    // Buscar en estudiantes
    const estudiante = await this.estudianteModel.findOne({
      email: loginDto.email,
    }).exec();

    if (!estudiante) {
      throw new UnauthorizedException('Email o contraseña inválidos');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      estudiante.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o contraseña inválidos');
    }

    // Generar token JWT
    const token = this.jwtService.sign({
      sub: estudiante._id.toString(),
      email: estudiante.email,
      role: 'estudiante',
    });

    return {
      access_token: token,
      user: {
        id: estudiante._id.toString(),
        email: estudiante.email,
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        role: 'estudiante',
      },
    };
  }

  async validateUser(id: string) {
    return this.usuarioModel.findById(id).exec();
  }
}
