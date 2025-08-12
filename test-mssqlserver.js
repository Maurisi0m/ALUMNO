// Test script for MSSQLSERVER instance
import sql from 'mssql';

const config = {
  server: 'localhost', // This should work for MSSQLSERVER default instance
  database: 'SIGEA_DB_LOCAL',
  user: 'sa',
  password: 'Pollito92.',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

async function testMSSQLSERVER() {
  try {
    console.log('🔍 Testing MSSQLSERVER connection...');
    
    const pool = await sql.connect(config);
    console.log('✅ Successfully connected to MSSQLSERVER!');
    
    // Check if SIGEA_DB_LOCAL exists
    const dbCheck = await pool.request().query(`
      SELECT name FROM sys.databases WHERE name = 'SIGEA_DB_LOCAL'
    `);
    
    if (dbCheck.recordset.length > 0) {
      console.log('📊 SIGEA_DB_LOCAL database exists');
      
      // Switch to the database
      await pool.request().query('USE SIGEA_DB_LOCAL');
      
      // Check tables
      const tables = await pool.request().query(`
        SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
      `);
      
      if (tables.recordset.length > 0) {
        console.log('📋 Tables found:', tables.recordset.map(t => t.TABLE_NAME));
      } else {
        console.log('⚠️ Database exists but has no tables - needs initialization');
      }
      
    } else {
      console.log('⚠️ SIGEA_DB_LOCAL database does not exist - needs creation');
    }
    
    await pool.close();
    return true;
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

testMSSQLSERVER().then(success => {
  if (success) {
    console.log('🎉 MSSQLSERVER connection test completed!');
  } else {
    console.log('💡 Check SQL Server configuration');
  }
  process.exit(0);
});
