import { createAirtableService } from './services/airtable-service';
import { AIRTABLE_TABLES } from './types/airtable';

async function quickTest() {
  try {
    console.log('🔍 Testing Airtable API Communication...');
    
    const service = createAirtableService({
      baseId: 'apph8yM7gVc9QBFtx',
      apiKey: 'patm0p87AP12yGYUS.f8b5c2e1a3d4f6e8b9c0a1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4'
    });
    
    console.log('📊 Running Health Check...');
    const healthCheck = await service.healthCheck();
    console.log(`Status: ${healthCheck.status}`);
    
    healthCheck.checks.forEach(check => {
      const status = check.status === 'pass' ? '✅' : '❌';
      console.log(`${status} ${check.name}: ${check.message} ${check.responseTime ? `(${check.responseTime}ms)` : ''}`);
    });
    
    if (healthCheck.status === 'healthy' || healthCheck.status === 'degraded') {
      console.log('\n🔍 Testing Table Access...');
      const systemEvolution = await service.getRecords(AIRTABLE_TABLES.SYSTEM_EVOLUTION, { maxRecords: 1 });
      console.log(`✅ SystemEvolution table accessible with ${systemEvolution.records.length} records`);
      
      const promptLogs = await service.getRecords(AIRTABLE_TABLES.PROMPT_LOGS, { maxRecords: 1 });
      console.log(`✅ PromptLogs table accessible with ${promptLogs.records.length} records`);
      
      console.log('\n🎉 API Communication Test PASSED!');
    } else {
      console.log('\n❌ Health check failed - API communication issues detected');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : error);
  }
}

quickTest(); 