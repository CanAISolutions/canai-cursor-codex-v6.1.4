export interface AIProvider {
  evaluateFixTrustScore(fixProposal: string, bugContext: BugContext): Promise<number>;
  evaluateFixTrust(fixProposal: string, bugContext: BugContext): Promise<TrustEvaluation>;
} 