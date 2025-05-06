/**
 * @file fix-context-utils.ts
 * @description Utilities for fix context logging.
 */
import * as fs from 'fs';
import * as path from 'path';

export async function appendToFixContextAsync(message: string): Promise<void> {
  const fixLogPath = path.join('.canai-context', 'fix.log');
  const contextDir = path.join('.canai-context');
  
  if (!fs.existsSync(contextDir)) {
    fs.mkdirSync(contextDir, { recursive: true });
  }
  
  fs.appendFileSync(fixLogPath, `${message}\n`);
} 