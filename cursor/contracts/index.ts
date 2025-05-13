/**
 * cursor/contracts/index.ts
 * What: Central export for all plugin/service contract types
 * Why: Ensures audit-safe, modular imports across the system
 * How: Import from this file in all plugin/service modules
 */

export * from './TPluginMeta';
export * from './TServiceContract'; 