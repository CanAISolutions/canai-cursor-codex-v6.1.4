// Tone validation helper
export function validateTone(tone: string): boolean {
  return ['professional', 'friendly'].includes(tone);
}