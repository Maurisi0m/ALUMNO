// Test script for MSSQLSERVER default instance
import sql from 'mssql';

const config = {
  server: 'localhost', // For default MSSQLSERVER instance
  database: 'master', // Connect to master first to check if SIGEA_DB_LOCAL exists
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
    console.log('✅ Successfully connected to SQL Server!');
    
    // Check SQL Server version
    const version = await pool.request().query('SELECT @@VERSION as version');
    console.log('📊 SQL Server Version:', version.recordset[0].version);
    
    // Check if SIGEA_DB_LOCAL exists
    const dbCheck = await pool.request().query(`
      SELECT name FROM sys.databases WHERE name = 'SIGEA_DB_LOCAL'
    `);
    
    if (dbCheck.recordset.length > 0) {
      console.log('✅ SIGEA_DB_LOCAL database exists');
      
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
    console.log('💡 Troubleshooting:');
    console.log('   1. Verify SQL Server service is running');
    console.log('   2. Check if TCP/IP is enabled in SQL Server Configuration Manager');
    console.log('   3. Verify firewall allows port 1433');
    console.log('   4. Check if sa user is enabled and password is correct');
    return false;
  }
}

testMSSQLSERVER().then(success => {
  if (success) {
    console.log('🎉 SQL Server connection test completed!');
  }
  process.exit(0);
});
