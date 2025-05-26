#!/usr/bin/env node

/**
 * @file cursor/resonance-engine/cli/resonance-cli.ts
 * @description CLI for generating emotionally intelligent UI components
 * @version 1.0.0
 * @emotionalResonance true
 * @codexAligned true
 */

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ComponentGenerator } from '../generator/component-generator';
import { PromptRegistry } from '../prompt-registry/prompt-registry';
import { EmotionalValidator } from '../validators/emotional-validator';
import { VisualValidator } from '../validation/visual-validator';
import path from 'path';
import fs from 'fs/promises';

const program = new Command();

// CLI Configuration
program
  .name('resonance')
  .description('🎯 Emotionally intelligent UI component generator for CanAI Codex')
  .version('1.0.0');

// Generate command
program
  .command('generate')
  .alias('gen')
  .description('Generate an emotionally resonant UI component')
  .argument('[component-name]', 'Name of the component to generate')
  .option('-t, --type <type>', 'Component type (hero, card, form, navigation, fallback)', 'card')
  .option('--tone <tone>', 'Emotional tone (reassuring, confident, empathetic, etc.)', 'reassuring')
  .option('--trust-level <level>', 'Trust score requirement (4.2-5.0)', '4.5')
  .option('--memberstack <fields>', 'Comma-separated Memberstack fields to bind', '')
  .option('--fallbacks <states>', 'Comma-separated fallback states', 'loading,error,empty')
  .option('--visual-validation', 'Enable visual validation and snapshots', false)
  .option('--test-coverage <types>', 'Test coverage types', 'emotional,functional')
  .option('-o, --output <path>', 'Output directory', './components')
  .option('--from-prompt <file>', 'Generate from existing prompt file')
  .option('--interactive', 'Interactive mode with guided questions', false)
  .action(async (componentName, options) => {
    try {
      console.log(chalk.cyan('🎯 Resonance Engine - Emotional UI Generator\n'));

      let config;
      
      if (options.interactive || !componentName) {
        config = await runInteractiveMode(componentName);
      } else {
        config = await parseOptions(componentName, options);
      }

      // Validate configuration
      await validateConfig(config);

      // Generate component
      console.log(chalk.yellow('⚡ Generating component...'));
      const generator = new ComponentGenerator();
      const result = await generator.generate(config);

      // Run emotional validation
      console.log(chalk.yellow('🧠 Validating emotional resonance...'));
      const emotionalValidator = new EmotionalValidator();
      const emotionalScore = await emotionalValidator.validateGenerated(result);

      if (emotionalScore < parseFloat(config.trustLevel)) {
        console.log(chalk.red(`❌ Emotional validation failed. Score: ${emotionalScore}, Required: ${config.trustLevel}`));
        process.exit(1);
      }

      // Run visual validation if requested
      if (config.visualValidation) {
        console.log(chalk.yellow('👁️  Running visual validation...'));
        const visualValidator = new VisualValidator();
        await visualValidator.captureStates(result, config);
      }

      // Success output
      console.log(chalk.green('\n✅ Component generated successfully!'));
      console.log(chalk.gray(`📁 Output: ${result.outputPath}`));
      console.log(chalk.gray(`🧠 Emotional Score: ${emotionalScore.toFixed(1)}`));
      console.log(chalk.gray(`🔒 Trust Level: ${config.trustLevel}`));
      
      if (result.tests) {
        console.log(chalk.gray(`🧪 Tests: ${result.tests.length} files generated`));
      }

      // Show next steps
      console.log(chalk.cyan('\n📋 Next Steps:'));
      console.log(chalk.gray(`   1. Review generated component at ${result.outputPath}`));
      console.log(chalk.gray(`   2. Run tests: npm test ${result.testPath}`));
      console.log(chalk.gray(`   3. Import: import { ${result.componentName} } from '${result.importPath}'`));

    } catch (error) {
      console.error(chalk.red('❌ Generation failed:'), error.message);
      process.exit(1);
    }
  });

