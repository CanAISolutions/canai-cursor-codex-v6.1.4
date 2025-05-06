/**
 * @file useDebugContext.ts
 * @description React hook for accessing debug context in the UI
 */

import { useState, useEffect, useCallback } from 'react';
import { DebugCopilotBridge } from '../core/bridge';
import { DebugContext } from '../../agents/debug/types';
import { CopilotSuggestion } from '../types';

interface UseDebugContextResult {
  context: DebugContext | null;
  trustScore: number | null;
  issues: string[];
  suggestions: string[];
  enhanceSuggestion: (suggestion: CopilotSuggestion) => Promise<CopilotSuggestion>;
  refreshContext: () => Promise<void>;
}

export function useDebugContext(
  bridge: DebugCopilotBridge,
  initialContext?: DebugContext
): UseDebugContextResult {
  const [context, setContext] = useState<DebugContext | null>(initialContext || null);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const refreshContext = useCallback(async () => {
    const currentContext = bridge.getDebugContext();
    if (!currentContext) return;

    const analysis = await bridge.analyzeContext(currentContext);
    setContext(currentContext);
    setTrustScore(analysis.trustScore);
    setIssues(analysis.issues);
    setSuggestions(analysis.suggestions);
  }, [bridge]);

  const enhanceSuggestion = useCallback(
    async (suggestion: CopilotSuggestion): Promise<CopilotSuggestion> => {
      if (!context) return suggestion;
      return bridge.enhanceCopilotSuggestion(suggestion, context);
    },
    [bridge, context]
  );

  useEffect(() => {
    if (initialContext) {
      refreshContext();
    }
  }, [initialContext, refreshContext]);

  return {
    context,
    trustScore,
    issues,
    suggestions,
    enhanceSuggestion,
    refreshContext
  };
} 