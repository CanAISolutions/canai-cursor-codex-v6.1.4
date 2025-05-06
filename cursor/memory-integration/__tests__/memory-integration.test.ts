/**
 * memory-integration/__tests__/memory-integration.test.ts
 * 
 * Purpose:
 * Tests memory integration functionality including:
 * - Memory injection
 * - Memory filtering
 * - Influence calculation
 * - Event emission
 */

import { EventBus } from '../../utils/event-bus';
import { CodexRuleEngine } from '../../rules/rule-engine';
import { CodexPromptRegistry } from '../../prompt-registry/prompt-registry';
import { MemoryFilter } from '../memory-filter';
import { MemoryInjector } from '../memory-injector';
import { MemoryHierarchyManager } from '../../ai-memories/memory-hierarchy-manager';
import {
  MemoryInjectionRequest,
  MemoryInjectionConfig,
  MemoryFilterConfig,
  MemoryInjectionType,
  MemoryInjectionResult,
  InjectionRejectionReason
} from '../memory-integration-schema';
import { RegistryConfig, RegistryEntry } from '../../prompt-registry/prompt-registry-schema';
import { 
  Memory,
  MemoryType,
  ShortTermMemory,
  WorkingMemory,
  LongTermMemory,
  MemoryMetadata
} from '../../ai-memories/memory-types';
import { PromptDefinition, PromptType } from '../../prompt-infrastructure/prompt-schema';

// Mock data
const mockPromptDefinition: PromptDefinition = {
  id: 'test-prompt',
  type: 'test' as PromptType,
  version: '1.0.0',
  status: 'active',
  name: 'Test Prompt',
  description: 'Test prompt for memory integration',
  content: 'Test prompt content',
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
      reason: 'initial version',
      trustImpact: 0,
      performanceImpact: 0,
      alignmentImpact: 0
    }
  }
};

const mockRegistryEntry: RegistryEntry = {
  id: 'test-prompt',
  prompt: mockPromptDefinition,
  metadata: {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    trustScore: 0.8,
    alignmentScore: 0.8,
    performanceScore: 0.8,
    usageCount: 0,
    lastUsed: Date.now(),
    tags: ['test'],
    dependencies: []
  },
  versionHistory: [],
  status: 'active'
};

const mockMemoryMetadata: MemoryMetadata = {
  source: 'test',
  confidence: 0.8,
  context: {},
  tags: ['test'],
  importance: 0.8,
  relatedMemories: []
};

const mockShortTermMemory: ShortTermMemory = {
  id: 'st-1',
  type: 'short-term',
  timestamp: Date.now(),
  version: 1,
  metadata: mockMemoryMetadata,
  isCompressed: false,
  lastAccessed: Date.now(),
  accessCount: 1,
  content: 'Test short-term memory',
  ttl: 3600,
  priority: 1,
  isProcessed: false,
  processingStatus: 'pending',
  processingAttempts: 0
};

const mockWorkingMemory: WorkingMemory = {
  id: 'wm-1',
  type: 'working',
  timestamp: Date.now(),
  version: 1,
  metadata: mockMemoryMetadata,
  isCompressed: false,
  lastAccessed: Date.now(),
  accessCount: 1,
  content: 'Test working memory',
  state: 'active',
  focus: 0.8,
  associations: [],
  processingContext: {
    currentTask: 'test',
    subTasks: [],
    progress: 0,
    dependencies: []
  }
};

const mockLongTermMemory: LongTermMemory = {
  id: 'lt-1',
  type: 'long-term',
  timestamp: Date.now(),
  version: 1,
  metadata: mockMemoryMetadata,
  isCompressed: false,
  lastAccessed: Date.now(),
  accessCount: 1,
  content: 'Test long-term memory',
  category: 'test',
  subCategories: [],
  retrievalStrength: 0.8,
  lastRetrieved: Date.now(),
  retrievalCount: 1,
  compressionHistory: []
};

const filterConfig: MemoryFilterConfig = {
  trustThreshold: 0.7,
  alignmentThreshold: 0.6,
  maxVolatilityScore: 0.3,
  maxRecordsPerInjection: 5,
  maxAgeInDays: 7,
  blockedFields: ['sensitive'],
  requiredFields: ['type', 'content']
};

