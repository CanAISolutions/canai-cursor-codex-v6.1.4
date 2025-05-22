/* eslint-env node, jest */
/**
 * prompt-registry/__tests__/prompt-registry.test.ts
 * 
 * Purpose:
 * Tests the prompt registry functionality.
 */

import { EventBus } from '../../event-bus/eventBus';
import { CodexRuleEngine } from '../../rules/rule-engine';
import { CodexPromptRegistry } from '../prompt-registry';
import { PromptDefinition } from '../../prompt-infrastructure/prompt-schema';
import { RegistryConfig } from '../prompt-registry-schema';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('CodexPromptRegistry', () => {
  let eventBus: EventBus;
  let ruleEngine: CodexRuleEngine;
  let registry: CodexPromptRegistry;
  let config: RegistryConfig;

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    ruleEngine = new CodexRuleEngine(eventBus);
    config = {
      trustThreshold: 0.7,
      alignmentThreshold: 0.7,
      performanceThreshold: 0.7,
      maxVersions: 10,
      validationRules: [],
      cacheSize: 1000,
      updateInterval: 5000
    };
    registry = new CodexPromptRegistry(eventBus, ruleEngine, config);
  });

  describe('register', () => {
    it('should register a valid prompt', async () => {
      const prompt: PromptDefinition = {
        id: 'test-prompt',
        type: 'test',
        version: '1.0.0',
        status: 'active',
        name: 'Test Prompt',
        description: 'A test prompt',
        content: 'Test content',
        metadata: {
          author: 'test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['test'],
          dependencies: [],
          trustScore: 0.8,
          alignmentScore: 0.8,
          performanceScore: 0.8
        },
        contracts: [{
          id: 'test-contract',
          type: 'tone',
          description: 'Test contract',
          validation: {
            regex: '^[A-Za-z]+$'
          }
        }],
        constraints: [{
          id: 'test-constraint',
          type: 'token',
          value: 100,
          operator: 'lte',
          description: 'Test constraint'
        }],
        evolution: {
          id: 'test-evolution',
          version: '1.0.0',
          timestamp: Date.now(),
          changes: [],
          metadata: {
            author: 'test',
            reason: 'Initial version',
            trustImpact: 0,
            performanceImpact: 0,
            alignmentImpact: 0
          }
        }
      };

      const entry = await registry.register(prompt);
      expect(entry).toBeDefined();
      expect(entry.id).toBeDefined();
      expect(entry.prompt).toEqual(prompt);
      expect(entry.metadata.trustScore).toBe(0.8);
      expect(entry.metadata.alignmentScore).toBe(0.8);
      expect(entry.metadata.performanceScore).toBe(0.8);
    });

    it('should reject an invalid prompt', async () => {
      const prompt: PromptDefinition = {
        id: 'test-prompt',
        type: 'test',
        version: '1.0.0',
        status: 'active',
        name: 'Test Prompt',
        description: 'A test prompt',
        content: 'Test content',
        metadata: {
          author: 'test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['test'],
          dependencies: [],
          trustScore: 0.5,
          alignmentScore: 0.5,
          performanceScore: 0.5
        },
        contracts: [],
        constraints: [],
        evolution: {
          id: 'test-evolution',
          version: '1.0.0',
          timestamp: Date.now(),
          changes: [],
          metadata: {
            author: 'test',
            reason: 'Initial version',
            trustImpact: 0,
            performanceImpact: 0,
            alignmentImpact: 0
          }
        }
      };

      await expect(registry.register(prompt)).rejects.toThrow('Invalid prompt');
    });
  });

  describe('get', () => {
    it('should get a prompt by ID', async () => {
      const prompt: PromptDefinition = {
        id: 'test-prompt',
        type: 'test',
        version: '1.0.0',
        status: 'active',
        name: 'Test Prompt',
        description: 'A test prompt',
        content: 'Test content',
        metadata: {
          author: 'test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['test'],
          dependencies: [],
          trustScore: 0.8,
          alignmentScore: 0.8,
          performanceScore: 0.8
        },
        contracts: [],
        constraints: [],
        evolution: {
          id: 'test-evolution',
          version: '1.0.0',
          timestamp: Date.now(),
          changes: [],
          metadata: {
            author: 'test',
            reason: 'Initial version',
            trustImpact: 0,
            performanceImpact: 0,
            alignmentImpact: 0
          }
        }
      };

      await registry.register(prompt);
      const entry = await registry.get('test-prompt');
      expect(entry).toBeDefined();
      expect(entry?.prompt).toEqual(prompt);
    });

    it('should get a prompt by ID and version', async () => {
      const prompt: PromptDefinition = {
        id: 'test-prompt',
        type: 'test',
        version: '1.0.0',
        status: 'active',
        name: 'Test Prompt',
        description: 'A test prompt',
        content: 'Test content',
        metadata: {
          author: 'test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['test'],
          dependencies: [],
          trustScore: 0.8,
          alignmentScore: 0.8,
          performanceScore: 0.8
        },
        contracts: [],
        constraints: [],
        evolution: {
          id: 'test-evolution',
          version: '1.0.0',
          timestamp: Date.now(),
          changes: [],
          metadata: {
            author: 'test',
            reason: 'Initial version',
            trustImpact: 0,
            performanceImpact: 0,
            alignmentImpact: 0
          }
        }
      };

      await registry.register(prompt);
      const entry = await registry.get('test-prompt', '1.0.0');
      expect(entry).toBeDefined();
      expect(entry?.prompt).toEqual(prompt);
    });

    it('should return null for non-existent prompt', async () => {
      const entry = await registry.get('non-existent');
      expect(entry).toBeNull();
    });
  });

  describe('query', () => {
    it('should query prompts by type', async () => {
      const prompt1: PromptDefinition = {
        id: 'test-prompt-1',
        type: 'test',
        version: '1.0.0',
        status: 'active',
        name: 'Test Prompt 1',
        description: 'A test prompt',
        content: 'Test content',
        metadata: {
          author: 'test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['test'],
          dependencies: [],
          trustScore: 0.8,
          alignmentScore: 0.8,
          performanceScore: 0.8
        },
        contracts: [],
        constraints: [],
        evolution: {
          id: 'test-evolution',
          version: '1.0.0',
          timestamp: Date.now(),
          changes: [],
          metadata: {
            author: 'test',
            reason: 'Initial version',
            trustImpact: 0,
            performanceImpact: 0,
            alignmentImpact: 0
          }
        }
      };

      const prompt2: PromptDefinition = {
        id: 'test-prompt-2',
        type: 'production',
        version: '1.0.0',
        status: 'active',
        name: 'Test Prompt 2',
        description: 'A test prompt',
        content: 'Test content',
        metadata: {
          author: 'test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['test'],
          dependencies: [],
          trustScore: 0.8,
          alignmentScore: 0.8,
          performanceScore: 0.8
        },
        contracts: [],
        constraints: [],
        evolution: {
          id: 'test-evolution',
          version: '1.0.0',
          timestamp: Date.now(),
          changes: [],
          metadata: {
            author: 'test',
            reason: 'Initial version',
            trustImpact: 0,
            performanceImpact: 0,
            alignmentImpact: 0
          }
        }
      };

      await registry.register(prompt1);
      await registry.register(prompt2);

      const results = await registry.query({ type: 'test' });
      expect(results).toHaveLength(1);
      expect(results[0].prompt).toEqual(prompt1);
    });

    it('should query prompts by trust score', async () => {
      const prompt1: PromptDefinition = {
        id: 'test-prompt-1',
        type: 'test',
        version: '1.0.0',
        status: 'active',
        name: 'Test Prompt 1',
        description: 'A test prompt',
        content: 'Test content',
        metadata: {
          author: 'test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['test'],
          dependencies: [],
          trustScore: 0.8,
          alignmentScore: 0.8,
          performanceScore: 0.8
        },
        contracts: [],
        constraints: [],
        evolution: {
          id: 'test-evolution',
          version: '1.0.0',
          timestamp: Date.now(),
          changes: [],
          metadata: {
            author: 'test',
            reason: 'Initial version',
            trustImpact: 0,
            performanceImpact: 0,
            alignmentImpact: 0
          }
        }
      };

      const prompt2: PromptDefinition = {
        id: 'test-prompt-2',
        type: 'test',
        version: '1.0.0',
        status: 'active',
        name: 'Test Prompt 2',
        description: 'A test prompt',
        content: 'Test content',
        metadata: {
          author: 'test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['test'],
          dependencies: [],
          trustScore: 0.6,
          alignmentScore: 0.8,
          performanceScore: 0.8
        },
        contracts: [],
        constraints: [],
        evolution: {
          id: 'test-evolution',
          version: '1.0.0',
          timestamp: Date.now(),
          changes: [],
          metadata: {
            author: 'test',
            reason: 'Initial version',
            trustImpact: 0,
            performanceImpact: 0,
            alignmentImpact: 0
          }
        }
      };

      await registry.register(prompt1);
      await registry.register(prompt2);

      const results = await registry.query({ minTrustScore: 0.7 });
      expect(results).toHaveLength(1);
      expect(results[0].prompt).toEqual(prompt1);
    });
  });

  describe('evolve', () => {
    it('should evolve a prompt with a new version', async () => {
      const prompt: PromptDefinition = {
        id: 'test-prompt',
        type: 'test',
        version: '1.0.0',
        status: 'active',
        name: 'Test Prompt',
        description: 'A test prompt',
        content: 'Test content',
        metadata: {
          author: 'test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['test'],
          dependencies: [],
          trustScore: 0.8,
          alignmentScore: 0.8,
          performanceScore: 0.8
        },
        contracts: [],
        constraints: [],
        evolution: {
          id: 'test-evolution',
          version: '1.0.0',
          timestamp: Date.now(),
          changes: [],
          metadata: {
            author: 'test',
            reason: 'Initial version',
            trustImpact: 0,
            performanceImpact: 0,
            alignmentImpact: 0
          }
        }
      };

      await registry.register(prompt);

      const delta = {
        id: 'test-delta',
        promptId: 'test-prompt',
        fromVersion: '1.0.0',
        toVersion: '1.1.0',
        changes: [{
          field: 'content',
          oldValue: 'Test content',
          newValue: 'Updated content',
          reason: 'Test update'
        }],
        metadata: {
          author: 'test',
          reason: 'Test update',
          trustImpact: 0.1,
          performanceImpact: 0.1,
          alignmentImpact: 0.1
        }
      };

      const evolved = await registry.evolve('test-prompt', delta);
      expect(evolved.prompt.version).toBe('1.1.0');
      expect(evolved.metadata.trustScore).toBe(0.9);
      expect(evolved.metadata.alignmentScore).toBe(0.9);
      expect(evolved.metadata.performanceScore).toBe(0.9);
    });

    it('should throw error for non-existent prompt', async () => {
      const delta = {
        id: 'test-delta',
        promptId: 'non-existent',
        fromVersion: '1.0.0',
        toVersion: '1.1.0',
        changes: [],
        metadata: {
          author: 'test',
          reason: 'Test update',
          trustImpact: 0.1,
          performanceImpact: 0.1,
          alignmentImpact: 0.1
        }
      };

      await expect(registry.evolve('non-existent', delta)).rejects.toThrow('Prompt not found');
    });
  });

  describe('deprecate', () => {
    it('should deprecate a prompt', async () => {
      const prompt: PromptDefinition = {
        id: 'test-prompt',
        type: 'test',
        version: '1.0.0',
        status: 'active',
        name: 'Test Prompt',
        description: 'A test prompt',
        content: 'Test content',
        metadata: {
          author: 'test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['test'],
          dependencies: [],
          trustScore: 0.8,
          alignmentScore: 0.8,
          performanceScore: 0.8
        },
        contracts: [],
        constraints: [],
        evolution: {
          id: 'test-evolution',
          version: '1.0.0',
          timestamp: Date.now(),
          changes: [],
          metadata: {
            author: 'test',
            reason: 'Initial version',
            trustImpact: 0,
            performanceImpact: 0,
            alignmentImpact: 0
          }
        }
      };

      await registry.register(prompt);
      await registry.deprecate('test-prompt', 'Test deprecation');

      const entry = await registry.get('test-prompt');
      expect(entry?.status).toBe('deprecated');
    });

    it('should throw error for non-existent prompt', async () => {
      await expect(registry.deprecate('non-existent', 'Test deprecation')).rejects.toThrow('Prompt not found');
    });
  });
}); 