import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Usuario } from '../schemas/usuario.schema';
import { Estudiante } from '../schemas/estudiante.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthService {
    private usuarioModel;
    private estudianteModel;
    private jwtService;
    constructor(usuarioModel: Model<Usuario>, estudianteModel: Model<Estudiante>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            nombres: string;
            apellidos: string;
            role: string;
        };
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        user: {
            id: string;
            email: string;
            nombres: string;
            apellidos: string;
            role: string;
            telefono?: undefined;
            direccion?: undefined;
            fecha_nacimiento?: undefined;
        };
    } | {
        user: {
            id: string;
            email: string;
            nombres: string;
            apellidos: string;
            telefono: string;
            direccion: string;
            fecha_nacimiento: Date;
            role: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            nombres: string;
            apellidos: string;
            role: string;
        };
    }>;
    validateUser(id: string): Promise<import("mongoose").Document<unknown, {}, Usuario, {}, {}> & Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
