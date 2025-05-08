/**
 * optimization/__tests__/resource-monitor.test.ts
 * 
 * Purpose:
 * Tests the resource monitoring components, including CPU and memory usage tracking,
 * threshold checking, and resource usage optimization.
 */

import { ResourceMonitor } from '../resource-monitor';
import { ResourceUsage, ResourceThresholds } from '../resource-types';
import * as os from 'os';

jest.mock('os');

describe('ResourceMonitor', () => {
  let resourceMonitor: ResourceMonitor;

  beforeEach(() => {
    // Mock os.cpus() to return consistent test data
    (os.cpus as jest.Mock).mockReturnValue([
      {
        times: {
          user: 100,
          nice: 0,
          sys: 50,
          idle: 300,
          irq: 0
        }
      },
      {
        times: {
          user: 150,
          nice: 0,
          sys: 75,
          idle: 400,
          irq: 0
        }
      }
    ]);

    // Mock os.totalmem() and os.freemem() to return consistent test data
    (os.totalmem as jest.Mock).mockReturnValue(16000000000); // 16GB
    (os.freemem as jest.Mock).mockReturnValue(8000000000);  // 8GB

    resourceMonitor = new ResourceMonitor();
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    it('should handle concurrent resource usage requests', async () => {
      const requests = Array(5).fill(null).map(() => resourceMonitor.getResourceUsage());
      const results = await Promise.all(requests);
      
      results.forEach(usage => {
        expect(usage.cpu).toBeGreaterThanOrEqual(0);
        expect(usage.cpu).toBeLessThanOrEqual(1);
        expect(usage.memory).toBeGreaterThanOrEqual(0);
        expect(usage.memory).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Threshold Checking', () => {
    it('should detect warning levels', async () => {
      // Mock high but not critical CPU usage
      (os.cpus as jest.Mock).mockReturnValue([
        {
          times: {
            user: 700,
            nice: 0,
            sys: 200,
            idle: 100,
            irq: 0
          }
        }
      ]);

      const usage = await resourceMonitor.getResourceUsage();
      const result = resourceMonitor.checkResourceThresholds(usage);

      expect(result.isWarning).toBe(true);
      expect(result.isCritical).toBe(false);
      expect(result.exceededResources).toContain('CPU');
    });

    it('should detect critical levels', async () => {
      // Mock critical memory usage
      (os.totalmem as jest.Mock).mockReturnValue(16000000000); // 16GB
      (os.freemem as jest.Mock).mockReturnValue(400000000);   // 400MB

      const usage = await resourceMonitor.getResourceUsage();
      const result = resourceMonitor.checkResourceThresholds(usage);

      expect(result.isWarning).toBe(false);
      expect(result.isCritical).toBe(true);
      expect(result.exceededResources).toContain('Memory');
    });

    it('should handle multiple exceeded resources', async () => {
      // Mock both CPU and memory at critical levels
      (os.cpus as jest.Mock).mockReturnValue([
        {
          times: {
            user: 900,
            nice: 0,
            sys: 90,
            idle: 10,
            irq: 0
          }
        }
      ]);
      (os.totalmem as jest.Mock).mockReturnValue(16000000000); // 16GB
      (os.freemem as jest.Mock).mockReturnValue(400000000);   // 400MB

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
      const newThresholds: Partial<ResourceThresholds> = {
        cpuWarning: 0.8,
        cpuCritical: 0.95,
        memoryWarning: 0.85,
        memoryCritical: 0.98
      };

      resourceMonitor.updateThresholds(newThresholds);

      // Mock high CPU usage just below new warning threshold
      (os.cpus as jest.Mock).mockReturnValue([
        {
          times: {
            user: 750,
            nice: 0,
            sys: 50,
            idle: 200,
            irq: 0
          }
        }
      ]);

      const usage: ResourceUsage = {
        cpu: 0.79,
        memory: 0.5,
        timestamp: Date.now()
      };

      const result = resourceMonitor.checkResourceThresholds(usage);
      expect(result.isWarning).toBe(false);
    });

    it('should handle partial threshold updates', () => {
      const partialUpdate: Partial<ResourceThresholds> = {
        cpuWarning: 0.8
      };

      resourceMonitor.updateThresholds(partialUpdate);

      // Verify that other thresholds remain unchanged
      const usage: ResourceUsage = {
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
}); 