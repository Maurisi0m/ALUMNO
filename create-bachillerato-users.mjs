/**
 * Script para crear 700 usuarios de bachillerato
 */

async function createBachilleratoUsers() {
  console.log('🚀 Creando 700 usuarios de bachillerato...');
  
  const requestData = {
    startMatricula: 240001,
    count: 700,
    distributeYears: ['24', '25']
  };
  
  try {
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
    
    console.log('✅ Resultado:', result.success ? 'ÉXITO' : 'ERROR');
    console.log('💬 Mensaje:', result.message);
    
    if (result.data) {
      console.log('👥 Usuarios creados:', result.data.totalCreated);
      console.log('🎯 Usuarios solicitados:', result.data.totalRequested);
      console.log('❌ Errores:', result.data.errors.length);
      
      if (result.data.sample && result.data.sample.length > 0) {
        console.log('\n👤 Primeros usuarios creados:');
        result.data.sample.slice(0, 3).forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.matricula} - ${user.nombre} - ${user.email}`);
        });
      }
    }
    
    // Obtener estadísticas después de crear
    await getStats();
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

async function getStats() {
  console.log('\n📊 Obteniendo estadísticas...');
  
  try {
    const response = await fetch('http://localhost:8080/api/bulk-users/stats');
    const result = await response.json();
    
    if (result.success && result.data.byArea) {
      result.data.byArea.forEach(area => {
        if (area.area_estudios === 'Bachillerato') {
          console.log(`\n📚 ${area.area_estudios}: ${area.usuarios_activos} usuarios activos`);
          if (area.semestres) {
            area.semestres.forEach(sem => {
              console.log(`   Semestre ${sem.semestre}: ${sem.usuarios_activos} estudiantes`);
            });
          }
        }
      });
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error.message);
  }
}

createBachilleratoUsers();
