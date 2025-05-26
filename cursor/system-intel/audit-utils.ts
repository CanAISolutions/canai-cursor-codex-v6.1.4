/**
 * audit-utils.ts
 * 
 * Purpose: Centralized system audit utility. Aggregates emotional, modular, and Codex directive scores.
 * Used before major prompt changes, deploys, or as part of the smart revision loop.
 */

import { calculateEmotionalResonanceScore } from "./dreamstate-utils";
import { evaluateModularCohesion } from "./modularity-utils";
import { checkDirectiveCoverage } from "./codex-memory-utils";
import { checkUXConsistency } from "./ux-consistency-utils";
import * as fs from 'fs/promises';
import * as path from 'path';

export interface AuditReport {
  timestamp: number;
  modularityScore: number;
  emotionalResonanceScore: number;
  directiveCoverage: {
    total: number;
    covered: number;
    percent: number;
    missing: string[];
  };
  uxConsistencyScore: number;
  summary: string[];
}

export interface HealthMetrics {
  systemHealth: number;
  emotionalResonance: number;
  trustScore: number;
  performanceScore: number;
  stabilityScore: number;
  timestamp: number;
  modulesChanged?: boolean;
  emotionalDelta?: number;
  codexEvolutionSignal?: boolean;
}

export async function gatherHealthMetrics(): Promise<HealthMetrics> {
  // Gather system health metrics from various sources
  const systemSnapshot = "current-system-state"; // This would be actual system data
  
  const emotionalResonance = calculateEmotionalResonanceScore(systemSnapshot).score;
  const modularityScore = evaluateModularCohesion(systemSnapshot);
  const uxConsistency = checkUXConsistency(systemSnapshot);
  const directiveCoverage = checkDirectiveCoverage(systemSnapshot);
  
  // Calculate composite scores
  const systemHealth = (modularityScore + uxConsistency + (directiveCoverage.percent / 100)) / 3;
  const trustScore = Math.min(0.95, systemHealth * 0.9 + emotionalResonance * 0.1 / 100);
  const performanceScore = 0.85; // Would be calculated from actual performance metrics
  const stabilityScore = 0.92; // Would be calculated from error rates and uptime
  
  return {
    systemHealth,
    emotionalResonance,
    trustScore,
    performanceScore,
    stabilityScore,
    timestamp: Date.now()
  };
}

export async function runAudit(systemSnapshot: string): Promise<AuditReport> {
  const modularityScore = evaluateModularCohesion(systemSnapshot);
  const emotionalResonanceScore = calculateEmotionalResonanceScore(systemSnapshot).score;
  const directiveCoverage = checkDirectiveCoverage(systemSnapshot);
  const uxConsistencyScore = checkUXConsistency(systemSnapshot);

  const summary: string[] = [];

  if (modularityScore < 0.7) summary.push("⚠️ Modularity score below threshold.");
  if (emotionalResonanceScore < 80) summary.push("⚠️ Emotional resonance weakening.");
  if (directiveCoverage.percent < 90) summary.push("⚠️ Missing Codex directive coverage.");
  if (uxConsistencyScore < 0.75) summary.push("⚠️ UX consistency risk detected.");

  return {
    timestamp: Date.now(),
    modularityScore,
    emotionalResonanceScore,
    directiveCoverage,
    uxConsistencyScore,
    summary,
  };
}

interface SystemLogEntry {
  type: string;
  path: string;
  content: string;
  timestamp: string;
}

/**
 * Emit a system log entry to the specified path
 */
export async function emitSystemLog(type: string, data: { path: string; content: string }): Promise<void> {
  const entry: SystemLogEntry = {
    type,
    path: data.path,
    content: data.content,
    timestamp: new Date().toISOString()
  };

  try {
    // Ensure directory exists
    const dir = path.dirname(data.path);
    await fs.mkdir(dir, { recursive: true });

    // Append to file
    await fs.appendFile(
      data.path,
      entry.content + '\n',
      'utf8'
    );

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[System Log] ${type}: ${data.path}`);
    }
  } catch (error) {
    console.error(`Failed to emit system log: ${error}`);
    throw error;
  }
}
