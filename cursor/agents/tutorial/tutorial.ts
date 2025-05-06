/**
 * @file tutorial.ts
 * @description Context-aware CLI onboarding.
 * @pillar Crystal-Clear Experience
 * @maturity Stable
 * @status Active
 */
import { appendToFixContextAsync } from '../../context/fix-context-utils';
import { logInnovationMetric } from '../../utils/telemetry';
import * as inquirer from 'inquirer';
import { PromptContext } from '../../context/prompt-context';

export class TutorialAgent {
  private traceId: string;
  private context: PromptContext;

  constructor(traceId: string, context: PromptContext = { tone: 'neutral', industry: 'general' }) {
    this.traceId = traceId;
    this.context = context;
  }

  async runTutorial(): Promise<void> {
    try {
      const steps = [
        { message: 'Install dependencies', action: 'Run `npm install`.' },
        { message: 'Configure environment', action: 'Copy `.env.example` to `.env`.' },
        { message: 'Validate agents', action: 'Run `npm test`.' },
      ].map(step => ({
        ...step,
        message: this.context.tone === 'friendly' ? `Let's ${step.message.toLowerCase()}!` : step.message,
      }));

      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'startTutorial',
          message: `Welcome to CanAI (${this.context.industry} mode)! Start the onboarding?`,
          default: true,
        },
      ]);

      if (!answers.startTutorial) {
        await appendToFixContextAsync(`[${this.traceId}] Tutorial skipped`);
        await logInnovationMetric('tutorial_skipped', { context: this.context }, this.traceId);
        return;
      }

      for (const step of steps) {
        const { proceed } = await inquirer.prompt([
          { type: 'confirm', name: 'proceed', message: `${step.message}: ${step.action}\nNext?`, default: true },
        ]);

        if (!proceed) {
          await appendToFixContextAsync(`[${this.traceId}] Tutorial stopped at: ${step.message}`);
          await logInnovationMetric('tutorial_stopped', { step: step.message, context: this.context }, this.traceId);
          break;
        }

        await appendToFixContextAsync(`[${this.traceId}] Completed step: ${step.message}`);
        await logInnovationMetric('tutorial_step', { step: step.message, context: this.context }, this.traceId);
      }

      console.log('Tutorial completed! Ready to innovate with CanAI.');
      await appendToFixContextAsync(`[${this.traceId}] Tutorial completed`);
      await logInnovationMetric('tutorial_completed', { steps: steps.length, context: this.context }, this.traceId);
    } catch (err) {
      await appendToFixContextAsync(`[${this.traceId}] Tutorial failed: ${(err as Error).message}`);
      await logInnovationMetric('tutorial_failed', { error: (err as Error).message }, this.traceId);
      throw err;
    }
  }
} 