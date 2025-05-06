/**
 * prompt-infrastructure/__tests__/prompt-evolver.test.ts
 * 
 * Purpose:
 * Tests prompt evolution functionality including delta handling and versioning.
 */

import { EventBus } from '../../utils/event-bus';
import { PromptEvolutionManager } from '../prompt-evolver';
import { PromptDefinition, PromptDelta, PromptContract, PromptContractType } from '../prompt-schema';

describe('PromptEvolutionManager', () => {
  let eventBus: EventBus;
  let evolver: PromptEvolutionManager;
  let mockPrompt: PromptDefinition;

  beforeEach(() => {
    eventBus = new EventBus();
    evolver = new PromptEvolutionManager(eventBus);

    // Create mock prompt
    mockPrompt = {
      id: 'test-prompt',
      type: 'system',
      version: '1.0.0',
      status: 'active',
      name: 'Test Prompt',
      description: 'A test prompt for evolution',
      content: 'Test content',
      metadata: {
        author: 'Test Author',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ['test'],
        dependencies: []
      },
      contracts: [],
      constraints: [],
      evolution: {
        parentVersion: '1.0.0',
        delta: undefined,
        reason: 'Initial version',
        approvedBy: 'system'
      }
    };
  });

  describe('evolvePrompt', () => {
    it('should evolve a prompt with valid changes', async () => {
      const context = {
        feedback: {
          quality: 0.8,
          suggestions: ['Add more context']
        },
        metrics: {
          performance: 0.9,
          trust: 0.85
        },
        triggers: {
          type: 'optimization',
          priority: 'high'
        }
      };

      const evolvedPrompt = await evolver.evolvePrompt(mockPrompt, context);

      expect(evolvedPrompt).toBeDefined();
      expect(evolvedPrompt.version).not.toBe(mockPrompt.version);
      expect(evolvedPrompt.evolution.parentVersion).toBe(mockPrompt.version);
      expect(evolvedPrompt.evolution.delta).toBeDefined();
    });

    it('should emit evolved event on successful evolution', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const context = {
        feedback: { quality: 0.8 },
        metrics: { performance: 0.9 },
        triggers: { type: 'optimization' }
      };

      await evolver.evolvePrompt(mockPrompt, context);

      expect(eventSpy).toHaveBeenCalledWith(
        'prompt.prompt:evolved',
        expect.objectContaining({
          type: 'prompt:evolved',
          data: expect.objectContaining({
            promptId: mockPrompt.id,
            version: expect.any(String)
          })
        })
      );
    });

    it('should emit invalid event on failed evolution', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const context = {
        feedback: { quality: 0.1 }, // Low quality should trigger validation failure
        metrics: { performance: 0.1 },
        triggers: { type: 'optimization' }
      };

      await expect(evolver.evolvePrompt(mockPrompt, context)).rejects.toThrow();
      expect(eventSpy).toHaveBeenCalledWith(
        'prompt.prompt:invalid',
        expect.objectContaining({
          type: 'prompt:invalid',
          data: expect.objectContaining({
            promptId: mockPrompt.id
          })
        })
      );
    });
  });

  describe('validateEvolution', () => {
    it('should validate version increment', async () => {
      const evolvedPrompt = {
        ...mockPrompt,
        version: '1.0.1',
        evolution: {
          parentVersion: mockPrompt.version,
          delta: {
            id: 'test-delta',
            promptId: mockPrompt.id,
            fromVersion: mockPrompt.version,
            toVersion: '1.0.1',
            timestamp: Date.now(),
            changes: [],
            metadata: {
              author: 'system',
              reason: 'Test evolution',
              trustImpact: 1.0,
              performanceImpact: 1.0,
              alignmentImpact: 1.0
            }
          },
          reason: 'Test evolution',
          approvedBy: 'system'
        }
      };

      const isValid = await evolver.validateEvolution(mockPrompt, evolvedPrompt);
      expect(isValid).toBe(true);
    });

    it('should reject invalid version increment', async () => {
      const evolvedPrompt = {
        ...mockPrompt,
        version: '2.0.0', // Major version change not allowed
        evolution: {
          parentVersion: mockPrompt.version,
          delta: {
            id: 'test-delta',
            promptId: mockPrompt.id,
            fromVersion: mockPrompt.version,
            toVersion: '2.0.0',
            timestamp: Date.now(),
            changes: [],
            metadata: {
              author: 'system',
              reason: 'Test evolution',
              trustImpact: 1.0,
              performanceImpact: 1.0,
              alignmentImpact: 1.0
            }
          },
          reason: 'Test evolution',
          approvedBy: 'system'
        }
      };

      const isValid = await evolver.validateEvolution(mockPrompt, evolvedPrompt);
      expect(isValid).toBe(false);
    });

    it('should validate contract preservation', async () => {
      const contract: PromptContract = {
        type: 'behavior' as PromptContractType,
        description: 'Test contract',
        validation: {
          method: 'regex',
          pattern: 'test'
        },
        required: true,
        failureAction: 'error'
      };

      const promptWithContract: PromptDefinition = {
        ...mockPrompt,
        contracts: [contract]
      };

      const evolvedPrompt: PromptDefinition = {
        ...promptWithContract,
        version: '1.0.1',
        evolution: {
          parentVersion: promptWithContract.version,
          delta: {
            id: 'test-delta',
            promptId: promptWithContract.id,
            fromVersion: promptWithContract.version,
            toVersion: '1.0.1',
            timestamp: Date.now(),
            changes: [],
            metadata: {
              author: 'system',
              reason: 'Test evolution',
              trustImpact: 1.0,
              performanceImpact: 1.0,
              alignmentImpact: 1.0
            }
          },
          reason: 'Test evolution',
          approvedBy: 'system'
        }
      };

      const isValid = await evolver.validateEvolution(promptWithContract, evolvedPrompt);
      expect(isValid).toBe(true);
    });

    it('should reject evolution that breaks contracts', async () => {
      const contract: PromptContract = {
        type: 'behavior' as PromptContractType,
        description: 'Test contract',
        validation: {
          method: 'regex',
          pattern: 'test'
        },
        required: true,
        failureAction: 'error'
      };

      const promptWithContract: PromptDefinition = {
        ...mockPrompt,
        contracts: [contract]
      };

      const evolvedPrompt: PromptDefinition = {
        ...promptWithContract,
        version: '1.0.1',
        content: 'Changed content', // Breaks regex contract
        evolution: {
          parentVersion: promptWithContract.version,
          delta: {
            id: 'test-delta',
            promptId: promptWithContract.id,
            fromVersion: promptWithContract.version,
            toVersion: '1.0.1',
            timestamp: Date.now(),
            changes: [
              {
                field: 'content',
                oldValue: 'Test content',
                newValue: 'Changed content',
                reason: 'Test evolution'
              }
            ],
            metadata: {
              author: 'system',
              reason: 'Test evolution',
              trustImpact: 1.0,
              performanceImpact: 1.0,
              alignmentImpact: 1.0
            }
          },
          reason: 'Test evolution',
          approvedBy: 'system'
        }
      };

      const isValid = await evolver.validateEvolution(promptWithContract, evolvedPrompt);
      expect(isValid).toBe(false);
    });
  });
}); 