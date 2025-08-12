// Simple script to test SQL Server connection
import sql from 'mssql';

const config = {
  server: 'localhost',
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

async function testConnection() {
  try {
    console.log('🔍 Testing SQL Server connection...');
    
    const pool = await sql.connect(config);
    console.log('✅ Connection successful!');
    
    // Test database exists
    const result = await pool.request().query('SELECT DB_NAME() as current_database');
    console.log('📊 Current database:', result.recordset[0].current_database);
    
    // Check if tables exist
    const tables = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);
    
    if (tables.recordset.length > 0) {
      console.log('📋 Existing tables:', tables.recordset.map(t => t.TABLE_NAME));
    } else {
      console.log('⚠️ No tables found - database needs initialization');
    }
    
    await pool.close();
    return true;
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('🎉 Database connection test completed successfully!');
  } else {
    console.log('💡 Please check your SQL Server configuration');
  }
  process.exit(0);
});
