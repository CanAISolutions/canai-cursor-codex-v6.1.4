import { BreakthroughDetector } from './src/transcendence/BreakthroughDetector';

async function debugCrisisPrediction() {
  console.log('🔍 Debugging Crisis Prediction Logic\n');

  const stableScenario = {
    type: 'stable_progress',
    expectedCrisis: false,
    journey: {
      initialState: { 
        emotionalState: 'engaged', 
        consciousnessLevel: 0.7, 
        problemClarity: 0.8, 
        trustScore: 4.5 
      },
      interactions: [
        {
          type: 'positive_progress',
          content: 'This is really helping me understand',
          timestamp: Date.now(),
          emotionalMarkers: { 
            frustrationLevel: 0.1, 
            confusionLevel: 0.2, 
            trustDecline: 0.0, 
            engagementDrop: 0.0, 
            stressIndicators: [] 
          }
        }
      ]
    }
  };

  const trustCollapseScenario = {
    type: 'trust_collapse',
    expectedCrisis: true,
    journey: {
      initialState: { 
        emotionalState: 'skeptical', 
        consciousnessLevel: 0.3, 
        problemClarity: 0.4, 
        trustScore: 3.0 
      },
      interactions: [
        {
          type: 'trust_test',
          content: 'I\'m not sure this understands me',
          timestamp: Date.now(),
          emotionalMarkers: { 
            frustrationLevel: 0.4, 
            confusionLevel: 0.5, 
            trustDecline: 0.6, 
            engagementDrop: 0.3, 
            stressIndicators: ['trust_erosion'] 
          }
        }
      ]
    }
  };

  const detector = new BreakthroughDetector({
    sensitivityLevel: 'high',
    detectionMethods: ['comprehensive_analysis'],
    realTimeValidation: true,
    predictiveCrisisPrevention: true,
    crisisPredictionWindow: 30
  });

  console.log('📊 STABLE SCENARIO ANALYSIS:');
  console.log('Expected Crisis:', stableScenario.expectedCrisis);
  console.log('Journey:', JSON.stringify(stableScenario.journey, null, 2));
  
  const stableResult = await detector.analyzeJourney(stableScenario.journey);
  console.log('\n🎯 STABLE RESULT:');
  console.log('Crisis Likelihood:', stableResult.crisisPrediction?.crisisLikelihood);
  console.log('Crisis Predicted (>0.5):', (stableResult.crisisPrediction?.crisisLikelihood || 0) > 0.5);
  console.log('Crisis Type:', stableResult.crisisPrediction?.crisisType);
  console.log('Urgency Level:', stableResult.crisisPrediction?.urgencyLevel);

  console.log('\n📊 TRUST COLLAPSE SCENARIO ANALYSIS:');
  console.log('Expected Crisis:', trustCollapseScenario.expectedCrisis);
  
  const trustResult = await detector.analyzeJourney(trustCollapseScenario.journey);
  console.log('\n🎯 TRUST COLLAPSE RESULT:');
  console.log('Crisis Likelihood:', trustResult.crisisPrediction?.crisisLikelihood);
  console.log('Crisis Predicted (>0.5):', (trustResult.crisisPrediction?.crisisLikelihood || 0) > 0.5);
  console.log('Crisis Type:', trustResult.crisisPrediction?.crisisType);
  console.log('Urgency Level:', trustResult.crisisPrediction?.urgencyLevel);

  console.log('\n📈 ACCURACY CALCULATION:');
  const scenarios = [stableScenario, trustCollapseScenario];
  let correctPredictions = 0;
  
  for (const scenario of scenarios) {
    const result = await detector.analyzeJourney(scenario.journey);
    const crisisPredicted = (result.crisisPrediction?.crisisLikelihood || 0) > 0.5;
    const isCorrect = crisisPredicted === scenario.expectedCrisis;
    
    console.log(`${scenario.type}: Expected=${scenario.expectedCrisis}, Predicted=${crisisPredicted}, Correct=${isCorrect}`);
    
    if (isCorrect) {
      correctPredictions++;
    }
  }
  
  const accuracy = correctPredictions / scenarios.length;
  console.log(`\nFinal Accuracy: ${correctPredictions}/${scenarios.length} = ${accuracy} (${accuracy * 100}%)`);
  console.log(`Test Requirement: >95% (${accuracy > 0.95 ? '✅ PASS' : '❌ FAIL'})`);
}

debugCrisisPrediction().catch(console.error); 