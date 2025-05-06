/**
 * prompt-registry/__tests__/prompt-registry-loader.test.ts
 * 
 * Purpose:
 * Tests the prompt registry loader functionality.
 */

import { EventBus } from '../../event-bus';
import { CodexRuleEngine } from '../../rules/rule-engine';
import { CodexPromptRegistryLoader } from '../prompt-registry-loader';
import { PromptDefinition } from '../../prompt-infrastructure/prompt-schema';
import { RegistryConfig } from '../prompt-registry-schema';
import * as fs from 'fs/promises';
import * as path from 'path';

jest.mock('fs/promises');

describe('CodexPromptRegistryLoader', () => {
  let eventBus: EventBus;
  let ruleEngine: CodexRuleEngine;
  let loader: CodexPromptRegistryLoader;
  let config: RegistryConfig;

  beforeEach(() => {
    eventBus = new EventBus();
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
    loader = new CodexPromptRegistryLoader(eventBus, ruleEngine, config);
  });

  describe('loadPrompts', () => {
    it('should load valid prompts from directory', async () => {
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

      (fs.readdir as jest.Mock).mockResolvedValue([
        { name: 'test.json', isFile: () => true }
      ]);

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(prompt));

      const entries = await loader.loadPrompts('/test/directory');
      expect(entries).toHaveLength(1);
      expect(entries[0].prompt).toEqual(prompt);
    });

    it('should skip invalid prompts', async () => {
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

      (fs.readdir as jest.Mock).mockResolvedValue([
        { name: 'test.json', isFile: () => true }
      ]);

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(prompt));

      const entries = await loader.loadPrompts('/test/directory');
      expect(entries).toHaveLength(0);
    });

    it('should handle read errors', async () => {
      (fs.readdir as jest.Mock).mockResolvedValue([
        { name: 'test.json', isFile: () => true }
      ]);

      (fs.readFile as jest.Mock).mockRejectedValue(new Error('Read error'));

      const entries = await loader.loadPrompts('/test/directory');
      expect(entries).toHaveLength(0);
    });
  });

  describe('validatePrompt', () => {
    it('should validate a prompt', async () => {
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

      const isValid = await loader.validatePrompt(prompt);
      expect(isValid).toBe(true);
    });

    it('should reject a prompt with low scores', async () => {
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

      const isValid = await loader.validatePrompt(prompt);
      expect(isValid).toBe(false);
    });
  });

  describe('registerPrompt', () => {
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

      const entry = await loader.registerPrompt(prompt);
      expect(entry).toBeDefined();
      expect(entry.id).toBeDefined();
      expect(entry.prompt).toEqual(prompt);
      expect(entry.metadata.trustScore).toBe(0.8);
      expect(entry.metadata.alignmentScore).toBe(0.8);
      expect(entry.metadata.performanceScore).toBe(0.8);
    });
  });
}); 