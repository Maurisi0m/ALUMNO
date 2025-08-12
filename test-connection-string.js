// Test different connection string formats for SQL Server
import sql from 'mssql';

// Test various connection string formats
const connectionStrings = [
  {
    name: 'Standard TCP/IP',
    config: {
      server: 'localhost',
      database: 'master',
      user: 'sa',
      password: 'Pollito92.',
      port: 1433,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      },
    }
  },
  {
    name: 'With Connection Timeout',
    config: {
      server: 'localhost',
      database: 'master',
      user: 'sa',
      password: 'Pollito92.',
      port: 1433,
      connectionTimeout: 30000,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      },
    }
  }
];

async function testConnectionStrings() {
  console.log('🔍 Testing different SQL Server connection formats\n');
  
  for (const testCase of connectionStrings) {
    console.log(`--- Testing: ${testCase.name} ---`);
    try {
      const pool = await sql.connect(testCase.config);
      console.log('✅ SUCCESS: Connected successfully');
      
      // Test a simple query
      const result = await pool.request().query('SELECT 1 as test');
      console.log('📊 Query result:', result.recordset[0]);
      
      await pool.close();
      console.log('✅ Connection closed successfully\n');
      
    } catch (error) {
      console.error('❌ FAILED:', error.message);
      console.log('---\n');
    }
  }
}

testConnectionStrings().then(() => {
  console.log('🎯 Connection string testing completed!');
  console.log('\n💡 Next steps:');
  console.log('1. Open SQL Server Management Studio');
  console.log('2. Connect with: localhost, sa, Pollito92.');
  console.log('3. Run the verify-sql-server-setup.sql script');
  console.log('4. Once SSMS connection works, update the app config');
  process.exit(0);
});
