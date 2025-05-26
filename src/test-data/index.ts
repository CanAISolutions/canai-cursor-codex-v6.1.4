/**
 * 🎭 Test Data Generators
 * Realistic Scenarios for Emotional Sovereignty Validation
 * 
 * This module generates comprehensive test data that reflects real-world
 * emotional scenarios, cultural contexts, and user journeys.
 * 
 * @fileoverview Test data generation for emotional intelligence validation
 * @version 6.1.4
 * @author CanAI Test Data Team
 */

export interface EmotionalScenario {
  state: string;
  context: string;
  urgency: string;
  userType?: string;
  complexity?: number;
}

export interface UserJourney {
  userId: string;
  sessions: Array<{
    id: string;
    emotions: string[];
    achievements: string[];
    trustScore: number;
    duration: number;
    timestamp?: number;
  }>;
  userProfile: {
    type: string;
    experience: string;
    preferences: Record<string, any>;
  };
}

export interface CulturalContext {
  locale: string;
  culture: string;
  communication: string;
  hierarchy: string;
  rtl?: boolean;
  emotionalNorms: Record<string, number>;
}

export interface TrustChallenge {
  type: string;
  severity: number;
  context: string;
  userType: string;
  expectedRecoveryTime: number;
}

export function generateEmotionalScenarios(): EmotionalScenario[] {
  return [
    // Overwhelm scenarios
    {
      state: 'overwhelmed',
      context: 'complex_project_planning',
      urgency: 'high',
      userType: 'perfectionist',
      complexity: 0.9
    },
    {
      state: 'overwhelmed',
      context: 'multiple_deadlines',
      urgency: 'high',
      userType: 'entrepreneur',
      complexity: 0.8
    },
    {
      state: 'overwhelmed',
      context: 'technical_complexity',
      urgency: 'medium',
      userType: 'creative',
      complexity: 0.7
    },

    // Uncertainty scenarios
    {
      state: 'uncertain',
      context: 'market_validation',
      urgency: 'medium',
      userType: 'first_time_founder',
      complexity: 0.6
    },
    {
      state: 'uncertain',
      context: 'strategic_direction',
      urgency: 'low',
      userType: 'experienced_professional',
      complexity: 0.5
    },
    {
      state: 'uncertain',
      context: 'technology_choice',
      urgency: 'medium',
      userType: 'technical_lead',
      complexity: 0.7
    },

    // Frustration scenarios
    {
      state: 'frustrated',
      context: 'repeated_failures',
      urgency: 'high',
      userType: 'determined_achiever',
      complexity: 0.8
    },
    {
      state: 'frustrated',
      context: 'communication_breakdown',
      urgency: 'medium',
      userType: 'team_leader',
      complexity: 0.6
    },
    {
      state: 'frustrated',
      context: 'resource_constraints',
      urgency: 'high',
      userType: 'bootstrapped_founder',
      complexity: 0.9
    },

    // Hopeful scenarios
    {
      state: 'hopeful',
      context: 'breakthrough_insight',
      urgency: 'low',
      userType: 'visionary',
      complexity: 0.4
    },
    {
      state: 'hopeful',
      context: 'positive_feedback',
      urgency: 'low',
      userType: 'validation_seeker',
      complexity: 0.3
    },
    {
      state: 'hopeful',
      context: 'new_opportunity',
      urgency: 'medium',
      userType: 'opportunist',
      complexity: 0.5
    },

    // Exhaustion scenarios
    {
      state: 'exhausted',
      context: 'long_work_session',
      urgency: 'medium',
      userType: 'workaholic',
      complexity: 0.7
    },
    {
      state: 'exhausted',
      context: 'emotional_burnout',
      urgency: 'high',
      userType: 'caregiver_type',
      complexity: 0.8
    },
    {
      state: 'exhausted',
      context: 'decision_fatigue',
      urgency: 'medium',
      userType: 'analytical_type',
      complexity: 0.6
    },

    // Confidence scenarios
    {
      state: 'confident',
      context: 'successful_milestone',
      urgency: 'low',
      userType: 'achiever',
      complexity: 0.3
    },
    {
      state: 'confident',
      context: 'skill_mastery',
      urgency: 'low',
      userType: 'learner',
      complexity: 0.4
    },
    {
      state: 'confident',
      context: 'team_success',
      urgency: 'low',
      userType: 'collaborative_leader',
      complexity: 0.2
    },

    // Excitement scenarios
    {
      state: 'excited',
      context: 'creative_breakthrough',
      urgency: 'low',
      userType: 'innovator',
      complexity: 0.5
    },
    {
      state: 'excited',
      context: 'market_opportunity',
      urgency: 'medium',
      userType: 'growth_hacker',
      complexity: 0.6
    },
    {
      state: 'excited',
      context: 'partnership_potential',
      urgency: 'medium',
      userType: 'networker',
      complexity: 0.4
    }
  ];
}

