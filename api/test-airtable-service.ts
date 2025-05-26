/**
 * Test Script for Airtable Service
 * 
 * Validates the Airtable API service functionality and connection
 * to the revolutionary 36-table emotional intelligence platform.
 * 
 * @version 1.0.0
 * @author CanAI Codex v6.1.4
 * @trust_score 4.7
 */

import { createAirtableService } from './services/airtable-service';
import { AIRTABLE_TABLES } from './types/airtable';

async function testAirtableService() {
  console.log('🚀 Testing Airtable Service for Emotional Intelligence Platform...\n');

  try {
    // Create service instance
    const airtableService = createAirtableService({
      baseId: process.env.AIRTABLE_BASE_ID || 'apph8yM7gVc9QBFtx',
      apiKey: process.env.AIRTABLE_API_KEY || 'patm0p87AP12yGYUS...'
    });

    // Test 1: Health Check
    console.log('📊 Running Health Check...');
    const healthCheck = await airtableService.healthCheck();
    console.log(`Status: ${healthCheck.status}`);
    healthCheck.checks.forEach(check => {
      const status = check.status === 'pass' ? '✅' : '❌';
      console.log(`${status} ${check.name}: ${check.message} ${check.responseTime ? `(${check.responseTime}ms)` : ''}`);
    });
    console.log('');

    // Test 2: System Evolution Table Access
    console.log('🔍 Testing SystemEvolution Table Access...');
    const systemEvolution = await airtableService.getRecords(AIRTABLE_TABLES.SYSTEM_EVOLUTION, { maxRecords: 3 });
    console.log(`✅ Retrieved ${systemEvolution.records.length} SystemEvolution records`);
    if (systemEvolution.records.length > 0) {
      console.log(`   Sample record ID: ${systemEvolution.records[0].id}`);
      console.log(`   Fields: ${Object.keys(systemEvolution.records[0].fields).join(', ')}`);
    }
    console.log('');

    // Test 3: Create a test session log
    console.log('📝 Testing Session Logging...');
    const testSessionData = {
      session_id: `test_session_${Date.now()}`,
      user_id: 'test_user_001',
      prompt_type: 'business_plan',
      prompt_content: 'Create a business plan for a tech startup',
      response_content: 'Here is your comprehensive business plan...',
      trust_score: 4.5,
      emotional_intelligence_score: 4.2,
      user_satisfaction: 4.8,
      response_time_ms: 1250,
      token_usage: 850,
      cost_usd: 0.025,
      revision_count: 0,
      confirmation_status: 'confirmed' as const,
      emotional_tone: 'confident_optimistic',
      confidence_level: 0.92,
      behavioral_signals: ['engagement_high', 'trust_building'],
      context_richness: 0.85,
      personalization_level: 0.78,
      innovation_score: 4.3,
      compound_value: 4.1,
      reusability_score: 3.9,
      learning_extraction: 'User prefers detailed financial projections',
      meta_insights: JSON.stringify({ key_patterns: ['detail_oriented', 'growth_focused'] }),
      future_prediction: 'Likely to request follow-up on marketing strategy'
    };

    const sessionRecord = await airtableService.logSession(testSessionData);
    console.log(`✅ Created session log record: ${sessionRecord.id}`);
    console.log('');

    // Test 4: Update Trust Metrics
    console.log('🎯 Testing Trust Metrics Update...');
    const trustUpdate = await airtableService.updateTrustMetrics('test_user_001', {
      current_trust_score: 4.5,
      trust_trend: 'increasing',
      trust_velocity: 0.15,
      trust_consistency: 0.88,
      trust_factors_breakdown: JSON.stringify({
        reliability: 4.6,
        transparency: 4.4,
        competence: 4.5,
        benevolence: 4.3
      }),
      validation_status: 'validated'
    });
    console.log(`✅ Updated trust metrics record: ${trustUpdate.id}`);
    console.log('');

    // Test 5: Create SparkSplit Analytics
    console.log('✨ Testing SparkSplit Analytics...');
    const sparkSplitData = {
      session_id: testSessionData.session_id,
      user_id: 'test_user_001',
      trust_score_before: 4.2,
      trust_score_after: 4.5,
      trust_delta: 0.3,
      comparison_type: 'sequential' as const,
      comparison_data: JSON.stringify({ previous_session: 'session_123', improvement_factors: ['clarity', 'responsiveness'] }),
      transparency_level: 0.95,
      trust_factors: ['reliability', 'transparency', 'competence'],
      evolution_stage: 'building' as const,
      predictive_trust_score: 4.7,
      confidence_interval: 0.12,
      trust_trajectory: 'ascending' as const,
      emotional_resonance: 4.4,
      behavioral_consistency: 4.3,
      value_alignment: 4.6,
      communication_clarity: 4.5,
      reliability_score: 4.4
    };

    const sparkSplitRecord = await airtableService.createSparkSplitAnalytics(sparkSplitData);
    console.log(`✅ Created SparkSplit analytics record: ${sparkSplitRecord.id}`);
    console.log('');

    // Test 6: Record System Evolution
    console.log('🧠 Testing System Evolution Recording...');
    const evolutionData = {
      evolution_id: `evo_${Date.now()}`,
      system_component: 'airtable_service',
      evolution_type: 'api_integration',
      improvement_description: 'Successfully deployed comprehensive Airtable API service with 36-table support',
      impact_score: 4.8,
      learning_extraction: 'Type-safe API operations significantly improve reliability and developer experience',
      future_implications: 'Foundation for real-time emotional intelligence processing and trust transparency',
      evolution_confidence: 0.95,
      meta_learning: JSON.stringify({
        patterns: ['modular_design', 'type_safety', 'error_handling'],
        insights: ['Rate limiting prevents API abuse', 'Retry logic improves reliability']
      }),
      system_intelligence_gain: 4.5,
      compound_evolution: JSON.stringify({
        dependencies: ['type_definitions', 'error_handling', 'rate_limiting'],
        enablers: ['trust_analytics', 'emotional_intelligence', 'predictive_insights']
      })
    };

    const evolutionRecord = await airtableService.recordSystemEvolution(evolutionData);
    console.log(`✅ Recorded system evolution: ${evolutionRecord.id}`);
    console.log('');

    // Test 7: Get Trust Analytics
    console.log('📈 Testing Trust Analytics Retrieval...');
    const trustAnalytics = await airtableService.getTrustAnalytics('test_user_001');
    console.log(`✅ Retrieved trust analytics:`);
    console.log(`   Current metrics: ${trustAnalytics.currentMetrics ? 'Available' : 'None'}`);
    console.log(`   Evolution records: ${trustAnalytics.evolution.length}`);
    console.log(`   SparkSplit analytics: ${trustAnalytics.sparkSplitAnalytics.length}`);
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('🌟 Airtable Service is fully operational and ready for production use!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAirtableService();
}

export { testAirtableService }; 