// cursor/accelerators/emotional-foresight-lite/foresight-model-lite.ts

/**
 * Emotional Foresight Model – Lite Edition
 * ----------------------------------------
 * Uses `emotion-signal-spec.jsonc` to detect behavioral/emotional signals
 * based on session history. Outputs a list of signal names that match.
 *
 * Signals are used for interventions, UX guidance, and session drift analysis.
 */

import signalSpec from './emotion-signal-spec.jsonc';
import { analyzeSessionDelta } from '../../self-healing/ai-refactor-scripts/output-delta-analyzer';
import { getEmotionalScore } from '../../system-intel/loggers/emotionDriftJournal';
import { emitDeltaLog } from '../../system-intel/loggers/sessionDeltaLogEmitter';

/**
 * Evaluate if a single detector clause is satisfied.
 */
function matchDetectorClause(detector: string, history: any[], delta: number, emotionScore: number): boolean {
  const last = history.at(-1);
  const prev = history.at(-2);

  switch (true) {
    case detector.includes('revise-count'):
      return history.length > signalSpec.thresholds.reviseCount;

    case detector.includes('deltaScore'):
      return delta > signalSpec.thresholds.deltaScore;

    case detector.includes('emotionScore decline'):
      if (!last || !prev) return false;
      return prev.emotionScore - last.emotionScore > signalSpec.thresholds.emotionScoreDrop;

    case detector.includes('same-input-used-3x'):
      const inputs = history.map(h => h.input);
      const lastInput = inputs.at(-1);
      return inputs.filter(i => i === lastInput).length >= 3;

    case detector.includes('tone = confused'):
      return last?.tone === 'confused';

    case detector.includes('emotion = inspired'):
      return last?.emotion === 'inspired';

    case detector.includes('output-clarity-score'):
      return last?.outputClarityScore > 0.8;

    case detector.includes('session-duration'):
      return last?.sessionDuration > 300; // 5 minutes

    default:
      return false;
  }
}

/**
 * Predict emotional signals based on session history.
 */
export function predictEmotionalTrajectory(sessionId: string, history: any[]): string[] {
  const predictions: string[] = [];
  const delta = analyzeSessionDelta(sessionId);
  const emotionScore = getEmotionalScore(sessionId);

  for (const signal of signalSpec.signals) {
    const conditionsMet = signal.detectors.every(detector =>
      matchDetectorClause(detector, history, delta, emotionScore)
    );
    if (conditionsMet) predictions.push(signal.name);
  }

  // Emit log if signals were detected (excluding fallback)
  if (predictions.length > 0 && predictions[0] !== signalSpec.meta?.defaultSignal) {
    emitDeltaLog(sessionId, {
      event: 'emotional-foresight-signals',
      signals: predictions,
      context: 'foresight-model-lite',
      timestamp: new Date().toISOString()
    });
  }

  // Fallback if nothing matches
  if (predictions.length === 0 && signalSpec.meta?.defaultSignal) {
    predictions.push(signalSpec.meta.defaultSignal);
  }

  return predictions;
}
