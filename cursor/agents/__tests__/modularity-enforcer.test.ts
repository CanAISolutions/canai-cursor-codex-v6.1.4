/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Test modularity enforcement and violation detection"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Validate modularity enforcer's ability to maintain system architecture integrity
 */

import { enforceModularityStandards } from '../modularityEnforcer';
import { introspectModules, validateModularIntegrity } from '../../utils/modularity-utils';
import { runAudit } from '../../system-intel/audit-utils';

// Mock dependencies
jest.mock('../../utils/modularity-utils', () => ({
  introspectModules: jest.fn(),
  validateModularIntegrity: jest.fn()
}));

jest.mock('../../system-intel/audit-utils', () => ({
  runAudit: jest.fn()
}));

describe('Modularity Enforcer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('enforceModularityStandards', () => {
    it('should report clean state when no violations are detected', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { name: 'module1', version: '1.0.0' },
        { name: 'module2', version: '1.0.0' }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: true,
        score: 0.95
      });

      const result = await enforceModularityStandards();

      expect(result.clean).toBe(true);
      expect(result.violations).toBeUndefined();
      expect(runAudit).toHaveBeenCalled();
    });

    it('should detect coupling violations', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { name: 'module1', version: '1.0.0' },
        { name: 'module2', version: '1.0.0' }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: false,
        score: 0.65,
        violations: [{
          type: 'coupling',
          module: 'module1',
          description: 'Module has tight coupling with module2'
        }]
      });

      const result = await enforceModularityStandards();

      expect(result.clean).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.violations![0]).toMatchObject({
        type: 'coupling',
        module: 'module1',
        description: expect.stringContaining('tight coupling')
      });
      expect(runAudit).toHaveBeenCalled();
    });

    it('should detect bloat violations', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { name: 'module1', version: '1.0.0' }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: false,
        score: 0.75,
        violations: [{
          type: 'bloat',
          module: 'module1',
          description: 'Module exceeds size threshold'
        }]
      });

      const result = await enforceModularityStandards();

      expect(result.clean).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.violations![0]).toMatchObject({
        type: 'bloat',
        module: 'module1',
        description: expect.stringContaining('size threshold')
      });
      expect(runAudit).toHaveBeenCalled();
    });

    it('should detect drift violations', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { name: 'module1', version: '1.0.0' },
        { name: 'module2', version: '2.0.0' }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: false,
        score: 0.70,
        violations: [{
          type: 'drift',
          module: 'module2',
          description: 'Module version drift detected'
        }]
      });

      const result = await enforceModularityStandards();

      expect(result.clean).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.violations![0]).toMatchObject({
        type: 'drift',
        module: 'module2',
        description: expect.stringContaining('version drift')
      });
      expect(runAudit).toHaveBeenCalled();
    });

    it('should detect schema lag violations', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { name: 'module1', version: '1.0.0' }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: false,
        score: 0.68,
        violations: [{
          type: 'schema-lag',
          module: 'module1',
          description: 'Module schema out of sync with latest version'
        }]
      });

      const result = await enforceModularityStandards();

      expect(result.clean).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.violations![0]).toMatchObject({
        type: 'schema-lag',
        module: 'module1',
        description: expect.stringContaining('schema out of sync')
      });
      expect(runAudit).toHaveBeenCalled();
    });

    it('should detect multiple violations simultaneously', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { name: 'module1', version: '1.0.0' },
        { name: 'module2', version: '2.0.0' }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: false,
        score: 0.60,
        violations: [
          {
            type: 'coupling',
            module: 'module1',
            description: 'Module has tight coupling with module2'
          },
          {
            type: 'drift',
            module: 'module2',
            description: 'Module version drift detected'
          }
        ]
      });

      const result = await enforceModularityStandards();

      expect(result.clean).toBe(false);
      expect(result.violations).toHaveLength(2);
      expect(result.violations!.map(v => v.type)).toEqual(['coupling', 'drift']);
      expect(runAudit).toHaveBeenCalled();
    });

    it('should handle errors in module introspection', async () => {
      (introspectModules as jest.Mock).mockRejectedValue(new Error('Introspection failed'));

      await expect(enforceModularityStandards()).rejects.toThrow('Introspection failed');
    });

    it('should handle errors in violation detection', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { name: 'module1', version: '1.0.0' }
      ]);
      (validateModularIntegrity as jest.Mock).mockRejectedValue(new Error('Validation failed'));

      await expect(enforceModularityStandards()).rejects.toThrow('Validation failed');
    });

    it('should validate violation structure', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { name: 'module1', version: '1.0.0' }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: false,
        score: 0.72,
        violations: [{
          type: 'coupling',
          module: 'module1',
          description: 'Test violation'
        }]
      });

      const result = await enforceModularityStandards();

      result.violations!.forEach(violation => {
        expect(violation).toHaveProperty('type');
        expect(violation).toHaveProperty('module');
        expect(violation).toHaveProperty('description');
        expect(['coupling', 'bloat', 'drift', 'schema-lag']).toContain(violation.type);
      });
    });

    it('should run audit for all violations', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { name: 'module1', version: '1.0.0' }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: false,
        score: 0.65,
        violations: [
          {
            type: 'coupling',
            module: 'module1',
            description: 'Test violation 1'
          },
          {
            type: 'bloat',
            module: 'module1',
            description: 'Test violation 2'
          }
        ]
      });

      await enforceModularityStandards();

      expect(runAudit).toHaveBeenCalled();
    });

    it('should handle concurrent module analysis', async () => {
      const largeModuleSet = Array.from({ length: 100 }, (_, i) => ({
        name: `module${i}`,
        version: '1.0.0'
      }));

      (introspectModules as jest.Mock).mockResolvedValue(largeModuleSet);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: true,
        score: 0.95
      });

      const startTime = Date.now();
      await enforceModularityStandards();
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
      expect(runAudit).toHaveBeenCalled();
    });

    it('should detect circular dependencies', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { name: 'module1', version: '1.0.0', dependencies: ['module2'] },
        { name: 'module2', version: '1.0.0', dependencies: ['module1'] }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: false,
        score: 0.65,
        violations: [{
          type: 'coupling',
          module: 'module1',
          description: 'Circular dependency detected between module1 and module2'
        }]
      });

      const result = await enforceModularityStandards();

      expect(result.clean).toBe(false);
      expect(result.violations![0].description).toContain('Circular dependency');
    });

    it('should handle version compatibility edge cases', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { name: 'module1', version: '1.0.0' },
        { name: 'module2', version: '1.0.0-beta.1' },
        { name: 'module3', version: '1.0.0-rc.1' }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: false,
        score: 0.70,
        violations: [{
          type: 'drift',
          module: 'module2',
          description: 'Pre-release version detected'
        }]
      });

      const result = await enforceModularityStandards();

      expect(result.clean).toBe(false);
      expect(result.violations![0].description).toContain('Pre-release version');
    });

    it('should validate module performance metrics', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { 
          name: 'module1', 
          version: '1.0.0',
          metrics: {
            loadTime: 500,
            memoryUsage: 100,
            complexity: 0.8
          }
        }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: false,
        score: 0.75,
        violations: [{
          type: 'performance',
          module: 'module1',
          description: 'Module exceeds performance thresholds'
        }]
      });

      const result = await enforceModularityStandards();

      expect(result.clean).toBe(false);
      expect(result.violations![0].type).toBe('performance');
    });

    it('should handle module deprecation warnings', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { 
          name: 'module1', 
          version: '1.0.0',
          deprecated: true,
          replacement: 'module2'
        }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: false,
        score: 0.80,
        violations: [{
          type: 'deprecation',
          module: 'module1',
          description: 'Module is deprecated, use module2 instead'
        }]
      });

      const result = await enforceModularityStandards();

      expect(result.clean).toBe(false);
      expect(result.violations![0].type).toBe('deprecation');
    });

    it('should validate module security compliance', async () => {
      (introspectModules as jest.Mock).mockResolvedValue([
        { 
          name: 'module1', 
          version: '1.0.0',
          security: {
            vulnerabilities: 2,
            outdatedDependencies: 1
          }
        }
      ]);
      (validateModularIntegrity as jest.Mock).mockResolvedValue({
        passed: false,
        score: 0.85,
        violations: [{
          type: 'security',
          module: 'module1',
          description: 'Security vulnerabilities detected'
        }]
      });

      const result = await enforceModularityStandards();

      expect(result.clean).toBe(false);
      expect(result.violations![0].type).toBe('security');
    });
  });
}); 