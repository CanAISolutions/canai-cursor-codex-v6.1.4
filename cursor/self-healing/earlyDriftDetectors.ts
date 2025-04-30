/**
 * earlyDriftDetectors.ts
 * 
 * Purpose: Run proactive system scans to detect early signs of emotional, modular, Codex, or UX drift before they trigger user-facing failures.
 * Triggered: On heartbeat cycles, health checks, or scheduled audits.
 * Enforces: Anticipatory system self-protection and drift prevention.
 */

import { generateDeltaMap } from "../self-awareness/deltaMapGenerator";
import { analyzeDreamTrends } from "../self-awareness/dreamTrendAnalyzer";

export interface DriftSignal {
  type: "emotional" | "modular" | "codex" | "ux";
  severity: "info" | "warning" | "critical";
  origin: string;
  message: string;
  suggestedAction: string;
}

export async function runEarlyDriftDetectors(): Promise<DriftSignal[]> {
  const deltas = await generateDeltaMap();
  const trends = await analyzeDreamTrends();

  const signals: DriftSignal[] = [];

  for (const t of trends) {
    if (t.dimension === "emotional" && t.trendType === "negative") {
      signals.push({
        type: "emotional",
        severity: "warning",
        origin: "dreamTrendAnalyzer",
        message: `Downward emotional trend detected: ${t.notes}`,
        suggestedAction: "Activate emotionalStabilizer agent or initiate UX reinforcement.",
      });
    }

    if (t.dimension === "modular" && t.trendType === "volatile") {
      signals.push({
        type: "modular",
        severity: "info",
        origin: "dreamTrendAnalyzer",
        message: "Frequent modular changes detected — potential cohesion drift.",
        suggestedAction: "Run modularitySelfCorrector if cohesion degrades further.",
      });
    }

    if (t.dimension === "codex" && t.trendType === "neutral") {
      signals.push({
        type: "codex",
        severity: "info",
        origin: "dreamTrendAnalyzer",
        message: "Codex version unchanged, no upgrade tension present.",
        suggestedAction: "No action required unless expansion agent is queued.",
      });
    }
  }

  return signals;
}
