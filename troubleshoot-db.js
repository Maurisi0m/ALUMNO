// Script to troubleshoot SQL Server connection issues
import sql from 'mssql';

// Test different server configurations
const serverConfigs = [
  { server: 'localhost', name: 'localhost' },
  { server: 'localhost\\SQLEXPRESS', name: 'localhost\\SQLEXPRESS' },
  { server: '127.0.0.1', name: '127.0.0.1' },
  { server: '127.0.0.1\\SQLEXPRESS', name: '127.0.0.1\\SQLEXPRESS' },
];

const baseConfig = {
  database: 'master',
  user: 'sa',
  password: 'Pollito92.',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

async function testAllServers() {
  console.log('🔍 Testing different SQL Server configurations...\n');
  
  for (const serverConfig of serverConfigs) {
    try {
      console.log(`Testing ${serverConfig.name}...`);
      
      const config = { ...baseConfig, ...serverConfig };
      
      const pool = await sql.connect(config);
      console.log(`✅ SUCCESS: Connected to ${serverConfig.name}`);
      
      // Test if we can list databases
      const result = await pool.request().query('SELECT name FROM sys.databases');
      console.log('   Available databases:', result.recordset.map(db => db.name));
      
      await pool.close();
      console.log('   Connection closed successfully\n');
      
    } catch (error) {
      console.log(`❌ FAILED: ${serverConfig.name} - ${error.message}\n`);
    }
  }
}

// Check if SQL Server service is running
console.log('🔍 Checking SQL Server services...\n');
console.log('To check SQL Server services manually:');
console.log('1. Press Windows + R');
console.log('2. Type: services.msc');
console.log('3. Look for: SQL Server (SQLEXPRESS) or SQL Server (MSSQLSERVER)');
console.log('4. Ensure the service is "Running"\n');

// Test all configurations
testAllServers().then(() => {
  console.log('🎯 Troubleshooting completed!');
  console.log('\n💡 If all connections fail:');
  console.log('1. Verify SQL Server is installed and running');
  console.log('2. Check if SQL Server Browser service is running');
  console.log('3. Verify firewall allows port 1433');
  console.log('4. Try connecting with SQL Server Management Studio first');
  process.exit(0);
});
