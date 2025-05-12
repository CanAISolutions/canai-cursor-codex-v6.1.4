/**
 * business-plan-stress.ts
 * 
 * Purpose: Business plan specific stress test scenarios
 * Includes: Input validation, tone consistency, and structural integrity tests
 * 
 * TAP-Status: Locked
 * Codex: v6.1.4
 * Trust Score: 4.2
 */

import { StressTest } from '../stressbox-engine';

export const businessPlanStressTests: StressTest[] = [
  // Underspecified inputs
  {
    id: 'bp_under_1',
    type: 'input',
    scenario: 'Minimal business context',
    input: {
      industry: 'tech',
      goal: 'launch',
      tone: 'professional'
    },
    riskLevel: 'low'
  },
  {
    id: 'bp_under_2',
    type: 'input',
    scenario: 'Missing market analysis',
    input: {
      industry: 'tech',
      goal: 'launch',
      tone: 'professional',
      targetMarket: 'everyone'
    },
    riskLevel: 'medium'
  },
  {
    id: 'bp_under_3',
    type: 'input',
    scenario: 'Incomplete financials',
    input: {
      industry: 'tech',
      goal: 'secure funding',
      tone: 'professional',
      budget: 'flexible'
    },
    riskLevel: 'high'
  },

  // Overloaded inputs
  {
    id: 'bp_over_1',
    type: 'input',
    scenario: 'Excessive market detail',
    input: {
      industry: 'tech',
      goal: 'launch',
      tone: 'professional',
      targetMarket: 'global'.repeat(50)
    },
    riskLevel: 'high'
  },
  {
    id: 'bp_over_2',
    type: 'input',
    scenario: 'Conflicting business models',
    input: {
      industry: 'tech',
      goal: 'launch',
      tone: 'professional',
      modelType: ['b2b', 'b2c', 'c2c', 'p2p']
    },
    riskLevel: 'high'
  },
  {
    id: 'bp_over_3',
    type: 'input',
    scenario: 'Overlapping market segments',
    input: {
      industry: 'tech',
      goal: 'launch',
      tone: 'professional',
      segments: ['enterprise', 'smb', 'startup', 'individual', 'government']
    },
    riskLevel: 'medium'
  },

  // Tone incoherence
  {
    id: 'bp_tone_1',
    type: 'tone',
    scenario: 'Mixed professional/enthusiastic',
    input: {
      industry: 'finance',
      goal: 'secure funding',
      tone: 'professional',
      enhancers: {
        emotionalDepth: true,
        urgency: true
      }
    },
    riskLevel: 'medium'
  },
  {
    id: 'bp_tone_2',
    type: 'tone',
    scenario: 'Inappropriate for industry',
    input: {
      industry: 'healthcare',
      goal: 'launch',
      tone: 'enthusiastic',
      enhancers: {
        useAnalogies: true
      }
    },
    riskLevel: 'high'
  },
  {
    id: 'bp_tone_3',
    type: 'tone',
    scenario: 'Conflicting emotional cues',
    input: {
      industry: 'tech',
      goal: 'launch',
      tone: 'professional',
      enhancers: {
        emotionalDepth: true,
        urgency: true,
        useAnalogies: true
      }
    },
    riskLevel: 'medium'
  },

  // Structural stress
  {
    id: 'bp_struct_1',
    type: 'structure',
    scenario: 'Missing executive summary',
    input: {
      industry: 'tech',
      goal: 'launch',
      tone: 'professional',
      sections: ['market', 'financials', 'team']
    },
    riskLevel: 'high'
  },
  {
    id: 'bp_struct_2',
    type: 'structure',
    scenario: 'Incomplete financial projections',
    input: {
      industry: 'tech',
      goal: 'secure funding',
      tone: 'professional',
      financials: {
        revenue: 'projected',
        costs: 'estimated'
      }
    },
    riskLevel: 'high'
  },
  {
    id: 'bp_struct_3',
    type: 'structure',
    scenario: 'Weak competitive analysis',
    input: {
      industry: 'tech',
      goal: 'launch',
      tone: 'professional',
      competitors: 'none'
    },
    riskLevel: 'medium'
  },

  // Content risk
  {
    id: 'bp_content_1',
    type: 'content',
    scenario: 'Unrealistic market size',
    input: {
      industry: 'tech',
      goal: 'launch',
      tone: 'professional',
      marketSize: 'trillion dollar market'
    },
    riskLevel: 'high'
  },
  {
    id: 'bp_content_2',
    type: 'content',
    scenario: 'Vague value proposition',
    input: {
      industry: 'tech',
      goal: 'launch',
      tone: 'professional',
      valueProp: 'better than competitors'
    },
    riskLevel: 'medium'
  },
  {
    id: 'bp_content_3',
    type: 'content',
    scenario: 'Unsubstantiated claims',
    input: {
      industry: 'tech',
      goal: 'secure funding',
      tone: 'professional',
      traction: 'viral growth',
      metrics: 'exponential'
    },
    riskLevel: 'high'
  }
]; 