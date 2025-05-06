/**
 * Memory Filter
 * Handles filtering and sanitization of memories before injection
 */

import { MemoryPayload } from '../ai-memories/memory-types';
import { MemoryFilterConfig } from './memory-integration-schema';

export class MemoryFilter {
  /**
   * Filters memory based on the provided configuration
   * @param memory The memory to filter
   * @param config The filter configuration
   * @returns Promise resolving to the filtered memory or null if rejected
   */
  public async filterMemory(memory: MemoryPayload, config: MemoryFilterConfig): Promise<MemoryPayload | null> {
    try {
      // Check age if maxAge is specified
      if (config.maxAge && memory.timestamp) {
        const age = Date.now() - memory.timestamp;
        if (age > config.maxAge) {
          return null;
        }
      }

      // Check trust score
      if (memory.trustScore < config.minTrustScore) {
        return null;
      }

      // Filter out excluded fields
      const filteredMemory = { ...memory };
      if (config.excludedFields) {
        config.excludedFields.forEach(field => {
          delete filteredMemory[field];
        });
      }

      // Sanitize emotional content if requested
      if (config.sanitizeEmotionalContent) {
        this.sanitizeEmotionalContent(filteredMemory);
      }

      return filteredMemory;
    } catch (error) {
      console.error('Memory filtering failed:', error);
      return null;
    }
  }

  /**
   * Sanitizes emotional content in the memory
   */
  private sanitizeEmotionalContent(memory: MemoryPayload): void {
    // Implementation would analyze and adjust emotional content
    // This is a placeholder implementation
    if (memory.content) {
      memory.content = memory.content.replace(/[!]{2,}/g, '!');
      memory.content = memory.content.replace(/[?]{2,}/g, '?');
    }
  }
} 