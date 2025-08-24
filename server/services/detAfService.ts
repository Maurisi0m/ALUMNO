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

      // Verificar que la categoría existe y obtener información
      const categoryResult = await pool.request()
        .input('categoryId', sql.Int, categoryId)
        .query(`
          SELECT id, tipo, nombre, cupo_maximo, activo
          FROM categorias_det_af
          WHERE id = @categoryId
        `);

      if (categoryResult.recordset.length === 0) {
        throw new Error('La categoría seleccionada no existe');
      }

      const category = categoryResult.recordset[0];

      if (!category.activo) {
        throw new Error('La categoría seleccionada no está disponible');
      }

      // Verificar que el usuario no tenga ya una inscripción activa del mismo tipo
      const existingResult = await pool.request()
        .input('userId', sql.Int, userId)
        .input('tipo', sql.NVarChar(10), category.tipo)
        .query(`
          SELECT id, categoria_id
          FROM inscripciones_det_af
          WHERE usuario_id = @userId
          AND tipo_categoria = @tipo
          AND estado = 'activa'
        `);

      if (existingResult.recordset.length > 0) {
        throw new Error(`Ya tienes una inscripción activa en ${category.tipo}. Debes darte de baja primero`);
      }

      // Verificar cupo disponible
      const cupoResult = await pool.request()
        .input('categoryId', sql.Int, categoryId)
        .query(`
          SELECT
            c.cupo_maximo,
            COUNT(i.id) as inscritos_actuales
          FROM categorias_det_af c
          LEFT JOIN inscripciones_det_af i ON c.id = i.categoria_id AND i.estado = 'activa'
          WHERE c.id = @categoryId
          GROUP BY c.cupo_maximo
        `);

      const cupoInfo = cupoResult.recordset[0];

      if (cupoInfo.inscritos_actuales >= cupoInfo.cupo_maximo) {
        throw new Error('No hay cupo disponible en esta categoría');
      }

      // Proceder con la inscripción
      const insertResult = await pool.request()
        .input('userId', sql.Int, userId)
        .input('categoryId', sql.Int, categoryId)
        .input('tipo', sql.NVarChar(10), category.tipo)
        .query(`
          INSERT INTO inscripciones_det_af (usuario_id, categoria_id, tipo_categoria, estado, fecha_inscripcion)
          VALUES (@userId, @categoryId, @tipo, 'activa', GETDATE());

          SELECT SCOPE_IDENTITY() as inscripcion_id;
        `);

      const inscripcionId = insertResult.recordset[0].inscripcion_id;

      console.log(`✅ Inscripción exitosa: ${inscripcionId}`);

      return {
        success: true,
        message: `Te has inscrito exitosamente en ${category.nombre}`,
        inscripcion_id: inscripcionId
      };
    } catch (error: any) {
      console.error('💥 Error en inscripción:', error);

      // Manejar errores específicos
      if (error.message.includes('no existe')) {
        throw new Error('La categoría seleccionada no existe o está inactiva');
      } else if (error.message.includes('Ya tienes una inscripción')) {
        throw new Error(error.message);
      } else if (error.message.includes('No hay cupo')) {
        throw new Error('No hay cupo disponible en esta categoría');
      } else if (error.number === 2627) { // Constraint violation
        throw new Error('Ya tienes una inscripción activa en este tipo de categoría');
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

      // Primero verificar que la inscripción existe y está activa
      const checkResult = await pool.request()
        .input('userId', sql.Int, userId)
        .input('inscriptionId', sql.Int, inscriptionId)
        .query(`
          SELECT id, tipo_categoria, estado
          FROM inscripciones_det_af
          WHERE id = @inscriptionId
          AND usuario_id = @userId
        `);

      if (checkResult.recordset.length === 0) {
        throw new Error('La inscripción no existe o no pertenece al usuario');
      }

      const inscription = checkResult.recordset[0];

      if (inscription.estado !== 'activa') {
        // Si ya está dada de baja, no es error - simplemente retornar éxito
        console.log(`ℹ️ Inscripción ${inscriptionId} ya estaba dada de baja`);
        return {
          success: true,
          message: 'Ya te habías dado de baja anteriormente'
        };
      }

      // Proceder con la baja usando UPDATE directo (más seguro que procedimiento almacenado)
      const updateResult = await pool.request()
        .input('userId', sql.Int, userId)
        .input('inscriptionId', sql.Int, inscriptionId)
        .query(`
          UPDATE inscripciones_det_af
          SET estado = 'baja', fecha_baja = GETDATE()
          WHERE id = @inscriptionId
          AND usuario_id = @userId
          AND estado = 'activa'
        `);

      if (updateResult.rowsAffected[0] === 0) {
        throw new Error('No se pudo procesar la baja - inscripción no encontrada o ya inactiva');
      }

      console.log(`✅ Baja exitosa para inscripción ${inscriptionId}`);

      return {
        success: true,
        message: 'Te has dado de baja exitosamente'
      };
    } catch (error: any) {
      console.error('💥 Error en baja:', error);

      // Manejar errores específicos
      if (error.number === 2627) { // Constraint violation
        // Este caso no debería ocurrir con UPDATE, pero por si acaso
        throw new Error('Ya te has dado de baja anteriormente');
      } else if (error.number === 50004) {
        throw new Error('La inscripción no existe o ya fue dada de baja');
      } else if (error.message.includes('no existe') || error.message.includes('no pertenece')) {
        throw new Error(error.message);
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
