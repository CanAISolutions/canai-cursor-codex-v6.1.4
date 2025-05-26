import fs from 'fs';
import path from 'path';

// What: Simulate running rollback scripts and assert logging
// Why: Ensure rollback is safe, reproducible, and auditable
// How: Check rollback-events.json for success/failure entries and non-destructive context

describe('Rollback Mechanism Enforcement', () => {
  const rollbackLogPath = path.resolve(__dirname, '../../cursor/system-intel/rollback-events.json');
  let rollbackEvents: any[] = [];

  beforeAll(() => {
    rollbackEvents = JSON.parse(fs.readFileSync(rollbackLogPath, 'utf-8'));
  });

  it('should log successful Airtable rollback', () => {
    const found = rollbackEvents.find(e => e.context && e.context.includes('Airtable rollback'));
    expect(found).toBeDefined();
    expect(found.result).toBe('success');
  });

  it('should log successful Prompt rollback', () => {
    const found = rollbackEvents.find(e => e.context && e.context.includes('Prompt rollback'));
    expect(found).toBeDefined();
    expect(found.result).toBe('success');
  });

  it('should fail if rollback is destructive or not logged', () => {
    // Simulate a destructive rollback event
    const destructive = rollbackEvents.find(e => e.context && e.context.includes('destructive'));
    expect(destructive).toBeUndefined();
    // Simulate missing log
    expect(rollbackEvents.length).toBeGreaterThanOrEqual(2);
  });
}); 