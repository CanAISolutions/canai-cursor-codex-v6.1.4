/**
 * TServiceContract – Placeholder contract for service modules
 * What: Declares the minimum required interface for any service
 * Why: Ensures all services are auditable, typed, and Codex-compliant
 * How: Extend or implement this type in all service modules
 */

export type TServiceContract = {
  serviceName: string;
  version: string;
  description?: string;
  execute: (...args: any[]) => Promise<any>;
  codexAligned?: boolean;
  [key: string]: unknown;
}; 