export function createCulturalContexts(): CulturalContext[] {
  return [
    {
      locale: 'en-US',
      culture: 'individualistic',
      communication: 'direct',
      hierarchy: 'low',
      emotionalNorms: {
        enthusiasm: 0.8,
        directness: 0.9,
        formality: 0.3,
        emotionalExpression: 0.7
      }
    },
    {
      locale: 'ja-JP',
      culture: 'collectivistic',
      communication: 'high-context',
      hierarchy: 'high',
      emotionalNorms: {
        harmony: 0.9,
        indirectness: 0.8,
        formality: 0.9,
        emotionalRestraint: 0.8
      }
    },
    {
      locale: 'ar-SA',
      culture: 'traditional',
      communication: 'formal',
      hierarchy: 'high',
      rtl: true,
      emotionalNorms: {
        respect: 0.95,
        formality: 0.9,
        familyOrientation: 0.9,
        hospitalityWarmth: 0.8
      }
    },
    {
      locale: 'de-DE',
      culture: 'structured',
      communication: 'precise',
      hierarchy: 'medium',
      emotionalNorms: {
        precision: 0.9,
        efficiency: 0.85,
        directness: 0.8,
        professionalDistance: 0.7
      }
    },
    {
      locale: 'pt-BR',
      culture: 'warm',
      communication: 'expressive',
      hierarchy: 'medium',
      emotionalNorms: {
        warmth: 0.9,
        expressiveness: 0.85,
        personalConnection: 0.8,
        optimism: 0.8
      }
    },
    {
      locale: 'zh-CN',
      culture: 'harmonious',
      communication: 'face-saving',
      hierarchy: 'high',
      emotionalNorms: {
        harmony: 0.9,
        faceSaving: 0.85,
        collectiveGood: 0.8,
        indirectness: 0.75
      }
    },
    {
      locale: 'hi-IN',
      culture: 'respectful',
      communication: 'relationship-first',
      hierarchy: 'high',
      emotionalNorms: {
        respect: 0.9,
        relationshipBuilding: 0.85,
        spiritualAwareness: 0.7,
        familyValues: 0.9
      }
    },
    {
      locale: 'fr-FR',
      culture: 'sophisticated',
      communication: 'nuanced',
      hierarchy: 'medium',
      emotionalNorms: {
        sophistication: 0.8,
        intellectualDepth: 0.85,
        culturalPride: 0.8,
        elegance: 0.75
      }
    },
    {
      locale: 'es-ES',
      culture: 'passionate',
      communication: 'expressive',
      hierarchy: 'medium',
      emotionalNorms: {
        passion: 0.85,
        expressiveness: 0.8,
        familyOrientation: 0.85,
        personalWarmth: 0.8
      }
    },
    {
      locale: 'ru-RU',
      culture: 'stoic',
      communication: 'direct',
      hierarchy: 'high',
      emotionalNorms: {
        stoicism: 0.8,
        directness: 0.85,
        intellectualRespect: 0.8,
        emotionalDepth: 0.7
      }
    }
  ];
}

