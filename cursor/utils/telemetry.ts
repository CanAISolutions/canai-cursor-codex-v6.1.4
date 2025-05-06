/**
 * @file telemetry.ts
 * @description Structured telemetry with Winston.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';
import { loadConfig } from './config-manager';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join('.canai-context', 'metrics.log') }),
  ],
});

export async function logInnovationMetric(metricName: string, data: any, traceId: string): Promise<void> {
  const config = loadConfig();
  if (!config.TELEMETRY_ENABLED) {
    return;
  }
  
  logger.info({
    metricName,
    data,
    traceId,
    timestamp: new Date().toISOString(),
    sessionId: config.SESSION_ID,
    agentVersion: config.AGENT_VERSION
  });
}

export async function trackMetric(metricName: string, value: number, labels: any, traceId: string): Promise<void> {
  const config = loadConfig();
  if (!config.TELEMETRY_ENABLED) {
    return;
  }
  
  logger.info({
    metricName,
    value,
    labels,
    traceId,
    timestamp: new Date().toISOString(),
    sessionId: config.SESSION_ID,
    agentVersion: config.AGENT_VERSION
  });
} 