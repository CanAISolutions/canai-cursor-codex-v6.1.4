// 🛡️ Edge Case Handler
// Purpose: Handle schema validation edge cases with emotional awareness
// Codex-Enforced • Phase 2.5 • Trust Score: 4.2

import { Schema } from './validator';

export interface EdgeCaseResult {
  handled: boolean;
  value: any;
  modifications?: EdgeCaseModification[];
}

export interface EdgeCaseModification {
  path: string[];
  type: 'sanitize' | 'transform' | 'remove';
  originalValue: any;
  newValue: any;
}

export class EdgeCaseHandler {
  async handle(schema: Schema, data: any): Promise<EdgeCaseResult> {
    try {
      const result = this.handleNode(schema, data, []);
      return {
        handled: true,
        value: result.value,
        modifications: result.modifications.length > 0 ? result.modifications : undefined
      };
    } catch (error) {
      return {
        handled: false,
        value: data
      };
    }
  }

  private handleNode(schema: Schema, data: any, path: string[]): { value: any; modifications: EdgeCaseModification[] } {
    const modifications: EdgeCaseModification[] = [];

    // Handle null/undefined
    if (data === null || data === undefined) {
      return this.handleNullOrUndefined(schema, data, path);
    }

    // Handle by type
    switch (schema.type) {
      case 'array':
        return this.handleArray(schema, data, path);
      case 'object':
        return this.handleObject(schema, data, path);
      case 'string':
        return this.handleString(schema, data, path);
      case 'number':
        return this.handleNumber(schema, data, path);
      default:
        return { value: data, modifications };
    }
  }

  private handleNullOrUndefined(schema: Schema, data: any, path: string[]): { value: any; modifications: EdgeCaseModification[] } {
    // If type allows null, keep it
    if (Array.isArray(schema.type) && schema.type.includes('null')) {
      return { value: null, modifications: [] };
    }

    // Otherwise provide type-appropriate default
    const defaultValue = this.getDefaultValue(schema.type);
    return {
      value: defaultValue,
      modifications: [{
        path,
        type: 'transform',
        originalValue: data,
        newValue: defaultValue
      }]
    };
  }

  private handleArray(schema: Schema, data: any, path: string[]): { value: any; modifications: EdgeCaseModification[] } {
    if (!Array.isArray(data)) {
      return {
        value: [],
        modifications: [{
          path,
          type: 'transform',
          originalValue: data,
          newValue: []
        }]
      };
    }

    const modifications: EdgeCaseModification[] = [];
    const result = data.filter((item, index) => {
      if (item === null || item === undefined) {
        modifications.push({
          path: [...path, index.toString()],
          type: 'remove',
          originalValue: item,
          newValue: undefined
        });
        return false;
      }
      return true;
    });

    // Handle uniqueItems
    if (schema.uniqueItems) {
      const uniqueItems = [...new Set(result)];
      if (uniqueItems.length !== result.length) {
        modifications.push({
          path,
          type: 'transform',
          originalValue: result,
          newValue: uniqueItems
        });
        return { value: uniqueItems, modifications };
      }
    }

    return { value: result, modifications };
  }

  private handleObject(schema: Schema, data: any, path: string[]): { value: any; modifications: EdgeCaseModification[] } {
    if (typeof data !== 'object' || data === null) {
      return {
        value: {},
        modifications: [{
          path,
          type: 'transform',
          originalValue: data,
          newValue: {}
        }]
      };
    }

    const modifications: EdgeCaseModification[] = [];
    const result = { ...data };

    // Remove null/undefined values unless explicitly allowed
    for (const [key, value] of Object.entries(result)) {
      if (value === null || value === undefined) {
        const propSchema = schema.properties?.[key];
        if (!propSchema || !Array.isArray(propSchema.type) || !propSchema.type.includes('null')) {
          delete result[key];
          modifications.push({
            path: [...path, key],
            type: 'remove',
            originalValue: value,
            newValue: undefined
          });
        }
      }
    }

    return { value: result, modifications };
  }

  private handleString(schema: Schema, data: any, path: string[]): { value: any; modifications: EdgeCaseModification[] } {
    const modifications: EdgeCaseModification[] = [];
    let value = String(data).trim();

    // Handle empty string
    if (value === '') {
      value = this.getDefaultValue('string') as string;
      modifications.push({
        path,
        type: 'transform',
        originalValue: data,
        newValue: value
      });
    }

    return { value, modifications };
  }

  private handleNumber(schema: Schema, data: any, path: string[]): { value: any; modifications: EdgeCaseModification[] } {
    const modifications: EdgeCaseModification[] = [];
    let value = Number(data);

    // Handle NaN and Infinity
    if (!Number.isFinite(value)) {
      value = this.getDefaultValue('number') as number;
      modifications.push({
        path,
        type: 'transform',
        originalValue: data,
        newValue: value
      });
    }

    return { value, modifications };
  }

  private getDefaultValue(type: string): any {
    switch (type) {
      case 'string':
        return '';
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'array':
        return [];
      case 'object':
        return {};
      default:
        return null;
    }
  }
} 