export function simulateUserJourneys(): UserJourney[] {
  return [
    // First-time entrepreneur journey
    {
      userId: 'entrepreneur_001',
      sessions: [
        {
          id: 'session_1',
          emotions: ['nervous', 'hopeful', 'uncertain'],
          achievements: ['idea_validation', 'market_research'],
          trustScore: 3.8,
          duration: 2400,
          timestamp: Date.now() - 86400000 * 7 // 7 days ago
        },
        {
          id: 'session_2',
          emotions: ['focused', 'determined', 'optimistic'],
          achievements: ['business_model_draft', 'competitor_analysis'],
          trustScore: 4.2,
          duration: 3600,
          timestamp: Date.now() - 86400000 * 5 // 5 days ago
        },
        {
          id: 'session_3',
          emotions: ['confident', 'excited', 'strategic'],
          achievements: ['mvp_planning', 'team_formation'],
          trustScore: 4.6,
          duration: 2800,
          timestamp: Date.now() - 86400000 * 2 // 2 days ago
        }
      ],
      userProfile: {
        type: 'first_time_entrepreneur',
        experience: 'beginner',
        preferences: {
          communicationStyle: 'encouraging',
          detailLevel: 'comprehensive',
          pacing: 'steady',
          supportLevel: 'high'
        }
      }
    },

    // Experienced professional journey
    {
      userId: 'professional_002',
      sessions: [
        {
          id: 'session_1',
          emotions: ['analytical', 'skeptical', 'curious'],
          achievements: ['strategy_review', 'risk_assessment'],
          trustScore: 4.0,
          duration: 1800,
          timestamp: Date.now() - 86400000 * 10
        },
        {
          id: 'session_2',
          emotions: ['impressed', 'engaged', 'strategic'],
          achievements: ['optimization_plan', 'efficiency_gains'],
          trustScore: 4.4,
          duration: 2200,
          timestamp: Date.now() - 86400000 * 6
        },
        {
          id: 'session_3',
          emotions: ['confident', 'decisive', 'forward-thinking'],
          achievements: ['implementation_roadmap', 'team_alignment'],
          trustScore: 4.7,
          duration: 2000,
          timestamp: Date.now() - 86400000 * 1
        }
      ],
      userProfile: {
        type: 'experienced_professional',
        experience: 'advanced',
        preferences: {
          communicationStyle: 'direct',
          detailLevel: 'executive_summary',
          pacing: 'efficient',
          supportLevel: 'minimal'
        }
      }
    },

    // Creative innovator journey
    {
      userId: 'creative_003',
      sessions: [
        {
          id: 'session_1',
          emotions: ['inspired', 'scattered', 'passionate'],
          achievements: ['concept_exploration', 'creative_brainstorming'],
          trustScore: 4.1,
          duration: 3200,
          timestamp: Date.now() - 86400000 * 8
        },
        {
          id: 'session_2',
          emotions: ['focused', 'breakthrough', 'energized'],
          achievements: ['design_direction', 'prototype_concept'],
          trustScore: 4.5,
          duration: 4000,
          timestamp: Date.now() - 86400000 * 4
        },
        {
          id: 'session_3',
          emotions: ['visionary', 'confident', 'revolutionary'],
          achievements: ['innovation_framework', 'market_disruption_plan'],
          trustScore: 4.8,
          duration: 3600,
          timestamp: Date.now() - 86400000 * 1
        }
      ],
      userProfile: {
        type: 'creative_innovator',
        experience: 'intermediate',
        preferences: {
          communicationStyle: 'inspiring',
          detailLevel: 'visual_rich',
          pacing: 'dynamic',
          supportLevel: 'collaborative'
        }
      }
    },

    // Struggling startup founder journey
    {
      userId: 'founder_004',
      sessions: [
        {
          id: 'session_1',
          emotions: ['frustrated', 'overwhelmed', 'determined'],
          achievements: ['problem_identification', 'resource_audit'],
          trustScore: 3.5,
          duration: 2600,
          timestamp: Date.now() - 86400000 * 12
        },
        {
          id: 'session_2',
          emotions: ['hopeful', 'strategic', 'resilient'],
          achievements: ['pivot_strategy', 'cost_optimization'],
          trustScore: 3.9,
          duration: 3400,
          timestamp: Date.now() - 86400000 * 7
        },
        {
          id: 'session_3',
          emotions: ['breakthrough', 'relieved', 'optimistic'],
          achievements: ['funding_strategy', 'market_repositioning'],
          trustScore: 4.3,
          duration: 2800,
          timestamp: Date.now() - 86400000 * 3
        }
      ],
      userProfile: {
        type: 'struggling_founder',
        experience: 'intermediate',
        preferences: {
          communicationStyle: 'supportive',
          detailLevel: 'actionable',
          pacing: 'urgent_but_thoughtful',
          supportLevel: 'high'
        }
      }
    },

    // Technical leader journey
    {
      userId: 'tech_lead_005',
      sessions: [
        {
          id: 'session_1',
          emotions: ['analytical', 'methodical', 'cautious'],
          achievements: ['architecture_review', 'scalability_planning'],
          trustScore: 4.2,
          duration: 2000,
          timestamp: Date.now() - 86400000 * 9
        },
        {
          id: 'session_2',
          emotions: ['confident', 'systematic', 'innovative'],
          achievements: ['technology_roadmap', 'team_development'],
          trustScore: 4.5,
          duration: 2400,
          timestamp: Date.now() - 86400000 * 5
        },
        {
          id: 'session_3',
          emotions: ['visionary', 'strategic', 'empowered'],
          achievements: ['digital_transformation', 'innovation_culture'],
          trustScore: 4.7,
          duration: 2200,
          timestamp: Date.now() - 86400000 * 2
        }
      ],
      userProfile: {
        type: 'technical_leader',
        experience: 'expert',
        preferences: {
          communicationStyle: 'precise',
          detailLevel: 'technical_depth',
          pacing: 'methodical',
          supportLevel: 'consultative'
        }
      }
    }
  ];
}

