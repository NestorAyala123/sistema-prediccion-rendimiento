/**
 * Utilidades para normalización de roles en el sistema
 * Centraliza la lógica de normalización para mantener consistencia
 */

export type UserRole = 'admin' | 'docente' | 'estudiante';

/**
 * Normaliza un rol de usuario para comparación y uso consistente
 * @param role - Rol en cualquier formato (admin, administrador, docente, profesor, etc.)
 * @returns Rol normalizado: 'admin', 'docente' o 'estudiante'
 */
export const normalizeRole = (role: string | undefined | null): UserRole => {
  if (!role) return 'estudiante';
  
  const normalized = role.toLowerCase().trim();
  
  // Mapear variantes al rol normalizado
  if (normalized === 'administrador' || normalized === 'admin') {
    return 'admin';
  }
  
  if (normalized === 'profesor' || normalized === 'docente') {
    return 'docente';
  }
  
  return 'estudiante';
};

/**
 * Obtiene el rol del usuario desde el objeto user (soporta 'role' o 'rol')
 * @param user - Objeto de usuario
 * @returns Rol normalizado
 */
export const getUserRole = (user: any): UserRole => {
  return normalizeRole(user?.role || user?.rol);
};

/**
 * Obtiene el prefijo de ruta según el rol del usuario
 * @param role - Rol del usuario (normalizado o sin normalizar)
 * @returns Prefijo de ruta: '/admin', '/docente' o '/estudiante'
 */
export const getRolePrefix = (role: string | undefined | null): string => {
  const normalized = normalizeRole(role);
  
  switch (normalized) {
    case 'admin':
      return '/admin';
    case 'docente':
      return '/docente';
    case 'estudiante':
      return '/estudiante';
    default:
      return '/estudiante';
  }
};

/**
 * Verifica si un usuario tiene uno de los roles especificados
 * @param userRole - Rol del usuario
 * @param allowedRoles - Roles permitidos
 * @returns true si el usuario tiene uno de los roles permitidos
 */
export const hasRole = (userRole: string | undefined | null, allowedRoles: string[]): boolean => {
  const normalizedUserRole = normalizeRole(userRole);
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole);
  
  return normalizedAllowedRoles.includes(normalizedUserRole);
};

/**
 * Obtiene el dashboard path según el rol
 * @param role - Rol del usuario
 * @returns Ruta al dashboard correspondiente
 */
export const getDashboardPath = (role: string | undefined | null): string => {
  return `${getRolePrefix(role)}/dashboard`;
};
