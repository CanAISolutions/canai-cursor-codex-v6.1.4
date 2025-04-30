/**
 * @file client.ts
 * @description Types and interfaces for client-related operations.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

/**
 * Payload for creating a new client.
 */
export interface CreateClientPayload {
    name: string;
    email: string;
    organization?: string;
  }
  
  /**
   * Payload for updating an existing client.
   */
  export interface UpdateClientPayload {
    name?: string;
    email?: string;
    organization?: string;
  }
  
  /**
   * Internal system representation of a Client entity.
   */
  export interface ClientEntity {
    id: string;           // Unique identifier (could be UUID, database ID, etc.)
    name: string;
    email: string;
    organization?: string;
    createdAt: string;    // ISO8601 timestamp
    updatedAt: string;    // ISO8601 timestamp
  }
  