// DEPRECATED: Use AIProvider from '../../agents/debug/engines/ai-provider' instead.
/**
 * ai-provider.ts
 * Interface for AI provider capabilities
 */

import { DebugContext } from '../agents/debug/types';

export interface TrustEvalRequest {
  content: string;
  context: DebugContext;
  minScore: number;
}

export interface AIProvider {
  /**
   * Evaluates trust score for content
   */
  evaluateTrust(request: TrustEvalRequest): Promise<number>;

  /**
   * Evaluates trust score for a fix proposal
   */
  evaluateFixTrust(fixProposal: string, bugContext: DebugContext): Promise<number>;
} 