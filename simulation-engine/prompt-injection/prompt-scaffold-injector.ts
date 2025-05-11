import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/logger';

/**
 * PromptScaffoldInjector - Maps scenario promptType to scaffold, injects inputs, applies enhancers, logs prompt/response pairs
 */
export class PromptScaffoldInjector {
  private readonly logger: Logger;
  private readonly gptTemplatesDir: string;
  private readonly logDir: string;

  constructor(gptTemplatesDir: string = path.resolve('gpt-templates'), logDir: string = path.resolve('simulation-engine/logs')) {
    this.logger = new Logger('PromptScaffoldInjector');
    this.gptTemplatesDir = gptTemplatesDir;
    this.logDir = logDir;
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Injects scenario inputs into the mapped prompt scaffold and logs input/output for both variants
   * @param scenario The scenario object
   * @param runPromptFn Function to run the prompt (should return output)
   */
  public async injectAndLog(scenario: any, runPromptFn: (prompt: string, context: any) => Promise<string>): Promise<void> {
    const { scenario_id, promptType, weak_input, strong_input, enhancer } = scenario;
    const scaffoldPath = this.findScaffold(promptType);
    if (!scaffoldPath) {
      this.logger.error(`No scaffold found for promptType: ${promptType}`);
      return;
    }
    const scaffold = fs.readFileSync(scaffoldPath, 'utf8');

    // Prepare variants
    const variants = [
      { label: 'weak', input: weak_input },
      { label: 'strong', input: strong_input }
    ];

    for (const variant of variants) {
      // Inject input and enhancer
      let renderedPrompt = this.renderPrompt(scaffold, variant.input, enhancer);
      // Run prompt (simulate or real)
      const output = await runPromptFn(renderedPrompt, { scenario, variant: variant.label });
      // Log input/output
      this.logPromptRun(scenario_id, variant.label, renderedPrompt, output);
    }
  }

  /**
   * Finds the scaffold file for a given promptType
   * @param promptType The prompt type
   * @returns The path to the scaffold file
   */
  private findScaffold(promptType: string): string | null {
    // Try .prompt extension first
    const promptFile = path.join(this.gptTemplatesDir, `${promptType}.v1.prompt`);
    if (fs.existsSync(promptFile)) return promptFile;
    // Fallback: search for any .prompt file matching promptType
    const files = fs.readdirSync(this.gptTemplatesDir);
    const match = files.find(f => f.startsWith(promptType) && f.endsWith('.prompt'));
    if (match) return path.join(this.gptTemplatesDir, match);
    return null;
  }

  /**
   * Renders the prompt by injecting input and enhancer fields
   * @param scaffold The prompt scaffold string
   * @param input The input to inject
   * @param enhancer Optional enhancer fields
   * @returns The rendered prompt
   */
  private renderPrompt(scaffold: string, input: any, enhancer?: any): string {
    let rendered = scaffold.replace(/\{\{input\}\}/g, input || '');
    if (enhancer && typeof enhancer === 'object') {
      for (const [key, value] of Object.entries(enhancer)) {
        rendered = rendered.replace(new RegExp(`\\{\\{${key}\\}\}`, 'g'), String(value));
      }
    }
    return rendered;
  }

  /**
   * Logs the prompt input and output for a scenario variant
   * @param scenarioId The scenario ID
   * @param variantLabel 'weak' or 'strong'
   * @param prompt The rendered prompt input
   * @param output The output from the prompt
   */
  private logPromptRun(scenarioId: string, variantLabel: string, prompt: string, output: string): void {
    const logPath = path.join(this.logDir, `${scenarioId}-${variantLabel}-prompt-run.json`);
    const logEntry = {
      timestamp: new Date().toISOString(),
      scenarioId,
      variant: variantLabel,
      prompt,
      output
    };
    fs.writeFileSync(logPath, JSON.stringify(logEntry, null, 2));
    this.logger.info(`Logged prompt run: ${logPath}`);
  }
} 