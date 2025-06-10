const fetch = require('node-fetch');

async function testEnhancedAIBlueprint() {
  try {
    console.log('🧪 Testing Enhanced AI Blueprint API...');
    console.log('📅 Test Time:', new Date().toISOString());
    
    const testData = {
      userInput: {
        businessName: 'InnovateTech Solutions',
        targetAudience: 'Mid-market SaaS companies seeking AI-powered customer support automation',
        primaryGoal: 'Implement an AI chatbot system to reduce customer support response time by 60% and increase satisfaction scores to 4.5+',
        competitiveContext: 'InnovateTech Solutions aims to compete against Zendesk AI and Intercom Resolution Bot by offering superior emotional intelligence and multilingual support',
        brandVoice: 'innovative',
        resourceConstraints: 'Budget: $75K, Timeline: 4 months, Team: 2 developers + 1 AI specialist',
        currentStatus: 'Currently using Zendesk with manual ticket routing and basic auto-responses',
        aiSolution: 'Conversational AI platform with sentiment analysis, intent recognition, and emotional intelligence',
        mvpFeatures: 'Natural language processing, sentiment analysis, ticket auto-routing, knowledge base integration, escalation triggers',
        successMetrics: '30d: Prototype with 100 conversations; 60d: Beta with 500 conversations; 90d: Production with 50% automation rate',
        minimumViableExecution: 'Use Dialogflow for NLP, OpenAI GPT-4 for responses, Zendesk API for integration, deploy on Google Cloud with auto-scaling'
      },
      promptType: 'ai_blueprint'
    };

    console.log('\n🌐 Making API call to enhanced endpoint...');
    const response = await fetch('https://canai-router.onrender.com/api/sparksplit/generate-sterile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('\n✅ API Response Analysis:');
    console.log('📊 Response Status:', result.success);
    console.log('📄 Output Type:', typeof result.data?.sterileOutput);
    console.log('📏 Output Length:', result.data?.sterileOutput?.length || 0, 'characters');
    console.log('🔍 Contains Markdown Headers:', result.data?.sterileOutput?.includes('##'));
    console.log('🏗️ Contains Technical Stack:', result.data?.sterileOutput?.includes('Technical Stack'));
    console.log('📋 Contains Executive Summary:', result.data?.sterileOutput?.includes('Executive Summary'));
    console.log('⚙️ Contains Workflow Design:', result.data?.sterileOutput?.includes('Workflow Design'));
    console.log('🔒 Contains Data & Privacy:', result.data?.sterileOutput?.includes('Data & Privacy'));
    console.log('💰 Contains Monetization:', result.data?.sterileOutput?.includes('Monetization'));
    
    console.log('\n📝 Output Preview (first 400 characters):');
    console.log('=' .repeat(60));
    console.log(result.data?.sterileOutput?.substring(0, 400) + '...');
    console.log('=' .repeat(60));
    
    // Check for required AI Blueprint sections
    const requiredSections = [
      'Intent', 'Executive Summary', 'Competitive Positioning', 
      'Technical Stack', 'Workflow Design', 'Data & Privacy',
      'Automation Framework', 'Monetization Strategy', 'Scalability Roadmap',
      'Deliverables & Next Steps', 'SparkSplit Comparison'
    ];
    
    console.log('\n🎯 Section Completeness Analysis:');
    let sectionsFound = 0;
    requiredSections.forEach(section => {
      const hasSection = result.data?.sterileOutput?.includes(section);
      if (hasSection) sectionsFound++;
      console.log(`  ${hasSection ? '✅' : '❌'} ${section}`);
    });
    
    const completenessScore = (sectionsFound / requiredSections.length) * 100;
    console.log(`\n📈 Section Completeness: ${sectionsFound}/${requiredSections.length} (${completenessScore.toFixed(1)}%)`);
    
    // Quality assessment
    const outputLength = result.data?.sterileOutput?.length || 0;
    const hasMarkdown = result.data?.sterileOutput?.includes('##');
    const hasStructure = result.data?.sterileOutput?.includes('- **');
    
    console.log('\n🏆 Quality Assessment:');
    console.log(`  📏 Length Quality: ${outputLength > 500 ? '✅ Rich' : outputLength > 200 ? '⚠️ Basic' : '❌ Minimal'} (${outputLength} chars)`);
    console.log(`  🔗 Markdown Structure: ${hasMarkdown ? '✅ Present' : '❌ Missing'}`);
    console.log(`  📋 Formatted Lists: ${hasStructure ? '✅ Present' : '❌ Missing'}`);
    console.log(`  🎯 Section Coverage: ${completenessScore > 80 ? '✅ Excellent' : completenessScore > 60 ? '⚠️ Good' : '❌ Poor'}`);
    
    // Overall assessment
    const overallQuality = completenessScore > 80 && outputLength > 500 && hasMarkdown ? 'EXCELLENT' : 
                          completenessScore > 60 && outputLength > 300 ? 'GOOD' : 'NEEDS_IMPROVEMENT';
    
    console.log(`\n🌟 Overall Quality: ${overallQuality}`);
    
    if (overallQuality === 'EXCELLENT') {
      console.log('🎉 SUCCESS: AI Blueprint API now produces rich, structured output!');
    } else if (overallQuality === 'GOOD') {
      console.log('⚠️ IMPROVEMENT: Output quality improved but could be better');
    } else {
      console.log('❌ ISSUE: Output still needs significant improvement');
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('🔍 Full error:', error);
    return null;
  }
}

// Run the test
testEnhancedAIBlueprint()
  .then(result => {
    if (result) {
      console.log('\n✅ Test completed successfully');
    } else {
      console.log('\n❌ Test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Test execution error:', error);
    process.exit(1);
  }); 