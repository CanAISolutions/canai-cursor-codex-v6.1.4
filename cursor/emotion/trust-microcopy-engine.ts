// trust-microcopy-engine.ts
// WHAT: CanAI Trust Microcopy System (Codex CX Alchemy Protocol)
// WHY: Centralized, emotionally intelligent microcopy for fallbacks, recovery, onboarding, and encouragement
// HOW: Smart fallbacks, recovery variants, first-time reassurance, tone-calibrated encouragements
// Persona: Cursor, Echo, Sentinel
// Version: v1.0.0

export interface TrustMicrocopy {
  phrase: string;
  useCase: string;
  effect: string;
  trigger: string;
  tone: 'Supportive' | 'Empowering' | 'Playful' | 'Sacred';
}

export const TRUST_MICROCOPY_REGISTRY: TrustMicrocopy[] = [
  {
    phrase: "We're crafting your breakthrough…",
    useCase: 'Submission',
    effect: 'Anticipation, partnership',
    trigger: 'Prompt submission',
    tone: 'Empowering'
  },
  {
    phrase: "Still shaping it — great things take a moment.",
    useCase: 'GPT delay',
    effect: 'Patience, calm trust',
    trigger: 'Model delay',
    tone: 'Supportive'
  },
  {
    phrase: "A quick glitch — we're smoothing it out now.",
    useCase: 'API hiccup',
    effect: 'Reassurance, momentum',
    trigger: 'API error',
    tone: 'Supportive'
  },
  {
    phrase: "Let's tweak this — retrying with a sharper edge.",
    useCase: 'Prompt failure',
    effect: 'Encouragement, progress',
    trigger: 'Prompt error',
    tone: 'Empowering'
  },
  {
    phrase: "Take a breath — we'll walk this together.",
    useCase: 'Overwhelm detected',
    effect: 'Calm, partnership',
    trigger: 'User overwhelm',
    tone: 'Supportive'
  },
  {
    phrase: "Nothing yet? Let's refine it side by side.",
    useCase: 'Empty output',
    effect: 'Encouragement, partnership',
    trigger: 'No output',
    tone: 'Empowering'
  },
  {
    phrase: "You're not just building. You're becoming.",
    useCase: 'Spark Layer',
    effect: 'Identity, inspiration',
    trigger: 'Spark reveal',
    tone: 'Sacred'
  },
  {
    phrase: "Here's your breakthrough. Let's make it real.",
    useCase: 'Output reveal',
    effect: 'Momentum, possibility',
    trigger: 'Output reveal',
    tone: 'Empowering'
  },
  {
    phrase: "Let's sharpen this masterpiece.",
    useCase: 'Refinement',
    effect: 'Encouragement, progress',
    trigger: 'Prompt revision',
    tone: 'Empowering'
  },
  {
    phrase: "This could change everything — want to see how?",
    useCase: 'CTA',
    effect: 'Curiosity, momentum',
    trigger: 'CTA',
    tone: 'Playful'
  },
  {
    phrase: "Welcome back — your journey's waiting.",
    useCase: 'Return experience',
    effect: 'Recognition, continuity',
    trigger: 'User return',
    tone: 'Supportive'
  },
  {
    phrase: "I see your progress — let's keep building.",
    useCase: 'Lifecycle email',
    effect: 'Validation, encouragement',
    trigger: 'Lifecycle email',
    tone: 'Supportive'
  },
  {
    phrase: "You're not alone — we're in this together.",
    useCase: 'Error/fallback',
    effect: 'Reassurance, partnership',
    trigger: 'Error/fallback',
    tone: 'Supportive'
  }
];

// Usage: TRUST_MICROCOPY_REGISTRY.find(m => m.useCase === 'Submission') 