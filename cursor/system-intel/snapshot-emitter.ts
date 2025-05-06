/**
 * system-intel/snapshot-emitter.ts
 * 
 * Purpose:
 * Handles generation and storage of system state snapshots.
 * Outputs snapshot JSONs to /logs/snapshots/ for audit and review.
 */

import * as fs from 'fs';
import * as path from 'path';
import { SystemIntelMetrics } from './intel-aggregator';

export class SnapshotEmitter {
  private readonly snapshotDir: string;
  private readonly maxSnapshots: number;
  private readonly snapshotInterval: number;
  private lastSnapshotTime: number;

  constructor(
    snapshotDir: string = path.join(process.cwd(), 'logs', 'snapshots'),
    maxSnapshots: number = 1000,
    snapshotInterval: number = 5 * 60 * 1000 // 5 minutes
  ) {
    this.snapshotDir = snapshotDir;
    this.maxSnapshots = maxSnapshots;
    this.snapshotInterval = snapshotInterval;
    this.lastSnapshotTime = 0;
    this.ensureSnapshotDirectory();
  }

  private ensureSnapshotDirectory(): void {
    if (!fs.existsSync(this.snapshotDir)) {
      fs.mkdirSync(this.snapshotDir, { recursive: true });
    }
  }

  public async emitSnapshot(metrics: SystemIntelMetrics): Promise<void> {
    const now = Date.now();
    if (now - this.lastSnapshotTime < this.snapshotInterval) {
      return; // Skip if not enough time has passed
    }

    const snapshot = this.formatSnapshot(metrics);
    const filename = this.generateSnapshotFilename(metrics.timestamp);
    await this.writeSnapshot(filename, snapshot);
    this.cleanupOldSnapshots();
    this.lastSnapshotTime = now;
  }

  private formatSnapshot(metrics: SystemIntelMetrics): string {
    return JSON.stringify(metrics, null, 2);
  }

  private generateSnapshotFilename(timestamp: string): string {
    const date = new Date(timestamp);
    const formattedDate = date.toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .replace('Z', '');
    return `snapshot_${formattedDate}.json`;
  }

  private async writeSnapshot(filename: string, content: string): Promise<void> {
    const filepath = path.join(this.snapshotDir, filename);
    await fs.promises.writeFile(filepath, content, 'utf8');
  }

  private async cleanupOldSnapshots(): Promise<void> {
    const files = await fs.promises.readdir(this.snapshotDir);
    const snapshots = files
      .filter(file => file.startsWith('snapshot_') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(this.snapshotDir, file),
        time: fs.statSync(path.join(this.snapshotDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    if (snapshots.length > this.maxSnapshots) {
      const toDelete = snapshots.slice(this.maxSnapshots);
      await Promise.all(
        toDelete.map(snapshot => fs.promises.unlink(snapshot.path))
      );
    }
  }

  public async getLatestSnapshot(): Promise<SystemIntelMetrics | null> {
    const files = await fs.promises.readdir(this.snapshotDir);
    const snapshots = files
      .filter(file => file.startsWith('snapshot_') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(this.snapshotDir, file),
        time: fs.statSync(path.join(this.snapshotDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    if (snapshots.length === 0) {
      return null;
    }

    const content = await fs.promises.readFile(snapshots[0].path, 'utf8');
    return JSON.parse(content) as SystemIntelMetrics;
  }

  public async getSnapshotsInRange(
    startTime: string,
    endTime: string
  ): Promise<SystemIntelMetrics[]> {
    const files = await fs.promises.readdir(this.snapshotDir);
    const snapshots = files
      .filter(file => file.startsWith('snapshot_') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(this.snapshotDir, file),
        time: fs.statSync(path.join(this.snapshotDir, file)).mtime.getTime()
      }))
      .filter(snapshot => {
        const snapshotTime = new Date(snapshot.name.split('_')[1].replace('.json', '')).getTime();
        return snapshotTime >= new Date(startTime).getTime() &&
               snapshotTime <= new Date(endTime).getTime();
      })
      .sort((a, b) => a.time - b.time);

    return Promise.all(
      snapshots.map(async snapshot => {
        const content = await fs.promises.readFile(snapshot.path, 'utf8');
        return JSON.parse(content) as SystemIntelMetrics;
      })
    );
  }

  public async deleteSnapshotsBefore(timestamp: string): Promise<void> {
    const files = await fs.promises.readdir(this.snapshotDir);
    const cutoffTime = new Date(timestamp).getTime();

    const toDelete = files
      .filter(file => file.startsWith('snapshot_') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(this.snapshotDir, file),
        time: fs.statSync(path.join(this.snapshotDir, file)).mtime.getTime()
      }))
      .filter(snapshot => snapshot.time < cutoffTime);

    await Promise.all(
      toDelete.map(snapshot => fs.promises.unlink(snapshot.path))
    );
  }
} 