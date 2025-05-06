import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

/**
 * Middleware to validate request input against a schema
 * @param schema Joi schema to validate against
 * @returns Express middleware function
 */
export function validateInput(schema: Schema) {
  return function(req: Request, res: Response, next: NextFunction): void {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
      return;
    }
    next();
  };
} 