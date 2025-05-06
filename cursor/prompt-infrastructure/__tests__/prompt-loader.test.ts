/**
 * prompt-infrastructure/__tests__/prompt-loader.test.ts
 * 
 * Purpose:
 * Tests prompt loading and validation functionality.
 */

import { EventBus } from '../../utils/event-bus';
import { PromptFileLoader } from '../prompt-loader';
import { PromptDefinition, PromptContract } from '../prompt-schema';
import * as fs from 'fs/promises';
import * as path from 'path';

jest.mock('fs/promises');

describe('PromptFileLoader', () => {
  let eventBus: EventBus;
  let loader: PromptFileLoader;
  let mockPrompt: PromptDefinition;

  beforeEach(() => {
    eventBus = new EventBus();
    loader = new PromptFileLoader(eventBus);

    // Create mock prompt
    mockPrompt = {
      id: 'test-prompt',
      type: 'system',
      version: '1.0.0',
      status: 'active',
      name: 'Test Prompt',
      description: 'A test prompt for loading',
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

    // Mock fs.readFile
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockPrompt));
  });

  describe('loadPrompt', () => {
    it('should load and validate a prompt from file', async () => {
      const filePath = 'test/prompts/test-prompt.json';
      const prompt = await loader.loadPrompt(filePath);

      expect(prompt).toBeDefined();
      expect(prompt.id).toBe(mockPrompt.id);
      expect(prompt.version).toBe(mockPrompt.version);
      expect(fs.readFile).toHaveBeenCalledWith(filePath, 'utf-8');
    });

    it('should emit loaded event on successful load', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const filePath = 'test/prompts/test-prompt.json';

      await loader.loadPrompt(filePath);

      expect(eventSpy).toHaveBeenCalledWith(
        'prompt.prompt:loaded',
        expect.objectContaining({
          type: 'prompt:loaded',
          data: expect.objectContaining({
            promptId: mockPrompt.id,
            version: mockPrompt.version
          })
        })
      );
    });

    it('should emit invalid event on failed load', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const filePath = 'test/prompts/invalid-prompt.json';
      const error = new Error('Invalid JSON');

      (fs.readFile as jest.Mock).mockRejectedValue(error);

      await expect(loader.loadPrompt(filePath)).rejects.toThrow();
      expect(eventSpy).toHaveBeenCalledWith(
        'prompt.prompt:invalid',
        expect.objectContaining({
          type: 'prompt:invalid',
          data: expect.objectContaining({
            promptId: path.basename(filePath)
          })
        })
      );
    });
  });

  describe('validatePrompt', () => {
    it('should validate prompt structure', async () => {
      const isValid = await loader.validatePrompt(mockPrompt);
      expect(isValid).toBe(true);
    });

    it('should reject prompt with missing required fields', async () => {
      const invalidPrompt = { ...mockPrompt };
      delete (invalidPrompt as any).content;

      const isValid = await loader.validatePrompt(invalidPrompt);
      expect(isValid).toBe(false);
    });

    it('should validate prompt contracts', async () => {
      const contract: PromptContract = {
        type: 'behavior',
        description: 'Test contract',
        validation: {
          method: 'regex',
          pattern: 'test'
        },
        required: true,
        failureAction: 'error'
      };

      const promptWithContract = {
        ...mockPrompt,
        contracts: [contract]
      };

      const isValid = await loader.validatePrompt(promptWithContract);
      expect(isValid).toBe(true);
    });

    it('should reject prompt with invalid contract', async () => {
      const invalidContract: PromptContract = {
        type: 'behavior',
        description: 'Test contract',
        validation: {
          method: 'regex',
          pattern: 'invalid'
        },
        required: true,
        failureAction: 'error'
      };

      const promptWithInvalidContract = {
        ...mockPrompt,
        contracts: [invalidContract]
      };

      const isValid = await loader.validatePrompt(promptWithInvalidContract);
      expect(isValid).toBe(false);
    });
  });

  describe('refreshPrompts', () => {
    it('should refresh all loaded prompts', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const filePath = 'test/prompts/test-prompt.json';

      // Load initial prompt
      await loader.loadPrompt(filePath);

      // Refresh prompts
      await loader.refreshPrompts();

      expect(eventSpy).toHaveBeenCalledWith(
        'prompt.prompt:loaded',
        expect.any(Object)
      );
    });

    it('should remove invalid prompts during refresh', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const filePath = 'test/prompts/test-prompt.json';

      // Load initial prompt
      await loader.loadPrompt(filePath);

      // Mock invalid prompt
      (fs.readFile as jest.Mock).mockResolvedValue('invalid json');

      // Refresh prompts
      await loader.refreshPrompts();

      expect(eventSpy).toHaveBeenCalledWith(
        'prompt.prompt:invalid',
        expect.any(Object)
      );
    });
  });
}); 