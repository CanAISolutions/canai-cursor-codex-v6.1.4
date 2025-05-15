import { readFileSync } from 'fs';

export async function restoreFromBackup(file: string): Promise<string> {
  const backupPath = `/continuity/soul-crypt/${file.split('/').pop()}.backup`;
  return readFileSync(backupPath, 'utf8');
}
