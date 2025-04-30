// /cursor/system-intel/loggers/systemChangeFeed.ts

/**
 * System Change Feed Logger
 * -------------------------
 * Captures all structural, prompt, codex, schema, and config changes over time.
 * Forms a chronological ledger of system evolution for audits, retros, and Copilot reasoning.
 *
 * 🧠 Feeds: journaling, DeltaMap, founder digests, GitHub commentary, Codex memory.
 * 📦 Format: append-only JSON log. Markdown export for timeline visualization.
 */

import fs from 'fs';
import path from 'path';

const changeFeedPath = path.resolve(__dirname, 'system-change-feed.json');

export interface SystemChangeEntry {
  timestamp: string;
  category: 'prompt' | 'folder' | 'codex' | 'schema' | 'config' | 'infrastructure' | 'other';
  target: string;
  changeType: 'added' | 'modified' | 'removed' | 'refactored';
  summary: string;
  diffSnippet?: string;
  triggeredBy?: 'auto-detection' | 'manual-review' | 'codex-upgrade' | 'self-healing' | 'other';
}

export function loadSystemChangeFeed(): SystemChangeEntry[] {
  if (!fs.existsSync(changeFeedPath)) return [];
  return JSON.parse(fs.readFileSync(changeFeedPath, 'utf-8'));
}

export function saveSystemChangeFeed(feed: SystemChangeEntry[]): void {
  fs.writeFileSync(changeFeedPath, JSON.stringify(feed, null, 2));
}

export function logSystemChange(entry: SystemChangeEntry): void {
  const feed = loadSystemChangeFeed();
  feed.push(entry);
  saveSystemChangeFeed(feed);
}

export function exportLatestChangeMarkdown(): string {
  const feed = loadSystemChangeFeed();
  if (feed.length === 0) return '🟢 No system changes logged yet.';

  const latest = feed[feed.length - 1];

  return `# 📜 Latest System Change

**Timestamp:** ${latest.timestamp}  
**Category:** ${latest.category.toUpperCase()}  
**Target:** ${latest.target}  
**Change Type:** ${latest.changeType.toUpperCase()}  
**Triggered By:** ${latest.triggeredBy ?? 'unknown'}

## 🧠 Summary
${latest.summary}

${latest.diffSnippet
  ? `## 🔍 Diff Snippet\n\`\`\`\n${latest.diffSnippet}\n\`\`\``
  : ''}
`;
}
