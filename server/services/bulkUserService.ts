import { getConnection, sql } from '../config/database';
import bcrypt from 'bcryptjs';

export interface BulkUserCreationResult {
  totalCreated: number;
  errors: string[];
  users: any[];
}

export class BulkUserService {
  
  /**
   * Genera usuarios masivamente para bachillerato
   * @param startMatricula Matrícula inicial (ej: 240001)
   * @param count Cantidad de usuarios a crear
   * @param distributeYears Array de años para distribuir (ej: ['24', '25'])
   */
  static async createBachilleratoUsers(
    startMatricula: number, 
    count: number,
    distributeYears: string[] = ['24', '25']
  ): Promise<BulkUserCreationResult> {
    
    const result: BulkUserCreationResult = {
      totalCreated: 0,
      errors: [],
      users: []
    };

    try {
      const pool = await getConnection();
      
      // Verificar qué matrículas ya existen
      const existingMatriculas = await pool.request()
        .query(`
          SELECT matricula FROM usuarios 
          WHERE matricula LIKE '${startMatricula.toString().substring(0, 2)}%'
        `);
      
      const existing = new Set(existingMatriculas.recordset.map(r => r.matricula));
      
      // Generar datos para los usuarios
      const usersToCreate = [];
      let currentMatricula = startMatricula;
      
      for (let i = 0; i < count; i++) {
        // Saltar matrículas existentes
        while (existing.has(currentMatricula.toString())) {
          currentMatricula++;
        }
        
        // Determinar año de ingreso (24 o 25)
        const yearIndex = i % distributeYears.length;
        const year = distributeYears[yearIndex];
        
        // Determinar semestre (1-6)
        const semestre = (i % 6) + 1;
        
        // Construir matrícula con formato: año + número secuencial
        const matricula = year + currentMatricula.toString().substring(2);
        
        // Generar nombre aleatorio pero realista
        const nombres = [
          'Ana María', 'José Luis', 'María Carmen', 'Carlos Alberto', 'Laura Isabel',
          'Miguel Ángel', 'Carmen Rosa', 'Francisco Javier', 'Isabel Cristina', 'Roberto Carlos',
          'Patricia Elena', 'Eduardo Manuel', 'Rosa María', 'Fernando José', 'Guadalupe',
          'Ricardo Antonio', 'Silvia Esperanza', 'Alejandro', 'Mónica Adriana', 'Sergio',
          'Leticia', 'Raúl Ernesto', 'Norma Alicia', 'Víctor Hugo', 'Adriana',
          'Óscar René', 'Claudia Patricia', 'Jesús Manuel', 'Verónica', 'Daniel',
          'Gloria Elena', 'Arturo', 'Margarita', 'Enrique', 'Blanca Estela'
        ];
        
        const apellidos = [
          'García López', 'Martínez Rodríguez', 'López Hernández', 'González Martínez', 'Hernández García',
          'Rodríguez González', 'Pérez López', 'Sánchez Martínez', 'Ramírez Hernández', 'Cruz García',
          'Morales Rodríguez', 'Jiménez López', 'Ruiz González', 'Díaz Martínez', 'Vargas Hernández',
          'Castro García', 'Ortega Rodríguez', 'Ramos López', 'Vásquez González', 'Torres Martínez',
          'Flores Hernández', 'Rivera García', 'Gómez Rodríguez', 'Mendoza López', 'Aguilar González',
          'Silva Martínez', 'Castillo Hernández', 'Guerrero García', 'Medina Rodríguez', 'Romero López'
        ];
        
        const nombreCompleto = `${nombres[i % nombres.length]} ${apellidos[i % apellidos.length]}`;
        const email = `${matricula}@estudiantes.lasalle.mx`;
        
        usersToCreate.push({
          nombre: nombreCompleto,
          email: email,
          password: '1234', // Contraseña por defecto
          rol: 'estudiante',
          matricula: matricula,
          area_estudios: 'Bachillerato',
          semestre: semestre
        });
        
        currentMatricula++;
      }
      
      // Insertar usuarios en lotes para mejor rendimiento
      const batchSize = 50;
      for (let i = 0; i < usersToCreate.length; i += batchSize) {
        const batch = usersToCreate.slice(i, i + batchSize);
        
        try {
          await this.insertUserBatch(pool, batch);
          result.totalCreated += batch.length;
          result.users.push(...batch);
        } catch (error) {
          const errorMsg = `Error insertando lote ${Math.floor(i/batchSize) + 1}: ${error}`;
          result.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
      
      console.log(`✅ Proceso completado: ${result.totalCreated} usuarios creados de ${count} solicitados`);
      
      return result;
      
    } catch (error) {
      result.errors.push(`Error general: ${error}`);
      console.error('💥 Error en creación masiva:', error);
      return result;
    }
  }
  
  /**
   * Inserta un lote de usuarios en la base de datos
   */
  private static async insertUserBatch(pool: any, users: any[]) {
    const transaction = pool.transaction();
    
    try {
      await transaction.begin();
      
      for (const userData of users) {
        // Hash simple de contraseña para desarrollo
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        await transaction.request()
          .input('nombre', sql.VarChar, userData.nombre)
          .input('email', sql.VarChar, userData.email)
          .input('password', sql.VarChar, hashedPassword)
          .input('rol', sql.VarChar, userData.rol)
          .input('matricula', sql.VarChar, userData.matricula)
          .input('area_estudios', sql.VarChar, userData.area_estudios)
          .input('semestre', sql.Int, userData.semestre)
          .input('activo', sql.Bit, 1)
          .query(`
            INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo)
            VALUES (@nombre, @email, @password, @rol, @matricula, @area_estudios, @semestre, @activo)
          `);
      }
      
      await transaction.commit();
      console.log(`✅ Lote de ${users.length} usuarios insertado correctamente`);
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  /**
   * Obtiene estadísticas de usuarios por área de estudios
   */
  static async getUserStats() {
    try {
      const pool = await getConnection();
      
      const result = await pool.request()
        .query(`
          SELECT 
            area_estudios,
            semestre,
            COUNT(*) as total_usuarios,
            COUNT(CASE WHEN activo = 1 THEN 1 END) as usuarios_activos
          FROM usuarios
          WHERE rol = 'estudiante'
          GROUP BY area_estudios, semestre
          ORDER BY area_estudios, semestre
        `);
      
      return result.recordset;
      
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
}
