import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): any;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
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
}
