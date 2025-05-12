/**
 * business-plan-scoring.ts
 * 
 * Purpose: Business plan specific scoring logic for stress tests
 * Includes: Tone analysis, structure validation, and content verification
 * 
 * TAP-Status: Locked
 * Codex: v6.1.4
 * Trust Score: 4.2
 */

import { StressTest, StressResult } from '../stressbox-engine';

interface BusinessPlanResponse {
  content: string;
  metadata: {
    sections: string[];
    tone: string;
    claims: string[];
    metrics: Record<string, any>;
  };
}

export class BusinessPlanScoring {
  private readonly TONE_WEIGHTS = {
    professional: 0.4,
    enthusiastic: 0.3,
    technical: 0.3
  };

  private readonly STRUCTURE_WEIGHTS = {
    executiveSummary: 0.2,
    marketAnalysis: 0.15,
    competitiveAnalysis: 0.15,
    businessModel: 0.15,
    financialProjections: 0.2,
    team: 0.15
  };

  private readonly CONTENT_WEIGHTS = {
    marketSize: 0.2,
    valueProposition: 0.2,
    competitiveAdvantage: 0.2,
    financialMetrics: 0.2,
    riskAssessment: 0.2
  };

  /**
   * Calculate tone deviation score
   */
  calculateToneDeviation(response: BusinessPlanResponse, test: StressTest): number {
    const expectedTone = test.input.tone;
    const actualTone = response.metadata.tone;
    
    if (actualTone === expectedTone) {
      return 0;
    }

    // Check for tone conflicts
    if (test.input.enhancers) {
      const hasEmotionalDepth = test.input.enhancers.emotionalDepth;
      const hasUrgency = test.input.enhancers.urgency;
      
      if (hasEmotionalDepth && actualTone === 'technical') {
        return 0.8;
      }
      
      if (hasUrgency && actualTone === 'professional') {
        return 0.6;
      }
    }

    // Industry-specific tone validation
    if (test.input.industry === 'finance' && actualTone === 'enthusiastic') {
      return 0.9;
    }

    if (test.input.industry === 'healthcare' && actualTone === 'enthusiastic') {
      return 0.9;
    }

    return 0.4;
  }

  /**
   * Calculate structural integrity score
   */
  calculateStructuralIntegrity(response: BusinessPlanResponse, test: StressTest): number {
    const requiredSections = Object.keys(this.STRUCTURE_WEIGHTS);
    const presentSections = response.metadata.sections;
    
    // Check for missing critical sections
    const missingSections = requiredSections.filter(section => !presentSections.includes(section));
    if (missingSections.length > 0) {
      return 0.8;
    }

    // Validate section completeness
    let completenessScore = 0;
    for (const section of presentSections) {
      if (this.STRUCTURE_WEIGHTS[section]) {
        completenessScore += this.STRUCTURE_WEIGHTS[section];
      }
    }

    // Check for section order
    const correctOrder = requiredSections.every((section, index) => 
      presentSections[index] === section
    );
    
    if (!correctOrder) {
      completenessScore *= 0.8;
    }

    return 1 - completenessScore;
  }

  /**
   * Calculate hallucination risk score
   */
  calculateHallucinationRisk(response: BusinessPlanResponse, test: StressTest): number {
    const claims = response.metadata.claims;
    let riskScore = 0;

    // Check for unrealistic market claims
    if (claims.some(claim => claim.includes('trillion dollar market'))) {
      riskScore += 0.4;
    }

    // Check for unsubstantiated growth claims
    if (claims.some(claim => claim.includes('exponential growth'))) {
      riskScore += 0.3;
    }

    // Check for vague differentiators
    if (claims.some(claim => claim.includes('better than competitors'))) {
      riskScore += 0.2;
    }

    // Validate financial metrics
    const metrics = response.metadata.metrics;
    if (metrics) {
      if (metrics.revenue && typeof metrics.revenue === 'string') {
        riskScore += 0.3;
      }
      if (metrics.costs && typeof metrics.costs === 'string') {
        riskScore += 0.3;
      }
    }

    return Math.min(riskScore, 1);
  }

  /**
   * Calculate prompt alignment score
   */
  calculatePromptAlignment(response: BusinessPlanResponse, test: StressTest): number {
    let alignmentScore = 0;

    // Check goal alignment
    if (test.input.goal === 'secure funding' && !response.metadata.sections.includes('financialProjections')) {
      alignmentScore += 0.3;
    }

    if (test.input.goal === 'launch' && !response.metadata.sections.includes('marketAnalysis')) {
      alignmentScore += 0.3;
    }

    // Check industry-specific requirements
    if (test.input.industry === 'tech' && !response.metadata.sections.includes('competitiveAnalysis')) {
      alignmentScore += 0.2;
    }

    if (test.input.industry === 'finance' && !response.metadata.sections.includes('riskAssessment')) {
      alignmentScore += 0.2;
    }

    // Check for missing critical context
    if (test.input.targetMarket === 'everyone') {
      alignmentScore += 0.3;
    }

    return Math.min(alignmentScore, 1);
  }

  /**
   * Score a business plan response
   */
  scoreResponse(response: BusinessPlanResponse, test: StressTest): StressResult['scores'] {
    return {
      toneDeviation: this.calculateToneDeviation(response, test),
      structuralIntegrity: this.calculateStructuralIntegrity(response, test),
      hallucinationRisk: this.calculateHallucinationRisk(response, test),
      promptAlignment: this.calculatePromptAlignment(response, test)
    };
  }
} 