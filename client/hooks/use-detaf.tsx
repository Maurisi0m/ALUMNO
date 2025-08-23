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
      const data = await response.json();

      if (response.ok && data.success) {
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
      const data = await response.json();

      if (response.ok && data.success) {
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

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "¡Inscripción exitosa!",
          description: data.message,
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
        description: error.message,
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

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Baja exitosa",
          description: data.message,
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
      toast({
        title: "Error en baja",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setEnrolling(false);
    }
  };

  // Verificar elegibilidad para una categoría
  const checkEligibility = async (categoryId: number) => {
    try {
      const response = await authenticatedFetch(`/api/detaf/check-eligibility/${categoryId}`);
      const data = await response.json();

      if (response.ok && data.success) {
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
