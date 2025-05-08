/**
 * @file cursor/memory/exports-snapshot.test.ts
 * @description Tests for memory system exports and snapshot management
 * @version 6.1.4
 * @emotionalResonance true
 * @dreamStateAlignment true
 */

import { MemoryExports } from '../cursor/memory/exports';
import { SnapshotManager } from '../cursor/memory/snapshot-manager';
import { EmotionalResonanceValidator } from '../cursor/emotional-ux/validator';
import { DreamStateAligner } from '../cursor/dream-state/aligner';

describe('Memory Exports', () => {
  let memoryExports: MemoryExports;
  let snapshotManager: SnapshotManager;
  let emotionalValidator: EmotionalResonanceValidator;
  let dreamStateAligner: DreamStateAligner;

  beforeEach(() => {
    memoryExports = new MemoryExports({
      version: '6.1.4',
      exportTypes: ['json', 'markdown', 'binary'],
      compression: true
    });
    snapshotManager = new SnapshotManager();
    emotionalValidator = new EmotionalResonanceValidator();
    dreamStateAligner = new DreamStateAligner();
  });

  describe('Export Operations', () => {
    it('should export memory to JSON', async () => {
      const memory = {
        id: 'memory123',
        data: { key: 'value' },
        timestamp: Date.now()
      };
      
      const exportedData = await memoryExports.exportToJson(memory);
      expect(exportedData.format).toBe('json');
      expect(exportedData.data).toBeDefined();
      expect(exportedData.metadata).toBeDefined();
    });

    it('should export memory to Markdown', async () => {
      const memory = {
        id: 'memory123',
        content: '# Test Content',
        metadata: { type: 'document' }
      };
      
      const exportedData = await memoryExports.exportToMarkdown(memory);
      expect(exportedData.format).toBe('markdown');
      expect(exportedData.content).toBeDefined();
      expect(exportedData.frontmatter).toBeDefined();
    });
  });

  describe('Snapshot Management', () => {
    it('should create snapshot successfully', async () => {
      const memory = {
        id: 'memory123',
        data: { key: 'value' }
      };
      
      const snapshot = await snapshotManager.createSnapshot(memory);
      expect(snapshot.id).toBeDefined();
      expect(snapshot.timestamp).toBeDefined();
      expect(snapshot.data).toBeDefined();
    });

    it('should restore from snapshot', async () => {
      const snapshot = {
        id: 'snapshot123',
        data: { key: 'value' }
      };
      
      const restored = await snapshotManager.restoreFromSnapshot(snapshot);
      expect(restored.id).toBe('snapshot123');
      expect(restored.data).toEqual({ key: 'value' });
    });
  });

  describe('Emotional Resonance', () => {
    it('should validate memory structure', async () => {
      const memory = {
        id: 'memory123',
        data: { key: 'value' }
      };
      
      const validation = await emotionalValidator.validateMemoryStructure(memory);
      expect(validation.isResonant).toBe(true);
      expect(validation.resonanceScore).toBeGreaterThanOrEqual(0.8);
    });

    it('should ensure consistent memory format', async () => {
      const format = await memoryExports.getMemoryFormat();
      const consistency = await emotionalValidator.validateFormat(format);
      
      expect(consistency.isConsistent).toBe(true);
      expect(consistency.consistencyScore).toBeGreaterThanOrEqual(0.9);
    });
  });

  describe('Dream State Alignment', () => {
    it('should validate memory alignment', async () => {
      const memory = await memoryExports.getMemoryData();
      const alignment = await dreamStateAligner.validateMemoryAlignment(memory);
      
      expect(alignment.isAligned).toBe(true);
      expect(alignment.alignmentScore).toBeGreaterThanOrEqual(0.9);
    });

    it('should ensure future capability preservation', async () => {
      const capabilities = await snapshotManager.getFutureCapabilities();
      const preservation = await dreamStateAligner.validateCapabilities(capabilities);
      
      expect(preservation.isPreserved).toBe(true);
      expect(preservation.preservationScore).toBeGreaterThanOrEqual(0.9);
    });
  });

  describe('Integration Points', () => {
    it('should integrate with storage system', async () => {
      const integration = await memoryExports.validateStorageIntegration();
      expect(integration.isValid).toBe(true);
      expect(integration.status).toBe('connected');
    });

    it('should integrate with compression system', async () => {
      const integration = await snapshotManager.validateCompressionIntegration();
      expect(integration.isValid).toBe(true);
      expect(integration.status).toBe('active');
    });
  });

  describe('Fallback Scenarios', () => {
    it('should handle export failures', async () => {
      const failure = await memoryExports.simulateExportFailure();
      expect(failure.recoveryStrategy).toBeDefined();
      expect(failure.maxRetries).toBeGreaterThan(0);
    });

    it('should handle snapshot failures', async () => {
      const failure = await snapshotManager.simulateSnapshotFailure();
      expect(failure.fallbackAction).toBeDefined();
      expect(failure.notificationRequired).toBe(true);
    });
  });

  describe('Performance Metrics', () => {
    it('should track export performance', async () => {
      const metrics = await memoryExports.getExportMetrics();
      expect(metrics.duration).toBeGreaterThanOrEqual(0);
      expect(metrics.size).toBeGreaterThan(0);
    });

    it('should measure snapshot efficiency', async () => {
      const efficiency = await snapshotManager.measureEfficiency();
      expect(efficiency.compressionRatio).toBeGreaterThan(0);
      expect(efficiency.storageSavings).toBeDefined();
    });
  });
}); 