// List command
program
  .command('list')
  .description('List available component templates and prompts')
  .option('-t, --type <type>', 'Filter by component type')
  .option('--prompts', 'Show available prompts', false)
  .action(async (options) => {
    try {
      const registry = new PromptRegistry();
      
      if (options.prompts) {
        const prompts = await registry.listPrompts(options.type);
        console.log(chalk.cyan('📝 Available Prompts:\n'));
        prompts.forEach(prompt => {
          console.log(chalk.white(`  ${prompt.name}`));
          console.log(chalk.gray(`    Type: ${prompt.type} | Trust: ${prompt.trustScore} | Version: ${prompt.version}`));
          console.log(chalk.gray(`    ${prompt.description}\n`));
        });
      } else {
        const templates = await registry.listTemplates(options.type);
        console.log(chalk.cyan('🎨 Available Templates:\n'));
        templates.forEach(template => {
          console.log(chalk.white(`  ${template.name}`));
          console.log(chalk.gray(`    Type: ${template.type} | Emotional Context: ${template.emotionalContext}`));
          console.log(chalk.gray(`    ${template.description}\n`));
        });
      }
    } catch (error) {
      console.error(chalk.red('❌ Failed to list items:'), error.message);
      process.exit(1);
    }
  });

// Validate command
program
  .command('validate')
  .description('Validate existing component for emotional resonance')
  .argument('<component-path>', 'Path to component file')
  .option('--visual', 'Include visual validation', false)
  .option('--fix', 'Attempt to fix validation issues', false)
  .action(async (componentPath, options) => {
    try {
      console.log(chalk.cyan('🔍 Validating component emotional resonance...\n'));

      const validator = new EmotionalValidator();
      const result = await validator.validateFile(componentPath);

      console.log(chalk.white(`Component: ${path.basename(componentPath)}`));
      console.log(chalk.gray(`Trust Score: ${result.trustScore.toFixed(1)}`));
      console.log(chalk.gray(`Emotional Tone: ${result.detectedTone}`));
      
      if (result.trustScore >= 4.2) {
        console.log(chalk.green('✅ Emotional validation passed'));
      } else {
        console.log(chalk.red('❌ Emotional validation failed'));
        
        if (result.issues.length > 0) {
          console.log(chalk.yellow('\n⚠️  Issues found:'));
          result.issues.forEach(issue => {
            console.log(chalk.gray(`   • ${issue}`));
          });
        }

        if (options.fix) {
          console.log(chalk.yellow('\n🔧 Attempting to fix issues...'));
          const fixed = await validator.autoFix(componentPath, result.issues);
          if (fixed) {
            console.log(chalk.green('✅ Issues fixed successfully'));
          } else {
            console.log(chalk.red('❌ Could not auto-fix all issues'));
          }
        }
      }

      if (options.visual) {
        console.log(chalk.yellow('\n👁️  Running visual validation...'));
        const visualValidator = new VisualValidator();
        const visualResult = await visualValidator.validateComponent(componentPath);
        console.log(chalk.gray(`Visual Score: ${visualResult.score.toFixed(1)}`));
      }

    } catch (error) {
      console.error(chalk.red('❌ Validation failed:'), error.message);
      process.exit(1);
    }
  });

