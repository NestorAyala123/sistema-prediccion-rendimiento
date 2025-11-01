import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthService {
    private usuariosRepository;
    private jwtService;
    constructor(usuariosRepository: Repository<Usuario>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            nombres: string;
            apellidos: string;
            rol: string;
        };
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        user: {
            id: string;
            email: string;
            nombres: string;
            apellidos: string;
            rol: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            nombres: string;
            apellidos: string;
            rol: string;
        };
    }>;
    validateUser(id: string): Promise<Usuario>;
}
