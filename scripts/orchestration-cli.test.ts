/**
 * @file scripts/orchestration-cli.test.ts
 * @description Tests for CLI orchestration with emotional resonance and safety
 * @version 6.1.4
 * @emotionalResonance true
 * @dreamStateAlignment true
 */

import { CLIOrchestrator } from '../lib/scripts/orchestrator';
import { CommandExecutor } from '../lib/scripts/command-executor';
import { SafetyValidator } from '../lib/scripts/safety-validator';
import { OutputFormatter } from '../lib/scripts/output-formatter';
import { EmotionalValidator } from '../cursor/validators/emotional-validator';
import { DreamStateChecker } from '../cursor/validators/dream-state';
import { MemoryExporter } from '../cursor/exports/memory-exporter';
import { FallbackScenarios } from '../docs/emotional-fallback-scenarios';

describe('CLI Orchestration System', () => {
  let orchestrator: CLIOrchestrator;
  let executor: CommandExecutor;
  let safetyValidator: SafetyValidator;
  let outputFormatter: OutputFormatter;
  let emotionalValidator: EmotionalValidator;
  let dreamStateChecker: DreamStateChecker;
  let memoryExporter: MemoryExporter;

  beforeEach(async () => {
    orchestrator = new CLIOrchestrator();
    executor = new CommandExecutor();
    safetyValidator = new SafetyValidator();
    outputFormatter = new OutputFormatter();
    emotionalValidator = new EmotionalValidator();
    dreamStateChecker = new DreamStateChecker();
    memoryExporter = new MemoryExporter();
  });

  describe('Command Execution', () => {
    test('should execute safe commands with emotional awareness', async () => {
      // Arrange
      const command = {
        name: 'test:run',
        args: ['--suite', 'emotional-ux'],
        context: {
          environment: 'test',
          emotionalState: 'focused'
        }
      };

      // Act
      const result = await orchestrator.execute(command);
      const emotionalScore = await emotionalValidator.validateResponse(result);
      const dreamStateAligned = await dreamStateChecker.validate(result);

      // Assert
      expect(result.success).toBe(true);
      expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
      expect(dreamStateAligned).toBe(true);

      // Memory Export
      await memoryExporter.snapshot({
        type: 'cli-execution',
        emotionalScore,
        dreamStateAligned
      });
    });

    test('should handle execution failures with empathy', async () => {
      // Arrange
      const invalidCommand = {
        name: 'invalid:command',
        args: [],
        context: {
          environment: 'test'
        }
      };

      // Act
      const result = await orchestrator.execute(invalidCommand);
      const fallbackMessage = FallbackScenarios.CLI_EXECUTION_FAILURE;
      const emotionalScore = await emotionalValidator.validateMessage(fallbackMessage);

      // Assert
      expect(result.success).toBe(false);
      expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
      expect(fallbackMessage).toMatch(/Let's find a better approach/);
    });
  });

  describe('Safety Validation', () => {
    test('should validate command safety with emotional context', async () => {
      // Arrange
      const commands = [
        { name: 'test:run', args: ['--suite', 'unit'], risk: 'low' },
        { name: 'deploy:staging', args: [], risk: 'medium' },
        { name: 'system:reset', args: ['--force'], risk: 'high' }
      ];

      // Act & Assert
      for (const cmd of commands) {
        const result = await safetyValidator.validate(cmd);
        const emotionalScore = await emotionalValidator.validateResponse(result);

        expect(result.safe).toBe(cmd.risk !== 'high');
        expect(emotionalScore).toBeGreaterThanOrEqual(4.2);

        if (!result.safe) {
          expect(result.blockedReason).toMatch(/protecting your system/);
        }
      }
    });

    test('should prevent dangerous operations with clear messaging', async () => {
      // Arrange
      const dangerousCommand = {
        name: 'system:delete',
        args: ['--all', '--no-backup'],
        context: {
          environment: 'production'
        }
      };

      // Act
      const result = await safetyValidator.validate(dangerousCommand);
      const emotionalScore = await emotionalValidator.validateMessage(result.blockedReason!);

      // Assert
      expect(result.safe).toBe(false);
      expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
      expect(result.blockedReason).toMatch(/I care about your system's safety/);
    });
  });

  describe('Output Formatting', () => {
    test('should format success messages with emotional resonance', async () => {
      // Arrange
      const successData = {
        operation: 'test:complete',
        metrics: {
          passed: 15,
          failed: 0,
          duration: '3.5s'
        }
      };

      // Act
      const output = await outputFormatter.format(successData, 'success');
      const emotionalScore = await emotionalValidator.validateContent(output);

      // Assert
      expect(output).toContain('✨ All tests passed');
      expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
    });

    test('should format error messages with empathy and guidance', async () => {
      // Arrange
      const errorData = {
        operation: 'build:failed',
        error: {
          code: 'TS2307',
          message: 'Cannot find module'
        }
      };

      // Act
      const output = await outputFormatter.format(errorData, 'error');
      const emotionalScore = await emotionalValidator.validateContent(output);

      // Assert
      expect(output).toContain('Let me help you resolve this');
      expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
    });
  });

  describe('Progress Indication', () => {
    test('should show progress with emotional awareness', async () => {
      // Arrange
      const longOperation = {
        name: 'test:integration',
        totalSteps: 5,
        context: {
          emotionalState: 'patient'
        }
      };

      // Act & Assert
      for (let step = 1; step <= longOperation.totalSteps; step++) {
        const progress = await orchestrator.updateProgress(longOperation, step);
        const emotionalScore = await emotionalValidator.validateResponse(progress);

        expect(progress.formatted).toMatch(/Making progress/);
        expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
      }
    });

    test('should handle long-running operations with encouragement', async () => {
      // Arrange
      const longOperation = {
        name: 'deploy:production',
        duration: '5m',
        context: {
          emotionalState: 'anticipating'
        }
      };

      // Act
      const messages = await orchestrator.getLongRunningMessages(longOperation);
      const emotionalScores = await Promise.all(
        messages.map(msg => emotionalValidator.validateContent(msg))
      );

      // Assert
      expect(messages).toContain('Still working diligently');
      expect(emotionalScores.every(score => score >= 4.2)).toBe(true);
    });
  });

  describe('Help System', () => {
    test('should provide emotionally aware help messages', async () => {
      // Arrange
      const helpRequests = [
        { command: 'test:run', context: 'getting-started' },
        { command: 'deploy', context: 'first-time' },
        { command: 'system:status', context: 'troubleshooting' }
      ];

      // Act & Assert
      for (const request of helpRequests) {
        const help = await orchestrator.getHelp(request);
        const emotionalScore = await emotionalValidator.validateContent(help);

        expect(help).toContain("I'm here to guide you");
        expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
      }
    });

    test('should suggest alternatives for unknown commands', async () => {
      // Arrange
      const unknownCommand = {
        attempted: 'test:stats',
        similar: ['test:status', 'test:report']
      };

      // Act
      const suggestion = await orchestrator.getSuggestion(unknownCommand);
      const emotionalScore = await emotionalValidator.validateContent(suggestion);

      // Assert
      expect(suggestion).toContain('Did you mean');
      expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
    });
  });
}); 