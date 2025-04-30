# ai-vs-human-benchmark.md

## 🎯 Purpose
Compare GPT-generated output with human-authored content across key quality dimensions, using a version-safe, repeatable benchmark process.

## 📊 Evaluation Rubric

| Metric               | Description                                                                 | Scoring Range |
|----------------------|-----------------------------------------------------------------------------|---------------|
| Clarity              | Is the output clear and logically structured?                              | 1–10          |
| Strategic Depth      | Does it reflect high-quality reasoning and foresight?                      | 1–10          |
| Emotional Resonance  | Does it align with CanAI tone and emotional design?                        | 1–10          |
| Factual Integrity    | Does it maintain correctness and avoid hallucination?                      | 1–10          |
| Codex Alignment      | Does it adhere to dream-state, prompt format, and modularity expectations? | 1–10          |

## 🧪 Benchmark Protocol

```ts
// benchmark-replay.ts (linked runtime harness)
import { replayPrompt, fetchHumanReference, compareOutputs } from '../test-engines/benchmarkUtils'

runBenchmark({
  promptType: 'business_plan',
  sessionId: 'sess_xxx',
  metrics: ['clarity', 'depth', 'emotion', 'facts', 'codex'],
  snapshot: true
})
