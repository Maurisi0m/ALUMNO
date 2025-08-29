import { RequestHandler } from 'express';
import { BulkUserService } from '../services/bulkUserService';

/**
 * Ejecutar creación inmediata de usuarios de bachillerato
 * GET /api/execute/create-bachillerato
 */
export const executeCreateBachillerato: RequestHandler = async (req, res) => {
  try {
    console.log('🚀 EJECUTANDO CREACIÓN MASIVA DE 700 USUARIOS DE BACHILLERATO');
    
    // Configuración para crear 700 usuarios
    const config = {
      startMatricula: 240001,
      count: 700,
      distributeYears: ['24', '25']
    };
    
    console.log('📋 Configuración:', config);
    
    // Ejecutar creación
    const result = await BulkUserService.createBachilleratoUsers(
      config.startMatricula,
      config.count,
      config.distributeYears
    );
    
    console.log('✅ PROCESO COMPLETADO');
    console.log(`👥 Usuarios creados: ${result.totalCreated} de ${config.count}`);
    console.log(`❌ Errores: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.log('🚨 Errores encontrados:');
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    // Obtener estadísticas después de crear
    const stats = await BulkUserService.getUserStats();
    const bachilleratoStats = stats.filter(s => s.area_estudios === 'Bachillerato');
    
    res.json({
      success: true,
      message: `✅ CREACIÓN COMPLETADA: ${result.totalCreated} usuarios de bachillerato creados`,
      creationResult: {
        totalCreated: result.totalCreated,
        totalRequested: config.count,
        errors: result.errors,
        sampleUsers: result.users.slice(0, 10) // Mostrar 10 ejemplos
      },
      bachilleratoStats: bachilleratoStats
    });
    
  } catch (error) {
    console.error('💥 ERROR EN CREACIÓN MASIVA:', error);
    res.status(500).json({
      success: false,
      message: 'Error ejecutando creación masiva',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};
