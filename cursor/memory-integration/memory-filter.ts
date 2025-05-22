/**
 * memory-integration/memory-filter.ts
 * 
 * Purpose:
 * Filters and sanitizes memory records before injection.
 * Applies trust-aware limits and safety rules.
 */

import { MemoryRecord } from '../ai-memories/memory-schema';
import { MemoryFilterConfig, MemoryInjectionType } from './memory-integration-schema';
import { EventBus } from '../event-bus/eventBus';

export class MemoryFilter {
  constructor(
    private config: MemoryFilterConfig,
    private eventBus: EventBus
  ) {}

  /**
   * Filters memory records based on configuration
   */
  async filterRecords(
    records: MemoryRecord[],
    type: MemoryInjectionType
  ): Promise<MemoryRecord[]> {
    const filtered = records.filter(record => {
      // Check trust threshold
      if (record.metadata.trustScore < this.config.trustThreshold) {
        this.emitFilteredEvent(record, 'TRUST_THRESHOLD');
        return false;
      }

      // Check alignment threshold
      if (record.metadata.alignmentScore < this.config.alignmentThreshold) {
        this.emitFilteredEvent(record, 'ALIGNMENT_THRESHOLD');
        return false;
      }

      // Check volatility
      if (record.metadata.volatilityScore > this.config.maxVolatilityScore) {
        this.emitFilteredEvent(record, 'VOLATILITY_HIGH');
        return false;
      }

      // Check age
      const ageInDays = (Date.now() - record.metadata.timestamp) / (1000 * 60 * 60 * 24);
      if (ageInDays > this.config.maxAgeInDays) {
        this.emitFilteredEvent(record, 'AGE_EXCEEDED');
        return false;
      }

      // Check required fields
      if (!this.hasRequiredFields(record)) {
        this.emitFilteredEvent(record, 'MISSING_FIELDS');
        return false;
      }

      // Remove blocked fields
      this.removeBlockedFields(record);

      return true;
    });

    // Limit number of records
    return filtered.slice(0, this.config.maxRecordsPerInjection);
  }

  /**
   * Checks if record has all required fields
   */
  private hasRequiredFields(record: MemoryRecord): boolean {
    return this.config.requiredFields.every(field => {
      const value = this.getNestedValue(record, field);
      return value !== undefined && value !== null;
    });
  }

  /**
   * Removes blocked fields from record
   */
  private removeBlockedFields(record: MemoryRecord): void {
    this.config.blockedFields.forEach(field => {
      this.removeNestedField(record, field);
    });
  }

  /**
   * Gets nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => 
      current && current[key] !== undefined ? current[key] : undefined, obj);
  }

  /**
   * Removes nested field from object using dot notation
   */
  private removeNestedField(obj: any, path: string): void {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((current, key) => 
      current && current[key] !== undefined ? current[key] : {}, obj);
    
    if (target && last) {
      delete target[last];
    }
  }

  /**
   * Emits filtered event
   */
  private emitFilteredEvent(record: MemoryRecord, reason: string): void {
    this.eventBus.emit('memory.filtered', {
      recordId: record.id,
      reason,
      timestamp: Date.now()
    });
  }
} 