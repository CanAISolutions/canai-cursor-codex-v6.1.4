/**
 * journalWriter.ts
 * 
 * Purpose: Modular utility to persist updates to the self-awareness journal, maintaining accurate emotional, modular, and Codex memory states.
 * Triggered: After emotional audits, modular snapshots, or Codex directive checks.
 * Enforces: Snapshot safety, memory resilience, historical continuity.
 */

import { promises as fs } from "fs";
import { SelfAwarenessJournal } from "./selfAwarenessJournal";

const JOURNAL_PATH = "./self-awareness/selfAwarenessJournal.json";

export async function writeJournalUpdate(update: Partial<SelfAwarenessJournal>): Promise<void> {
  try {
    const currentData = await fs.readFile(JOURNAL_PATH, "utf8");
    const currentJournal: SelfAwarenessJournal = JSON.parse(currentData);

    const nextJournal: SelfAwarenessJournal = {
      ...currentJournal,
      ...update,
      updatedAt: Date.now(),
    };

    await fs.writeFile(JOURNAL_PATH, JSON.stringify(nextJournal, null, 2), "utf8");
  } catch (error) {
    const fallbackJournal: SelfAwarenessJournal = {
      lastEmotionalScore: 100,
      lastModularSnapshot: [],
      lastCodexVersion: "v1.0",
      updatedAt: Date.now(),
      ...update,
    };

    await fs.writeFile(JOURNAL_PATH, JSON.stringify(fallbackJournal, null, 2), "utf8");
  }
}
