/**
 * @file config.ts
 * @description Codex Edition v4.1.4 – Unified Config Loader for Cursor Debug Agent.
 * Loads, validates, and merges settings from `.cursorrules`, environment, and defaults.
 */

import fs from 'fs';
import path from 'path';

// === Type Definitions ===

export interface DebugConfig {
  trustScoreThreshold?: number;
  escalationPriority?: 'low' | 'medium' | 'high';
  concurrencyLimit?: number;
  pipelineTimeoutMs?: number;
  maxLogSize?: number;
  maxLogLines?: number;
  fallbackMode?: boolean;
  dryRun?: boolean;
  aiProvider?: string;
  fallbackProvider?: string;
  aiProviderConfig?: Record<string, any>;
  bugDetectionRetries?: number;
  fixProposalRetries?: number;
}

// === Defaults ===

const DEFAULTS: Required<DebugConfig> = {
  trustScoreThreshold: 4.2,
  escalationPriority: 'high',
  concurrencyLimit: 5,
  pipelineTimeoutMs: 30000,
  maxLogSize: 1_000_000,
  maxLogLines: 1000,
  fallbackMode: false,
  dryRun: false,
  aiProvider: 'openai',
  fallbackProvider: 'anthropic',
  aiProviderConfig: {},
  bugDetectionRetries: 3,
  fixProposalRetries: 3,
};

// === Test Hooks ===

export const testOverrides = {
  readFileSync: fs.readFileSync,
  statSync: fs.statSync,
  env: process.env,
};

// === Helpers ===

function validateConfigValue(key: keyof DebugConfig, value: any): boolean {
  switch (key) {
    case 'trustScoreThreshold':
      return typeof value === 'number' && value >= 0 && value <= 10;
    case 'concurrencyLimit':
    case 'pipelineTimeoutMs':
    case 'maxLogSize':
    case 'maxLogLines':
    case 'bugDetectionRetries':
    case 'fixProposalRetries':
      return Number.isInteger(value) && value >= 0;
    case 'fallbackMode':
    case 'dryRun':
      return typeof value === 'boolean';
    case 'escalationPriority':
      return ['low', 'medium', 'high'].includes(value);
    case 'aiProvider':
    case 'fallbackProvider':
      return typeof value === 'string' && value.length > 0;
    case 'aiProviderConfig':
      return typeof value === 'object' && value !== null;
    default:
      return false;
  }
}

// === .cursorrules Loader ===

function loadCursorrulesOverrides(): Partial<DebugConfig> {
  try {
    const filepath = path.resolve('.cursorrules');
    const stats = testOverrides.statSync(filepath);
    if (stats.size > 10_000) {
      console.warn('[config] .cursorrules exceeds 10KB, skipping.');
      return {};
    }

    const raw = testOverrides.readFileSync(filepath, 'utf-8');
    if (!/^[\w\s=.#\n-]+$/.test(raw)) {
      console.warn('[config] .cursorrules contains invalid characters, skipping.');
      return {};
    }

    const overrides: Partial<DebugConfig> = {};
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
      if (line.startsWith('#') || !line.includes('=')) continue;

      const [rawKey, rawVal] = line.split('=').map(s => s.trim());
      const key = rawKey as keyof DebugConfig;
      let value: any = rawVal;

      try {
        if (['trustScoreThreshold'].includes(key)) value = parseFloat(value);
        else if (['concurrencyLimit', 'pipelineTimeoutMs', 'maxLogSize', 'maxLogLines', 'bugDetectionRetries', 'fixProposalRetries'].includes(key))
          value = parseInt(value);
        else if (['fallbackMode', 'dryRun'].includes(key)) value = value === 'true';
        else if (key === 'aiProviderConfig') value = JSON.parse(value);

        if (validateConfigValue(key, value)) overrides[key] = value;
        else console.warn(`[config] Invalid .cursorrules value: ${key}=${rawVal}`);
      } catch {
        console.warn(`[config] Failed to parse value: ${key}=${rawVal}`);
      }
    }

    return overrides;
  } catch (err: any) {
    console.warn(`[config] Failed to load .cursorrules: ${err.message}`);
    return {};
  }
}

// === Environment Loader ===

function loadEnvOverrides(): Partial<DebugConfig> {
  const env = testOverrides.env;
  const overrides: Partial<DebugConfig> = {};

  const parseNum = (val: string) => parseInt(val);
  const parseFloatSafe = (val: string) => parseFloat(val);
  const parseBool = (val: string) => val === 'true';

  const fields: [keyof DebugConfig, string, (v: string) => any][] = [
    ['trustScoreThreshold', 'TRUST_SCORE_THRESHOLD', parseFloatSafe],
    ['concurrencyLimit', 'CONCURRENCY_LIMIT', parseNum],
    ['pipelineTimeoutMs', 'PIPELINE_TIMEOUT_MS', parseNum],
    ['maxLogSize', 'MAX_LOG_SIZE', parseNum],
    ['maxLogLines', 'MAX_LOG_LINES', parseNum],
    ['bugDetectionRetries', 'BUG_DETECTION_RETRIES', parseNum],
    ['fixProposalRetries', 'FIX_PROPOSAL_RETRIES', parseNum],
    ['fallbackMode', 'FALLBACK_MODE', parseBool],
    ['dryRun', 'DRY_RUN', parseBool],
    ['aiProvider', 'AI_PROVIDER', v => v],
    ['fallbackProvider', 'FALLBACK_PROVIDER', v => v],
    ['escalationPriority', 'ESCALATION_PRIORITY', v => v],
    ['aiProviderConfig', 'AI_PROVIDER_CONFIG', JSON.parse],
  ];

  for (const [key, envVar, parser] of fields) {
    const raw = env[envVar];
    if (raw) {
      try {
        const val = parser(raw);
        if (validateConfigValue(key, val)) overrides[key] = val;
      } catch {
        console.warn(`[config] Failed to parse ${envVar}: ${raw}`);
      }
    }
  }

  return overrides;
}

// === Final Config ===

/**
 * Loads and merges runtime config from defaults, cursorrules, and env.
 */
export function loadConfig(): Required<DebugConfig> {
  return {
    ...DEFAULTS,
    ...loadCursorrulesOverrides(),
    ...loadEnvOverrides(),
  };
}
