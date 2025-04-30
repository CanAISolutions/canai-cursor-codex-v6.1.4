// /cursor/system-intel/loggers/recommendationTrail.ts

/**
 * Recommendation Trail Logger
 * ----------------------------
 * Tracks system-generated recommendations, their rationale, and intended actions.
 * Enables causality tracing for audits, evolution retros, and Copilot reasoning transparency.
 *
 * 🧠 Feeds: journaling, DeltaMap, founder digest reports, Codex self-healing loops.
 * 📦 Format: append-only JSON log. Markdown export available.
 */

import fs from 'fs';
import path from 'path';

const trailLogPath = path.resolve(__dirname, 'recommendation-trail-log.json');

export interface RecommendationEntry {
  timestamp: string;
  sessionId?: string;
  trigger: 'audit-failure' | 'emotional-drift' | 'modularity-drift' | 'codex-update' | 'manual-review' | 'other';
  recommendation: string;
  rationale: string;
  affectedModules: string[];
  actionSuggested: 'revise' | 'rebuild' | 'refactor' | 'investigate' | 'monitor';
}

export function loadRecommendationTrail(): RecommendationEntry[] {
  if (!fs.existsSync(trailLogPath)) return [];
  return JSON.parse(fs.readFileSync(trailLogPath, 'utf-8'));
}

export function saveRecommendationTrail(trail: RecommendationEntry[]): void {
  fs.writeFileSync(trailLogPath, JSON.stringify(trail, null, 2));
}

export function logRecommendation(entry: RecommendationEntry): void {
  const trail = loadRecommendationTrail();
  trail.push(entry);
  saveRecommendationTrail(trail);
}

export function exportLatestRecommendationMarkdown(): string {
  const trail = loadRecommendationTrail();
  if (trail.length === 0) return '🟢 No recommendations logged yet.';

  const latest = trail[trail.length - 1];

  return `# 🧭 Latest System Recommendation

**Timestamp:** ${latest.timestamp}  
**Trigger Event:** ${latest.trigger}  
**Recommended Action:** ${latest.actionSuggested.toUpperCase()}

## 🧠 Recommendation
${latest.recommendation}

## 🔎 Rationale
${latest.rationale}

## 📂 Affected Modules
${latest.affectedModules.length > 0
    ? latest.affectedModules.map(m => `- ${m}`).join('\n')
    : 'None explicitly tagged.'}
`;
}
