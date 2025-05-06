/**
 * @file config-manager.ts
 * @description Centralized configuration management.
 */
import * as fs from 'fs';
import * as path from 'path';

interface Config {
  DEBUG_MODE: boolean;
  TELEMETRY_ENABLED: boolean;
  SESSION_ID: string;
  AGENT_VERSION: string;
  PLUGIN_REGISTRY_PATH: string;
}

export function loadConfig(): Config {
  const envPath = path.join(process.cwd(), '.env');
  const defaults: Config = {
    DEBUG_MODE: false,
    TELEMETRY_ENABLED: true,
    SESSION_ID: 'default',
    AGENT_VERSION: '1.1.0',
    PLUGIN_REGISTRY_PATH: path.join('cursor', 'plugins', 'registry.json'),
  };

  if (!fs.existsSync(envPath)) {
    return defaults;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {} as Record<string, string>);

  return {
    ...defaults,
    DEBUG_MODE: envVars.DEBUG_MODE === 'true',
    TELEMETRY_ENABLED: envVars.TELEMETRY_ENABLED === 'true',
    SESSION_ID: envVars.SESSION_ID || defaults.SESSION_ID,
    AGENT_VERSION: envVars.AGENT_VERSION || defaults.AGENT_VERSION,
    PLUGIN_REGISTRY_PATH: envVars.PLUGIN_REGISTRY_PATH || defaults.PLUGIN_REGISTRY_PATH,
  };
} 