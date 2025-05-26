/**
 * Credential Test for Airtable API
 * 
 * Simple test to validate Airtable credentials and diagnose authentication issues.
 */

async function testCredentials() {
  const baseId = 'apph8yM7gVc9QBFtx';
  const apiKey = 'patm0p87AP12yGYUS.f8b5c2e1a3d4f6e8b9c0a1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4';
  
  console.log('🔍 Testing Airtable Credentials...');
  console.log(`Base ID: ${baseId}`);
  console.log(`API Key: ${apiKey.substring(0, 20)}...`);
  
  try {
    const url = `https://api.airtable.com/v0/${baseId}/SystemEvolution?maxRecords=1`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`\nResponse Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json() as { records?: Array<{ id: string; fields: Record<string, any> }> };
      console.log('✅ Authentication successful!');
      console.log(`Records found: ${data.records?.length || 0}`);
      
      if (data.records && data.records.length > 0) {
        console.log(`Sample record ID: ${data.records[0].id}`);
        console.log(`Fields: ${Object.keys(data.records[0].fields).join(', ')}`);
      }
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Authentication failed!');
      console.log('Error details:', errorData);
      
      if (response.status === 401) {
        console.log('\n💡 Possible issues:');
        console.log('   - API key is invalid or expired');
        console.log('   - API key doesn\'t have access to this base');
        console.log('   - Base ID is incorrect');
      } else if (response.status === 404) {
        console.log('\n💡 Possible issues:');
        console.log('   - Base ID is incorrect');
        console.log('   - Table "SystemEvolution" doesn\'t exist');
      }
    }
    
  } catch (error) {
    console.error('❌ Network error:', error instanceof Error ? error.message : error);
  }
}

testCredentials(); 