const injectionConfig: MemoryInjectionConfig = {
  filterConfig,
  influenceThresholds: {
    minTrust: 0.7,
    minAlignment: 0.6,
    maxVolatility: 0.3
  },
  eventConfig: {
    emitInjectionEvents: true,
    emitRejectionEvents: true,
    emitInfluenceEvents: true
  }
};

const registryConfig: RegistryConfig = {
  trustThreshold: 0.7,
  alignmentThreshold: 0.6,
  performanceThreshold: 0.7,
  maxVersions: 10,
  validationRules: [],
  cacheSize: 1000,
  updateInterval: 3600000
};

describe('Memory Integration', () => {
  let eventBus: EventBus;
  let ruleEngine: CodexRuleEngine;
  let promptRegistry: CodexPromptRegistry;
  let memoryFilter: MemoryFilter;
  let memoryHierarchy: MemoryHierarchyManager;
  let memoryInjector: MemoryInjector;
  let emittedEvents: { type: string; data: any }[];

  beforeEach(() => {
    eventBus = new EventBus();
    ruleEngine = new CodexRuleEngine(eventBus);
    promptRegistry = new CodexPromptRegistry(eventBus, ruleEngine, registryConfig);
    memoryFilter = new MemoryFilter(filterConfig, eventBus);
    memoryHierarchy = new MemoryHierarchyManager(eventBus, './memories');
    memoryInjector = new MemoryInjector(
      eventBus,
      ruleEngine,
      promptRegistry,
      memoryFilter,
      memoryHierarchy,
      injectionConfig
    );

    emittedEvents = [];
    eventBus.on('memory.injected', (data) => emittedEvents.push({ type: 'injected', data }));
    eventBus.on('memory.rejected', (data) => emittedEvents.push({ type: 'rejected', data }));

    // Mock prompt registry
    jest.spyOn(promptRegistry, 'get').mockResolvedValue(mockRegistryEntry);

    // Mock memory hierarchy
    jest.spyOn(memoryHierarchy, 'recall').mockImplementation(async (id: string) => {
      switch (id) {
        case 'test-session':
          return mockShortTermMemory;
        case 'st-1':
          return mockShortTermMemory;
        case 'wm-1':
          return mockWorkingMemory;
        case 'lt-1':
          return mockLongTermMemory;
        default:
          return null;
      }
    });
  });

  describe('Memory Injection', () => {
    it('should successfully inject memory when all conditions are met', async () => {
      const request: MemoryInjectionRequest = {
        promptId: 'test-prompt',
        promptVersion: '1.0.0',
        memoryType: 'tone',
        userId: 'test-user',
        sessionId: 'test-session',
        contextGoal: 'test-goal',
        topic: 'test-topic',
        metadata: {
          trustScore: 0.8,
          alignmentScore: 0.8,
          volatilityScore: 0.2,
          timestamp: Date.now(),
          source: 'test',
          reason: 'test'
        }
      };

      const result = await memoryInjector.injectMemory(request);

      expect(result.success).toBe(true);
      expect(result.injectedMemory?.type).toBe('tone');
      expect(result.injectedMemory?.records).toHaveLength(1);
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'injected' })
      );
    });

    it('should reject injection when prompt version does not match', async () => {
      jest.spyOn(promptRegistry, 'get').mockResolvedValueOnce(null);

      const request: MemoryInjectionRequest = {
        promptId: 'test-prompt',
        promptVersion: '2.0.0', // Non-existent version
        memoryType: 'tone',
        userId: 'test-user',
        sessionId: 'test-session',
        metadata: {
          trustScore: 0.8,
          alignmentScore: 0.8,
          volatilityScore: 0.2,
          timestamp: Date.now(),
          source: 'test',
          reason: 'test'
        }
      };

      const result = await memoryInjector.injectMemory(request);

      expect(result.success).toBe(false);
      expect(result.rejectionReason?.code).toBe('VERSION_MISMATCH');
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'rejected' })
      );
    });

    it('should reject injection when no memories are found', async () => {
      jest.spyOn(memoryHierarchy, 'recall').mockResolvedValue(null);

      const request: MemoryInjectionRequest = {
        promptId: 'test-prompt',
        promptVersion: '1.0.0',
        memoryType: 'tone',
        userId: 'test-user',
        sessionId: 'non-existent',
        metadata: {
          trustScore: 0.8,
          alignmentScore: 0.8,
          volatilityScore: 0.2,
          timestamp: Date.now(),
          source: 'test',
          reason: 'test'
        }
      };

      const result = await memoryInjector.injectMemory(request);

      expect(result.success).toBe(false);
      expect(result.rejectionReason?.code).toBe('MEMORY_NOT_FOUND');
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'rejected' })
      );
    });

    it('should reject injection when trust threshold is not met', async () => {
      const lowTrustMemory: ShortTermMemory = {
        ...mockShortTermMemory,
        metadata: {
          ...mockMemoryMetadata,
          confidence: 0.3 // Below trust threshold
        }
      };

      jest.spyOn(memoryHierarchy, 'recall').mockResolvedValue(lowTrustMemory);

      const request: MemoryInjectionRequest = {
        promptId: 'test-prompt',
        promptVersion: '1.0.0',
        memoryType: 'tone',
        userId: 'test-user',
        sessionId: 'test-session',
        metadata: {
          trustScore: 0.3,
          alignmentScore: 0.8,
          volatilityScore: 0.2,
          timestamp: Date.now(),
          source: 'test',
          reason: 'test'
        }
      };

      const result = await memoryInjector.injectMemory(request);

      expect(result.success).toBe(false);
      expect(result.rejectionReason?.code).toBe('TRUST_THRESHOLD');
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'rejected' })
      );
    });
  });

  describe('Prompt Version Validation', () => {
    it('should reject injection when prompt version is missing', async () => {
      const request: MemoryInjectionRequest = {
        promptId: 'test-prompt',
        promptVersion: '', // Missing version
        memoryType: 'tone',
        userId: 'test-user',
        sessionId: 'test-session',
        metadata: {
          trustScore: 0.8,
          alignmentScore: 0.8,
          volatilityScore: 0.2,
          timestamp: Date.now(),
          source: 'test',
          reason: 'test'
        }
      };

      const result = await memoryInjector.injectMemory(request);

      expect(result.success).toBe(false);
      expect(result.rejectionReason?.code).toBe('VERSION_MISMATCH');
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'rejected' })
      );
    });

    it('should reject injection when prompt version is undefined', async () => {
      const request: MemoryInjectionRequest = {
        promptId: 'test-prompt',
        promptVersion: undefined as any, // Undefined version
        memoryType: 'tone',
        userId: 'test-user',
        sessionId: 'test-session',
        metadata: {
          trustScore: 0.8,
          alignmentScore: 0.8,
          volatilityScore: 0.2,
          timestamp: Date.now(),
          source: 'test',
          reason: 'test'
        }
      };

      const result = await memoryInjector.injectMemory(request);

      expect(result.success).toBe(false);
      expect(result.rejectionReason?.code).toBe('VERSION_MISMATCH');
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'rejected' })
      );
    });

    it('should reject injection when prompt version is bypassed', async () => {
      // Mock prompt registry to simulate version bypass attempt
      jest.spyOn(promptRegistry, 'get').mockImplementation(async (id, version) => {
        if (!version) {
          return null;
        }
        return mockRegistryEntry;
      });

      const request: MemoryInjectionRequest = {
        promptId: 'test-prompt',
        promptVersion: '1.0.0',
        memoryType: 'tone',
        userId: 'test-user',
        sessionId: 'test-session',
        metadata: {
          trustScore: 0.8,
          alignmentScore: 0.8,
          volatilityScore: 0.2,
          timestamp: Date.now(),
          source: 'test',
          reason: 'test'
        }
      };

      const result = await memoryInjector.injectMemory(request);

      expect(result.success).toBe(false);
      expect(result.rejectionReason?.code).toBe('VERSION_MISMATCH');
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'rejected' })
      );
    });

    it('should validate prompt version against registry before injection', async () => {
      // Mock prompt registry to verify version check
      const getSpy = jest.spyOn(promptRegistry, 'get').mockResolvedValue(mockRegistryEntry);

      const request: MemoryInjectionRequest = {
        promptId: 'test-prompt',
        promptVersion: '1.0.0',
        memoryType: 'tone',
        userId: 'test-user',
        sessionId: 'test-session',
        metadata: {
          trustScore: 0.8,
          alignmentScore: 0.8,
          volatilityScore: 0.2,
          timestamp: Date.now(),
          source: 'test',
          reason: 'test'
        }
      };

      await memoryInjector.injectMemory(request);

      expect(getSpy).toHaveBeenCalledWith('test-prompt', '1.0.0');
    });
  });
}); 