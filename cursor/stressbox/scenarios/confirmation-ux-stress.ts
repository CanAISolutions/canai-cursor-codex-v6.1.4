/**
 * confirmation-ux-stress.ts
 * 
 * Purpose: Confirmation UX Layer stress test scenarios
 * Focus: Emotional depth recovery, override reduction, trust score accuracy,
 *        confirmation latency, and conflict resolution
 * 
 * TAP-Status: Locked
 * Codex: v2.7.8
 * Trust Score: 4.2
 */

import { StressTest } from '../stressbox-engine';

export const confirmationUXStressTests: StressTest[] = [
  // Emotional Depth Recovery
  {
    id: 'cu_emotion_1',
    type: 'input',
    scenario: 'Low emotional depth recovery',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue'
    },
    riskLevel: 'medium'
  },
  {
    id: 'cu_emotion_2',
    type: 'input',
    scenario: 'Missing emotional anchors',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'unknown'
    },
    riskLevel: 'high'
  },

  // Override Reduction
  {
    id: 'cu_override_1',
    type: 'input',
    scenario: 'High override frequency',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        fieldConfirmations: {
          business_type: { wasEdited: true },
          primary_goal: { wasEdited: true },
          tone: { wasEdited: true }
        }
      }
    },
    riskLevel: 'high'
  },
  {
    id: 'cu_override_2',
    type: 'input',
    scenario: 'Cascading overrides',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        fieldConfirmations: {
          business_type: { wasEdited: true, editReason: 'Clarification needed' },
          primary_goal: { wasEdited: true, editReason: 'Dependent on business type' }
        }
      }
    },
    riskLevel: 'medium'
  },

  // Trust Score Accuracy
  {
    id: 'cu_trust_1',
    type: 'input',
    scenario: 'Trust score mismatch',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        intentConfidence: 0.95,
        emotionalTrustScore: 3.8
      }
    },
    riskLevel: 'high'
  },
  {
    id: 'cu_trust_2',
    type: 'input',
    scenario: 'Inconsistent trust signals',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        intentConfidence: 0.7,
        emotionalTrustScore: 4.5
      }
    },
    riskLevel: 'medium'
  },

  // Confirmation Latency
  {
    id: 'cu_latency_1',
    type: 'input',
    scenario: 'High confirmation latency',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        confirmationLatency: 2000 // 2 seconds
      }
    },
    riskLevel: 'high'
  },
  {
    id: 'cu_latency_2',
    type: 'input',
    scenario: 'Cascading latency',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        fieldConfirmations: {
          business_type: { confirmationLatency: 1500 },
          primary_goal: { confirmationLatency: 2000 },
          tone: { confirmationLatency: 1800 }
        }
      }
    },
    riskLevel: 'medium'
  },

  // Conflict Resolution
  {
    id: 'cu_conflict_1',
    type: 'input',
    scenario: 'Spark vs Vision conflict',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        conflictDetected: true,
        conflictFields: ['tone', 'motivator'],
        sparkSignal: { tone: 'playful', motivator: 'make impact' },
        visionSignal: { tone: 'professional', motivator: 'increase revenue' }
      }
    },
    riskLevel: 'high'
  },
  {
    id: 'cu_conflict_2',
    type: 'input',
    scenario: 'Multiple field conflicts',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        conflictDetected: true,
        conflictFields: ['business_type', 'primary_goal', 'tone', 'motivator'],
        sparkSignal: {
          business_type: 'saas',
          primary_goal: 'grow user base',
          tone: 'playful',
          motivator: 'make impact'
        },
        visionSignal: {
          business_type: 'tech',
          primary_goal: 'launch',
          tone: 'professional',
          motivator: 'increase revenue'
        }
      }
    },
    riskLevel: 'high'
  },

  // Mixed Edge Cases
  {
    id: 'cu_edge_1',
    type: 'input',
    scenario: 'Missing tone + conflicting motivator',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'unknown',
      motivator: 'increase revenue',
      _meta: {
        conflictDetected: true,
        conflictFields: ['motivator'],
        sparkSignal: { motivator: 'make impact' },
        visionSignal: { motivator: 'increase revenue' }
      }
    },
    riskLevel: 'high'
  },
  {
    id: 'cu_edge_2',
    type: 'input',
    scenario: 'Low trust + high latency',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        emotionalTrustScore: 3.8,
        confirmationLatency: 2500,
        fieldConfirmations: {
          business_type: { confirmationLatency: 2000 },
          primary_goal: { confirmationLatency: 2500 }
        }
      }
    },
    riskLevel: 'high'
  }
]; 