import { RequestHandler } from 'express';
import { BulkUserService } from '../services/bulkUserService';

/**
 * Crear usuarios de bachillerato masivamente
 * POST /api/bulk-users/bachillerato
 */
export const createBachilleratoUsers: RequestHandler = async (req, res) => {
  try {
    const { 
      startMatricula = 240001, 
      count = 700, 
      distributeYears = ['24', '25'] 
    } = req.body;

    console.log(`🚀 Iniciando creación masiva de ${count} usuarios de bachillerato`);
    console.log(`📝 Matrícula inicial: ${startMatricula}`);
    console.log(`📅 Distribución por años: ${distributeYears.join(', ')}`);

    // Validaciones básicas
    if (count <= 0 || count > 2000) {
      return res.status(400).json({
        success: false,
        message: 'El número de usuarios debe estar entre 1 y 2000'
      });
    }

    if (!Array.isArray(distributeYears) || distributeYears.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar al menos un año para distribución'
      });
    }

    // Ejecutar creación masiva
    const result = await BulkUserService.createBachilleratoUsers(
      startMatricula,
      count,
      distributeYears
    );

    if (result.errors.length > 0) {
      console.warn('⚠️ Se encontraron errores durante la creación:', result.errors);
    }

    res.json({
      success: true,
      message: `Proceso completado: ${result.totalCreated} usuarios creados de ${count} solicitados`,
      data: {
        totalCreated: result.totalCreated,
        totalRequested: count,
        errors: result.errors,
        sample: result.users.slice(0, 5) // Muestra solo los primeros 5 como ejemplo
      }
    });

  } catch (error) {
    console.error('💥 Error en creación masiva de usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Obtener estadísticas de usuarios
 * GET /api/bulk-users/stats
 */
export const getUserStats: RequestHandler = async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas de usuarios...');

    const stats = await BulkUserService.getUserStats();

    // Agrupar estadísticas por área de estudios
    const groupedStats = stats.reduce((acc: any, curr: any) => {
      const area = curr.area_estudios;
      if (!acc[area]) {
        acc[area] = {
          area_estudios: area,
          semestres: [],
          total_usuarios: 0,
          usuarios_activos: 0
        };
      }

      acc[area].semestres.push({
        semestre: curr.semestre,
        total_usuarios: curr.total_usuarios,
        usuarios_activos: curr.usuarios_activos
      });

      acc[area].total_usuarios += curr.total_usuarios;
      acc[area].usuarios_activos += curr.usuarios_activos;

      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        byArea: Object.values(groupedStats),
        raw: stats
      }
    });

  } catch (error) {
    console.error('💥 Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Verificar matrículas disponibles
 * GET /api/bulk-users/check-matriculas/:start/:count
 */
export const checkAvailableMatriculas: RequestHandler = async (req, res) => {
  try {
    const start = parseInt(req.params.start);
    const count = parseInt(req.params.count);

    if (isNaN(start) || isNaN(count) || count <= 0 || count > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Parámetros inválidos'
      });
    }

    // Esta funcionalidad se puede implementar después si es necesaria
    res.json({
      success: true,
      message: 'Verificación de matrículas disponible próximamente',
      data: {
        start,
        count,
        available: true // Por ahora asumimos que están disponibles
      }
    });

  } catch (error) {
    console.error('Error verificando matrículas:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando matrículas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};
