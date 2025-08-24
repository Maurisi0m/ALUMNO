import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface DetAfCategory {
  id: number;
  tipo: 'DET' | 'AF';
  nombre: string;
  descripcion: string;
  cupo_maximo: number;
  inscritos_actuales: number;
  cupos_disponibles: number;
  tiene_cupo_disponible: boolean;
}

export interface UserInscription {
  inscripcion_id: number;
  tipo: 'DET' | 'AF';
  categoria_nombre: string;
  descripcion: string;
  fecha_inscripcion: string;
}

export interface InscriptionStatus {
  det_inscrito: boolean;
  af_inscrito: boolean;
  det_categoria?: string;
  af_categoria?: string;
  det_inscripcion_id?: number;
  af_inscripcion_id?: number;
}

export function useDetAf() {
  const [categories, setCategories] = useState<DetAfCategory[]>([]);
  const [inscriptions, setInscriptions] = useState<UserInscription[]>([]);
  const [status, setStatus] = useState<InscriptionStatus>({
    det_inscrito: false,
    af_inscrito: false
  });
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const { toast } = useToast();

  // Función para obtener token de manera consistente
  const getToken = () => {
    return localStorage.getItem('sigea-token');
  };

  // Función para hacer requests autenticados
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    return fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  };

  // Cargar categorías disponibles
  const loadCategories = async () => {
    try {
      console.log('🔍 Cargando categorías DET/AF...');
      
      const response = await fetch('/api/detaf/categories');
      const data = await response.json();

      if (response.ok && data.success) {
        setCategories(data.data);
        console.log(`✅ ${data.data.length} categorías cargadas`);
      } else {
        throw new Error(data.error || 'Error cargando categorías');
      }
    } catch (error: any) {
      console.error('💥 Error cargando categorías:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive"
      });
    }
  };

  // Cargar inscripciones del usuario
  const loadMyInscriptions = async () => {
    try {
      console.log('🔍 Cargando mis inscripciones...');

      const response = await authenticatedFetch('/api/detaf/my-inscriptions');

      if (!response.ok) {
        throw new Error('Error cargando inscripciones');
      }

      const data = await response.json();

      if (data.success) {
        setInscriptions(data.data);
        console.log(`✅ ${data.data.length} inscripciones cargadas`);
      } else {
        throw new Error(data.error || 'Error cargando inscripciones');
      }
    } catch (error: any) {
      console.error('💥 Error cargando inscripciones:', error);
      if (error.message.includes('token')) {
        toast({
          title: "Sesión expirada",
          description: "Por favor inicia sesión nuevamente",
          variant: "destructive"
        });
      }
    }
  };

  // Cargar estado de inscripciones
  const loadMyStatus = async () => {
    try {
      console.log('📊 Cargando estado de inscripciones...');

      const response = await authenticatedFetch('/api/detaf/my-status');

      if (!response.ok) {
        throw new Error('Error cargando estado');
      }

      const data = await response.json();

      if (data.success) {
        setStatus(data.data);
        console.log('✅ Estado cargado:', data.data);
      } else {
        throw new Error(data.error || 'Error cargando estado');
      }
    } catch (error: any) {
      console.error('💥 Error cargando estado:', error);
    }
  };

  // Inscribirse en una categoría
  const enroll = async (categoryId: number): Promise<boolean> => {
    try {
      setEnrolling(true);
      console.log(`📝 Inscribiéndose en categoría ${categoryId}...`);

      const response = await authenticatedFetch('/api/detaf/enroll', {
        method: 'POST',
        body: JSON.stringify({ categoryId }),
      });

      // Check if response is ok and has content before reading JSON
      if (!response.ok) {
        // For non-ok responses, try to read error message if possible
        let errorMessage = 'Error en inscripción';
        try {
          if (response.headers.get('content-type')?.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            errorMessage = await response.text() || errorMessage;
          }
        } catch (readError) {
          console.warn('Could not read error response:', readError);
        }
        throw new Error(errorMessage);
      }

      // Clone response to avoid "body stream already read" error
      const responseClone = response.clone();
      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        console.warn('Failed to parse JSON, trying with cloned response:', jsonError);
        try {
          data = await responseClone.json();
        } catch (cloneError) {
          console.error('Failed to parse JSON from both responses:', cloneError);
          throw new Error('Respuesta del servidor inválida');
        }
      }

      if (data.success) {
        toast({
          title: "¡Inscripción exitosa!",
          description: data.message || "Te has inscrito exitosamente",
          variant: "default"
        });

        // Recargar datos
        await Promise.all([
          loadCategories(),
          loadMyInscriptions(),
          loadMyStatus()
        ]);

        return true;
      } else {
        throw new Error(data.error || 'Error en inscripción');
      }
    } catch (error: any) {
      console.error('💥 Error en inscripción:', error);
      toast({
        title: "Error en inscripción",
        description: error.message || "Ocurrió un error al procesar la inscripción",
        variant: "destructive"
      });
      return false;
    } finally {
      setEnrolling(false);
    }
  };

  // Darse de baja de una inscripción
  const unenroll = async (inscriptionId: number): Promise<boolean> => {
    try {
      setEnrolling(true);
      console.log(`📝 Dándose de baja de inscripción ${inscriptionId}...`);

      const response = await authenticatedFetch('/api/detaf/unenroll', {
        method: 'POST',
        body: JSON.stringify({ inscriptionId }),
      });

      // Check if response is ok and has content before reading JSON
      if (!response.ok) {
        // For non-ok responses, try to read error message if possible
        let errorMessage = 'Error en baja';
        try {
          if (response.headers.get('content-type')?.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            errorMessage = await response.text() || errorMessage;
          }
        } catch (readError) {
          console.warn('Could not read error response:', readError);
        }
        throw new Error(errorMessage);
      }

      // Clone response to avoid "body stream already read" error
      const responseClone = response.clone();
      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        console.warn('Failed to parse JSON, trying with cloned response:', jsonError);
        try {
          data = await responseClone.json();
        } catch (cloneError) {
          console.error('Failed to parse JSON from both responses:', cloneError);
          throw new Error('Respuesta del servidor inválida');
        }
      }

      if (data.success) {
        toast({
          title: "Baja exitosa",
          description: data.message || "Te has dado de baja exitosamente",
          variant: "default"
        });

        // Recargar datos
        await Promise.all([
          loadCategories(),
          loadMyInscriptions(),
          loadMyStatus()
        ]);

        return true;
      } else {
        throw new Error(data.error || 'Error en baja');
      }
    } catch (error: any) {
      console.error('💥 Error en baja:', error);

      let errorMessage = error.message || "Ocurrió un error al procesar la baja";
      let shouldRefresh = false;

      // Handle specific database constraint errors
      if (error.message.includes('UNIQUE KEY constraint') ||
          error.message.includes('UQ_Usuario_DET') ||
          error.message.includes('Ya te has dado de baja') ||
          error.message.includes('ya fue dada de baja') ||
          error.message.includes('no existe o ya')) {
        errorMessage = "Ya te has dado de baja anteriormente. Actualizando datos...";
        shouldRefresh = true;
      } else if (error.message.includes('no pertenece al usuario')) {
        errorMessage = "Esta inscripción no te pertenece";
        shouldRefresh = true;
      }

      // Show appropriate message
      toast({
        title: shouldRefresh ? "Información" : "Error en baja",
        description: errorMessage,
        variant: shouldRefresh ? "default" : "destructive"
      });

      // Force refresh data if needed
      if (shouldRefresh) {
        setTimeout(() => {
          loadAllData();
        }, 1000);
        return true; // Consider it successful since data will be refreshed
      }

      return false;
    } finally {
      setEnrolling(false);
    }
  };

  // Verificar elegibilidad para una categoría
  const checkEligibility = async (categoryId: number) => {
    try {
      const response = await authenticatedFetch(`/api/detaf/check-eligibility/${categoryId}`);

      if (!response.ok) {
        throw new Error('Error verificando elegibilidad');
      }

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Error verificando elegibilidad');
      }
    } catch (error: any) {
      console.error('💥 Error verificando elegibilidad:', error);
      return { canEnroll: false, reason: error.message };
    }
  };

  // Cargar todos los datos iniciales
  const loadAllData = async () => {
    try {
      setLoading(true);
      
      await loadCategories();
      
      // Solo cargar datos del usuario si hay token
      const token = getToken();
      if (token) {
        await Promise.all([
          loadMyInscriptions(),
          loadMyStatus()
        ]);
      }
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    } finally {
      setLoading(false);
    }
  };

  // Separar categorías por tipo
  const detCategories = categories.filter(cat => cat.tipo === 'DET');
  const afCategories = categories.filter(cat => cat.tipo === 'AF');

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadAllData();
  }, []);

  return {
    // Estados
    categories,
    detCategories,
    afCategories,
    inscriptions,
    status,
    loading,
    enrolling,

    // Acciones
    enroll,
    unenroll,
    checkEligibility,
    refreshData: loadAllData,

    // Utilidades
    isEnrolledInDET: status.det_inscrito,
    isEnrolledInAF: status.af_inscrito,
    canEnrollInDET: !status.det_inscrito,
    canEnrollInAF: !status.af_inscrito,
  };
}
