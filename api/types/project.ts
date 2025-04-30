/**
 * @file project.ts
 * @description Types and interfaces for project-related operations.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

/**
 * Payload for creating a new project.
 */
export interface CreateProjectPayload {
    clientId: string;      // ID linking to a client
    title: string;         // Project title
    description?: string;  // Optional detailed description
  }
  
  /**
   * Payload for updating an existing project.
   */
  export interface UpdateProjectPayload {
    title?: string;
    description?: string;
  }
  
  /**
   * Internal system representation of a Project entity.
   */
  export interface ProjectEntity {
    id: string;            // Unique identifier (UUID, etc.)
    clientId: string;      // Associated client ID
    title: string;
    description?: string;
    createdAt: string;     // ISO8601 timestamp
    updatedAt: string;     // ISO8601 timestamp
  }
  