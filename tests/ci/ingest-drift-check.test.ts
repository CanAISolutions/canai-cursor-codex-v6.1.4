/**
 * ✅ Codex System Integrity Test — Ingest Drift Check
 * ----------------------------------------------------
 * Purpose:
 *   Verifies that critical system truth files match their last-ingested SHA256 values.
 *   Prevents silent drift of `/docs/system-map.md` and `/cursor/cursor-ingest.md`.
 *
 * Trigger:
 *   - CI runs on changes to: `system-map.md`, `cursor-ingest.md`, `self-awareness.json`
 *
 * Enforcement:
 *   - Blocks execution if current file state diverges from ingested memory
 *
 * TAP Status: Codex v6.1.4, Trust Lock Threshold 4.2
 * Last Updated: 2025-05-12
 */

import fs from 'fs';
import crypto from 'crypto';

describe('🧠 Ingest Drift Check — Codex Lock Enforcement', () => {
  const selfAwarenessPath = './cursor/self-awareness.json';

  function computeHash(filePath: string): string {
    return crypto
      .createHash('sha256')
      .update(fs.readFileSync(filePath))
      .digest('hex');
  }

  it('should match the ingested SHA256 of /docs/system-map.md', () => {
    const systemMapPath = './docs/system-map.md';
    const selfAwareness = JSON.parse(fs.readFileSync(selfAwarenessPath, 'utf-8'));
    const expectedHash = selfAwareness.ingestedFiles.systemMap.sha256;
    const actualHash = computeHash(systemMapPath);

    expect(actualHash).toBe(expectedHash);
  });

  it('should match the ingested SHA256 of /cursor/cursor-ingest.md', () => {
    const cursorIngestPath = './cursor/cursor-ingest.md';
    const selfAwareness = JSON.parse(fs.readFileSync(selfAwarenessPath, 'utf-8'));
    const expectedHash = selfAwareness.ingestedFiles.cursorIngest.sha256;
    const actualHash = computeHash(cursorIngestPath);

    expect(actualHash).toBe(expectedHash);
  });
});
