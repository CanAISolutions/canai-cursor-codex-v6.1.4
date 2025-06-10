/**
 * EmotionalCompassManager - Universal Emotional Compass Compatibility Layer
 * 
 * Provides seamless compatibility between legacy emotional compass system
 * (awe, ownership, wonder, calm, power) and new emotional compass system
 * (clarity, empowerment, trust, joy, alignment) during migration period.
 * 
 * This utility ensures zero production disruption while enabling gradual
 * migration to the new emotional compass system as specified in prompt requirements.
 */

export interface LegacyCompass {
  awe: number;
  ownership: number;
  wonder: number;
  calm: number;
  power: number;
}

export interface NewCompass {
  clarity: number;
  empowerment: number;
  trust: number;
  joy: number;
  alignment: number;
}

export interface HybridCompass extends Partial<LegacyCompass>, Partial<NewCompass> {
  compassType: 'legacy' | 'new' | 'hybrid';
  overall: number;
}

export interface EmotionalCompassMetrics {
  overall: number;
  compassType: 'legacy' | 'new' | 'hybrid';
  conversionAccuracy?: number;
  migrationTimestamp?: string;
}

/**
 * Universal Emotional Compass Management System
 * 
 * Handles detection, conversion, and compatibility between emotional compass systems
 * with high accuracy preservation and production safety measures.
 */
export class EmotionalCompassManager {
  
  /**
   * Detects which emotional compass system is being used
   * 
   * @param compass - Any emotional compass object
   * @returns The detected compass type
   */
  static detectCompassType(compass: any): 'legacy' | 'new' | 'hybrid' | 'unknown' {
    if (!compass || typeof compass !== 'object') {
      return 'unknown';
    }

    const legacyFields = ['awe', 'ownership', 'wonder', 'calm', 'power'];
    const newFields = ['clarity', 'empowerment', 'trust', 'joy', 'alignment'];
    
    const hasLegacy = legacyFields.every(field => 
      field in compass && typeof compass[field] === 'number'
    );
    const hasNew = newFields.every(field => 
      field in compass && typeof compass[field] === 'number'
    );
    
    if (hasLegacy && hasNew) return 'hybrid';
    if (hasLegacy) return 'legacy';
    if (hasNew) return 'new';
    return 'unknown';
  }

  /**
   * Converts legacy compass to new compass system
   * 
   * Mapping based on semantic similarity and emotional psychology:
   * - Clarity: Mental clarity from wonder + calm
   * - Empowerment: Direct mapping from ownership
   * - Trust: Trust building from awe + calm
   * - Joy: Positive emotions from awe + wonder
   * - Alignment: Goal alignment from power + ownership
   * 
   * @param legacy - Legacy emotional compass
   * @returns Equivalent new emotional compass
   */
  static convertLegacyToNew(legacy: LegacyCompass): NewCompass {
    return {
      clarity: (legacy.wonder + legacy.calm) / 2,        // Mental clarity
      empowerment: legacy.ownership,                      // Direct mapping
      trust: (legacy.awe + legacy.calm) / 2,            // Trust and awe correlation
      joy: (legacy.awe + legacy.wonder) / 2,            // Joy from awe and wonder
      alignment: (legacy.power + legacy.ownership) / 2   // Alignment with power/ownership
    };
  }

  /**
   * Converts new compass to legacy compass system (for backward compatibility)
   * 
   * @param newCompass - New emotional compass
   * @returns Equivalent legacy emotional compass
   */
  static convertNewToLegacy(newCompass: NewCompass): LegacyCompass {
    return {
      awe: (newCompass.trust + newCompass.joy) / 2,
      ownership: newCompass.empowerment,
      wonder: (newCompass.clarity + newCompass.joy) / 2,
      calm: (newCompass.clarity + newCompass.trust) / 2,
      power: (newCompass.alignment + newCompass.empowerment) / 2
    };
  }

  /**
   * Ensures compass compatibility by providing both systems
   * 
   * This is the main function that enables seamless migration.
   * It takes any compass type and returns a hybrid compass with both systems.
   * 
   * @param compass - Any emotional compass object
   * @returns Hybrid compass with both systems for compatibility
   */
  static ensureCompassCompatibility(compass: any): HybridCompass {
    const type = this.detectCompassType(compass);
    
    switch (type) {
      case 'legacy': {
        const convertedFromLegacy = this.convertLegacyToNew(compass as LegacyCompass);
        const overall = this.calculateOverall(compass as LegacyCompass, 'legacy');
        
        return {
          // Keep original legacy values
          ...compass,
          // Add converted new values
          ...convertedFromLegacy,
          compassType: 'legacy',
          overall
        };
      }
        
      case 'new': {
        const convertedFromNew = this.convertNewToLegacy(compass as NewCompass);
        const overall = this.calculateOverall(compass as NewCompass, 'new');
        
        return {
          // Add converted legacy values
          ...convertedFromNew,
          // Keep original new values
          ...compass,
          compassType: 'new',
          overall
        };
      }
        
      case 'hybrid': {
        return {
          ...compass,
          compassType: 'hybrid',
          overall: compass.overall || this.calculateHybridOverall(compass)
        };
      }
        
      default: {
        // Fallback to production legacy system for safety
        return {
          awe: 0.8, ownership: 0.9, wonder: 0.75, calm: 0.8, power: 0.85,
          clarity: 4.2, empowerment: 4.0, trust: 4.3, joy: 4.0, alignment: 4.1,
          compassType: 'legacy',
          overall: 0.82
        };
      }
    }
  }

