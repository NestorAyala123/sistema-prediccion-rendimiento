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
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const usuario_schema_1 = require("../schemas/usuario.schema");
const estudiante_schema_1 = require("../schemas/estudiante.schema");
let AuthService = class AuthService {
    constructor(usuarioModel, estudianteModel, jwtService) {
        this.usuarioModel = usuarioModel;
        this.estudianteModel = estudianteModel;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const existingUser = await this.usuarioModel.findOne({
            email: registerDto.email,
        }).exec();
        const existingEstudiante = await this.estudianteModel.findOne({
            email: registerDto.email,
        }).exec();
        if (existingUser || existingEstudiante) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        let rol = 'estudiante';
        if (registerDto.email.includes('@admin.')) {
            rol = 'admin';
        }
        else if (registerDto.email.includes('@docente.') || registerDto.email.includes('@profesor.')) {
            rol = 'docente';
        }
        if (rol === 'estudiante') {
            const estudiante = new this.estudianteModel({
                id_estudiante: registerDto.email.split('@')[0],
                email: registerDto.email,
                nombres: registerDto.nombres,
                apellidos: registerDto.apellidos,
                password: hashedPassword,
                activo: true,
            });
            await estudiante.save();
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
        const usuario = new this.usuarioModel({
            email: registerDto.email,
            nombres: registerDto.nombres,
            apellidos: registerDto.apellidos,
            password: hashedPassword,
            rol: rol,
            activo: true,
        });
        await usuario.save();
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
    async updateProfile(userId, dto) {
        const usuario = await this.usuarioModel.findById(userId).exec();
        if (!usuario) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        if (dto.email && dto.email !== usuario.email) {
            const exists = await this.usuarioModel.findOne({ email: dto.email }).exec();
            if (exists) {
                throw new common_1.ConflictException('El email ya está registrado');
            }
            usuario.email = dto.email;
        }
        if (dto.nombres)
            usuario.nombres = dto.nombres;
        if (dto.apellidos)
            usuario.apellidos = dto.apellidos;
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
    async login(loginDto) {
        const usuario = await this.usuarioModel.findOne({
            email: loginDto.email,
        }).exec();
        if (usuario) {
            const isPasswordValid = await bcrypt.compare(loginDto.password, usuario.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Email o contraseña inválidos');
            }
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
        const estudiante = await this.estudianteModel.findOne({
            email: loginDto.email,
        }).exec();
        if (!estudiante) {
            throw new common_1.UnauthorizedException('Email o contraseña inválidos');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, estudiante.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email o contraseña inválidos');
        }
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
    async validateUser(id) {
        return this.usuarioModel.findById(id).exec();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(usuario_schema_1.Usuario.name)),
    __param(1, (0, mongoose_1.InjectModel)(estudiante_schema_1.Estudiante.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map