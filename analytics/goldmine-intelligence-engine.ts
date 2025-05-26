/**
 * Goldmine Intelligence Engine
 * Orchestrates compound intelligence across OutputGoldmine, AIMiningAgents, and UserAIResume
 * Transforms every session into reusable, revenue-generating, insight-rich assets
 */

import { EventBus } from '../cursor/utils/event-bus';
import { PromptLogs } from '../cursor/types/prompt-logs';

export interface GoldmineOutput {
  recordId: string;
  sessionId: string;
  userId: string | null;
  promptType: string;
  outputContent: string;
  outputHash: string;
  resonanceScore: number;
  trustScore: number;
  emotionalFingerprint: {
    tone: string;
    energy: string;
    style: string;
    vocabulary: string;
  };
  industryCluster: string | null;
  intentSummary: string;
  sparkConcept: string | null;
  reuseCategory: string | null;
  reusePotential: number;
  compoundValue: number;
}

export interface MiningAgentRun {
  recordId: string;
  agentType: string;
  agentName: string;
  runId: string;
  patternsDetected: Array<{
    pattern: string;
    confidence: number;
    description: string;
    impact: string;
  }>;
  trendsIdentified: Array<{
    trend: string;
    industry: string;
    growth: number;
    confidence: number;
  }>;
  monetizationOpportunities: Array<{
    opportunity: string;
    description: string;
    estimatedDemand: number;
    targetIndustries: string[];
  }>;
  contentGenerated: {
    blogPosts?: Array<{ title: string; content: string; targetAudience: string }>;
    socialPosts?: Array<{ platform: string; content: string; hashtags: string[] }>;
    emailSequences?: Array<{ subject: string; content: string; targetSegment: string }>;
  };
  templatesCreated: Array<{
    templateName: string;
    basedOnOutputs: string[];
    reusePotential: number;
  }>;
  impactScore: number;
}

export interface UserAIProfile {
  recordId: string;
  userId: string;
  totalSessions: number;
  preferredTone: string | null;
  industryFocus: string[];
  businessGoals: string[];
  emotionalProfile: {
    primaryMotivators: string[];
    stressPoints: string[];
    energySources: string[];
    communicationNeeds: string[];
  };
  sparkResonance: {
    highResonanceConcepts: string[];
    averageResonanceScore: number;
    preferredSparkTypes: string[];
  };
  personalizationScore: number;
  predictiveInsights: {
    nextLikelyProducts: string[];
    optimalTiming: string;
    preferredCommunicationFrequency: string;
    growthOpportunities: string[];
  };
  lifetimeValue: number;
  churnRisk: number;
  engagementTrend: string;
}

export interface GoldmineIntelligence {
  totalOutputs: number;
  highValueOutputs: number;
  averageResonanceScore: number;
  topIndustries: Array<{ industry: string; count: number; averageResonance: number }>;
  reusableAssets: {
    templates: number;
    caseStudies: number;
    contentAssets: number;
  };
  monetizationPotential: number;
  compoundGrowthRate: number;
}

