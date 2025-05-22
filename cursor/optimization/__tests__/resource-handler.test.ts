/**
 * optimization/__tests__/resource-handler.test.ts
 * 
 * Purpose:
 * Tests the resource handler component, including strategy management,
 * action execution, and resource optimization.
 */

import { ResourceHandler } from '../resource-handler';
import { ResourceMonitor } from '../resource-monitor';
import { PerformanceOptimizer } from '../performance-optimizer';
import { TrustEvolutionTracker } from '../../agents/trust-scorer/evolution-tracker';
import { SmartRevisionLoop } from '../../self-healing/smart-revision-loop';
import { EnhancedVisionProcessor } from '../../vision-injection/enhanced-vision-processor';

jest.mock('../resource-monitor');
// jest.mock('../performance-optimizer');

// Manual mock for PerformanceOptimizer to avoid constructor signature drift
class MockPerformanceOptimizer {
  clearAllCaches = jest.fn();
  reduceCacheSize = jest.fn();
  optimizeCacheSettings = jest.fn();
  // Add any other methods used in the tests as needed
  constructor(trustTracker: any, revisionLoop: any, visionProcessor: any) {}
}

describe('ResourceHandler', () => {
  let resourceHandler: ResourceHandler;
  let resourceMonitor: jest.Mocked<ResourceMonitor>;
  let performanceOptimizer: jest.Mocked<PerformanceOptimizer>;
  let trustTracker: jest.Mocked<TrustEvolutionTracker>;
  let revisionLoop: jest.Mocked<SmartRevisionLoop>;
  let visionProcessor: jest.Mocked<EnhancedVisionProcessor>;

  beforeEach(() => {
    resourceMonitor = new ResourceMonitor() as jest.Mocked<ResourceMonitor>;
    trustTracker = new TrustEvolutionTracker('test', 1) as jest.Mocked<TrustEvolutionTracker>;
    revisionLoop = new SmartRevisionLoop() as jest.Mocked<SmartRevisionLoop>;
    visionProcessor = new EnhancedVisionProcessor() as jest.Mocked<EnhancedVisionProcessor>;
    // Use manual mock for PerformanceOptimizer to avoid constructor drift
    performanceOptimizer = new MockPerformanceOptimizer(
      trustTracker,
      revisionLoop,
      visionProcessor
    ) as unknown as jest.Mocked<PerformanceOptimizer>;
    resourceHandler = new ResourceHandler(resourceMonitor, performanceOptimizer);
  });

  describe('Strategy Management', () => {
    it('should initialize with default strategies', () => {
      const strategies = (resourceHandler as any).strategies;
      expect(strategies.get('cpu-optimization')).toBeDefined();
      expect(strategies.get('memory-optimization')).toBeDefined();
    });

    it('should get correct strategies for resources', () => {
      const strategies = (resourceHandler as any).getStrategiesForResources(['CPU', 'Memory']);
      expect(strategies).toHaveLength(2);
      expect(strategies[0].description).toContain('CPU');
      expect(strategies[1].description).toContain('Memory');
    });

    it('should handle unknown resource types', () => {
      const strategies = (resourceHandler as any).getStrategiesForResources(['Unknown']);
      expect(strategies).toHaveLength(0);
    });
  });

  describe('Action Execution', () => {
    it('should execute cache actions', async () => {
      const action = { type: 'cache' as const, action: 'clear' as const, priority: 'high' as const };
      await (resourceHandler as any).executeAction(action);
      expect(performanceOptimizer.clearAllCaches).toHaveBeenCalled();
    });

    it('should execute memory actions', async () => {
      const clearUnusedMemorySpy = jest.spyOn(resourceHandler as any, 'clearUnusedMemory');
      const action = { type: 'memory' as const, action: 'clear' as const, priority: 'high' as const };
      await (resourceHandler as any).executeAction(action);
      expect(clearUnusedMemorySpy).toHaveBeenCalled();
    });

    it('should execute CPU actions', async () => {
      const optimizeCpuUtilizationSpy = jest.spyOn(resourceHandler as any, 'optimizeCpuUtilization');
      const action = { type: 'cpu' as const, action: 'optimize' as const, priority: 'high' as const };
      await (resourceHandler as any).executeAction(action);
      expect(optimizeCpuUtilizationSpy).toHaveBeenCalled();
    });
  });

  describe('Resource Monitoring', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should start monitoring resources', () => {
      const getResourceUsageSpy = jest.spyOn(resourceMonitor, 'getResourceUsage');
      (resourceHandler as any).startResourceMonitoring();
      
      jest.advanceTimersByTime(30000); // 30 seconds
      expect(getResourceUsageSpy).toHaveBeenCalled();
    });

    it('should handle critical resource situations', async () => {
      const handleCriticalSituationSpy = jest.spyOn(resourceHandler, 'handleCriticalSituation');
      
      resourceMonitor.getResourceUsage.mockResolvedValue({
        cpu: 0.95,
        memory: 0.96,
        timestamp: Date.now()
      });
      
      resourceMonitor.checkResourceThresholds.mockReturnValue({
        isWarning: false,
        isCritical: true,
        exceededResources: ['CPU', 'Memory']
      });

      (resourceHandler as any).startResourceMonitoring();
      jest.advanceTimersByTime(30000);

      expect(handleCriticalSituationSpy).toHaveBeenCalledWith(['CPU', 'Memory']);
    });

    it('should handle warning resource situations', async () => {
      const handleWarningSituationSpy = jest.spyOn(resourceHandler as any, 'handleWarningSituation');
      
      resourceMonitor.getResourceUsage.mockResolvedValue({
        cpu: 0.75,
        memory: 0.8,
        timestamp: Date.now()
      });
      
      resourceMonitor.checkResourceThresholds.mockReturnValue({
        isWarning: true,
        isCritical: false,
        exceededResources: ['CPU', 'Memory']
      });

      (resourceHandler as any).startResourceMonitoring();
      jest.advanceTimersByTime(30000);

      expect(handleWarningSituationSpy).toHaveBeenCalledWith(['CPU', 'Memory']);
    });
  });

  describe('Resource Optimization', () => {
    it('should optimize resources based on impact level', async () => {
      const strategies = [
        {
          actions: [
            { type: 'cpu' as const, action: 'optimize' as const, priority: 'high' as const }
          ],
          description: 'Test strategy',
          impact: 'high' as const
        }
      ];

      jest.spyOn(resourceHandler as any, 'getStrategiesForResources').mockReturnValue(strategies);
      const applyStrategySpy = jest.spyOn(resourceHandler as any, 'applyStrategy');

      await resourceHandler.handleCriticalSituation(['CPU']);
      expect(applyStrategySpy).toHaveBeenCalledWith(strategies[0]);
    });

    it('should apply only low/medium impact strategies for warnings', async () => {
      const strategies = [
        {
          actions: [
            { type: 'cpu' as const, action: 'optimize' as const, priority: 'high' as const }
          ],
          description: 'High impact strategy',
          impact: 'high' as const
        },
        {
          actions: [
            { type: 'cache' as const, action: 'optimize' as const, priority: 'medium' as const }
          ],
          description: 'Medium impact strategy',
          impact: 'medium' as const
        }
      ];

      jest.spyOn(resourceHandler as any, 'getStrategiesForResources').mockReturnValue(strategies);
      const applyStrategySpy = jest.spyOn(resourceHandler as any, 'applyStrategy');

      await (resourceHandler as any).handleWarningSituation(['CPU']);
      expect(applyStrategySpy).toHaveBeenCalledTimes(1);
      expect(applyStrategySpy).toHaveBeenCalledWith(strategies[1]);
    });
  });

  describe('Error Handling', () => {
    it('should handle action execution errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      performanceOptimizer.clearAllCaches.mockRejectedValue(new Error('Test error'));

      const action = { type: 'cache' as const, action: 'clear' as const, priority: 'high' as const };
      await (resourceHandler as any).executeAction(action);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should continue monitoring after errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      resourceMonitor.getResourceUsage.mockRejectedValue(new Error('Test error'));

      (resourceHandler as any).startResourceMonitoring();
      jest.advanceTimersByTime(30000);

      expect(consoleSpy).toHaveBeenCalled();
      expect(resourceMonitor.getResourceUsage).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
}); 