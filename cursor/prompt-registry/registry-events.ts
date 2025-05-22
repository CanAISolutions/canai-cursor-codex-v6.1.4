/**
 * prompt-registry/registry-events.ts
 * 
 * Purpose:
 * Defines event types and handlers for the prompt registry system.
 * Provides centralized event emission for registry operations.
 */

import { EventBus } from '../event-bus/eventBus';
import { RegistryEvent, RegistryEventType } from './prompt-registry-schema';

export class RegistryEventEmitter {
  constructor(private eventBus: EventBus) {}

  /**
   * Emits a registry event
   */
  async emitEvent(type: RegistryEventType, data: Omit<RegistryEvent['data'], 'timestamp'>): Promise<void> {
    await this.eventBus.emit(type, {
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
  async emitPromptLoaded(promptId: string, version: string, metadata: RegistryEvent['data']['metadata']): Promise<void> {
    await this.emitEvent('registry.prompt.loaded', {
      promptId,
      version,
      metadata
    });
  }

  /**
   * Emits a prompt invalid event
   */
  async emitPromptInvalid(promptId: string, reason: string): Promise<void> {
    await this.emitEvent('registry.prompt.invalid', {
      promptId,
      reason
    });
  }

  /**
   * Emits a prompt evolved event
   */
  async emitPromptEvolved(promptId: string, version: string, metadata: RegistryEvent['data']['metadata']): Promise<void> {
    await this.emitEvent('registry.prompt.evolved', {
      promptId,
      version,
      metadata
    });
  }

  /**
   * Emits a prompt deprecated event
   */
  async emitPromptDeprecated(promptId: string, reason: string): Promise<void> {
    await this.emitEvent('registry.prompt.deprecated', {
      promptId,
      reason
    });
  }
} 