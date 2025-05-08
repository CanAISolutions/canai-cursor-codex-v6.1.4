// 🔍 Schema Validator
// Purpose: Validate data structures with emotional awareness
// Codex-Enforced • Phase 2.5 • Trust Score: 4.2

export interface Schema {
  type: string;
  properties?: {
    [key: string]: Schema;
  };
  items?: Schema;
  required?: string[];
  format?: string;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  emotionalScore?: number;
}

export interface ValidationError {
  path: string[];
  message: string;
  code: string;
}

export class SchemaValidator {
  async validate(schema: Schema, data: any): Promise<ValidationResult> {
    try {
      const errors = this.validateNode(schema, data, []);

      return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        valid: false,
        errors: [{
          path: [],
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'VALIDATION_ERROR'
        }]
      };
    }
  }

  private validateNode(schema: Schema, data: any, path: string[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Type validation
    if (!this.validateType(schema.type, data)) {
      errors.push({
        path,
        message: `Expected type ${schema.type} but got ${typeof data}`,
        code: 'TYPE_ERROR'
      });
      return errors;
    }

    // Object validation
    if (schema.type === 'object' && schema.properties) {
      errors.push(...this.validateObject(schema, data, path));
    }

    // Array validation
    if (schema.type === 'array' && schema.items) {
      errors.push(...this.validateArray(schema, data, path));
    }

    return errors;
  }

  private validateType(type: string, data: any): boolean {
    if (type === 'array') return Array.isArray(data);
    if (type === 'null') return data === null;
    return typeof data === type;
  }

  private validateObject(schema: Schema, data: object, path: string[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in data)) {
          errors.push({
            path: [...path, field],
            message: `Missing required field: ${field}`,
            code: 'REQUIRED_ERROR'
          });
        }
      }
    }

    // Property validation
    if (schema.properties) {
      for (const [key, value] of Object.entries(data)) {
        if (key in schema.properties) {
          errors.push(...this.validateNode(
            schema.properties[key],
            value,
            [...path, key]
          ));
        }
      }
    }

    return errors;
  }

  private validateArray(schema: Schema, data: any[], path: string[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Length validation
    if (schema.minItems !== undefined && data.length < schema.minItems) {
      errors.push({
        path,
        message: `Array length ${data.length} is less than minimum ${schema.minItems}`,
        code: 'MIN_ITEMS_ERROR'
      });
    }

    if (schema.maxItems !== undefined && data.length > schema.maxItems) {
      errors.push({
        path,
        message: `Array length ${data.length} is greater than maximum ${schema.maxItems}`,
        code: 'MAX_ITEMS_ERROR'
      });
    }

    // Uniqueness validation
    if (schema.uniqueItems && new Set(data).size !== data.length) {
      errors.push({
        path,
        message: 'Array contains duplicate items',
        code: 'UNIQUE_ITEMS_ERROR'
      });
    }

    // Item validation
    if (schema.items) {
      data.forEach((item, index) => {
        errors.push(...this.validateNode(
          schema.items!,
          item,
          [...path, index.toString()]
        ));
      });
    }

    return errors;
  }
} 