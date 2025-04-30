/**
 * dreamTrendAnalyzer.ts
 * 
 * Purpose: Analyze emotional, modular, and Codex evolution deltas to detect long-term directional trends and enable proactive course corrections.
 * Triggered: On demand during strategic cycles or scheduled trend audits.
 * Enforces: Predictive self-awareness, evolutionary foresight, emotional resonance preservation.
 */

import { generateDeltaMap } from "./deltaMapGenerator";

interface DreamTrendInsight {
  dimension: "emotional" | "modular" | "codex";
  trendType: "positive" | "negative" | "neutral" | "volatile";
  trendScore: number; // 0–1 scale confidence
  notes: string;
}

export async function analyzeDreamTrends(): Promise<DreamTrendInsight[]> {
  const deltas = await generateDeltaMap();
  const insights: DreamTrendInsight[] = [];

  const emotionalDeltas = deltas.filter(d => d.dimension === "emotional");
  const modularDeltas = deltas.filter(d => d.dimension === "modular");
  const codexDeltas = deltas.filter(d => d.dimension === "codex");

  if (emotionalDeltas.length > 2) {
    const scores = emotionalDeltas.map(d => d.newState as number);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const trendType = avg >= 90 ? "positive" : avg >= 85 ? "neutral" : "negative";
    insights.push({
      dimension: "emotional",
      trendType,
      trendScore: avg / 100,
      notes: `Emotional average at ${avg.toFixed(1)}%.`,
    });
  }

  if (modularDeltas.length > 1) {
    insights.push({
      dimension: "modular",
      trendType: "volatile",
      trendScore: 0.7,
      notes: "Detected frequent modular shifts — monitor for instability.",
    });
  }

  if (codexDeltas.length > 0) {
    insights.push({
      dimension: "codex",
      trendType: "positive",
      trendScore: 0.95,
      notes: "Codex upgrades detected and absorbed.",
    });
  }

  return insights;
}
