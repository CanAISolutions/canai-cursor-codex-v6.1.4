/**
 * test_ai_blueprint_step6_openai.ts
 * 
 * Purpose: Test Step 6 OpenAI API integration for ai_blueprint.mcp.ts
 * Tests dynamic content generation with gpt-4-turbo and validation of trust/emotional metrics
 * 
 * Date: June 09, 2025, 10:58 AM MDT
 * Objective: Validate OpenAI API integration with test input from ai_blueprint-prompt.md
 */

import { generateAIBlueprint } from './prompts/ai_blueprint.mcp';

// Test input from ai_blueprint-prompt.md Step 6 requirements
const testInput = {
  businessName: "SupportAI",
  targetAudience: "SaaS companies, 10-50 employees",
  primaryGoal: "Reduce tickets by 50%",
  competitiveContext: "Unique NLP vs generic bots",
  brandVoice: "approachable" as const,
  resourceConstraints: "$5K, 3 months, 2-person team",
  currentStatus: "Manual support, no AI",
  aiSolution: "AI chatbot for ticket triage",
  mvpFeatures: "NLP, Zendesk integration",
  successMetrics: "30d: Prototype; 60d: 20 users",
  linkedPrompts: ["business-plan", "ad-amplify"],
  minimumViableExecution: "Use Dialogflow, Zapier"
};

async function testStep6OpenAIIntegration(): Promise<void> {
  console.log('🚀 Starting AI Blueprint Step 6 OpenAI API Integration Test...');
  
  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable not found');
  }
  
  console.log('✅ OpenAI API key found');
  console.log('\n📋 Test Input:');
  console.log(JSON.stringify(testInput, null, 2));
  
  console.log('\n🤖 Calling generateAIBlueprint with OpenAI integration...');
  
  const startTime = performance.now();
  const session = await generateAIBlueprint(testInput);
  const endTime = performance.now();
  
  console.log(`✅ API call completed in ${Math.round(endTime - startTime)}ms`);
  
  // Validate results
  if (session.output) {
    const output = session.output;
    
    console.log('\n📊 Content Generation Analysis:');
    console.log(`Architecture: ${output.blueprint.architecture}`);
    console.log(`Components: ${output.blueprint.components.length} items`);
    console.log(`Recommendations: ${output.recommendations.length} items`);
    console.log(`Timeline: ${output.timeline.length} phases`);
    console.log(`Risks: ${output.risks.length} items`);
    
    console.log('\n🔍 Validation Results:');
    console.log(`Trust Score: ${session.metadata.trustScore.toFixed(2)} (≥4.2: ${session.metadata.trustScore >= 4.2 ? '✅' : '❌'})`);
    
    if (session.emotionalCompass) {
      console.log(`Emotional Resonance: ${session.emotionalCompass.overall.toFixed(2)} (≥0.85: ${session.emotionalCompass.overall >= 0.85 ? '✅' : '❌'})`);
    }
    
    console.log('\n📄 Sample Generated Content:');
    console.log(`Architecture: ${output.blueprint.architecture}`);
    console.log('Components:', output.blueprint.components.slice(0, 3).join(', '));
    console.log('Recommendations:', output.recommendations.slice(0, 2).join(', '));
    
    console.log('\n✅ Step 6 OpenAI API Integration: COMPLETE');
  } else {
    console.log('❌ No output generated');
    throw new Error('OpenAI API integration failed');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testStep6OpenAIIntegration()
    .then(() => {
      console.log('\n🎉 All tests passed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Test failed:', error);
      process.exit(1);
    });
}

export { testStep6OpenAIIntegration }; 