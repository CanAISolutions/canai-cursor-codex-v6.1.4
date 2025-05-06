/**
 * optimization/__tests__/resource-monitor.test.ts
 * 
 * Purpose:
 * Tests the resource monitoring components, including CPU and memory usage tracking,
 * threshold checking, and resource usage optimization.
 */

import { ResourceMonitor } from '../resource-monitor';

describe('ResourceMonitor', () => {
  let resourceMonitor: ResourceMonitor;

  beforeEach(() => {
    resourceMonitor = new ResourceMonitor();
  });

  describe('Resource Usage Tracking', () => {
    it('should track CPU usage', async () => {
      const usage = await resourceMonitor.getResourceUsage();
      expect(usage.cpu).toBeGreaterThanOrEqual(0);
      expect(usage.cpu).toBeLessThanOrEqual(1);
    });

    it('should track memory usage', async () => {
      const usage = await resourceMonitor.getResourceUsage();
      expect(usage.memory).toBeGreaterThanOrEqual(0);
      expect(usage.memory).toBeLessThanOrEqual(1);
    });

    it('should include timestamp in usage data', async () => {
      const usage = await resourceMonitor.getResourceUsage();
      expect(usage.timestamp).toBeDefined();
      expect(typeof usage.timestamp).toBe('number');
      expect(usage.timestamp).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Threshold Checking', () => {
    it('should detect warning levels', async () => {
      // Mock high but not critical CPU usage
      jest.spyOn(resourceMonitor as any, 'getCpuUsage').mockResolvedValue(0.75);
      jest.spyOn(resourceMonitor as any, 'getMemoryUsage').mockResolvedValue(0.5);

      const usage = await resourceMonitor.getResourceUsage();
      const result = resourceMonitor.checkResourceThresholds(usage);

      expect(result.isWarning).toBe(true);
      expect(result.isCritical).toBe(false);
      expect(result.exceededResources).toContain('CPU');
    });

    it('should detect critical levels', async () => {
      // Mock critical memory usage
      jest.spyOn(resourceMonitor as any, 'getCpuUsage').mockResolvedValue(0.5);
      jest.spyOn(resourceMonitor as any, 'getMemoryUsage').mockResolvedValue(0.96);

      const usage = await resourceMonitor.getResourceUsage();
      const result = resourceMonitor.checkResourceThresholds(usage);

      expect(result.isWarning).toBe(false);
      expect(result.isCritical).toBe(true);
      expect(result.exceededResources).toContain('Memory');
    });

    it('should handle multiple exceeded resources', async () => {
      // Mock both CPU and memory at critical levels
      jest.spyOn(resourceMonitor as any, 'getCpuUsage').mockResolvedValue(0.95);
      jest.spyOn(resourceMonitor as any, 'getMemoryUsage').mockResolvedValue(0.96);

      const usage = await resourceMonitor.getResourceUsage();
      const result = resourceMonitor.checkResourceThresholds(usage);

      expect(result.isCritical).toBe(true);
      expect(result.exceededResources).toContain('CPU');
      expect(result.exceededResources).toContain('Memory');
      expect(result.exceededResources.length).toBe(2);
    });
  });

  describe('Threshold Management', () => {
    it('should update thresholds', () => {
      const newThresholds = {
        cpuWarning: 0.8,
        cpuCritical: 0.95,
        memoryWarning: 0.85,
        memoryCritical: 0.98
      };

      resourceMonitor.updateThresholds(newThresholds);

      // Mock high CPU usage just below new warning threshold
      jest.spyOn(resourceMonitor as any, 'getCpuUsage').mockResolvedValue(0.79);
      jest.spyOn(resourceMonitor as any, 'getMemoryUsage').mockResolvedValue(0.5);

      const usage = {
        cpu: 0.79,
        memory: 0.5,
        timestamp: Date.now()
      };

      const result = resourceMonitor.checkResourceThresholds(usage);
      expect(result.isWarning).toBe(false);
    });

    it('should handle partial threshold updates', () => {
      const partialUpdate = {
        cpuWarning: 0.8
      };

      resourceMonitor.updateThresholds(partialUpdate);

      // Verify that other thresholds remain unchanged
      const usage = {
        cpu: 0.85,
        memory: 0.81,
        timestamp: Date.now()
      };

      const result = resourceMonitor.checkResourceThresholds(usage);
      expect(result.isWarning).toBe(true);
      expect(result.exceededResources).toContain('CPU');
      expect(result.exceededResources).toContain('Memory');
    });
  });

  describe('CPU Usage Calculation', () => {
    it('should calculate average CPU usage', async () => {
      const usage1 = await resourceMonitor.getResourceUsage();
      await new Promise(resolve => setTimeout(resolve, 100));
      const usage2 = await resourceMonitor.getResourceUsage();

      expect(usage2.cpu).toBeGreaterThanOrEqual(0);
      expect(usage2.cpu).toBeLessThanOrEqual(1);
      expect(usage2.timestamp).toBeGreaterThan(usage1.timestamp);
    });

    it('should handle initial CPU usage calculation', async () => {
      // Reset the monitor to test initial state
      resourceMonitor = new ResourceMonitor();
      const usage = await resourceMonitor.getResourceUsage();

      expect(usage.cpu).toBe(0);
      expect(usage.timestamp).toBeDefined();
    });
  });

  describe('Memory Usage Calculation', () => {
    it('should calculate memory usage percentage', async () => {
      const usage = await resourceMonitor.getResourceUsage();
      expect(usage.memory).toBeGreaterThan(0);
      expect(usage.memory).toBeLessThan(1);
    });

    it('should reflect system memory changes', async () => {
      const usage1 = await resourceMonitor.getResourceUsage();
      
      // Allocate some memory
      const bigArray = new Array(1000000).fill(0);
      
      const usage2 = await resourceMonitor.getResourceUsage();
      expect(usage2.memory).toBeGreaterThanOrEqual(usage1.memory);

      // Clean up
      bigArray.length = 0;
    });
  });

  describe('Error Handling', () => {
    it('should handle CPU usage calculation errors', async () => {
      // Mock CPU usage calculation to throw error
      jest.spyOn(resourceMonitor as any, 'getCpuUsage').mockRejectedValue(new Error('CPU error'));

      const usage = await resourceMonitor.getResourceUsage();
      expect(usage.cpu).toBe(0);
      expect(usage.memory).toBeGreaterThanOrEqual(0);
    });

    it('should handle memory usage calculation errors', async () => {
      // Mock memory usage calculation to throw error
      jest.spyOn(resourceMonitor as any, 'getMemoryUsage').mockRejectedValue(new Error('Memory error'));

      const usage = await resourceMonitor.getResourceUsage();
      expect(usage.memory).toBe(0);
      expect(usage.cpu).toBeGreaterThanOrEqual(0);
    });
  });
}); 