// Interactive mode implementation
async function runInteractiveMode(initialName?: string): Promise<ComponentConfig> {
  console.log(chalk.cyan('🎯 Interactive Component Generation\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Component name:',
      default: initialName,
      validate: (input) => input.length > 0 || 'Component name is required'
    },
    {
      type: 'list',
      name: 'type',
      message: 'Component type:',
      choices: [
        { name: '🦸 Hero Banner - Main page headers with emotional impact', value: 'hero' },
        { name: '🃏 Card - Content cards with trust-building elements', value: 'card' },
        { name: '📝 Form - Input forms with emotional validation', value: 'form' },
        { name: '🧭 Navigation - Menu systems with user context', value: 'navigation' },
        { name: '🛡️ Fallback - Error and loading states', value: 'fallback' }
      ]
    },
    {
      type: 'list',
      name: 'tone',
      message: 'Emotional tone:',
      choices: [
        { name: '🤗 Reassuring - "You are safe and supported"', value: 'reassuring' },
        { name: '💪 Confident - "This will definitely work"', value: 'confident' },
        { name: '❤️ Empathetic - "We understand your challenges"', value: 'empathetic' },
        { name: '🎯 Strategic - "Based on analysis, we recommend"', value: 'strategic' },
        { name: '✨ Inspiring - "Your vision can transform everything"', value: 'inspiring' }
      ]
    },
    {
      type: 'number',
      name: 'trustLevel',
      message: 'Trust score requirement (4.2-5.0):',
      default: 4.5,
      validate: (input) => (input >= 4.2 && input <= 5.0) || 'Trust level must be between 4.2 and 5.0'
    },
    {
      type: 'checkbox',
      name: 'memberstackFields',
      message: 'Memberstack fields to bind:',
      choices: [
        { name: 'firstName - User\'s first name', value: 'firstName' },
        { name: 'planTier - Subscription plan level', value: 'planTier' },
        { name: 'lastLogin - Last login timestamp', value: 'lastLogin' },
        { name: 'preferredTone - User\'s tone preference', value: 'preferredTone' },
        { name: 'decisionHistory - Previous decisions made', value: 'decisionHistory' }
      ]
    },
    {
      type: 'checkbox',
      name: 'fallbackStates',
      message: 'Fallback states to include:',
      choices: [
        { name: 'loading - Slow response handling', value: 'loading', checked: true },
        { name: 'error - Error state with recovery', value: 'error', checked: true },
        { name: 'empty - No data available', value: 'empty', checked: true },
        { name: 'timeout - Session timeout', value: 'timeout' },
        { name: 'offline - Network connectivity issues', value: 'offline' }
      ]
    },
    {
      type: 'confirm',
      name: 'visualValidation',
      message: 'Enable visual validation and snapshots?',
      default: false
    },
    {
      type: 'checkbox',
      name: 'testCoverage',
      message: 'Test coverage types:',
      choices: [
        { name: 'emotional - Emotional resonance tests', value: 'emotional', checked: true },
        { name: 'functional - Component functionality tests', value: 'functional', checked: true },
        { name: 'accessibility - ARIA and a11y tests', value: 'accessibility' },
        { name: 'visual - Visual regression tests', value: 'visual' }
      ]
    }
  ]);

  return {
    name: answers.name,
    type: answers.type,
    tone: answers.tone,
    trustLevel: answers.trustLevel.toString(),
    memberstackFields: answers.memberstackFields,
    fallbackStates: answers.fallbackStates,
    visualValidation: answers.visualValidation,
    testCoverage: answers.testCoverage,
    outputPath: './components'
  };
}

// Parse command line options
async function parseOptions(componentName: string, options: any): Promise<ComponentConfig> {
  return {
    name: componentName,
    type: options.type,
    tone: options.tone,
    trustLevel: options.trustLevel,
    memberstackFields: options.memberstack ? options.memberstack.split(',') : [],
    fallbackStates: options.fallbacks.split(','),
    visualValidation: options.visualValidation,
    testCoverage: options.testCoverage.split(','),
    outputPath: options.output,
    fromPrompt: options.fromPrompt
  };
}

// Validate configuration
async function validateConfig(config: ComponentConfig): Promise<void> {
  const trustLevel = parseFloat(config.trustLevel);
  if (trustLevel < 4.2 || trustLevel > 5.0) {
    throw new Error('Trust level must be between 4.2 and 5.0 (Codex requirement)');
  }

  if (!config.name || config.name.length === 0) {
    throw new Error('Component name is required');
  }

  // Validate component name follows kebab-case
  if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(config.name)) {
    throw new Error('Component name must be in kebab-case format');
  }

  // Check if output directory exists
  try {
    await fs.access(config.outputPath);
  } catch {
    console.log(chalk.yellow(`📁 Creating output directory: ${config.outputPath}`));
    await fs.mkdir(config.outputPath, { recursive: true });
  }
}

// Component configuration interface
interface ComponentConfig {
  name: string;
  type: string;
  tone: string;
  trustLevel: string;
  memberstackFields: string[];
  fallbackStates: string[];
  visualValidation: boolean;
  testCoverage: string[];
  outputPath: string;
  fromPrompt?: string;
}

// Run CLI
if (require.main === module) {
  program.parse();
}

export { program as ResonanceCLI }; 