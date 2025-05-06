/**
 * Prompt Registry Types
 * Defines types for prompt versioning and management
 */

/**
 * Represents a version of a prompt
 */
export interface PromptVersion {
  /** Unique identifier for the prompt */
  id: string;
  
  /** Version number */
  version: string;
  
  /** The prompt content */
  content: string;
  
  /** Timestamp when the prompt was created */
  timestamp: number;
  
  /** Whether this is the active version */
  isActive: boolean;
  
  /** Metadata about the prompt */
  metadata?: {
    /** Author of the prompt */
    author?: string;
    
    /** Description of the prompt */
    description?: string;
    
    /** Tags for categorization */
    tags?: string[];
    
    /** Additional metadata */
    [key: string]: unknown;
  };
}

/**
 * Represents a prompt template
 */
export interface PromptTemplate {
  /** Unique identifier for the template */
  id: string;
  
  /** Name of the template */
  name: string;
  
  /** Description of the template */
  description: string;
  
  /** The template content with placeholders */
  template: string;
  
  /** Available versions of the template */
  versions: PromptVersion[];
  
  /** Whether the template is active */
  isActive: boolean;
  
  /** Metadata about the template */
  metadata?: Record<string, unknown>;
} 