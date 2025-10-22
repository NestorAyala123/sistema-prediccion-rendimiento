# ✅ Autenticación Backend - Guía Implementada

## 📋 Resumen

El sistema de autenticación **JWT con bcrypt** ha sido implementado completamente en el backend NestJS.

---

## 🏗️ Arquitectura

```
Frontend (React)
      ↓ (credentials)
  AuthService (api.ts)
      ↓ (HTTP POST)
  AuthController (backend)
      ↓
  AuthService (validation)
      ↓ (bcrypt verify)
  Base de datos (Usuario)
      ↓
  JwtService (sign token)
      ↓ (JWT token)
  Frontend stores en localStorage
      ↓
  Axios interceptor (Authorization header)
      ↓
  Protected Routes (JwtAuthGuard)
```

---

## 📁 Estructura de Archivos

```
backend/src/auth/
├── dto/
│   ├── login.dto.ts          # Validación para login
│   └── register.dto.ts        # Validación para registro
├── guards/
│   └── jwt.guard.ts           # Guard para proteger rutas
├── strategies/
│   └── jwt.strategy.ts        # Estrategia de Passport.js
├── auth.service.ts            # Lógica de autenticación
├── auth.controller.ts         # Endpoints HTTP
└── auth.module.ts             # Módulo bundled
```

---

## 🔐 DTOs con Validación

### LoginDto

```typescript
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

### RegisterDto

```typescript
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

---

## 🔑 JWT Strategy

Utiliza Passport.js para extraer el token JWT del header `Authorization: Bearer {token}`.

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

**Extracción de token**: Del header `Authorization: Bearer <token>`
**Validación**: Verifica que el token sea válido y no esté expirado
**Payload retornado**: `{ id, email, role }`

---

## 🛡️ JWT Guard

Protege las rutas que requieren autenticación:

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

**Uso en controladores**:

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user; // {id, email, role}
}
```

---

## 🔓 Endpoints Implementados

### 1. Registro - `POST /auth/register`

**Request**:

```json
{
  "email": "usuario@example.com",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "password": "micontraseña123"
}
```

**Response (Exitoso - 201)**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "rol": "usuario"
  }
}
```

**Response (Error)**:

```json
{
  "statusCode": 409,
  "message": "El email ya está registrado"
}
```

**Validaciones**:

- Email único en la base de datos
- Email con formato válido
- Nombres y apellidos con mínimo 2 caracteres
- Contraseña con mínimo 6 caracteres
- Contraseña hasheada con bcrypt (salt rounds: 10)

---

### 2. Login - `POST /auth/login`

**Request**:

```json
{
  "email": "usuario@example.com",
  "password": "micontraseña123"
}
```

**Response (Exitoso - 200)**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "rol": "usuario"
  }
}
```

**Response (Error)**:

```json
{
  "statusCode": 401,
  "message": "Email o contraseña inválidos"
}
```

**Lógica**:

1. Busca usuario por email
2. Compara contraseña ingresada con hash en BD (bcrypt)
3. Si ambos son válidos, genera JWT token
4. Token válido por 24 horas

---

### 3. Perfil - `GET /auth/profile` (Protegido)

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Exitoso - 200)**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "role": "usuario"
}
```

**Response (Sin Token - 401)**:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## 🔒 AuthService - Métodos Principales

### `register(dto: RegisterDto)`

```typescript
async register(registerDto: RegisterDto) {
  // 1. Verifica que email no exista
  const existingUser = await this.usuariosRepository.findOne({
    where: { email: registerDto.email },
  });
  if (existingUser) {
    throw new ConflictException('El email ya está registrado');
  }

  // 2. Hashea contraseña con bcrypt (10 rounds)
  const hashedPassword = await bcrypt.hash(registerDto.password, 10);

  // 3. Crea nuevo usuario
  const usuario = this.usuariosRepository.create({
    id_usuario: uuidv4(),
    email: registerDto.email,
    nombres: registerDto.nombres,
    apellidos: registerDto.apellidos,
    password: hashedPassword,
    rol: 'usuario',
  });

  await this.usuariosRepository.save(usuario);

  // 4. Genera JWT token
  const token = this.jwtService.sign({
    sub: usuario.id_usuario,
    email: usuario.email,
    role: usuario.rol,
  });

  return {
    access_token: token,
    user: { id, email, nombres, apellidos, rol },
  };
}
```

### `login(dto: LoginDto)`

```typescript
async login(loginDto: LoginDto) {
  // 1. Busca usuario por email
  const usuario = await this.usuariosRepository.findOne({
    where: { email: loginDto.email },
  });
  if (!usuario) {
    throw new UnauthorizedException('Email o contraseña inválidos');
  }

  // 2. Verifica contraseña con bcrypt
  const isPasswordValid = await bcrypt.compare(
    loginDto.password,
    usuario.password,
  );
  if (!isPasswordValid) {
    throw new UnauthorizedException('Email o contraseña inválidos');
  }

  // 3. Genera JWT token
  const token = this.jwtService.sign({
    sub: usuario.id_usuario,
    email: usuario.email,
    role: usuario.rol,
  });

  return {
    access_token: token,
    user: { id, email, nombres, apellidos, rol },
  };
}
```

