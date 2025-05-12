/**
 * Confirmation UX Stress Test Scenarios
 * 
 * Purpose: Validate confirmation UX layer against edge cases, ambiguous inputs,
 *          and tone conflicts. Measures trust, emotional alignment, and performance.
 * 
 * TAP-Status: Locked
 * Codex: v2.7.8
 * Trust Score: 4.2
 */

import { StressTest } from '../stressbox-engine';

export const confirmationUXStressTests: StressTest[] = [
  // Edge Cases
  {
    id: 'cu_edge_1',
    type: 'input',
    scenario: 'Empty input with high confidence',
    input: {
      business_type: '',
      primary_goal: '',
      tone: '',
      motivator: '',
      _meta: {
        intentConfidence: 0.95,
        emotionalTrustScore: 4.5
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
  },

  // Ambiguous Inputs
  {
    id: 'cu_ambig_1',
    type: 'input',
    scenario: 'Mixed tone signals',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        sparkTone: 'playful',
        visionTone: 'serious',
        conflictDetected: true,
        conflictFields: ['tone']
      }
    },
    riskLevel: 'medium'
  },
  {
    id: 'cu_ambig_2',
    type: 'input',
    scenario: 'Incomplete emotional anchors',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        emotionalAnchorPresent: false,
        sparkSignal: false,
        visionCatcher: false
      }
    },
    riskLevel: 'high'
  },

  // Tone Conflicts
  {
    id: 'cu_tone_1',
    type: 'input',
    scenario: 'Spark vs Vision tone conflict',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        sparkTone: 'playful',
        visionTone: 'serious',
        conflictDetected: true,
        conflictFields: ['tone'],
        emotionalTrustScore: 4.0
      }
    },
    riskLevel: 'medium'
  },
  {
    id: 'cu_tone_2',
    type: 'input',
    scenario: 'Multiple tone conflicts',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        sparkTone: 'playful',
        visionTone: 'serious',
        formTone: 'formal',
        conflictDetected: true,
        conflictFields: ['tone', 'motivator'],
        emotionalTrustScore: 3.9
      }
    },
    riskLevel: 'high'
  },

  // Performance Scenarios
  {
    id: 'cu_perf_1',
    type: 'performance',
    scenario: 'High latency confirmation',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        confirmationLatency: 2000,
        fieldConfirmations: {
          business_type: { confirmationLatency: 1500 },
          primary_goal: { confirmationLatency: 2000 },
          tone: { confirmationLatency: 1800 }
        }
      }
    },
    riskLevel: 'high'
  },
  {
    id: 'cu_perf_2',
    type: 'performance',
    scenario: 'Cascading field confirmations',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        fieldConfirmations: {
          business_type: { wasEdited: true },
          primary_goal: { wasEdited: true, editReason: 'Dependent on business type' },
          tone: { wasEdited: true, editReason: 'Dependent on motivator' }
        }
      }
    },
    riskLevel: 'medium'
  },

  // Trust Score Scenarios
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
        emotionalTrustScore: 3.8,
        trustScoreDelta: -0.2
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
        emotionalTrustScore: 4.5,
        trustScoreDelta: 0.3
      }
    },
    riskLevel: 'medium'
  },

  // Emotional Depth Scenarios
  {
    id: 'cu_emotion_1',
    type: 'input',
    scenario: 'Low emotional depth',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        emotionalDepth: 0.3,
        emotionalTrustScore: 3.9,
        emotionalAnchorPresent: false
      }
    },
    riskLevel: 'high'
  },
  {
    id: 'cu_emotion_2',
    type: 'input',
    scenario: 'Emotional depth recovery',
    input: {
      business_type: 'tech',
      primary_goal: 'launch',
      tone: 'professional',
      motivator: 'increase revenue',
      _meta: {
        initialEmotionalDepth: 0.3,
        finalEmotionalDepth: 0.8,
        emotionalDepthDelta: 0.5,
        emotionalTrustScore: 4.2
      }
    },
    riskLevel: 'medium'
  },

  // Override Scenarios
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
        },
        overrideRate: 0.75
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
          primary_goal: { wasEdited: true, editReason: 'Dependent on business type' },
          tone: { wasEdited: true, editReason: 'Dependent on motivator' }
        },
        overrideRate: 0.6
      }
    },
    riskLevel: 'medium'
  }
]; 