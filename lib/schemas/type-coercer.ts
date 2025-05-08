// 🔄 Type Coercer
// Purpose: Safely coerce data types with emotional awareness
// Codex-Enforced • Phase 2.5 • Trust Score: 4.2

import { Schema } from './validator';

export interface CoercionResult {
  coerced: any;
  modified: boolean;
  errors?: CoercionError[];
}

export interface CoercionError {
  path: string[];
  message: string;
  code: string;
  originalValue: any;
}

export class TypeCoercer {
  async coerce(schema: Schema, data: any): Promise<CoercionResult> {
    try {
      const result = this.coerceNode(schema, data, []);
      return {
        coerced: result.value,
        modified: result.modified,
        errors: result.errors.length > 0 ? result.errors : undefined
      };
    } catch (error) {
      return {
        coerced: data,
        modified: false,
        errors: [{
          path: [],
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'COERCION_ERROR',
          originalValue: data
        }]
      };
    }
  }

  private coerceNode(schema: Schema, data: any, path: string[]): { value: any; modified: boolean; errors: CoercionError[] } {
    const errors: CoercionError[] = [];
    let modified = false;

    // Handle null/undefined
    if (data === null || data === undefined) {
      return { value: null, modified: true, errors };
    }

    // Type coercion
    switch (schema.type) {
      case 'number':
        return this.coerceNumber(data, path);
      case 'boolean':
        return this.coerceBoolean(data, path);
      case 'string':
        return this.coerceString(data, path, schema.format);
      case 'array':
        return this.coerceArray(schema, data, path);
      case 'object':
        return this.coerceObject(schema, data, path);
      default:
        return { value: data, modified: false, errors };
    }
  }

  private coerceNumber(data: any, path: string[]): { value: any; modified: boolean; errors: CoercionError[] } {
    const errors: CoercionError[] = [];
    
    if (typeof data === 'number') {
      if (!Number.isFinite(data)) {
        return { value: null, modified: true, errors: [{
          path,
          message: 'Invalid number value',
          code: 'INVALID_NUMBER',
          originalValue: data
        }]};
      }
      return { value: data, modified: false, errors };
    }

    if (typeof data === 'string') {
      const num = Number(data);
      if (Number.isFinite(num)) {
        return { value: num, modified: true, errors };
      }
    }

    errors.push({
      path,
      message: 'Could not coerce to number',
      code: 'COERCION_ERROR',
      originalValue: data
    });
    return { value: null, modified: true, errors };
  }

  private coerceBoolean(data: any, path: string[]): { value: any; modified: boolean; errors: CoercionError[] } {
    if (typeof data === 'boolean') {
      return { value: data, modified: false, errors: [] };
    }

    if (data === 1 || data === '1' || data === 'true') {
      return { value: true, modified: true, errors: [] };
    }

    if (data === 0 || data === '0' || data === 'false') {
      return { value: false, modified: true, errors: [] };
    }

    return {
      value: null,
      modified: true,
      errors: [{
        path,
        message: 'Could not coerce to boolean',
        code: 'COERCION_ERROR',
        originalValue: data
      }]
    };
  }

  private coerceString(data: any, path: string[], format?: string): { value: any; modified: boolean; errors: CoercionError[] } {
    if (typeof data === 'string') {
      return { value: data, modified: false, errors: [] };
    }

    if (format === 'date-time' && typeof data === 'number') {
      try {
        const date = new Date(data);
        return { value: date.toISOString(), modified: true, errors: [] };
      } catch {
        return {
          value: null,
          modified: true,
          errors: [{
            path,
            message: 'Invalid date-time value',
            code: 'INVALID_DATETIME',
            originalValue: data
          }]
        };
      }
    }

    return { value: String(data), modified: true, errors: [] };
  }

  private coerceArray(schema: Schema, data: any, path: string[]): { value: any; modified: boolean; errors: CoercionError[] } {
    if (Array.isArray(data)) {
      if (!schema.items) {
        return { value: data, modified: false, errors: [] };
      }

      const results = data.map((item, index) => 
        this.coerceNode(schema.items!, item, [...path, index.toString()])
      );

      return {
        value: results.map(r => r.value),
        modified: results.some(r => r.modified),
        errors: results.flatMap(r => r.errors)
      };
    }

    if (typeof data === 'string') {
      const array = data.split(',').map(s => s.trim());
      return this.coerceArray(schema, array, path);
    }

    return {
      value: null,
      modified: true,
      errors: [{
        path,
        message: 'Could not coerce to array',
        code: 'COERCION_ERROR',
        originalValue: data
      }]
    };
  }

  private coerceObject(schema: Schema, data: any, path: string[]): { value: any; modified: boolean; errors: CoercionError[] } {
    if (typeof data !== 'object' || data === null) {
      return {
        value: null,
        modified: true,
        errors: [{
          path,
          message: 'Could not coerce to object',
          code: 'COERCION_ERROR',
          originalValue: data
        }]
      };
    }

    if (!schema.properties) {
      return { value: data, modified: false, errors: [] };
    }

    const result: any = {};
    let modified = false;
    const errors: CoercionError[] = [];

    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (key in data) {
        const coerced = this.coerceNode(propSchema, data[key], [...path, key]);
        result[key] = coerced.value;
        modified = modified || coerced.modified;
        errors.push(...coerced.errors);
      }
    }

    return { value: result, modified, errors };
  }
} 