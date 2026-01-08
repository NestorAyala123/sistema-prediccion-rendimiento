import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Soportar tanto 'role' como 'rol'
    const userRole = user.role || user.rol || '';
    
    // Normalizar roles para comparación (admin, administrador, docente, profesor, estudiante)
    const normalizeRole = (role: string): string => {
      const normalized = role.toLowerCase();
      if (normalized === 'administrador') return 'admin';
      if (normalized === 'profesor') return 'docente';
      return normalized;
    };
    
    const normalizedUserRole = normalizeRole(userRole);
    
    const hasRole = requiredRoles.some((role) => {
      const normalizedRequiredRole = normalizeRole(role);
      return normalizedUserRole === normalizedRequiredRole;
    });
    
    if (!hasRole) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    }

    return true;
  }
}
