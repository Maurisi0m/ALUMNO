/**
 * Script de prueba para crear usuarios de bachillerato masivamente
 * Ejecutar con: node test-bulk-users.js
 */

const fetch = require('node-fetch').default || globalThis.fetch;

async function testBulkUserCreation() {
  console.log('🚀 Iniciando creación masiva de usuarios de bachillerato...');
  
  const requestData = {
    startMatricula: 240001,
    count: 700,
    distributeYears: ['24', '25']
  };
  
  console.log('📋 Configuración:', requestData);
  
  try {
    console.log('📡 Enviando solicitud al servidor...');
    
    const response = await fetch('http://localhost:8080/api/bulk-users/bachillerato', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('\n✅ Respuesta del servidor:');
    console.log('🎯 Éxito:', result.success);
    console.log('💬 Mensaje:', result.message);
    
    if (result.data) {
      console.log('\n📊 Estadísticas:');
      console.log('👥 Usuarios creados:', result.data.totalCreated);
      console.log('🎯 Usuarios solicitados:', result.data.totalRequested);
      console.log('❌ Errores:', result.data.errors.length);
      
      if (result.data.errors.length > 0) {
        console.log('\n🚨 Errores encontrados:');
        result.data.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });
      }
      
      if (result.data.sample && result.data.sample.length > 0) {
        console.log('\n👤 Muestra de usuarios creados:');
        result.data.sample.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.matricula} - ${user.nombre} - ${user.email}`);
        });
      }
    }
    
  } catch (error) {
    console.error('💥 Error ejecutando la prueba:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Solución sugerida:');
      console.log('   1. Asegúrate de que el servidor esté ejecutándose');
      console.log('   2. Ejecuta: npm run dev');
      console.log('   3. Verifica que el puerto 8080 esté disponible');
    }
  }
}

async function testUserStats() {
  console.log('\n📊 Obteniendo estadísticas de usuarios...');
  
  try {
    const response = await fetch('http://localhost:8080/api/bulk-users/stats');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data.byArea) {
      console.log('\n📈 Estadísticas por área:');
      result.data.byArea.forEach(area => {
        console.log(`\n📚 ${area.area_estudios}:`);
        console.log(`   Total: ${area.total_usuarios} | Activos: ${area.usuarios_activos}`);
        
        if (area.semestres && area.semestres.length > 0) {
          console.log('   Por semestres:');
          area.semestres.forEach(sem => {
            console.log(`     Sem ${sem.semestre}: ${sem.usuarios_activos} activos`);
          });
        }
      });
    }
    
  } catch (error) {
    console.error('💥 Error obteniendo estadísticas:', error.message);
  }
}

// Ejecutar las pruebas
async function runTests() {
  await testBulkUserCreation();
  await testUserStats();
  
  console.log('\n🏁 Pruebas completadas');
  console.log('\n🌐 Para probar la interfaz web, ve a:');
  console.log('   http://localhost:8080/admin/bulk-users');
}

runTests().catch(console.error);
