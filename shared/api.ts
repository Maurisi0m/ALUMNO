/**
 * Código compartido entre cliente y servidor
 * Útil para compartir tipos entre cliente y servidor
 * y/o pequeñas funciones JS puras que pueden usarse tanto en cliente como servidor
 */

/**
 * Tipo de respuesta de ejemplo para /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Interfaz para datos de usuario
 */
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'estudiante' | 'admin';
  matricula: string;
  area_estudios: 'Medicina' | 'Arquitectura' | 'Administración';
  semestre: number;
  activo: boolean;
}

/**
 * Interfaz para login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interfaz para login response
 */
export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: Usuario;
  message?: string;
}

/**
 * Interfaz para calificaciones
 */
export interface Calificacion {
  id: number;
  materia: string;
  codigo: string;
  calificacion: number;
  creditos: number;
}

/**
 * Interfaz para perfil de usuario
 */
export interface PerfilResponse {
  user: Usuario;
  calificaciones: Calificacion[];
}
