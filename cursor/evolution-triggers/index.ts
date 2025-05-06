/**
 * evolution-triggers/index.ts
 * 
 * Purpose:
 * Exports all evolution trigger components for easy access.
 */

export { EvolutionTriggerManager } from './evolution-trigger';
export { EvolutionStrategyExecutor } from './strategy-executor';
export { EvolutionTriggerCoordinator } from './trigger-manager';

// Re-export types
export type { EvolutionTrigger, TriggerResult } from './evolution-trigger';
export type { EvolutionStrategy, StrategyResult } from './strategy-executor';
export type { EvolutionEvent } from './trigger-manager'; 