/**
 * EmotionalDrift type definition
 * @version 2.7.9
 */

export interface EmotionalDrift {
  timestamp: string;
  sessionId: string;
  overallDrift: number;
  confidenceShifts: ConfidenceShift[];
  toneConsistency: number;
  emotionalAnchors: EmotionalAnchor[];
  trustImpact: number;
}

export interface ConfidenceShift {
  field: string;
  from: number;
  to: number;
  impact: number;
  timestamp: string;
}

export interface EmotionalAnchor {
  type: string;
  value: string;
  confidence: number;
  impact: number;
  timestamp: string;
} 