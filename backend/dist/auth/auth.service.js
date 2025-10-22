"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const usuario_entity_1 = require("../entities/usuario.entity");
let AuthService = class AuthService {
    constructor(usuariosRepository, jwtService) {
        this.usuariosRepository = usuariosRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const existingUser = await this.usuariosRepository.findOne({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const usuario = this.usuariosRepository.create({
            id_usuario: (0, uuid_1.v4)(),
            email: registerDto.email,
            nombres: registerDto.nombres,
            apellidos: registerDto.apellidos,
            password: hashedPassword,
            rol: 'usuario',
        });
        await this.usuariosRepository.save(usuario);
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
    async login(loginDto) {
        const usuario = await this.usuariosRepository.findOne({
            where: { email: loginDto.email },
        });
        if (!usuario) {
            throw new common_1.UnauthorizedException('Email o contraseña inválidos');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, usuario.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email o contraseña inválidos');
        }
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
    async validateUser(id) {
        return this.usuariosRepository.findOne({
            where: { id_usuario: id },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map