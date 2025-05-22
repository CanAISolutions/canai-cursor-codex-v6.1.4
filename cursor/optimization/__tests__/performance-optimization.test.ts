/**
 * optimization/__tests__/performance-optimization.test.ts
 *
 * Purpose:
 * Tests core PerformanceOptimizer functionality: construction, stats, and cache clearing.
 * WHAT: Minimal scaffold to resolve empty test suite failure and enable future extensibility.
 * WHY: Codex compliance requires every exported module to have at least one test.
 * HOW: Covers constructor, getPerformanceStats, and clearAllCaches with basic assertions.
 */

import { PerformanceOptimizer } from '../performance-optimizer';

// Mock dependencies
const mockTrustTracker = { track: jest.fn() } as any;
const mockRevisionLoop = { loop: jest.fn() } as any;
const mockVisionProcessor = { process: jest.fn() } as any;

describe('PerformanceOptimizer', () => {
  it('should construct without error', () => {
    const optimizer = new PerformanceOptimizer(
      mockTrustTracker,
      mockRevisionLoop,
      mockVisionProcessor
    );
    expect(optimizer).toBeDefined();
  });

  it('should return default performance stats when no metrics recorded', () => {
    const optimizer = new PerformanceOptimizer(
      mockTrustTracker,
      mockRevisionLoop,
      mockVisionProcessor
    );
    const stats = optimizer.getPerformanceStats();
    expect(stats).toEqual({
      averageResponseTime: 0,
      averageRecoveryTime: 0,
      cacheHitRate: 0,
      resourceUsage: { cpu: 0, memory: 0 }
    });
  });

  it('should clear all caches without error', async () => {
    const optimizer = new PerformanceOptimizer(
      mockTrustTracker,
      mockRevisionLoop,
      mockVisionProcessor
    );
    await expect(optimizer.clearAllCaches()).resolves.toBeUndefined();
  });
}); 