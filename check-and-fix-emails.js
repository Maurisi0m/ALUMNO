const sql = require('mssql');

const config = {
  server: process.env.SQL_SERVER || 'localhost',
  database: process.env.SQL_DATABASE || 'SIGEA_DB_LOCAL',
  user: process.env.SQL_USER || 'sa',
  password: process.env.SQL_PASSWORD || 'Pollito92.',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  }
};

async function checkAndFixEmails() {
  try {
    console.log('🔍 Conectando a la base de datos...');
    await sql.connect(config);
    
    // Verificar emails actuales
    console.log('\n📧 EMAILS ACTUALES:');
    console.log('================================================');
    const result = await sql.query(`
      SELECT id, nombre, email, matricula 
      FROM usuarios 
      WHERE rol = 'estudiante'
      ORDER BY id
    `);
    
    const students = result.recordset;
    students.forEach(user => {
      console.log(`ID: ${user.id} | Matrícula: ${user.matricula} | Email: ${user.email} | Nombre: ${user.nombre}`);
    });
    
    console.log(`\n📊 Total de estudiantes: ${students.length}`);
    
    // Verificar cuáles no tienen @lasallep.mx
    const incorrectEmails = students.filter(user => !user.email.endsWith('@lasallep.mx'));
    
    if (incorrectEmails.length > 0) {
      console.log('\n❌ EMAILS INCORRECTOS (no terminan en @lasallep.mx):');
      console.log('================================================');
      incorrectEmails.forEach(user => {
        console.log(`❌ ${user.email} (Matrícula: ${user.matricula})`);
      });
      
      console.log('\n🔧 CORRIGIENDO EMAILS...');
      console.log('================================================');
      
      // Corregir emails
      for (const user of incorrectEmails) {
        const newEmail = `${user.matricula}@lasallep.mx`;
        console.log(`🔄 Corrigiendo: ${user.email} → ${newEmail}`);
        
        await sql.query(`
          UPDATE usuarios 
          SET email = '${newEmail}' 
          WHERE id = ${user.id}
        `);
      }
      
      console.log('\n✅ CORRECCIÓN COMPLETADA');
    } else {
      console.log('\n✅ Todos los emails ya tienen el formato correcto @lasallep.mx');
    }
    
    // Verificar emails después de la corrección
    console.log('\n📧 EMAILS DESPUÉS DE LA CORRECCIÓN:');
    console.log('================================================');
    const resultAfter = await sql.query(`
      SELECT id, nombre, email, matricula 
      FROM usuarios 
      WHERE rol = 'estudiante'
      ORDER BY id
    `);
    
    resultAfter.recordset.forEach(user => {
      const status = user.email.endsWith('@lasallep.mx') ? '✅' : '❌';
      console.log(`${status} ID: ${user.id} | Matrícula: ${user.matricula} | Email: ${user.email}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.close();
    console.log('\n🔚 Conexión cerrada');
  }
}

checkAndFixEmails();
