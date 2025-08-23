import { getConnection, sql } from '../config/database';

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
  fecha_inscripcion: Date;
}

export interface InscriptionStatus {
  det_inscrito: boolean;
  af_inscrito: boolean;
  det_categoria?: string;
  af_categoria?: string;
  det_inscripcion_id?: number;
  af_inscripcion_id?: number;
}

export class DetAfService {
  
  /**
   * Obtener todas las categorías disponibles con información de cupos
   */
  static async getAvailableCategories(): Promise<DetAfCategory[]> {
    try {
      console.log('🔍 Obteniendo categorías DET/AF disponibles...');
      
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT 
          id,
          tipo,
          nombre,
          descripcion,
          cupo_maximo,
          inscritos_actuales,
          cupos_disponibles,
          tiene_cupo_disponible
        FROM v_categorias_disponibles
        ORDER BY tipo, nombre
      `);

      console.log(`✅ ${result.recordset.length} categorías encontradas`);
      return result.recordset;
    } catch (error) {
      console.error('💥 Error obteniendo categorías:', error);
      throw new Error('Error al obtener categorías DET/AF');
    }
  }

  /**
   * Obtener inscripciones activas de un usuario
   */
  static async getUserInscriptions(userId: number): Promise<UserInscription[]> {
    try {
      console.log(`🔍 Obteniendo inscripciones del usuario ${userId}...`);
      
      const pool = await getConnection();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT 
            inscripcion_id,
            tipo,
            categoria_nombre,
            descripcion,
            fecha_inscripcion
          FROM v_inscripciones_usuario
          WHERE usuario_id = @userId
          ORDER BY tipo
        `);

      console.log(`✅ ${result.recordset.length} inscripciones encontradas para usuario ${userId}`);
      return result.recordset;
    } catch (error) {
      console.error('💥 Error obteniendo inscripciones del usuario:', error);
      throw new Error('Error al obtener inscripciones del usuario');
    }
  }

  /**
   * Obtener estado de inscripciones del usuario (DET/AF)
   */
  static async getUserInscriptionStatus(userId: number): Promise<InscriptionStatus> {
    try {
      const inscriptions = await this.getUserInscriptions(userId);
      
      const status: InscriptionStatus = {
        det_inscrito: false,
        af_inscrito: false
      };

      inscriptions.forEach(inscription => {
        if (inscription.tipo === 'DET') {
          status.det_inscrito = true;
          status.det_categoria = inscription.categoria_nombre;
          status.det_inscripcion_id = inscription.inscripcion_id;
        } else if (inscription.tipo === 'AF') {
          status.af_inscrito = true;
          status.af_categoria = inscription.categoria_nombre;
          status.af_inscripcion_id = inscription.inscripcion_id;
        }
      });

      console.log(`📊 Estado usuario ${userId}:`, status);
      return status;
    } catch (error) {
      console.error('💥 Error obteniendo estado de inscripciones:', error);
      throw new Error('Error al obtener estado de inscripciones');
    }
  }

  /**
   * Inscribir usuario en una categoría
   */
  static async enrollUser(userId: number, categoryId: number) {
    try {
      console.log(`📝 Inscribiendo usuario ${userId} en categoría ${categoryId}...`);
      
      const pool = await getConnection();
      
      // Usar procedimiento almacenado seguro
      const result = await pool.request()
        .input('usuario_id', sql.Int, userId)
        .input('categoria_id', sql.Int, categoryId)
        .execute('sp_inscribir_det_af');

      const response = result.recordset[0];
      console.log(`✅ Inscripción exitosa:`, response);
      
      return {
        success: true,
        message: response.mensaje,
        inscripcion_id: response.inscripcion_id
      };
    } catch (error: any) {
      console.error('💥 Error en inscripción:', error);
      
      // Manejar errores específicos del procedimiento almacenado
      if (error.number === 50001) {
        throw new Error('La categoría seleccionada no existe o está inactiva');
      } else if (error.number === 50002) {
        throw new Error('Ya tienes una inscripción activa en este tipo de categoría. Debes darte de baja primero');
      } else if (error.number === 50003) {
        throw new Error('No hay cupo disponible en esta categoría');
      } else {
        throw new Error('Error al procesar la inscripción');
      }
    }
  }

  /**
   * Dar de baja usuario de una inscripción
   */
  static async unenrollUser(userId: number, inscriptionId: number) {
    try {
      console.log(`📝 Dando de baja usuario ${userId} de inscripción ${inscriptionId}...`);
      
      const pool = await getConnection();
      
      // Usar procedimiento almacenado seguro
      const result = await pool.request()
        .input('usuario_id', sql.Int, userId)
        .input('inscripcion_id', sql.Int, inscriptionId)
        .execute('sp_dar_baja_det_af');

      const response = result.recordset[0];
      console.log(`✅ Baja exitosa:`, response);
      
      return {
        success: true,
        message: response.mensaje
      };
    } catch (error: any) {
      console.error('💥 Error en baja:', error);
      
      // Manejar errores específicos del procedimiento almacenado
      if (error.number === 50004) {
        throw new Error('La inscripción no existe o ya fue dada de baja');
      } else {
        throw new Error('Error al procesar la baja');
      }
    }
  }

  /**
   * Obtener estadísticas generales DET/AF
   */
  static async getGeneralStats() {
    try {
      console.log('📊 Obteniendo estadísticas generales DET/AF...');
      
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT 
          'total_categorias_det' as stat_name,
          COUNT(*) as stat_value
        FROM categorias_det_af 
        WHERE tipo = 'DET' AND activo = 1
        
        UNION ALL
        
        SELECT 
          'total_categorias_af',
          COUNT(*)
        FROM categorias_det_af 
        WHERE tipo = 'AF' AND activo = 1
        
        UNION ALL
        
        SELECT 
          'total_inscripciones_activas',
          COUNT(*)
        FROM inscripciones_det_af 
        WHERE estado = 'activa'
        
        UNION ALL
        
        SELECT 
          'usuarios_con_det',
          COUNT(DISTINCT usuario_id)
        FROM inscripciones_det_af 
        WHERE tipo_categoria = 'DET' AND estado = 'activa'
        
        UNION ALL
        
        SELECT 
          'usuarios_con_af',
          COUNT(DISTINCT usuario_id)
        FROM inscripciones_det_af 
        WHERE tipo_categoria = 'AF' AND estado = 'activa'
      `);

      // Convertir resultado a objeto
      const stats: Record<string, number> = {};
      result.recordset.forEach(row => {
        stats[row.stat_name] = row.stat_value;
      });

      console.log('📈 Estadísticas obtenidas:', stats);
      return stats;
    } catch (error) {
      console.error('💥 Error obteniendo estadísticas:', error);
      throw new Error('Error al obtener estadísticas');
    }
  }

  /**
   * Verificar si un usuario puede inscribirse en una categoría específica
   */
  static async canUserEnroll(userId: number, categoryId: number): Promise<{
    canEnroll: boolean;
    reason?: string;
    categoryInfo?: any;
  }> {
    try {
      console.log(`🔍 Verificando si usuario ${userId} puede inscribirse en categoría ${categoryId}...`);
      
      const pool = await getConnection();
      
      // Obtener información de la categoría
      const categoryResult = await pool.request()
        .input('categoryId', sql.Int, categoryId)
        .query(`
          SELECT 
            tipo,
            nombre,
            cupo_maximo,
            inscritos_actuales,
            cupos_disponibles,
            tiene_cupo_disponible
          FROM v_categorias_disponibles
          WHERE id = @categoryId
        `);

      if (categoryResult.recordset.length === 0) {
        return {
          canEnroll: false,
          reason: 'La categoría no existe o está inactiva'
        };
      }

      const category = categoryResult.recordset[0];

      // Verificar cupo disponible
      if (!category.tiene_cupo_disponible) {
        return {
          canEnroll: false,
          reason: 'No hay cupo disponible en esta categoría',
          categoryInfo: category
        };
      }

      // Verificar si ya tiene inscripción del mismo tipo
      const userStatus = await this.getUserInscriptionStatus(userId);
      
      if (category.tipo === 'DET' && userStatus.det_inscrito) {
        return {
          canEnroll: false,
          reason: `Ya tienes una inscripción activa en DET (${userStatus.det_categoria}). Debes darte de baja primero.`,
          categoryInfo: category
        };
      }

      if (category.tipo === 'AF' && userStatus.af_inscrito) {
        return {
          canEnroll: false,
          reason: `Ya tienes una inscripción activa en AF (${userStatus.af_categoria}). Debes darte de baja primero.`,
          categoryInfo: category
        };
      }

      return {
        canEnroll: true,
        categoryInfo: category
      };
    } catch (error) {
      console.error('💥 Error verificando elegibilidad:', error);
      throw new Error('Error al verificar elegibilidad de inscripción');
    }
  }
}
