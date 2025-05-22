/**
 * prompt-registry/prompt-registry.ts
 * 
 * Purpose:
 * Manages prompt storage and indexing.
 * Provides versioned access to prompts.
 */

import { EventBus } from '../event-bus/eventBus';
import { PromptDefinition } from '../prompt-infrastructure/prompt-schema';
import { CodexRuleEngine } from '../rules/rule-engine';
import { 
  PromptRegistry,
  RegistryEntry,
  RegistryConfig,
  PromptIndex,
  RegistryQueryOptions,
  VersionHistory
} from './prompt-registry-schema';
import { RegistryEventEmitter } from './registry-events';
import { v4 as uuidv4 } from 'uuid';

// Export the interface
export { PromptRegistry };

export class CodexPromptRegistry implements PromptRegistry {
  private eventEmitter: RegistryEventEmitter;
  private ruleEngine: CodexRuleEngine;
  private config: RegistryConfig;
  private index: PromptIndex;
  private registry: Map<string, RegistryEntry>;
  private versionHistory: Map<string, VersionHistory[]>;
  private status: string;

  constructor(
    eventBus: EventBus,
    ruleEngine: CodexRuleEngine,
    config: RegistryConfig
  ) {
    this.eventEmitter = new RegistryEventEmitter(eventBus);
    this.ruleEngine = ruleEngine;
    this.config = config;
    this.index = {
      byId: new Map(),
      byType: new Map(),
      byTrust: new Map(),
      byVersion: new Map(),
      byTag: new Map()
    };
    this.registry = new Map();
    this.versionHistory = new Map();
    this.status = 'active';
  }

  /**
   * Registers a new prompt in the registry
   */
  async register(prompt: PromptDefinition): Promise<RegistryEntry> {
    // Validate prompt
    if (!await this.validate(prompt)) {
      throw new Error('Invalid prompt');
    }

    // Create registry entry
    const entry: RegistryEntry = {
      id: uuidv4(),
      prompt,
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        trustScore: prompt.metadata?.trustScore ?? 0,
        alignmentScore: prompt.metadata?.alignmentScore ?? 0,
        performanceScore: prompt.metadata?.performanceScore ?? 0,
        usageCount: 0,
        lastUsed: Date.now(),
        tags: prompt.metadata?.tags ?? [],
        dependencies: prompt.metadata?.dependencies ?? []
      },
      versionHistory: [{
        version: prompt.version,
        timestamp: Date.now(),
        delta: {
          id: uuidv4(),
          promptId: prompt.id,
          fromVersion: '0.0.0',
          toVersion: prompt.version,
          changes: [],
          metadata: {
            author: 'system',
            reason: 'Initial registration',
            trustImpact: 0,
            performanceImpact: 0,
            alignmentImpact: 0
          }
        },
        scores: {
          trust: prompt.metadata?.trustScore ?? 0,
          performance: prompt.metadata?.performanceScore ?? 0,
          alignment: prompt.metadata?.alignmentScore ?? 0
        }
      }],
      status: 'active'
    };

    // Update index
    this.updateIndex(entry);

    // Emit event
    await this.eventEmitter.emitPromptLoaded(
      entry.id,
      entry.prompt.version,
      {
        trustScore: entry.metadata.trustScore,
        alignmentScore: entry.metadata.alignmentScore,
        performanceScore: entry.metadata.performanceScore
      }
    );

