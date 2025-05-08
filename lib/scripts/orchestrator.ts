/**
 * @file lib/scripts/orchestrator.ts
 * @description CLI orchestration with emotional resonance and safety
 * @version 6.1.4
 */

import { EmotionalValidator } from '../../cursor/validators/emotional-validator';
import { DreamStateChecker } from '../../cursor/validators/dream-state';
import { CommandExecutor } from './command-executor';
import { SafetyValidator } from './safety-validator';
import { OutputFormatter } from './output-formatter';

export interface Command {
  name: string;
  args: string[];
  context?: {
    environment?: string;
    emotionalState?: string;
  };
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: any;
  emotionalScore?: number;
  dreamStateAligned?: boolean;
}

export class CLIOrchestrator {
  private executor: CommandExecutor;
  private safetyValidator: SafetyValidator;
  private outputFormatter: OutputFormatter;
  private emotionalValidator: EmotionalValidator;
  private dreamStateChecker: DreamStateChecker;

  constructor() {
    this.executor = new CommandExecutor();
    this.safetyValidator = new SafetyValidator();
    this.outputFormatter = new OutputFormatter();
    this.emotionalValidator = new EmotionalValidator();
    this.dreamStateChecker = new DreamStateChecker();
  }

  async execute(command: Command): Promise<ExecutionResult> {
    const safetyCheck = await this.safetyValidator.validate(command);
    if (!safetyCheck.safe) {
      return {
        success: false,
        error: safetyCheck.blockedReason,
        emotionalScore: await this.emotionalValidator.validateMessage(safetyCheck.blockedReason!)
      };
    }

    try {
      const result = await this.executor.execute(command);
      const emotionalScore = await this.emotionalValidator.validateResponse(result);
      const dreamStateAligned = await this.dreamStateChecker.validate(result);

      return {
        success: true,
        output: result,
        emotionalScore,
        dreamStateAligned
      };
    } catch (error) {
      return {
        success: false,
        error,
        emotionalScore: await this.emotionalValidator.validateMessage(error.message)
      };
    }
  }

  async updateProgress(operation: any, step: number): Promise<any> {
    const progress = {
      step,
      total: operation.totalSteps,
      formatted: `Making progress - Step ${step}/${operation.totalSteps}`
    };
    return progress;
  }

  async getLongRunningMessages(operation: any): Promise<string[]> {
    return [
      'Still working diligently on your request...',
      'Making steady progress...',
      'Almost there - crafting the perfect result...'
    ];
  }

  async getHelp(request: { command: string; context: string }): Promise<string> {
    return `I'm here to guide you through the ${request.command} command.`;
  }

  async getSuggestion(unknownCommand: { attempted: string; similar: string[] }): Promise<string> {
    return `Did you mean: ${unknownCommand.similar.join(' or ')}?`;
  }
} 