/**
 * @file lib/scripts/safety-validator.ts
 * @description Command safety validation with emotional awareness
 * @version 6.1.4
 */

import { Command } from './orchestrator';

export interface SafetyValidationResult {
  safe: boolean;
  blockedReason?: string;
}

export class SafetyValidator {
  private highRiskCommands = ['system:delete', 'system:reset'];

  async validate(command: Command): Promise<SafetyValidationResult> {
    // Check for high-risk commands
    if (this.highRiskCommands.includes(command.name)) {
      return {
        safe: false,
        blockedReason: "I care about your system's safety - this command requires additional confirmation."
      };
    }

    // Check for production environment safety
    if (command.context?.environment === 'production') {
      return {
        safe: false,
        blockedReason: 'Protecting your production environment - please confirm this action.'
      };
    }

    return { safe: true };
  }
} 