    return entry;
  }

  /**
   * Gets a prompt by ID and optional version
   */
  async get(promptId: string, version?: string): Promise<RegistryEntry | null> {
    const entry = this.index.byId.get(promptId);
    if (!entry) {
      return null;
    }

    if (version) {
      const versionMap = this.index.byVersion.get(promptId);
      if (!versionMap) {
        return null;
      }
      return versionMap.get(version) ?? null;
    }

    return entry;
  }

  /**
   * Queries prompts based on options
   */
  async query(options: RegistryQueryOptions): Promise<RegistryEntry[]> {
    let results = Array.from(this.index.byId.values());

    // Filter by type
    if (options.type) {
      const typeSet = this.index.byType.get(options.type);
      if (typeSet) {
        results = results.filter(entry => typeSet.has(entry.id));
      }
    }

    // Filter by trust score
    if (options.minTrustScore) {
      results = results.filter(entry => 
        entry.metadata.trustScore >= options.minTrustScore!
      );
    }

    // Filter by alignment score
    if (options.minAlignmentScore) {
      results = results.filter(entry => 
        entry.metadata.alignmentScore >= options.minAlignmentScore!
      );
    }

    // Filter by performance score
    if (options.minPerformanceScore) {
      results = results.filter(entry => 
        entry.metadata.performanceScore >= options.minPerformanceScore!
      );
    }

    // Filter by tags
    if (options.tags?.length) {
      results = results.filter(entry => 
        options.tags!.every(tag => entry.metadata.tags.includes(tag))
      );
    }

    // Filter by version
    if (options.version) {
      results = results.filter(entry => 
        entry.prompt.version === options.version
      );
    }

    // Filter by status
    if (options.status) {
      results = results.filter(entry => 
        entry.status === options.status
      );
    }

    // Apply pagination
    if (options.limit) {
      const offset = options.offset ?? 0;
      results = results.slice(offset, offset + options.limit);
    }

    return results;
  }

  /**
   * Evolves a prompt with a new version
   */
  async evolve(promptId: string, delta: VersionHistory['delta']): Promise<RegistryEntry> {
    const entry = await this.get(promptId);
    if (!entry) {
      throw new Error('Prompt not found');
    }

    // Create new version
    const newVersion: VersionHistory = {
      version: delta.toVersion,
      timestamp: Date.now(),
      delta,
      scores: {
        trust: entry.metadata.trustScore + delta.metadata.trustImpact,
        performance: entry.metadata.performanceScore + delta.metadata.performanceImpact,
        alignment: entry.metadata.alignmentScore + delta.metadata.alignmentImpact
      }
    };

    // Update entry
    entry.versionHistory.push(newVersion);
    entry.metadata.updatedAt = Date.now();
    entry.metadata.trustScore = newVersion.scores.trust;
    entry.metadata.alignmentScore = newVersion.scores.alignment;
    entry.metadata.performanceScore = newVersion.scores.performance;

    // Update index
    this.updateIndex(entry);

    // Emit event
    await this.eventEmitter.emitPromptEvolved(
      entry.id,
      newVersion.version,
      {
        trustScore: newVersion.scores.trust,
        alignmentScore: newVersion.scores.alignment,
        performanceScore: newVersion.scores.performance
      }
    );

    return entry;
  }

  /**
   * Deprecates a prompt
   */
  async deprecate(promptId: string, reason: string): Promise<void> {
    const entry = await this.get(promptId);
    if (!entry) {
      throw new Error('Prompt not found');
    }

    entry.status = 'deprecated';

    // Emit event
    await this.eventEmitter.emitPromptDeprecated(entry.id, reason);
  }

  /**
   * Validates a prompt
   */
  async validate(prompt: PromptDefinition): Promise<boolean> {
    // Validate against rule engine
    const violations = await this.ruleEngine.evaluateRules([], prompt);
    if (violations.length > 0) {
      return false;
    }

    // Validate trust score
    if (prompt.metadata?.trustScore < this.config.trustThreshold) {
      return false;
    }

    // Validate alignment score
    if (prompt.metadata?.alignmentScore < this.config.alignmentThreshold) {
      return false;
    }

    // Validate performance score
    if (prompt.metadata?.performanceScore < this.config.performanceThreshold) {
      return false;
    }

    return true;
  }

  /**
   * Updates the index with a registry entry
   */
  private updateIndex(entry: RegistryEntry): void {
    // Update byId index
    this.index.byId.set(entry.id, entry);

    // Update byType index
    const typeSet = this.index.byType.get(entry.prompt.type) ?? new Set();
    typeSet.add(entry.id);
    this.index.byType.set(entry.prompt.type, typeSet);

    // Update byTrust index
    const trustSet = this.index.byTrust.get(entry.metadata.trustScore) ?? new Set();
    trustSet.add(entry.id);
    this.index.byTrust.set(entry.metadata.trustScore, trustSet);

    // Update byVersion index
    const versionMap = this.index.byVersion.get(entry.id) ?? new Map();
    versionMap.set(entry.prompt.version, entry);
    this.index.byVersion.set(entry.id, versionMap);

    // Update byTag index
    for (const tag of entry.metadata.tags) {
      const tagSet = this.index.byTag.get(tag) ?? new Set();
      tagSet.add(entry.id);
      this.index.byTag.set(tag, tagSet);
    }
  }
} 