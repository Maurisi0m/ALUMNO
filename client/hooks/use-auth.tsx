import { useState, useEffect } from 'react';
import { Usuario } from '@shared/api';

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('sigea-token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener perfil de usuario');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        // Si hay error, limpiar token
        localStorage.removeItem('sigea-token');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem('sigea-token');
    localStorage.removeItem("sigea-language");
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
  };
}