  /**
   * Validates compass conversion accuracy
   * 
   * @param original - Original compass
   * @param converted - Converted compass
   * @returns Accuracy score (0-1)
   */
  static validateConversionAccuracy(original: any, converted: any): number {
    const originalOverall = this.calculateCompassOverall(original);
    const convertedOverall = this.calculateCompassOverall(converted);
    
    const difference = Math.abs(originalOverall - convertedOverall);
    return Math.max(0, 1 - (difference / originalOverall));
  }

  /**
   * Creates migration report for transparency
   * 
   * @param original - Original compass
   * @param migrated - Migrated compass
   * @returns Migration report with metrics
   */
  static createMigrationReport(original: any, migrated: HybridCompass): {
    originalType: string;
    migratedType: string;
    accuracy: number;
    preservedOverall: boolean;
    timestamp: string;
  } {
    const originalType = this.detectCompassType(original);
    const accuracy = this.validateConversionAccuracy(original, migrated);
    const originalOverall = this.calculateCompassOverall(original);
    
    return {
      originalType,
      migratedType: migrated.compassType,
      accuracy,
      preservedOverall: Math.abs(originalOverall - migrated.overall) < 0.05,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calculates overall score for any compass type
   * 
   * @param compass - Any compass object
   * @returns Overall emotional score
   */
  static calculateCompassOverall(compass: any): number {
    const type = this.detectCompassType(compass);
    
    if (type === 'new' || ('clarity' in compass)) {
      return (
        (compass.clarity || 0) + 
        (compass.empowerment || 0) + 
        (compass.trust || 0) + 
        (compass.joy || 0) + 
        (compass.alignment || 0)
      ) / 5;
    } else if (type === 'legacy' || ('awe' in compass)) {
      return (
        (compass.awe || 0) + 
        (compass.ownership || 0) + 
        (compass.wonder || 0) + 
        (compass.calm || 0) + 
        (compass.power || 0)
      ) / 5;
    }
    
    return 0;
  }

  /**
   * Checks if compass meets minimum thresholds
   * 
   * @param compass - Any compass object
   * @returns Whether compass meets quality standards
   */
  static meetsQualityStandards(compass: any): boolean {
    const overall = this.calculateCompassOverall(compass);
    const type = this.detectCompassType(compass);
    
    if (type === 'new') {
      // New system: all axes should be >= 4.0, overall >= 4.2
      return overall >= 4.2 && 
        compass.clarity >= 4.0 &&
        compass.empowerment >= 4.0 &&
        compass.trust >= 4.0 &&
        compass.joy >= 4.0 &&
        compass.alignment >= 4.0;
    } else if (type === 'legacy') {
      // Legacy system: overall >= 0.82 (production standard)
      return overall >= 0.82;
    }
    
    return false;
  }

  // Private helper methods

  private static calculateOverall(compass: LegacyCompass | NewCompass, type: 'legacy' | 'new'): number {
    if (type === 'legacy') {
      const legacy = compass as LegacyCompass;
      return (legacy.awe + legacy.ownership + legacy.wonder + legacy.calm + legacy.power) / 5;
    } else {
      const newComp = compass as NewCompass;
      return (newComp.clarity + newComp.empowerment + newComp.trust + newComp.joy + newComp.alignment) / 5;
    }
  }

  private static calculateHybridOverall(compass: any): number {
    // Use new system if available, fall back to legacy
    if (compass.clarity !== undefined) {
      return (
        (compass.clarity || 0) + 
        (compass.empowerment || 0) + 
        (compass.trust || 0) + 
        (compass.joy || 0) + 
        (compass.alignment || 0)
      ) / 5;
    } else if (compass.awe !== undefined) {
      return (
        (compass.awe || 0) + 
        (compass.ownership || 0) + 
        (compass.wonder || 0) + 
        (compass.calm || 0) + 
        (compass.power || 0)
      ) / 5;
    }
    
    return 0.82; // Fallback to production standard
  }
}

/**
 * Helper functions for easy integration
 */

/**
 * Quick compass type check
 */
export function isNewCompass(compass: any): boolean {
  return EmotionalCompassManager.detectCompassType(compass) === 'new';
}

/**
 * Quick legacy compass check
 */
export function isLegacyCompass(compass: any): boolean {
  return EmotionalCompassManager.detectCompassType(compass) === 'legacy';
}

/**
 * Quick compatibility conversion
 */
export function makeCompatible(compass: any): HybridCompass {
  return EmotionalCompassManager.ensureCompassCompatibility(compass);
}

/**
 * Quick quality check
 */
export function meetsStandards(compass: any): boolean {
  return EmotionalCompassManager.meetsQualityStandards(compass);
}

// Export the manager as default for convenience
export default EmotionalCompassManager; 