export class GoldmineIntelligenceEngine {
  private eventBus: EventBus;
  private goldmineOutputs: Map<string, GoldmineOutput>;
  private miningAgentRuns: Map<string, MiningAgentRun>;
  private userProfiles: Map<string, UserAIProfile>;
  private intelligence: GoldmineIntelligence;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.goldmineOutputs = new Map();
    this.miningAgentRuns = new Map();
    this.userProfiles = new Map();
    this.intelligence = this.initializeIntelligence();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.eventBus.on('OUTPUT_COMPLETED', this.handleOutputCompleted.bind(this));
    this.eventBus.on('MINING_AGENT_RUN_COMPLETED', this.handleMiningAgentRun.bind(this));
    this.eventBus.on('USER_PROFILE_UPDATED', this.handleUserProfileUpdate.bind(this));
    this.eventBus.on('SPARKSPLIT_SELECTION_MADE', this.handleSparkSplitSelection.bind(this));
  }

  private initializeIntelligence(): GoldmineIntelligence {
    return {
      totalOutputs: 0,
      highValueOutputs: 0,
      averageResonanceScore: 0,
      topIndustries: [],
      reusableAssets: {
        templates: 0,
        caseStudies: 0,
        contentAssets: 0
      },
      monetizationPotential: 0,
      compoundGrowthRate: 0
    };
  }

  private async handleOutputCompleted(
    sessionId: string,
    outputData: {
      promptType: string;
      outputContent: string;
      trustScore: number;
      emotionalContext: any;
      userContext: any;
    }
  ): Promise<void> {
    // Generate output hash for deduplication
    const outputHash = await this.generateOutputHash(outputData.outputContent);
    
    // Calculate resonance score
    const resonanceScore = await this.calculateResonanceScore(outputData);
    
    // Detect industry cluster
    const industryCluster = await this.detectIndustryCluster(outputData);
    
    // Extract emotional fingerprint
    const emotionalFingerprint = await this.extractEmotionalFingerprint(outputData);
    
    // Calculate reuse potential
    const reusePotential = await this.calculateReusePotential(outputData, resonanceScore);
    
    // Calculate compound value
    const compoundValue = await this.calculateCompoundValue(outputData, resonanceScore, reusePotential);

    const goldmineOutput: GoldmineOutput = {
      recordId: this.generateULID(),
      sessionId,
      userId: outputData.userContext?.userId || null,
      promptType: outputData.promptType,
      outputContent: outputData.outputContent,
      outputHash,
      resonanceScore,
      trustScore: outputData.trustScore,
      emotionalFingerprint,
      industryCluster,
      intentSummary: outputData.userContext?.intentSummary || '',
      sparkConcept: outputData.userContext?.sparkConcept || null,
      reuseCategory: await this.categorizeForReuse(outputData, resonanceScore),
      reusePotential,
      compoundValue
    };

    this.goldmineOutputs.set(goldmineOutput.recordId, goldmineOutput);
    this.updateIntelligence();
    this.emitGoldmineEvent('OUTPUT_GOLDMINE_UPDATED', goldmineOutput);

    // Trigger AI mining if conditions are met
    if (this.shouldTriggerMining()) {
      await this.triggerMiningAgents();
    }
  }

  private async handleMiningAgentRun(runData: MiningAgentRun): Promise<void> {
    this.miningAgentRuns.set(runData.recordId, runData);
    
    // Process mining results
    await this.processMiningResults(runData);
    
    this.emitGoldmineEvent('MINING_INTELLIGENCE_UPDATED', runData);
  }

  private async handleUserProfileUpdate(userId: string, profileData: UserAIProfile): Promise<void> {
    this.userProfiles.set(userId, profileData);
    
    // Update personalization insights
    await this.updatePersonalizationInsights(userId, profileData);
    
    this.emitGoldmineEvent('USER_INTELLIGENCE_UPDATED', profileData);
  }

  private async handleSparkSplitSelection(
    sessionId: string,
    selectionData: {
      userSelection: string;
      trustDeltaAchieved: number;
      feedback: string;
    }
  ): Promise<void> {
    // Update goldmine output with SparkSplit data
    const output = Array.from(this.goldmineOutputs.values()).find(o => o.sessionId === sessionId);
    if (output && selectionData.userSelection === 'canai') {
      output.compoundValue += selectionData.trustDeltaAchieved * 10; // Trust transparency bonus
      this.goldmineOutputs.set(output.recordId, output);
    }
  }

  private async generateOutputHash(content: string): Promise<string> {
    // Simple hash implementation - in production, use crypto.createHash
    return `sha256:${content.slice(0, 32)}...`;
  }

  private async calculateResonanceScore(outputData: any): Promise<number> {
    // Calculate based on emotional context, user engagement, and trust score
    const baseScore = outputData.trustScore * 2; // 0-10 scale
    const emotionalBonus = outputData.emotionalContext?.emotionalDepth || 0;
    return Math.min(10, baseScore + emotionalBonus);
  }

  private async detectIndustryCluster(outputData: any): Promise<string | null> {
    // Simple industry detection - in production, use ML/NLP
    const content = outputData.outputContent.toLowerCase();
    if (content.includes('coffee') || content.includes('cafe')) return 'coffee_retail';
    if (content.includes('saas') || content.includes('software')) return 'saas';
    if (content.includes('beauty') || content.includes('wellness')) return 'beauty_wellness';
    return null;
  }

  private async extractEmotionalFingerprint(outputData: any): Promise<any> {
    return {
      tone: outputData.emotionalContext?.tone || 'neutral',
      energy: outputData.emotionalContext?.energy || 'medium',
      style: outputData.emotionalContext?.style || 'professional',
      vocabulary: outputData.emotionalContext?.vocabulary || 'standard'
    };
  }

  private async calculateReusePotential(outputData: any, resonanceScore: number): Promise<number> {
    // High resonance + clear industry + actionable content = high reuse potential
    let potential = resonanceScore;
    if (outputData.industryCluster) potential += 2;
    if (outputData.trustScore > 4.0) potential += 1;
    return Math.min(10, potential);
  }

  private async calculateCompoundValue(outputData: any, resonanceScore: number, reusePotential: number): Promise<number> {
    // Compound value considers resonance, reuse potential, and business impact
    const baseValue = (resonanceScore + reusePotential) * 5;
    const trustBonus = outputData.trustScore > 4.5 ? 20 : 0;
    const industryBonus = outputData.industryCluster ? 10 : 0;
    return Math.min(100, baseValue + trustBonus + industryBonus);
  }

  private async categorizeForReuse(outputData: any, resonanceScore: number): Promise<string | null> {
    if (resonanceScore > 8.5) return 'case_study';
    if (resonanceScore > 7.0) return 'template';
    if (resonanceScore > 6.0) return 'inspiration';
    return null;
  }

  private shouldTriggerMining(): boolean {
    // Trigger mining every 50 new outputs or weekly
    return this.goldmineOutputs.size % 50 === 0;
  }

  private async triggerMiningAgents(): Promise<void> {
    // Trigger different types of mining agents
    const agents = [
      'pattern_detector',
      'trend_analyzer',
      'content_generator',
      'template_creator',
      'opportunity_finder'
    ];

    for (const agentType of agents) {
      this.emitGoldmineEvent('TRIGGER_MINING_AGENT', {
        agentType,
        dataSource: Array.from(this.goldmineOutputs.keys()),
        timestamp: Date.now()
      });
    }
  }

  private async processMiningResults(runData: MiningAgentRun): Promise<void> {
    // Process templates created
    for (const template of runData.templatesCreated) {
      this.intelligence.reusableAssets.templates++;
    }

    // Process content generated
    if (runData.contentGenerated.blogPosts) {
      this.intelligence.reusableAssets.contentAssets += runData.contentGenerated.blogPosts.length;
    }
    if (runData.contentGenerated.socialPosts) {
      this.intelligence.reusableAssets.contentAssets += runData.contentGenerated.socialPosts.length;
    }

    // Update monetization potential
    for (const opportunity of runData.monetizationOpportunities) {
      this.intelligence.monetizationPotential += opportunity.estimatedDemand;
    }
  }

  private async updatePersonalizationInsights(userId: string, profileData: UserAIProfile): Promise<void> {
    // Update user's predictive insights based on goldmine data
    const userOutputs = Array.from(this.goldmineOutputs.values()).filter(o => o.userId === userId);
    
    if (userOutputs.length > 0) {
      const averageResonance = userOutputs.reduce((sum, o) => sum + o.resonanceScore, 0) / userOutputs.length;
      profileData.sparkResonance.averageResonanceScore = averageResonance;
      
      // Update industry focus based on outputs
      const industries = userOutputs.map(o => o.industryCluster).filter(Boolean);
      profileData.industryFocus = [...new Set(industries)] as string[];
    }
  }

  private updateIntelligence(): void {
    const outputs = Array.from(this.goldmineOutputs.values());
    
    this.intelligence.totalOutputs = outputs.length;
    this.intelligence.highValueOutputs = outputs.filter(o => o.compoundValue > 70).length;
    this.intelligence.averageResonanceScore = outputs.length > 0 
      ? outputs.reduce((sum, o) => sum + o.resonanceScore, 0) / outputs.length 
      : 0;

    // Calculate top industries
    const industryMap = new Map<string, { count: number; totalResonance: number }>();
    outputs.forEach(output => {
      if (output.industryCluster) {
        const current = industryMap.get(output.industryCluster) || { count: 0, totalResonance: 0 };
        current.count++;
        current.totalResonance += output.resonanceScore;
        industryMap.set(output.industryCluster, current);
      }
    });

    this.intelligence.topIndustries = Array.from(industryMap.entries())
      .map(([industry, data]) => ({
        industry,
        count: data.count,
        averageResonance: data.totalResonance / data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate compound growth rate
    if (outputs.length > 1) {
      const recentOutputs = outputs.slice(-30); // Last 30 outputs
      const olderOutputs = outputs.slice(0, -30);
      
      if (olderOutputs.length > 0) {
        const recentAverage = recentOutputs.reduce((sum, o) => sum + o.compoundValue, 0) / recentOutputs.length;
        const olderAverage = olderOutputs.reduce((sum, o) => sum + o.compoundValue, 0) / olderOutputs.length;
        this.intelligence.compoundGrowthRate = ((recentAverage - olderAverage) / olderAverage) * 100;
      }
    }
  }

  private emitGoldmineEvent(eventType: string, data: any): void {
    const analyticsMeta: PromptLogs['analyticsMeta'] = {
      goldmineIntelligence: {
        eventType,
        data,
        intelligence: this.intelligence,
        timestamp: Date.now()
      }
    };

    this.eventBus.emit('ANALYTICS_META_UPDATED', analyticsMeta);
  }

  private generateULID(): string {
    // Simple ULID generation - in production, use proper ULID library
    return `01HQ${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  public getGoldmineIntelligence(): GoldmineIntelligence {
    return this.intelligence;
  }

  public getHighValueOutputs(): GoldmineOutput[] {
    return Array.from(this.goldmineOutputs.values())
      .filter(output => output.compoundValue > 70)
      .sort((a, b) => b.compoundValue - a.compoundValue);
  }

  public getUserProfile(userId: string): UserAIProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  public exportGoldmineReport(): string {
    const intelligence = this.intelligence;
    const highValueOutputs = this.getHighValueOutputs();

    return `# Goldmine Intelligence Report
Generated: ${new Date().toISOString()}

## Compound Intelligence Overview
- **Total Outputs Captured**: ${intelligence.totalOutputs}
- **High-Value Outputs**: ${intelligence.highValueOutputs} (${((intelligence.highValueOutputs / intelligence.totalOutputs) * 100).toFixed(1)}%)
- **Average Resonance Score**: ${intelligence.averageResonanceScore.toFixed(2)}/10
- **Compound Growth Rate**: ${intelligence.compoundGrowthRate.toFixed(1)}%

## Reusable Assets Generated
- **Templates Created**: ${intelligence.reusableAssets.templates}
- **Case Studies Ready**: ${intelligence.reusableAssets.caseStudies}
- **Content Assets**: ${intelligence.reusableAssets.contentAssets}

## Top Industries by Output Volume
${intelligence.topIndustries.map(industry => 
  `- **${industry.industry}**: ${industry.count} outputs (${industry.averageResonance.toFixed(1)} avg resonance)`
).join('\n')}

## Monetization Potential
- **Total Monetization Score**: ${intelligence.monetizationPotential.toFixed(1)}
- **High-Value Outputs Ready for Reuse**: ${highValueOutputs.length}

## Top Performing Outputs
${highValueOutputs.slice(0, 5).map(output => 
  `- **${output.promptType}** (${output.industryCluster || 'General'}): ${output.compoundValue.toFixed(1)} compound value`
).join('\n')}

## Goldmine Status
${intelligence.averageResonanceScore > 8.0 ? '✅ **GOLDMINE EXCELLENCE**: Average resonance exceeds 8.0' : '⚠️ **OPTIMIZATION OPPORTUNITY**: Average resonance below 8.0'}
${intelligence.compoundGrowthRate > 10 ? '✅ **COMPOUND GROWTH ACHIEVED**: Growth rate exceeds 10%' : '⚠️ **GROWTH OPTIMIZATION NEEDED**: Growth rate below 10%'}
${intelligence.reusableAssets.templates > 10 ? '✅ **TEMPLATE LIBRARY ESTABLISHED**: 10+ templates created' : '⚠️ **TEMPLATE BUILDING NEEDED**: Less than 10 templates'}
`;
  }
} 