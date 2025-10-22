# 📋 Guía para Implementar Endpoints de Autenticación en el Backend

## 🚨 Error Detectado

```
Register.tsx:54  POST http://localhost:3001/auth/register 404 (Not Found)
```

El error 404 indica que los endpoints `/auth/login` y `/auth/register` no existen en el backend NestJS.

## ✅ Solución: Crear Módulo de Autenticación

### Paso 1: Crear el módulo Auth

```bash
cd backend
nest generate module auth
nest generate service auth/services/auth
nest generate controller auth/controllers/auth
```

### Paso 2: Crear DTOs (Data Transfer Objects)

Crear archivo: `backend/src/auth/dto/login.dto.ts`

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

Crear archivo: `backend/src/auth/dto/register.dto.ts`

```typescript
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
```

### Paso 3: Implementar AuthService

Archivo: `backend/src/auth/services/auth.service.ts`

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../../entities/usuario.entity';

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
      throw new UnauthorizedException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear nuevo usuario
    const usuario = this.usuariosRepository.create({
      email: registerDto.email,
      nombres: registerDto.nombres,
      apellidos: registerDto.apellidos,
      password: hashedPassword,
      rol: 'usuario', // Rol por defecto
    });

    await this.usuariosRepository.save(usuario);

    // Generar token JWT
    const token = this.jwtService.sign({
      sub: usuario.id_usuario,
      email: usuario.email,
    });

    return {
      access_token: token,
      user: {
        id: usuario.id_usuario,
        email: usuario.email,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
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
    });

    return {
      access_token: token,
      user: {
        id: usuario.id_usuario,
        email: usuario.email,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
      },
    };
  }

  async validateUser(id: string) {
    return this.usuariosRepository.findOne({
      where: { id_usuario: id },
    });
  }
}
```

### Paso 4: Crear AuthController

Archivo: `backend/src/auth/controllers/auth.controller.ts`

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

### Paso 5: Crear JWT Strategy

Archivo: `backend/src/auth/strategies/jwt.strategy.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    return this.authService.validateUser(payload.sub);
  }
}
```

### Paso 6: Crear Guard

Archivo: `backend/src/auth/guards/jwt.guard.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### Paso 7: Actualizar AuthModule

Archivo: `backend/src/auth/auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Usuario } from '../entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
```

### Paso 8: Importar AuthModule en AppModule

Archivo: `backend/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EstudiantesModule } from './modules/estudiantes/estudiantes.module';
// ... otras importaciones

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // ... configuración
    }),
    AuthModule, // ← Agregar aquí
    EstudiantesModule,
    // ... otros módulos
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Paso 9: Instalar dependencias necesarias

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install --save-dev @types/passport-jwt
```

### Paso 10: Variables de entorno

Crear o actualizar `.env` en la raíz del backend:

```
JWT_SECRET=your-super-secret-key-change-in-production
DATABASE_URL=sqlite:./database.db
PORT=3001
```

### Paso 11: Proteger rutas

Para proteger rutas con JWT, usaen el controlador:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Get('estudiantes')
async getEstudiantes() {
  // Solo usuarios autenticados
}
```

## 🧪 Pruebas

### Con cURL

```bash
# Registro
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@test.com","nombres":"Juan","apellidos":"Pérez","password":"password123"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@test.com","password":"password123"}'

# Acceder a ruta protegida
curl -X GET http://localhost:3001/estudiantes \
  -H "Authorization: Bearer <token>"
```

### Con Postman

1. **POST /auth/register**
   - Body: JSON con email, nombres, apellidos, password
2. **POST /auth/login**
   - Body: JSON con email y password
3. **GET /estudiantes** (protegida)
   - Headers: Authorization: Bearer <access_token>

## 📌 Notas Importantes

1. **JWT_SECRET**: Cambiar en producción a una clave segura
2. **Tiempo de expiración**: Configurable en JwtModule
3. **Validaciones**: Usar class-validator para validar DTOs
4. **Hashing**: Usar bcrypt para contraseñas (NUNCA almacenar en texto plano)
5. **CORS**: Habilitar CORS en main.ts si es necesario

```typescript
// En main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

## ✅ Checklist

- [ ] Crear AuthModule
- [ ] Crear DTOs (LoginDto, RegisterDto)
- [ ] Implementar AuthService
- [ ] Crear AuthController
- [ ] Crear JwtStrategy
- [ ] Crear JwtAuthGuard
- [ ] Instalar dependencias (jwt, passport, bcrypt)
- [ ] Configurar variables de entorno
- [ ] Importar AuthModule en AppModule
- [ ] Probar endpoints con Postman/cURL
- [ ] Proteger rutas sensibles

---

**Nota**: El frontend ya está configurado para funcionar en modo demo sin backend. Una vez implementes estos endpoints, el login/registro funcionarán con tu base de datos real.
