/**
 * @file prompt.ts
 * @description Types and interfaces for prompt-related operations.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

/**
 * Payload for creating a new prompt.
 */
export interface CreatePromptPayload {
    projectId: string;       // Associated project ID
    promptText: string;      // Raw user input
    tone?: string;           // Optional tone specifier (e.g., 'formal', 'friendly')
    targetOutput?: string;   // Optional intended outcome description
  }
  
  /**
   * Payload for updating or revising an existing prompt.
   */
  export interface UpdatePromptPayload {
    promptText?: string;
    tone?: string;
    targetOutput?: string;
  }
  
  /**
   * Internal system representation of a Prompt entity.
   */
  export interface PromptEntity {
    id: string;              // Unique identifier (UUID, etc.)
    projectId: string;
    promptText: string;
    tone?: string;
    targetOutput?: string;
    generatedOutput?: string;    // AI-generated result (optional)
    revisionCount: number;       // How many times this prompt has been revised
    createdAt: string;           // ISO8601 timestamp
    updatedAt: string;           // ISO8601 timestamp
  }
  