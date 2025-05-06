/**
 * prompt-registry/registry-events.ts
 * 
 * Purpose:
 * Defines event types and handlers for the prompt registry system.
 * Provides centralized event emission for registry operations.
 */

import { EventBus } from '../utils/event-bus';
import { RegistryEvent, RegistryEventType } from './prompt-registry-schema';

export class RegistryEventEmitter {
  constructor(private eventBus: EventBus) {}

  /**
   * Emits a registry event
   */
  emitEvent(type: RegistryEventType, data: Omit<RegistryEvent['data'], 'timestamp'>): void {
    this.eventBus.emit(type, {
      type,
      data: {
        ...data,
        timestamp: Date.now()
      }
    } as RegistryEvent);
  }

  /**
   * Emits a prompt loaded event
   */
  emitPromptLoaded(promptId: string, version: string, metadata: RegistryEvent['data']['metadata']): void {
    this.emitEvent('registry.prompt.loaded', {
      promptId,
      version,
      metadata
    });
  }

  /**
   * Emits a prompt invalid event
   */
  emitPromptInvalid(promptId: string, reason: string): void {
    this.emitEvent('registry.prompt.invalid', {
      promptId,
      reason
    });
  }

  /**
   * Emits a prompt evolved event
   */
  emitPromptEvolved(promptId: string, version: string, metadata: RegistryEvent['data']['metadata']): void {
    this.emitEvent('registry.prompt.evolved', {
      promptId,
      version,
      metadata
    });
  }

  /**
   * Emits a prompt deprecated event
   */
  emitPromptDeprecated(promptId: string, reason: string): void {
    this.emitEvent('registry.prompt.deprecated', {
      promptId,
      reason
    });
  }
} 