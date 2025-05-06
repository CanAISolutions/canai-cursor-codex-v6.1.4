/**
 * @file prompt-context.ts
 * @description Defines prompt context for personalization.
 */
export interface PromptContext {
  tone: 'neutral' | 'friendly' | 'formal';
  industry: 'general' | 'tech' | 'finance' | 'healthcare';
} 