export function generateTrustChallenges(): TrustChallenge[] {
  return [
    {
      type: 'system_error',
      severity: 0.8,
      context: 'critical_presentation_prep',
      userType: 'high_stakes_professional',
      expectedRecoveryTime: 300000 // 5 minutes
    },
    {
      type: 'misunderstanding',
      severity: 0.6,
      context: 'creative_direction_conflict',
      userType: 'artistic_perfectionist',
      expectedRecoveryTime: 600000 // 10 minutes
    },
    {
      type: 'expectation_mismatch',
      severity: 0.7,
      context: 'technical_complexity_underestimated',
      userType: 'non_technical_founder',
      expectedRecoveryTime: 900000 // 15 minutes
    },
    {
      type: 'technical_failure',
      severity: 0.9,
      context: 'data_loss_during_important_work',
      userType: 'data_dependent_analyst',
      expectedRecoveryTime: 1200000 // 20 minutes
    },
    {
      type: 'communication_breakdown',
      severity: 0.5,
      context: 'cultural_sensitivity_miss',
      userType: 'international_collaborator',
      expectedRecoveryTime: 450000 // 7.5 minutes
    },
    {
      type: 'performance_degradation',
      severity: 0.4,
      context: 'slow_response_during_deadline',
      userType: 'time_sensitive_user',
      expectedRecoveryTime: 180000 // 3 minutes
    },
    {
      type: 'feature_limitation',
      severity: 0.6,
      context: 'advanced_feature_not_available',
      userType: 'power_user',
      expectedRecoveryTime: 720000 // 12 minutes
    },
    {
      type: 'emotional_disconnect',
      severity: 0.8,
      context: 'tone_mismatch_during_vulnerability',
      userType: 'emotionally_sensitive_user',
      expectedRecoveryTime: 1800000 // 30 minutes
    }
  ];
}

