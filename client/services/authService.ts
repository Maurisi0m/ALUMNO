const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://tu-servidor.com/api' 
  : 'http://localhost:8080/api';

export interface LoginCredentials {
  matricula: string;
  password: string;
}

export interface User {
  id: number;
  matricula: string;
  email?: string;
  nombre?: string;
  apellido?: string;
  carrera?: string;
  semestre?: number;
  tipo_usuario: string;
}

export class AuthService {
  
  static async login(credentials: LoginCredentials) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en login');
      }

      // Guardar token en localStorage
      localStorage.setItem('sigea-token', data.data.token);
      localStorage.setItem('sigea-user', JSON.stringify(data.data.user));

      return data.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  static async testConnection() {
    try {
      const response = await fetch(`${API_BASE}/test-db`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error probando conexión:', error);
      throw error;
    }
  }

  static logout() {
    localStorage.removeItem('sigea-token');
    localStorage.removeItem('sigea-user');
  }

  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('sigea-user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static getToken(): string | null {
    return localStorage.getItem('sigea-token');
  }
}
