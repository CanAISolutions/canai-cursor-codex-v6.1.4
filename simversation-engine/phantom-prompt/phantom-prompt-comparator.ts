// Phantom Prompt Comparator: Evaluates phantom prompts against main prompts
// What/Why/How: Ensures phantom prompts meet performance and ethical standards, logs detailed actions for traceability

import * as fs from 'fs';
import * as path from 'path';

/**
 * PhantomPromptComparator - Evaluates phantom prompts against main prompts
 * - Compares performance metrics (trust, clarity, empathy, drift, memory)
 * - Logs detailed actions to auto-actions.log.md
 * - Ensures full traceability of all decisions and edge cases
 */
export class PhantomPromptComparator {
  private readonly mainPromptsDir: string;
  private readonly phantomPromptsDir: string;
  private readonly logPath: string;

  constructor(
    mainPromptsDir: string = path.resolve('prompts'),
    phantomPromptsDir: string = path.resolve('phantom-prompts'),
    logPath: string = path.resolve('cursor/auto-actions.log.md')
  ) {
    this.mainPromptsDir = mainPromptsDir;
    this.phantomPromptsDir = phantomPromptsDir;
    this.logPath = logPath;
  }

  /**
   * Main entry: compares phantom prompts against main prompts
   */
  public async run(): Promise<void> {
    this.logAction('Starting Phantom Prompt Comparator run.');
    const mainPrompts = this.loadPrompts(this.mainPromptsDir);
    const phantomPrompts = this.loadPrompts(this.phantomPromptsDir);
    const comparisons = this.comparePrompts(mainPrompts, phantomPrompts);
    this.logComparisons(comparisons);
    this.logAction('Phantom Prompt Comparator run complete.');
  }

  /**
   * Loads all prompt JSON files from the specified directory
   */
  private loadPrompts(dir: string): any[] {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    const prompts: any[] = [];
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
        prompts.push(data);
      } catch (e) {
        this.logAction(`Failed to parse prompt file: ${file}`);
      }
    }
    return prompts;
  }

  /**
   * Compares phantom prompts against main prompts
   */
  private comparePrompts(mainPrompts: any[], phantomPrompts: any[]): any[] {
    const comparisons: any[] = [];
    for (const phantom of phantomPrompts) {
      const main = mainPrompts.find(m => m.id === phantom.id);
      if (main) {
        comparisons.push({
          phantom_id: phantom.id,
          trust_delta: phantom.trust - main.trust,
          clarity_delta: phantom.clarity - main.clarity,
          empathy_delta: phantom.empathy - main.empathy,
          drift_delta: phantom.drift - main.drift,
          memory_delta: phantom.memory - main.memory
        });
      }
    }
    return comparisons;
  }

  /**
   * Logs comparison results to auto-actions.log.md
   */
  private logComparisons(comparisons: any[]): void {
    for (const comp of comparisons) {
      this.logAction(`Phantom Prompt ${comp.phantom_id}: Trust Delta ${comp.trust_delta}, Clarity Delta ${comp.clarity_delta}, Empathy Delta ${comp.empathy_delta}, Drift Delta ${comp.drift_delta}, Memory Delta ${comp.memory_delta}`);
    }
  }

  /**
   * Appends an action to the auto-actions log
   */
  private logAction(msg: string): void {
    const entry = `\n[${new Date().toISOString()}] PhantomPromptComparator: ${msg}`;
    fs.appendFileSync(this.logPath, entry);
  }
}

// If run directly, execute the comparator
if (require.main === module) {
  (async () => {
    const comparator = new PhantomPromptComparator();
    await comparator.run();
  })();
} 