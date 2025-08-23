// Comprehensive SQL Server troubleshooting script
import sql from 'mssql';

// Test configurations for different scenarios
const testConfigs = [
  {
    name: 'Default Instance (localhost)',
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
    name: 'Named Instance (localhost\\MSSQLSERVER)',
    config: {
      server: 'localhost\\MSSQLSERVER',
      database: 'master',
      user: 'sa',
      password: 'Pollito92.',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      },
    }
  },
  {
    name: 'Local IP (127.0.0.1)',
    config: {
      server: '127.0.0.1',
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
  }
];

async function testAllConnections() {
  console.log('🔍 Comprehensive SQL Server Connection Test\n');
  console.log('📋 Testing configurations:');
  
  for (const testCase of testConfigs) {
    console.log(`\n--- Testing: ${testCase.name} ---`);
    try {
      const pool = await sql.connect(testCase.config);
      console.log('✅ SUCCESS: Connected successfully');
      
      // Get server info
      const serverInfo = await pool.request().query(`
        SELECT 
          @@SERVERNAME as server_name,
          @@VERSION as version,
          DB_NAME() as current_db
      `);
      
      console.log('📊 Server Info:', serverInfo.recordset[0]);
      
      // Check if SIGEA_DB_LOCAL exists
      const dbCheck = await pool.request().query(`
        SELECT name, state_desc 
        FROM sys.databases 
        WHERE name = 'SIGEA_DB_LOCAL'
      `);
      
      if (dbCheck.recordset.length > 0) {
        console.log('✅ SIGEA_DB_LOCAL database exists');
        
        // Switch to SIGEA_DB_LOCAL
        await pool.request().query('USE SIGEA_DB_LOCAL');
        
        // Check tables
        const tables = await pool.request().query(`
          SELECT TABLE_NAME 
          FROM INFORMATION_SCHEMA.TABLES 
          WHERE TABLE_TYPE = 'BASE TABLE'
        `);
        
        if (tables.recordset.length > 0) {
          console.log('📋 Tables:', tables.recordset.map(t => t.TABLE_NAME));
        } else {
          console.log('⚠️ No tables found - database needs initialization');
        }
        
      } else {
        console.log('⚠️ SIGEA_DB_LOCAL database does not exist');
      }
      
      await pool.close();
      console.log('✅ Connection closed');
      
    } catch (error) {
      console.error('❌ FAILED:', error.message);
    }
  }
}

// Run troubleshooting steps
async function runTroubleshooting() {
  console.log('🔧 SQL Server Troubleshooting Guide\n');
  
  console.log('📋 Manual verification steps:');
  console.log('1. Check SQL Server service status:');
  console.log('   - Press Windows + R, type: services.msc');
  console.log('   - Look for: SQL Server (MSSQLSERVER)');
  console.log('   - Status should be: Running');
  
  console.log('\n2. Check SQL Server Configuration Manager:');
  console.log('   - Open SQL Server Configuration Manager');
  console.log('   - Go to: SQL Server Network Configuration > Protocols for MSSQLSERVER');
  console.log('   - Ensure: TCP/IP is Enabled');
  console.log('   - Check: IP Addresses tab, ensure port 1433 is configured');
  
  console.log('\n3. Test with SQL Server Management Studio:');
  console.log('   - Server name: localhost');
  console.log('   - Authentication: SQL Server Authentication');
  console.log('   - Login: sa');
  console.log('   - Password: Pollito92.');
  
  console.log('\n4. Check Windows Firewall:');
  console.log('   - Ensure port 1433 is allowed for inbound connections');
  
  console.log('\n5. Verify SQL Server Browser service:');
  console.log('   - Look for: SQL Server Browser');
  console.log('   - Status should be: Running');
  
  console.log('\n🧪 Running connection tests...\n');
  await testAllConnections();
}

runTroubleshooting().then(() => {
  console.log('\n🎯 Troubleshooting completed!');
  console.log('\n💡 Next steps:');
  console.log('1. If any connection succeeds, note the working configuration');
  console.log('2. Update server/config/database.ts with the working server name');
  console.log('3. Run the database initialization script if needed');
  process.exit(0);
});
