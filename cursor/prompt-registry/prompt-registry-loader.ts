/**
 * prompt-registry/prompt-registry-loader.ts
 * 
 * Purpose:
 * Handles bulk loading and validation of prompts from directories.
 * Integrates with rule engine for contract validation.
 */

import { EventBus } from '../event-bus/eventBus';
import { PromptDefinition } from '../prompt-infrastructure/prompt-schema';
import { CodexRuleEngine } from '../rules/rule-engine';
import { 
  PromptRegistryLoader,
  RegistryEntry,
  RegistryConfig
} from './prompt-registry-schema';
import { RegistryEventEmitter } from './registry-events';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';

export class CodexPromptRegistryLoader implements PromptRegistryLoader {
  private eventEmitter: RegistryEventEmitter;
  private ruleEngine: CodexRuleEngine;
  private config: RegistryConfig;

  constructor(
    eventBus: EventBus,
    ruleEngine: CodexRuleEngine,
    config: RegistryConfig
  ) {
    this.eventEmitter = new RegistryEventEmitter(eventBus);
    this.ruleEngine = ruleEngine;
    this.config = config;
  }

  /**
   * Loads all prompts from a directory and validates them
   */
  async loadPrompts(directory: string): Promise<RegistryEntry[]> {
    const entries: RegistryEntry[] = [];
    const files = await this.getPromptFiles(directory);

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const prompt = JSON.parse(content) as PromptDefinition;
        
        if (await this.validatePrompt(prompt)) {
          const entry = await this.registerPrompt(prompt);
          entries.push(entry);
          
          await this.eventEmitter.emitPromptLoaded(
            entry.id,
            entry.prompt.version,
            {
              trustScore: entry.metadata.trustScore,
              alignmentScore: entry.metadata.alignmentScore,
              performanceScore: entry.metadata.performanceScore
            }
          );
        }
      } catch (error) {
        await this.eventEmitter.emitPromptInvalid(
          path.basename(file, '.json'),
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    }

    return entries;
  }

  /**
   * Validates a prompt against rules and contracts
   */
  async validatePrompt(prompt: PromptDefinition): Promise<boolean> {
    // Validate against rule engine
    const violations = await this.ruleEngine.evaluateRules(this.config.validationRules, prompt);
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
   * Registers a validated prompt in the registry
   */
  async registerPrompt(prompt: PromptDefinition): Promise<RegistryEntry> {
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

    return entry;
  }

  /**
   * Gets all prompt files from a directory recursively
   */
  private async getPromptFiles(directory: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...await this.getPromptFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }

    return files;
  }
} 