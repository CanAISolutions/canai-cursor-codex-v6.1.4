// recursive-thinker.ts
// Modular utility for recursive generation and internal output refinement
// Used in SmartRefineLayer, AI Concierge, and Prompt Intelligence Loop

import { generatePromptOutput } from './gpt-runner';
import { evaluateOutputs } from './output-evaluator';

interface RecursiveThinkerConfig {
  promptType: string;
  inputData: Record<string, any>;
  rounds?: number;
  variantsPerRound?: number;
  criteria?: string[];
  logDelta?: boolean;
}

export async function recursiveThinker(config: RecursiveThinkerConfig): Promise<any> {
  const {
    promptType,
    inputData,
    rounds = 2,
    variantsPerRound = 3,
    criteria = ['clarity', 'actionability'],
    logDelta = false
  } = config;

  let bestOutput: any = null;

  for (let round = 0; round < rounds; round++) {
    const variants = await Promise.all(
      Array.from({ length: variantsPerRound }).map(() =>
        generatePromptOutput({ promptType, inputData })
      )
    );

    const scored = await evaluateOutputs(variants, criteria);

    const top = scored.sort((a, b) => b.totalScore - a.totalScore)[0];

    if (logDelta) {
      console.log(`Round ${round + 1} Top Score:`, top.totalScore);
    }

    bestOutput = top.output;
  }

  return bestOutput;
}
