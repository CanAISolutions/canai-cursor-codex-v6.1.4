/**
 * opportunityRadar.ts
 * 
 * Purpose: Monitor emotional, modular, UX, and Codex system signals to detect and surface strategic growth opportunities, inflection points, and amplification moments.
 * Triggered: Post-health checks, modular snapshot updates, or scheduled opportunity scans.
 * Enforces: Proactive evolution, strategic compounding, emotional amplification.
 */

import { gatherHealthMetrics } from "../system-intel/audit-utils";

interface StrategicOpportunity {
  type: "modular-expansion" | "ux-resonance-amplification" | "codex-evolution-leverage" | "emotional-deepening";
  description: string;
  confidence: number; // 0–1 scale
  whyNow: string;
  suggestedMove: string;
}

export async function scanForOpportunities(): Promise<StrategicOpportunity[]> {
  const health = await gatherHealthMetrics();
  const opportunities: StrategicOpportunity[] = [];

  if (health.modulesChanged) {
    opportunities.push({
      type: "modular-expansion",
      description: "Detected new modular capabilities available for integration.",
      confidence: 0.9,
      whyNow: "Recent modular loadout expansion detected.",
      suggestedMove: "Integrate newly available modules into UX or system agents.",
    });
  }

  if (health.emotionalDelta && health.emotionalDelta > 5) {
    opportunities.push({
      type: "ux-resonance-amplification",
      description: "Emotional resonance boost detected — opportunity to double-down on UX magnetism.",
      confidence: 0.92,
      whyNow: "Recent UX outputs exceeded emotional resonance benchmarks.",
      suggestedMove: "Expand emotional UX anchors or reinforce successful tone clusters.",
    });
  }

  if (health.codexEvolutionSignal) {
    opportunities.push({
      type: "codex-evolution-leverage",
      description: "Codex directive upgrades available — opportunity to absorb and scale new capabilities.",
      confidence: 0.88,
      whyNow: "Canonical Codex directive version increased.",
      suggestedMove: "Integrate new directives into operational loops.",
    });
  }

  return opportunities;
}
