export interface TrustFactors {
  reliability: number;
  safety: number;
  performance: number;
  ethical: number;
}

export interface TrustEvaluation {
  score: number;
  confidence: number;
  factors: TrustFactors;
}

export type TrustEventType = 'trust:signal' | 'trust:warning' | 'trust:violation';

export interface TrustEventData {
  score: number;
  confidence: number;
  factors?: TrustFactors;
}

export interface TrustSignalData extends TrustEventData {
  type: 'signal';
}

export interface TrustWarningData extends TrustEventData {
  type: 'warning';
  reason: string;
}

export interface TrustViolationData extends TrustEventData {
  type: 'violation';
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TrustEvent {
  type: TrustEventType;
  data: TrustEventData | TrustViolationData | TrustWarningData | TrustSignalData;
  timestamp: string;
} 