const fetch = require('node-fetch');

async function checkServerHealth() {
  try {
    console.log('🏥 Checking Server Health...');
    
    const response = await fetch('https://canai-router.onrender.com/api/health');
    const data = await response.json();
    
    console.log('✅ Server Status:', data.status);
    console.log('📅 Server Time:', data.timestamp);
    console.log('⏱️ Uptime:', data.uptime);
    console.log('🔧 Services:', data.services);
    
    return data;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return null;
  }
}

checkServerHealth(); 