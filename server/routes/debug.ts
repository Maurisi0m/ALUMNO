import { RequestHandler } from "express";
import { getConnection, sql } from '../config/database';

// Endpoint para diagnóstico completo de la base de datos
export const handleFullDatabaseDebug: RequestHandler = async (req, res) => {
  try {
    const pool = await getConnection();
    
    console.log('🔍 Iniciando diagnóstico completo de base de datos...');
    
    // 1. Verificar conexión
    const connectionTest = await pool.request().query('SELECT 1 as test');
    console.log('✅ Conexión a BD exitosa');

    // 2. Verificar si existen las tablas
    const tablesCheck = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);
    
    console.log('📋 Tablas encontradas:', tablesCheck.recordset.map(t => t.TABLE_NAME));

    // 3. Verificar usuarios (todos)
    const allUsers = await pool.request().query(`
      SELECT id, nombre, email, matricula, area_estudios, semestre, activo 
      FROM usuarios
    `);
    
    console.log('👥 Usuarios en BD:', allUsers.recordset);

    // 4. Verificar usuario específico Mauro
    const mauroUser = await pool.request()
      .input('email', sql.VarChar, '240088@lasallep.mx')
      .query(`
        SELECT id, nombre, email, password, matricula, area_estudios, semestre, activo 
        FROM usuarios 
        WHERE email = @email
      `);
    
    console.log('👤 Usuario Mauro encontrado:', mauroUser.recordset);

    // 5. Test de login directo
    const loginTest = await pool.request()
      .input('email', sql.VarChar, '240088@lasallep.mx')
      .input('password', sql.VarChar, '1234')
      .query(`
        SELECT id, nombre, email, rol, matricula, area_estudios, semestre, activo
        FROM usuarios
        WHERE email = @email AND password = @password AND activo = 1
      `);
    
    console.log('🔐 Test login directo:', loginTest.recordset);

    // 6. Verificar materias
    const materias = await pool.request().query(`
      SELECT id, nombre, codigo, creditos, semestre, area_estudios 
      FROM materias 
      WHERE area_estudios = 'Arquitectura' AND semestre = 3
    `);
    
    console.log('📚 Materias Arquitectura 3er:', materias.recordset);

    // 7. Verificar calificaciones
    let calificaciones = [];
    if (mauroUser.recordset.length > 0) {
      const userId = mauroUser.recordset[0].id;
      const calificacionesResult = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT 
            c.id,
            m.codigo,
            m.nombre as materia,
            m.creditos,
            c.calificacion,
            c.tipo_evaluacion,
            c.porcentaje
          FROM calificaciones c
          INNER JOIN materias m ON c.materia_id = m.id
          WHERE c.usuario_id = @userId
        `);
      
      calificaciones = calificacionesResult.recordset;
      console.log('📊 Calificaciones de Mauro:', calificaciones);
    }

    // 8. Verificar variables de entorno
    const envConfig = {
      SQL_SERVER: process.env.SQL_SERVER,
      SQL_DATABASE: process.env.SQL_DATABASE,
      SQL_USER: process.env.SQL_USER,
      SQL_PORT: process.env.SQL_PORT,
      JWT_SECRET: !!process.env.JWT_SECRET
    };
    
    console.log('⚙️ Config ENV:', envConfig);

    // Respuesta del diagnóstico
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      diagnostico: {
        conexion: 'OK',
        tablas: tablesCheck.recordset.map(t => t.TABLE_NAME),
        usuarios: {
          total: allUsers.recordset.length,
          lista: allUsers.recordset
        },
        usuarioMauro: {
          encontrado: mauroUser.recordset.length > 0,
          datos: mauroUser.recordset[0] || null
        },
        testLogin: {
          exitoso: loginTest.recordset.length > 0,
          usuario: loginTest.recordset[0] || null
        },
        materias: {
          total: materias.recordset.length,
          lista: materias.recordset
        },
        calificaciones: {
          total: calificaciones.length,
          lista: calificaciones.slice(0, 5) // Solo primeras 5 para no saturar
        },
        configuracion: envConfig
      }
    });

  } catch (error: any) {
    console.error('💥 Error en diagnóstico:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      sqlState: error.originalError?.info?.state,
      sqlNumber: error.originalError?.info?.number
    });
  }
};

// Endpoint para crear usuario forzado
export const handleForceCreateUser: RequestHandler = async (req, res) => {
  try {
    const pool = await getConnection();
    
    console.log('🔧 Creando usuario forzado...');

    // Eliminar usuario si existe
    await pool.request()
      .input('email', sql.VarChar, '240088@lasallep.mx')
      .query('DELETE FROM calificaciones WHERE usuario_id IN (SELECT id FROM usuarios WHERE email = @email)');
      
    await pool.request()
      .input('email', sql.VarChar, '240088@lasallep.mx')
      .query('DELETE FROM usuarios WHERE email = @email');

    // Crear usuario nuevo
    const createResult = await pool.request()
      .input('nombre', sql.VarChar, 'Mauro Ortiz')
      .input('email', sql.VarChar, '240088@lasallep.mx')
      .input('password', sql.VarChar, '1234')
      .input('rol', sql.VarChar, 'estudiante')
      .input('matricula', sql.VarChar, '240088')
      .input('area_estudios', sql.VarChar, 'Arquitectura')
      .input('semestre', sql.Int, 3)
      .input('activo', sql.Bit, 1)
      .query(`
        INSERT INTO usuarios (nombre, email, password, rol, matricula, area_estudios, semestre, activo)
        OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.email
        VALUES (@nombre, @email, @password, @rol, @matricula, @area_estudios, @semestre, @activo)
      `);

    console.log('✅ Usuario creado:', createResult.recordset[0]);

    res.json({
      success: true,
      message: 'Usuario creado forzadamente',
      usuario: createResult.recordset[0]
    });

  } catch (error: any) {
    console.error('💥 Error creando usuario:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Endpoint para ejecutar query personalizada
export const handleCustomQuery: RequestHandler = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query requerida en el body'
      });
    }

    const pool = await getConnection();
    const result = await pool.request().query(query);
    
    res.json({
      success: true,
      result: result.recordset,
      rowsAffected: result.rowsAffected
    });

  } catch (error: any) {
    console.error('💥 Error en query:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
