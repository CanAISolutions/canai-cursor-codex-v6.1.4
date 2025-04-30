// output-evaluator.ts
// Scoring engine to evaluate multiple prompt outputs based on custom criteria

interface ScoredOutput {
  output: any;
  scores: Record<string, number>;
  totalScore: number;
}

export async function evaluateOutputs(
  outputs: any[],
  criteria: string[] = ['clarity']
): Promise<ScoredOutput[]> {
  return outputs.map((output) => {
    const scores: Record<string, number> = {};
    let total = 0;

    for (const criterion of criteria) {
      let score = 0;

      // Example heuristics — to be replaced with actual evaluators or LLM-based judgment
      switch (criterion) {
        case 'clarity':
          score = clarityHeuristic(output);
          break;
        case 'actionability':
          score = actionabilityHeuristic(output);
          break;
        case 'emotional resonance':
          score = resonanceHeuristic(output);
          break;
        default:
          score = 1; // fallback neutral score
      }

      scores[criterion] = score;
      total += score;
    }

    return { output, scores, totalScore: total };
  });
}

// Heuristics — these can later be replaced with GPT scoring agents
function clarityHeuristic(output: any): number {
  const text = output?.text || '';
  return Math.min(5, Math.floor(text.length / 100)); // crude proxy: longer = clearer
}

function actionabilityHeuristic(output: any): number {
  const text = output?.text || '';
  return /step|plan|how to|guide|action/i.test(text) ? 5 : 2;
}

function resonanceHeuristic(output: any): number {
  const text = output?.text || '';
  return /feel|inspire|struggle|vision|journey/i.test(text) ? 5 : 2;
}
