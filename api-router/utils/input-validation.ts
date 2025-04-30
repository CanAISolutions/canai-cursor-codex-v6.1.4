// input-validation.ts

/**
 * WHAT: Input validation utilities to enforce schema and payload integrity.
 * WHY: Ensures incoming data is safe, expected, and structured before processing.
 * HOW: Validates presence, type correctness, and required fields dynamically.
 */

export function validateInput(input: any, schema: Record<string, string>): { success: boolean; errors: string[] } {
    const errors: string[] = [];
  
    for (const [field, type] of Object.entries(schema)) {
      if (!(field in input)) {
        errors.push(`Missing field: ${field}`);
      } else if (typeof input[field] !== type) {
        errors.push(`Invalid type for field '${field}': expected ${type}`);
      }
    }
  
    return {
      success: errors.length === 0,
      errors,
    };
  }
  