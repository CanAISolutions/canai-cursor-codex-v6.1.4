/**
 * TPluginMeta – Placeholder contract for plugin metadata
 * What: Declares the minimum required metadata for any plugin
 * Why: Ensures all plugins are auditable, versioned, and Codex-compliant
 * How: Extend or implement this type in all plugin modules
 */

export type TPluginMeta = {
  name: string;
  version: string;
  description?: string;
  author?: string;
  codexAligned?: boolean;
  [key: string]: unknown;
}; 