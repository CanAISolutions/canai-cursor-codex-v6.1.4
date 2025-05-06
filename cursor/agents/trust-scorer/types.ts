export interface TrustEventData {
  component: string;
  score: number;
  timestamp: string;
}

export interface TrustViolationData extends TrustEventData {
  threshold: number;
}

export interface TrustWarningData extends TrustEventData {
  warningThreshold: number;
}

export interface TrustSignalData extends TrustEventData {
  factors?: {
    reliability: number;
    safety: number;
    performance: number;
    ethical: number;
  };
}

export type TrustEventType = 'trust:violation' | 'trust:warning' | 'trust:signal';

export interface TrustEvent {
  type: TrustEventType;
  data: TrustEventData | TrustViolationData | TrustWarningData | TrustSignalData;
  timestamp: string;
} 