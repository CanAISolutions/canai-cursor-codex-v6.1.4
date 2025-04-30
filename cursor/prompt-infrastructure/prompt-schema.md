## 📡 Emotional Signal Schema – v1.0.0

This schema governs all signal definitions in `emotion-signal-spec.jsonc`. It is used by foresight engines to interpret user emotion, intent, and session drift.

```ts
// Top-level signal object
type EmotionalSignal = {
  name: string;                     // Unique signal name (e.g., "loop-fatigue")
  description: string;              // Plain-English purpose of the signal
  detectors: DetectorClause[];     // Conditions that trigger this signal
  severity: SignalSeverity;        // Urgency/impact on UX or intervention
};

// Conditions evaluated during session
type DetectorClause =
  | `revise-count ${Comparator} ${number}`
  | `same-input-used-${number}x`
  | `tone = ${Tone}`
  | `emotion = ${Emotion}`
  | `deltaScore ${Comparator} ${number}`
  | `output-clarity-score ${Comparator} ${number}`
  | `session-duration ${Comparator} ${Duration}`
  | `emotionScore decline over ${number} steps`;

// Enumerated support types
type Comparator = '>' | '>=' | '<' | '<=' | '=';
type SignalSeverity = 'high' | 'medium' | 'low-positive' | 'silent-danger';
type Emotion = 'frustrated' | 'confused' | 'inspired' | 'hopeful' | 'neutral' | 'lost';
type Tone = 'confused' | 'neutral' | 'optimistic' | 'assertive' | 'overwhelmed';
type Duration = `${number}m` | `${number}s`;
