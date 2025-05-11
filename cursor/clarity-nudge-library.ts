/**
 * @file cursor/clarity-nudge-library.ts
 * @description Library of clarity nudges for the Clarity Engine
 * @version 6.2.1
 */

interface ClarityNudge {
  id: string;
  type: 'cta_trigger' | 'reengage_nudge' | 'input_clarifier';
  message: string;
  context: {
    minTrustScore: number;
    maxTrustScore: number;
    personaTypes: string[];
    industries: string[];
  };
  metadata: {
    emotionalTone: string;
    confidenceLevel: number;
    usageCount: number;
    successRate: number;
  };
}

export class ClarityNudgeLibrary {
  private nudges: Map<string, ClarityNudge>;
  private readonly defaultNudges: ClarityNudge[] = [
    {
      id: 'cta_001',
      type: 'cta_trigger',
      message: "Ready to transform this vision into reality? Let's build your blueprint.",
      context: {
        minTrustScore: 4.2,
        maxTrustScore: 5.0,
        personaTypes: ['entrepreneur', 'business_owner', 'strategist'],
        industries: ['all']
      },
      metadata: {
        emotionalTone: 'confident',
        confidenceLevel: 0.9,
        usageCount: 0,
        successRate: 0.85
      }
    },
    {
      id: 'cta_002',
      type: 'cta_trigger',
      message: "Your breakthrough is waiting. Shall we bring it to life?",
      context: {
        minTrustScore: 4.5,
        maxTrustScore: 5.0,
        personaTypes: ['innovator', 'creator', 'visionary'],
        industries: ['tech', 'creative', 'education']
      },
      metadata: {
        emotionalTone: 'inspiring',
        confidenceLevel: 0.95,
        usageCount: 0,
        successRate: 0.92
      }
    },
    {
      id: 'reengage_001',
      type: 'reengage_nudge',
      message: "I notice you're exploring this area. Would you like to dive deeper?",
      context: {
        minTrustScore: 3.8,
        maxTrustScore: 4.5,
        personaTypes: ['researcher', 'analyst', 'student'],
        industries: ['all']
      },
      metadata: {
        emotionalTone: 'curious',
        confidenceLevel: 0.85,
        usageCount: 0,
        successRate: 0.78
      }
    },
    {
      id: 'reengage_002',
      type: 'reengage_nudge',
      message: "Your journey is unique. Let's make it extraordinary.",
      context: {
        minTrustScore: 4.0,
        maxTrustScore: 4.8,
        personaTypes: ['entrepreneur', 'business_owner'],
        industries: ['retail', 'service', 'consulting']
      },
      metadata: {
        emotionalTone: 'supportive',
        confidenceLevel: 0.88,
        usageCount: 0,
        successRate: 0.82
      }
    },
    {
      id: 'clarify_001',
      type: 'input_clarifier',
      message: "To help you better, could you tell me more about your vision?",
      context: {
        minTrustScore: 3.5,
        maxTrustScore: 4.2,
        personaTypes: ['all'],
        industries: ['all']
      },
      metadata: {
        emotionalTone: 'helpful',
        confidenceLevel: 0.82,
        usageCount: 0,
        successRate: 0.75
      }
    },
    {
      id: 'clarify_002',
      type: 'input_clarifier',
      message: "I want to ensure I understand your needs perfectly. Could you elaborate?",
      context: {
        minTrustScore: 3.8,
        maxTrustScore: 4.5,
        personaTypes: ['professional', 'manager', 'director'],
        industries: ['corporate', 'enterprise', 'government']
      },
      metadata: {
        emotionalTone: 'professional',
        confidenceLevel: 0.85,
        usageCount: 0,
        successRate: 0.80
      }
    }
  ];

  constructor() {
    this.nudges = new Map();
    this.initializeNudges();
  }

  private initializeNudges(): void {
    this.defaultNudges.forEach(nudge => {
      this.nudges.set(nudge.id, nudge);
    });
  }

  getNudge(params: {
    type: 'cta_trigger' | 'reengage_nudge' | 'input_clarifier';
    trustScore: number;
    personaType: string;
    industry: string;
  }): ClarityNudge | null {
    const matchingNudges = Array.from(this.nudges.values())
      .filter(nudge => {
        const { type, context } = nudge;
        return (
          type === params.type &&
          params.trustScore >= context.minTrustScore &&
          params.trustScore <= context.maxTrustScore &&
          (context.personaTypes.includes('all') || context.personaTypes.includes(params.personaType)) &&
          (context.industries.includes('all') || context.industries.includes(params.industry))
        );
      })
      .sort((a, b) => b.metadata.successRate - a.metadata.successRate);

    return matchingNudges[0] || null;
  }

  async updateNudgeMetrics(nudgeId: string, success: boolean): Promise<void> {
    const nudge = this.nudges.get(nudgeId);
    if (nudge) {
      nudge.metadata.usageCount++;
      const currentSuccessRate = nudge.metadata.successRate;
      const newSuccessRate = (currentSuccessRate * (nudge.metadata.usageCount - 1) + (success ? 1 : 0)) / nudge.metadata.usageCount;
      nudge.metadata.successRate = newSuccessRate;
      this.nudges.set(nudgeId, nudge);
    }
  }

  getNudgeStats(): {
    totalNudges: number;
    averageSuccessRate: number;
    mostSuccessfulNudge: ClarityNudge | null;
    mostUsedNudge: ClarityNudge | null;
  } {
    const nudgeArray = Array.from(this.nudges.values());
    
    return {
      totalNudges: nudgeArray.length,
      averageSuccessRate: nudgeArray.reduce((sum, nudge) => sum + nudge.metadata.successRate, 0) / nudgeArray.length,
      mostSuccessfulNudge: nudgeArray.sort((a, b) => b.metadata.successRate - a.metadata.successRate)[0] || null,
      mostUsedNudge: nudgeArray.sort((a, b) => b.metadata.usageCount - a.metadata.usageCount)[0] || null
    };
  }

  addCustomNudge(nudge: ClarityNudge): void {
    if (this.nudges.has(nudge.id)) {
      throw new Error(`Nudge with ID ${nudge.id} already exists`);
    }
    this.nudges.set(nudge.id, nudge);
  }

  removeNudge(nudgeId: string): boolean {
    return this.nudges.delete(nudgeId);
  }
} 