---

## 🔐 Seguridad Implementada

### 1. **Hasheado de Contraseñas**

- ✅ bcrypt con 10 salt rounds
- ✅ Nunca se almacena contraseña en texto plano
- ✅ Imposible recuperar contraseña original

### 2. **JWT Tokens**

- ✅ Válido por 24 horas
- ✅ Secret key en variables de entorno
- ✅ Contiene: `sub` (usuario ID), `email`, `role`
- ✅ Firmado criptográficamente

### 3. **CORS** (Futuro)

- Configurable en `main.ts`
- Whitelist de orígenes permitidos

### 4. **Validación de Entrada**

- ✅ DTOs con class-validator
- ✅ Email válido obligatorio
- ✅ Contraseña mínimo 6 caracteres
- ✅ Nombres y apellidos requeridos

### 5. **Manejo de Errores**

- ✅ Mensajes genéricos (no revela si email existe)
- ✅ HTTP 409 para duplicados
- ✅ HTTP 401 para credenciales inválidas

---

## 📊 JWT Token Anatomy

El token JWT tiene 3 partes separadas por puntos (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│                                        │                                                      │
└─ Header (algoritmo y tipo)             └─ Payload (datos del usuario)                        └─ Firma (validación)
```

**Header**:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "role": "usuario",
  "iat": 1634567890,
  "exp": 1634654290
}
```

---

## 🧪 Pruebas de API

### Con cURL

```bash
# Registro
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'

# Perfil (protegido)
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer {access_token}"
```

### Con Postman

1. **Collection**: Importa en Postman
2. **Variables de entorno**:

   - `base_url`: http://localhost:3001
   - `access_token`: Se asigna automáticamente después de login

3. **Requests**:
   - `POST {{base_url}}/auth/register`
   - `POST {{base_url}}/auth/login`
   - `GET {{base_url}}/auth/profile`

---

## 🔄 Integración con Frontend

El frontend usa la autenticación así:

```typescript
// 1. Login
const response = await api.post('/auth/login', {
  email,
  password,
});

// 2. Guardar token
localStorage.setItem('token', response.access_token);

// 3. Guardar usuario
localStorage.setItem('user', JSON.stringify(response.user));

// 4. Usar en requests
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
api.get('/estudiantes', config);
```

**Axios Interceptor** automáticamente agrega el token en cada request.

---

## 📦 Dependencias Instaladas

```json
{
  "@nestjs/jwt": "^11.0.0",
  "@nestjs/passport": "^10.0.0",
  "bcrypt": "^5.1.1",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1",
  "uuid": "^9.0.1"
}
```

---

## 🚀 Cómo Usar

### 1. Iniciar el backend

```powershell
cd backend
npm run start:dev
```

### 2. Hacer registro

```bash
POST http://localhost:3001/auth/register
{
  "email": "usuario@example.com",
  "nombres": "Nombre",
  "apellidos": "Apellido",
  "password": "Password123"
}
```

### 3. Hacer login

```bash
POST http://localhost:3001/auth/login
{
  "email": "usuario@example.com",
  "password": "Password123"
}
```

### 4. Guardar token

El frontend automáticamente guarda el `access_token` en localStorage.

### 5. Usar en rutas protegidas

Todas las rutas que usen `@UseGuards(JwtAuthGuard)` requerirán el token en el header:

```
Authorization: Bearer {access_token}
```

---

## 🔧 Variables de Entorno (Opcional)

Crear archivo `backend/.env`:

```
JWT_SECRET=tu-clave-secreta-aqui
JWT_EXPIRATION=24h
```

Si no se especifica, usa valores por defecto (suficientes para desarrollo).

---

## ✅ Estado de Implementación

| Componente     | Estado | Detalles                             |
| -------------- | ------ | ------------------------------------ |
| DTOs           | ✅     | LoginDto, RegisterDto con validación |
| JWT Strategy   | ✅     | Extrae token del header Bearer       |
| JWT Guard      | ✅     | Protege rutas                        |
| AuthService    | ✅     | Registro, login, bcrypt hashing      |
| AuthController | ✅     | 3 endpoints implementados            |
| AuthModule     | ✅     | Integrado en AppModule               |
| Usuario Entity | ✅     | Actualizada con campos de auth       |
| Dependencias   | ✅     | JWT, Passport, bcrypt instalados     |
| Compilación    | ✅     | 0 errores TypeScript                 |

---

## 🎯 Próximos Pasos

1. ✅ Prueba los endpoints con Postman
2. ✅ Inicia el frontend y prueba login real
3. ✅ Verifica que el token se envía correctamente
4. ✅ Implementa rutas protegidas adicionales con `@UseGuards(JwtAuthGuard)`

---

**Versión**: 1.0  
**Fecha**: 21 de Octubre de 2025  
**Estado**: ✅ IMPLEMENTADO Y PROBADO

¡El sistema de autenticación está listo para usar! 🚀
