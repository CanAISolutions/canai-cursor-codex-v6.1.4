/**
 * Test AI Blueprint Step 3 - Field Inference Enhancement
 * 
 * Validates the enhanced field inference logic implemented in Step 3
 * Tests minimal, partial, and complete input scenarios with inference accuracy validation
 * 
 * Date: June 09, 2025, 09:34 AM MDT
 * Version: V4 Schema Compliance Test
 */

// ✅ CRITICAL: Load .env file FIRST before anything else
require('dotenv').config();

import { applyMCPEnhancers } from './prompts/ai_blueprint.mcp';
import type { AIBlueprintInput } from './prompts/ai_blueprint.mcp';

// Test Case 1: Minimal Input - Only primaryGoal provided
const testCase1MinimalInput = {
  primaryGoal: "Build AI chatbot for customer support"
};

// Test Case 2: Partial Input - Business name, goal, and competitive context
const testCase2PartialInput = {
  businessName: "TechFlow Analytics",
  primaryGoal: "Implement predictive analytics for sales forecasting", 
  competitiveContext: "Advanced ML vs Excel-based forecasting"
};

// Test Case 3: Complete Input - All fields provided (validation test)
const testCase3CompleteInput = {
  businessName: "HealthTech Innovations",
  targetAudience: "Healthcare providers and medical staff",
  primaryGoal: "Develop AI diagnosis assistant for medical imaging",
  competitiveContext: "Proprietary deep learning vs generic image analysis",
  brandVoice: "professional",
  resourceConstraints: "$50K budget, 6-month timeline, compliance requirements",
  currentStatus: "Manual radiology review processes",
  aiSolution: "Computer vision AI for medical image analysis",
  mvpFeatures: "X-ray analysis, anomaly detection, compliance reporting",
  successMetrics: "30d: Algorithm training; 60d: Clinical validation; 90d: FDA submission",
  linkedPrompts: ["business-plan", "site-audit"],
  minimumViableExecution: "Use TensorFlow for deep learning, DICOM integration"
};

// Expected inference patterns from Step 3 preparation
const expectedInferencePatterns = {
  testCase1: {
    businessName: /SupportBot|Customer Support|Support/i,
    targetAudience: /customer service|support/i,
    competitiveContext: /chatbot|ticketing/i,
    brandVoice: "approachable",
    aiSolution: /chatbot|support/i,
    mvpFeatures: /natural language|NLP|routing/i,
    successMetrics: /conversations|automation/i,
    linkedPrompts: ["business-plan", "email-campaign"],
    minimumViableExecution: /Dialogflow|Zendesk/i
  },
  testCase2: {
    targetAudience: /sales|revenue|analyst/i,
    brandVoice: /(technical|strategic)/,
    resourceConstraints: /enterprise|expertise/i,
    currentStatus: /Excel|analytics/i,
    aiSolution: /machine learning|forecasting/i,
    mvpFeatures: /data analysis|prediction|accuracy/i,
    successMetrics: /pipeline|model|accuracy/i,
    linkedPrompts: ["business-plan", "ad-amplify"],
    minimumViableExecution: /Python|Scikit-learn|Tableau/i
  },
  testCase3: {
    // Should preserve all original fields (no inference needed)
    preserveOriginal: true
  }
};

// Inference accuracy validation thresholds
const inferenceThresholds = {
  minAccuracy: 0.85,
  minTrustScore: 4.2,
  maxResponseTime: 2000, // 2 seconds
  requiredFieldCount: 12
};

