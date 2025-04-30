
import { PromptLog } from '../types';

export function reasoningDepth(trace: string): number {
  return trace.split('\n').filter(Boolean).length;
}

export function toolGraphWidth(toolCalls: { tool: string }[]): number {
  return new Set(toolCalls.map(c => c.tool)).size;
}

export function computeExtendedScore(base: number, promptLog: PromptLog): number {
  const depth = reasoningDepth(promptLog.reasoning);
  const width = toolGraphWidth(promptLog.toolCalls);
  return base + depth * 0.2 + width * 0.3;
}
