/**
 * selfAwarenessJournal.ts
 * 
 * Purpose: Persist emotional resonance scores, modular snapshots, and Codex directive versions to create historical system awareness and enable drift detection.
 * Triggered: After boot sequence, major events, or emotional/modular audits.
 * Enforces: Long-term emotional, modular, and operational memory preservation.
 */

import { promises as fs } from "fs";

const JOURNAL_PATH = "./self-awareness/selfAwarenessJournal.json";

interface SelfAwarenessJournal {
  lastEmotionalScore: number;
  lastModularSnapshot: any;
  lastCodexVersion: string;
  updatedAt: number;
}

export async function readSelfAwarenessJournal(): Promise<SelfAwarenessJournal> {
  try {
    const data = await fs.readFile(JOURNAL_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return {
      lastEmotionalScore: 100,
      lastModularSnapshot: [],
      lastCodexVersion: "v1.0",
      updatedAt: Date.now(),
    };
  }
}

export async function recordAlignmentDelta(update: Partial<SelfAwarenessJournal>): Promise<void> {
  const current = await readSelfAwarenessJournal();
  const next: SelfAwarenessJournal = {
    ...current,
    ...update,
    updatedAt: Date.now(),
  };

  await fs.writeFile(JOURNAL_PATH, JSON.stringify(next, null, 2), "utf8");
}