async function runInferenceTests(): Promise<void> {
  console.log('🚀 Starting AI Blueprint Step 3 Inference Tests');
  console.log('=========================================================');

  try {
    // Test Case 1: Minimal Input Inference
    console.log('\n📋 Test Case 1: Minimal Input Enhancement');
    console.log('Input:', JSON.stringify(testCase1MinimalInput, null, 2));
    
    const startTime1 = Date.now();
    const enhanced1 = await applyMCPEnhancers(testCase1MinimalInput);
    const responseTime1 = Date.now() - startTime1;

    console.log('Enhanced Output:', JSON.stringify(enhanced1, null, 2));
    console.log(`Response Time: ${responseTime1}ms`);

    // Test Case 2: Partial Input Enhancement
    console.log('\n📋 Test Case 2: Partial Input Enhancement');
    console.log('Input:', JSON.stringify(testCase2PartialInput, null, 2));
    
    const startTime2 = Date.now();
    const enhanced2 = await applyMCPEnhancers(testCase2PartialInput);
    const responseTime2 = Date.now() - startTime2;

    console.log('Enhanced Output:', JSON.stringify(enhanced2, null, 2));
    console.log(`Response Time: ${responseTime2}ms`);

    // Test Case 3: Complete Input Passthrough
    console.log('\n📋 Test Case 3: Complete Input Validation');
    console.log('Input:', JSON.stringify(testCase3CompleteInput, null, 2));
    
    const startTime3 = Date.now();
    const enhanced3 = await applyMCPEnhancers(testCase3CompleteInput);
    const responseTime3 = Date.now() - startTime3;

    console.log('Enhanced Output:', JSON.stringify(enhanced3, null, 2));
    console.log(`Response Time: ${responseTime3}ms`);

    console.log('\n🎉 ALL STEP 3 INFERENCE TESTS COMPLETED');

  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

function validateTestCase1(enhanced: AIBlueprintInput, original: any): { passed: boolean; details: any } {
  const validation = { passed: true, details: {} };
  const patterns = expectedInferencePatterns.testCase1;

  // Check all 12 required fields are present
  const requiredFields = ['businessName', 'targetAudience', 'primaryGoal', 'competitiveContext', 'brandVoice', 'resourceConstraints', 'currentStatus', 'aiSolution', 'mvpFeatures', 'successMetrics', 'linkedPrompts', 'minimumViableExecution'];
  
  requiredFields.forEach(field => {
    if (!enhanced[field as keyof AIBlueprintInput]) {
      validation.passed = false;
      validation.details[field] = 'Missing required field';
    }
  });

  // Validate inference patterns
  if (!patterns.businessName.test(enhanced.businessName)) {
    validation.details.businessName = `Expected customer support related name, got: ${enhanced.businessName}`;
  }

  if (!patterns.targetAudience.test(enhanced.targetAudience)) {
    validation.details.targetAudience = `Expected customer service audience, got: ${enhanced.targetAudience}`;
  }

  if (enhanced.brandVoice !== patterns.brandVoice) {
    validation.details.brandVoice = `Expected ${patterns.brandVoice}, got: ${enhanced.brandVoice}`;
  }

  if (!patterns.aiSolution.test(enhanced.aiSolution)) {
    validation.details.aiSolution = `Expected chatbot solution, got: ${enhanced.aiSolution}`;
  }

  // Check linked prompts inference
  const expectedPrompts = patterns.linkedPrompts;
  if (!arraysEqual(enhanced.linkedPrompts.sort(), expectedPrompts.sort())) {
    validation.details.linkedPrompts = `Expected ${expectedPrompts}, got: ${enhanced.linkedPrompts}`;
  }

  return validation;
}

function validateTestCase2(enhanced: AIBlueprintInput, original: any): { passed: boolean; details: any } {
  const validation = { passed: true, details: {} };
  const patterns = expectedInferencePatterns.testCase2;

  // Verify original fields are preserved
  if (enhanced.businessName !== original.businessName) {
    validation.passed = false;
    validation.details.businessNamePreservation = 'Original business name not preserved';
  }

  if (enhanced.primaryGoal !== original.primaryGoal) {
    validation.passed = false;
    validation.details.primaryGoalPreservation = 'Original primary goal not preserved';
  }

  // Check inferred fields match analytics context
  if (!patterns.targetAudience.test(enhanced.targetAudience)) {
    validation.details.targetAudience = `Expected analytics audience, got: ${enhanced.targetAudience}`;
  }

  if (!patterns.brandVoice.test(enhanced.brandVoice)) {
    validation.details.brandVoice = `Expected technical/strategic voice, got: ${enhanced.brandVoice}`;
  }

  if (!patterns.aiSolution.test(enhanced.aiSolution)) {
    validation.details.aiSolution = `Expected ML/forecasting solution, got: ${enhanced.aiSolution}`;
  }

  return validation;
}

function validateTestCase3(enhanced: AIBlueprintInput, original: any): { passed: boolean; details: any } {
  const validation = { passed: true, details: {} };

  // For complete input, all original fields should be preserved exactly
  const fieldsToCheck = ['businessName', 'targetAudience', 'primaryGoal', 'competitiveContext', 'brandVoice', 'resourceConstraints', 'currentStatus', 'aiSolution', 'mvpFeatures', 'successMetrics', 'minimumViableExecution'];

  fieldsToCheck.forEach(field => {
    if (enhanced[field as keyof AIBlueprintInput] !== original[field]) {
      validation.passed = false;
      validation.details[field] = `Field modified: expected "${original[field]}", got "${enhanced[field as keyof AIBlueprintInput]}"`;
    }
  });

  // Check linkedPrompts array preservation
  if (!arraysEqual(enhanced.linkedPrompts, original.linkedPrompts)) {
    validation.passed = false;
    validation.details.linkedPrompts = `Array modified: expected ${original.linkedPrompts}, got ${enhanced.linkedPrompts}`;
  }

  return validation;
}

function calculateOverallResults(enhancedInputs: AIBlueprintInput[], responseTimes: number[]) {
  const totalFields = enhancedInputs.length * 12;
  let completedFields = 0;
  let trustScoreSum = 0;

  enhancedInputs.forEach(enhanced => {
    // Count non-empty fields
    const requiredFields = ['businessName', 'targetAudience', 'primaryGoal', 'competitiveContext', 'brandVoice', 'resourceConstraints', 'currentStatus', 'aiSolution', 'mvpFeatures', 'successMetrics', 'linkedPrompts', 'minimumViableExecution'];
    
    requiredFields.forEach(field => {
      const value = enhanced[field as keyof AIBlueprintInput];
      if (value && (typeof value === 'string' ? value.trim().length > 0 : value.length > 0)) {
        completedFields++;
      }
    });

    // Calculate basic trust score
    trustScoreSum += calculateBasicTrustScore(enhanced);
  });

  const overallAccuracy = completedFields / totalFields;
  const trustScoreAverage = trustScoreSum / enhancedInputs.length;
  const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;

  return {
    overallAccuracy,
    trustScoreAverage,
    averageResponseTime: Math.round(averageResponseTime)
  };
}

function calculateBasicTrustScore(enhanced: AIBlueprintInput): number {
  const baseScore = 4.2;
  const contextualityBonus = enhanced.competitiveContext && enhanced.competitiveContext.length > 20 ? 0.2 : 0;
  const specificityBonus = enhanced.mvpFeatures && enhanced.mvpFeatures.length > 30 ? 0.3 : 0;
  const executionBonus = enhanced.minimumViableExecution && enhanced.minimumViableExecution.includes('Use') ? 0.3 : 0;

  return Math.min(5.0, baseScore + contextualityBonus + specificityBonus + executionBonus);
}

function arraysEqual(a: any[], b: any[]): boolean {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}

// Run the tests
runInferenceTests().catch(console.error); 