export function generateComplexScenarios(): Array<{
  scenario: string;
  emotionalComplexity: number;
  culturalSensitivity: number;
  trustRequirement: number;
  expectedOutcomes: string[];
}> {
  return [
    {
      scenario: 'cross_cultural_team_conflict_resolution',
      emotionalComplexity: 0.9,
      culturalSensitivity: 0.95,
      trustRequirement: 0.85,
      expectedOutcomes: ['harmony_restored', 'cultural_understanding', 'team_cohesion']
    },
    {
      scenario: 'startup_pivot_emotional_support',
      emotionalComplexity: 0.85,
      culturalSensitivity: 0.6,
      trustRequirement: 0.9,
      expectedOutcomes: ['confidence_rebuilt', 'strategic_clarity', 'resilience_strengthened']
    },
    {
      scenario: 'technical_failure_during_investor_demo',
      emotionalComplexity: 0.95,
      culturalSensitivity: 0.7,
      trustRequirement: 0.95,
      expectedOutcomes: ['crisis_management', 'confidence_preservation', 'relationship_maintained']
    },
    {
      scenario: 'creative_block_breakthrough_facilitation',
      emotionalComplexity: 0.8,
      culturalSensitivity: 0.5,
      trustRequirement: 0.8,
      expectedOutcomes: ['creativity_unlocked', 'inspiration_ignited', 'momentum_restored']
    },
    {
      scenario: 'burnout_recovery_and_sustainable_practices',
      emotionalComplexity: 0.9,
      culturalSensitivity: 0.7,
      trustRequirement: 0.9,
      expectedOutcomes: ['energy_restored', 'boundaries_established', 'wellbeing_prioritized']
    }
  ];
}

export function generatePerformanceTestData(): Array<{
  userCount: number;
  emotionalComplexity: 'low' | 'medium' | 'high' | 'maximum';
  culturalDiversity: number;
  expectedResponseTime: number;
  expectedThroughput: number;
}> {
  return [
    {
      userCount: 10,
      emotionalComplexity: 'low',
      culturalDiversity: 0.3,
      expectedResponseTime: 100,
      expectedThroughput: 1000
    },
    {
      userCount: 100,
      emotionalComplexity: 'medium',
      culturalDiversity: 0.6,
      expectedResponseTime: 200,
      expectedThroughput: 800
    },
    {
      userCount: 1000,
      emotionalComplexity: 'high',
      culturalDiversity: 0.8,
      expectedResponseTime: 500,
      expectedThroughput: 500
    },
    {
      userCount: 10000,
      emotionalComplexity: 'maximum',
      culturalDiversity: 1.0,
      expectedResponseTime: 1000,
      expectedThroughput: 200
    }
  ];
}

export function generateAccessibilityScenarios(): Array<{
  accessibilityNeeds: string[];
  emotionalContext: string;
  expectedAdaptations: string[];
  successMetrics: Record<string, number>;
}> {
  return [
    {
      accessibilityNeeds: ['screen_reader', 'high_contrast'],
      emotionalContext: 'confidence_building',
      expectedAdaptations: ['aria_labels', 'color_independent_feedback', 'audio_cues'],
      successMetrics: {
        accessibilityScore: 0.95,
        emotionalResonance: 0.9,
        userSatisfaction: 0.85
      }
    },
    {
      accessibilityNeeds: ['reduced_motion', 'cognitive_load_reduction'],
      emotionalContext: 'overwhelm_management',
      expectedAdaptations: ['static_animations', 'simplified_interface', 'clear_hierarchy'],
      successMetrics: {
        accessibilityScore: 0.9,
        emotionalResonance: 0.95,
        userSatisfaction: 0.9
      }
    },
    {
      accessibilityNeeds: ['keyboard_navigation', 'voice_control'],
      emotionalContext: 'empowerment_focus',
      expectedAdaptations: ['tab_order', 'voice_commands', 'keyboard_shortcuts'],
      successMetrics: {
        accessibilityScore: 0.92,
        emotionalResonance: 0.88,
        userSatisfaction: 0.87
      }
    }
  ];
} 