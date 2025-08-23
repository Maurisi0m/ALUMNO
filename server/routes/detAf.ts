import { RequestHandler } from "express";
import { DetAfService } from "../services/detAfService";
import jwt from "jsonwebtoken";

// Interfaz para el token decodificado
interface DecodedToken {
  id: number;
  email: string;
  rol: string;
  iat: number;
  exp: number;
}

/**
 * Middleware de autenticación para rutas DET/AF
 */
export const authenticateToken: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticación requerido'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verificar JWT token
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido o expirado'
      });
    }

    // Agregar información del usuario a la request
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    console.error('Error en autenticación:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

/**
 * GET /api/detaf/categories
 * Obtener todas las categorías DET/AF disponibles
 */
export const handleGetCategories: RequestHandler = async (req, res) => {
  try {
    console.log('📋 Solicitando categorías DET/AF...');
    
    const categories = await DetAfService.getAvailableCategories();

    res.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener categorías'
    });
  }
};

/**
 * GET /api/detaf/my-inscriptions
 * Obtener inscripciones del usuario autenticado
 */
export const handleGetMyInscriptions: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user as DecodedToken;
    console.log(`📋 Solicitando inscripciones del usuario ${user.id}...`);
    
    const inscriptions = await DetAfService.getUserInscriptions(user.id);

    res.json({
      success: true,
      data: inscriptions
    });
  } catch (error: any) {
    console.error('Error obteniendo inscripciones:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener inscripciones'
    });
  }
};

/**
 * GET /api/detaf/my-status
 * Obtener estado de inscripciones del usuario (DET/AF)
 */
export const handleGetMyStatus: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user as DecodedToken;
    console.log(`📊 Solicitando estado de inscripciones del usuario ${user.id}...`);
    
    const status = await DetAfService.getUserInscriptionStatus(user.id);

    res.json({
      success: true,
      data: status
    });
  } catch (error: any) {
    console.error('Error obteniendo estado:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener estado de inscripciones'
    });
  }
};

/**
 * POST /api/detaf/enroll
 * Inscribir usuario en una categoría
 */
export const handleEnroll: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user as DecodedToken;
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        error: 'categoryId es requerido'
      });
    }

    console.log(`📝 Usuario ${user.id} intentando inscribirse en categoría ${categoryId}...`);

    // Verificar elegibilidad antes de inscribir
    const eligibility = await DetAfService.canUserEnroll(user.id, categoryId);
    
    if (!eligibility.canEnroll) {
      return res.status(400).json({
        success: false,
        error: eligibility.reason
      });
    }

    // Proceder con la inscripción
    const result = await DetAfService.enrollUser(user.id, categoryId);

    res.json({
      success: true,
      message: 'Inscripción exitosa',
      data: result
    });
  } catch (error: any) {
    console.error('Error en inscripción:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error al procesar inscripción'
    });
  }
};

/**
 * POST /api/detaf/unenroll
 * Dar de baja usuario de una inscripción
 */
export const handleUnenroll: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user as DecodedToken;
    const { inscriptionId } = req.body;

    if (!inscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'inscriptionId es requerido'
      });
    }

    console.log(`📝 Usuario ${user.id} intentando darse de baja de inscripción ${inscriptionId}...`);

    const result = await DetAfService.unenrollUser(user.id, inscriptionId);

    res.json({
      success: true,
      message: 'Baja exitosa',
      data: result
    });
  } catch (error: any) {
    console.error('Error en baja:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error al procesar baja'
    });
  }
};

/**
 * GET /api/detaf/check-eligibility/:categoryId
 * Verificar si el usuario puede inscribirse en una categoría
 */
export const handleCheckEligibility: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user as DecodedToken;
    const categoryId = parseInt(req.params.categoryId);

    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        error: 'categoryId debe ser un número válido'
      });
    }

    console.log(`🔍 Verificando elegibilidad usuario ${user.id} para categoría ${categoryId}...`);

    const eligibility = await DetAfService.canUserEnroll(user.id, categoryId);

    res.json({
      success: true,
      data: eligibility
    });
  } catch (error: any) {
    console.error('Error verificando elegibilidad:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al verificar elegibilidad'
    });
  }
};

/**
 * GET /api/detaf/stats
 * Obtener estadísticas generales DET/AF
 */
export const handleGetStats: RequestHandler = async (req, res) => {
  try {
    console.log('📊 Solicitando estadísticas generales...');
    
    const stats = await DetAfService.getGeneralStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener estadísticas'
    });
  }
};

/**
 * GET /api/detaf/admin/inscriptions
 * [ADMIN] Obtener todas las inscripciones (solo para administradores)
 */
export const handleGetAllInscriptions: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user as DecodedToken;
    
    // Verificar que sea administrador
    if (user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Solo administradores pueden ver todas las inscripciones'
      });
    }

    console.log('👑 Admin solicitando todas las inscripciones...');
    
    // Para administradores, podríamos obtener todas las inscripciones
    // Por ahora retornamos estadísticas
    const stats = await DetAfService.getGeneralStats();

    res.json({
      success: true,
      message: 'Funcionalidad de administrador disponible',
      data: stats
    });
  } catch (error: any) {
    console.error('Error obteniendo inscripciones (admin):', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener inscripciones'
    });
  }
};
