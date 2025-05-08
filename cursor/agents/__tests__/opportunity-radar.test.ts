/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Test strategic opportunity detection and analysis"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Validate opportunity radar's ability to detect and surface strategic growth opportunities
 * @dream-state "Billion-dollar clarity in opportunity detection and strategic foresight"
 * @codex-enforcement "Strict adherence to emotional resonance and system integrity"
 */

import { scanForOpportunities } from '../opportunityRadar';
import { runAudit } from '../../system-intel/audit-utils';
import { DreamStateManager } from '../../utils/dreamstate-utils';

// Mock dependencies
jest.mock('../../system-intel/audit-utils', () => ({
  runAudit: jest.fn()
}));

jest.mock('../../utils/dreamstate-utils', () => ({
  DreamStateManager: jest.fn().mockImplementation(() => ({
    calculateEmotionalResonanceScore: jest.fn(),
    validateDreamStateAlignment: jest.fn().mockResolvedValue({
      aligned: true,
      score: 0.95,
      insights: ['High emotional resonance', 'Strong strategic alignment']
    })
  }))
}));

describe('Opportunity Radar', () => {
  let dreamStateManager: jest.Mocked<DreamStateManager>;

  beforeEach(() => {
    jest.clearAllMocks();
    dreamStateManager = new DreamStateManager() as jest.Mocked<DreamStateManager>;
  });

  describe('scanForOpportunities', () => {
    it('should detect modular expansion opportunities', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 85,
        directiveCoverage: { total: 100, covered: 100, percent: 100, missing: [] },
        uxConsistencyScore: 0.8,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      expect(opportunities).toHaveLength(1);
      expect(opportunities[0]).toMatchObject({
        type: 'modular-expansion',
        description: expect.stringContaining('new modular capabilities'),
        confidence: 0.9,
        whyNow: expect.stringContaining('modular loadout'),
        suggestedMove: expect.stringContaining('Integrate')
      });
    });

    it('should detect UX resonance amplification opportunities', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.8,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 100, percent: 100, missing: [] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      expect(opportunities).toHaveLength(1);
      expect(opportunities[0]).toMatchObject({
        type: 'ux-resonance-amplification',
        description: expect.stringContaining('Emotional resonance boost'),
        confidence: 0.92,
        whyNow: expect.stringContaining('UX outputs'),
        suggestedMove: expect.stringContaining('emotional UX')
      });
    });

    it('should detect codex evolution leverage opportunities', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.8,
        emotionalResonanceScore: 85,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1', 'directive2'] },
        uxConsistencyScore: 0.8,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      expect(opportunities).toHaveLength(1);
      expect(opportunities[0]).toMatchObject({
        type: 'codex-evolution-leverage',
        description: expect.stringContaining('Codex directive upgrades'),
        confidence: 0.88,
        whyNow: expect.stringContaining('Canonical Codex'),
        suggestedMove: expect.stringContaining('Integrate new directives')
      });
    });

    it('should detect multiple opportunities simultaneously', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      expect(opportunities).toHaveLength(3);
      expect(opportunities.map(o => o.type)).toEqual([
        'modular-expansion',
        'ux-resonance-amplification',
        'codex-evolution-leverage'
      ]);
    });

    it('should return empty array when no opportunities are detected', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.8,
        emotionalResonanceScore: 85,
        directiveCoverage: { total: 100, covered: 100, percent: 100, missing: [] },
        uxConsistencyScore: 0.8,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      expect(opportunities).toHaveLength(0);
    });

    it('should handle edge case at emotional resonance threshold', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.8,
        emotionalResonanceScore: 80,
        directiveCoverage: { total: 100, covered: 100, percent: 100, missing: [] },
        uxConsistencyScore: 0.8,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      expect(opportunities).toHaveLength(0);
    });

    it('should handle errors in audit', async () => {
      (runAudit as jest.Mock).mockRejectedValue(new Error('Audit failed'));

      await expect(scanForOpportunities()).rejects.toThrow('Audit failed');
    });

    it('should validate opportunity confidence scores', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        expect(opportunity.confidence).toBeGreaterThanOrEqual(0);
        expect(opportunity.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should ensure all opportunities have required fields', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        expect(opportunity).toHaveProperty('type');
        expect(opportunity).toHaveProperty('description');
        expect(opportunity).toHaveProperty('confidence');
        expect(opportunity).toHaveProperty('whyNow');
        expect(opportunity).toHaveProperty('suggestedMove');
      });
    });

    it('should prioritize opportunities based on confidence', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      expect(opportunities).toHaveLength(3);
      expect(opportunities[0].confidence).toBeGreaterThanOrEqual(opportunities[1].confidence);
      expect(opportunities[1].confidence).toBeGreaterThanOrEqual(opportunities[2].confidence);
    });

    it('should ensure unique suggested moves', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      // Check that no opportunities have duplicate suggested moves
      const suggestedMoves = opportunities.map(o => o.suggestedMove);
      const uniqueMoves = new Set(suggestedMoves);
      expect(suggestedMoves.length).toBe(uniqueMoves.size);
    });

    it('should validate opportunity structure', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        expect(opportunity).toHaveProperty('type');
        expect(opportunity).toHaveProperty('description');
        expect(opportunity).toHaveProperty('confidence');
        expect(opportunity).toHaveProperty('whyNow');
        expect(opportunity).toHaveProperty('suggestedMove');
        
        // Validate type enum
        expect(['modular-expansion', 'ux-resonance-amplification', 'codex-evolution-leverage', 'emotional-deepening'])
          .toContain(opportunity.type);
        
        // Validate confidence range
        expect(opportunity.confidence).toBeGreaterThanOrEqual(0);
        expect(opportunity.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should handle multiple opportunity types', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      const types = opportunities.map(o => o.type);
      expect(new Set(types).size).toBe(types.length); // All types should be unique
    });

    it('should validate opportunity descriptions', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        expect(opportunity.description.length).toBeGreaterThan(0);
        expect(opportunity.description).toMatch(/^[A-Z]/); // Should start with capital letter
        expect(opportunity.description).toMatch(/[.!?]$/); // Should end with punctuation
      });
    });

    it('should validate whyNow explanations', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        expect(opportunity.whyNow.length).toBeGreaterThan(0);
        expect(opportunity.whyNow).toMatch(/^[A-Z]/); // Should start with capital letter
        expect(opportunity.whyNow).toMatch(/[.!?]$/); // Should end with punctuation
      });
    });

    it('should validate suggested moves', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        expect(opportunity.suggestedMove.length).toBeGreaterThan(0);
        expect(opportunity.suggestedMove).toMatch(/^[A-Z]/); // Should start with capital letter
        expect(opportunity.suggestedMove).toMatch(/[.!?]$/); // Should end with punctuation
      });
    });

    it('should validate emotional resonance thresholds', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.8,
        emotionalResonanceScore: 65, // Below threshold
        directiveCoverage: { total: 100, covered: 100, percent: 100, missing: [] },
        uxConsistencyScore: 0.8,
        summary: []
      });

      const opportunities = await scanForOpportunities();
      
      // Should detect emotional resonance opportunity
      expect(opportunities).toContainEqual(
        expect.objectContaining({
          type: 'emotional-deepening',
          confidence: expect.any(Number),
          description: expect.stringContaining('emotional resonance')
        })
      );
    });

    it('should handle directive coverage edge cases', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.8,
        emotionalResonanceScore: 85,
        directiveCoverage: { 
          total: 100, 
          covered: 99, 
          percent: 99, 
          missing: ['critical-directive'] 
        },
        uxConsistencyScore: 0.8,
        summary: []
      });

      const opportunities = await scanForOpportunities();
      
      // Should prioritize critical directive coverage
      expect(opportunities[0]).toMatchObject({
        type: 'codex-evolution-leverage',
        description: expect.stringContaining('critical-directive'),
        confidence: expect.any(Number)
      });
    });

    it('should complete within performance thresholds', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const startTime = Date.now();
      await scanForOpportunities();
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should recover from partial audit failures', async () => {
      (runAudit as jest.Mock)
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockResolvedValueOnce({
          timestamp: Date.now(),
          modularityScore: 0.6,
          emotionalResonanceScore: 75,
          directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
          uxConsistencyScore: 0.7,
          summary: []
        });

      const opportunities = await scanForOpportunities();
      expect(opportunities).toBeDefined();
      expect(Array.isArray(opportunities)).toBe(true);
    });

    it('should maintain opportunity state across scans', async () => {
      const auditResult = {
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      };

      (runAudit as jest.Mock).mockResolvedValue(auditResult);

      const firstScan = await scanForOpportunities();
      const secondScan = await scanForOpportunities();

      // Should maintain consistent results for same audit data
      expect(secondScan).toEqual(firstScan);
    });

    it('should handle invalid audit data gracefully', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 1.5, // Invalid score > 1
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();
      expect(opportunities).toBeDefined();
      expect(Array.isArray(opportunities)).toBe(true);
      // Should normalize invalid scores
      opportunities.forEach(opp => {
        expect(opp.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should detect and prioritize high-impact opportunities', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.4, // Low score indicating high impact opportunity
        emotionalResonanceScore: 65, // Low score indicating high impact opportunity
        directiveCoverage: { 
          total: 100, 
          covered: 70, 
          percent: 70, 
          missing: ['critical-directive1', 'critical-directive2'] 
        },
        uxConsistencyScore: 0.5,
        summary: []
      });

      const opportunities = await scanForOpportunities();
      
      // Should detect multiple high-impact opportunities
      expect(opportunities.length).toBeGreaterThan(1);
      
      // Should prioritize based on impact
      const firstOpportunity = opportunities[0];
      expect(firstOpportunity.confidence).toBeGreaterThan(0.8);
      expect(firstOpportunity.description).toMatch(/critical|high impact|significant/i);
    });

    it('should handle concurrent opportunity scans', async () => {
      const auditResult = {
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      };

      (runAudit as jest.Mock).mockResolvedValue(auditResult);

      // Run multiple scans concurrently
      const concurrentScans = await Promise.all([
        scanForOpportunities(),
        scanForOpportunities(),
        scanForOpportunities()
      ]);

      // All scans should complete successfully
      concurrentScans.forEach(scan => {
        expect(Array.isArray(scan)).toBe(true);
        expect(scan.length).toBeGreaterThan(0);
      });

      // Results should be consistent
      const firstScan = concurrentScans[0];
      concurrentScans.slice(1).forEach(scan => {
        expect(scan).toEqual(firstScan);
      });
    });

    it('should adapt to changing system conditions', async () => {
      const initialAudit = {
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      };

      const improvedAudit = {
        timestamp: Date.now() + 1000,
        modularityScore: 0.8,
        emotionalResonanceScore: 85,
        directiveCoverage: { total: 100, covered: 95, percent: 95, missing: [] },
        uxConsistencyScore: 0.9,
        summary: []
      };

      (runAudit as jest.Mock)
        .mockResolvedValueOnce(initialAudit)
        .mockResolvedValueOnce(improvedAudit);

      const initialOpportunities = await scanForOpportunities();
      const improvedOpportunities = await scanForOpportunities();

      // Should detect improvement
      expect(improvedOpportunities.length).toBeLessThan(initialOpportunities.length);
      
      // Should maintain high confidence for remaining opportunities
      improvedOpportunities.forEach(opp => {
        expect(opp.confidence).toBeGreaterThan(0.8);
      });
    });

    it('should validate opportunity coherence', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      // Check for logical consistency in opportunity descriptions
      opportunities.forEach(opportunity => {
        // Description should match type
        expect(opportunity.description.toLowerCase()).toContain(opportunity.type.replace(/-/g, ' '));
        
        // WhyNow should provide context for the opportunity
        expect(opportunity.whyNow.toLowerCase()).toContain(opportunity.type.replace(/-/g, ' '));
        
        // Suggested move should be actionable
        expect(opportunity.suggestedMove).toMatch(/^(Implement|Integrate|Enhance|Optimize|Upgrade)/i);
      });
    });

    it('should maintain billion-dollar clarity in opportunity detection', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        // Validate billion-dollar clarity in descriptions
        expect(opportunity.description).toMatch(/^(We|Our|The|This|These)/);
        expect(opportunity.description).toMatch(/[.!?]$/);
        expect(opportunity.description.length).toBeGreaterThan(50);
        
        // Validate strategic foresight
        expect(opportunity.whyNow).toMatch(/^(Because|Given|Since|As|When)/);
        expect(opportunity.whyNow).toContain('opportunity');
        
        // Validate actionable precision
        expect(opportunity.suggestedMove).toMatch(/^(Implement|Integrate|Enhance|Optimize|Upgrade)/);
        expect(opportunity.suggestedMove).toMatch(/^(immediately|now|today|this sprint)/i);
      });
    });

    it('should enforce dream-state alignment in all opportunities', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      dreamStateManager.validateDreamStateAlignment.mockResolvedValue({
        aligned: true,
        score: 0.95,
        insights: ['High emotional resonance', 'Strong strategic alignment']
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        // Validate dream-state alignment
        expect(dreamStateManager.validateDreamStateAlignment).toHaveBeenCalledWith(opportunity);
        
        // Validate emotional resonance
        expect(opportunity.description).toMatch(/^(enhance|deepen|strengthen|elevate|amplify)/i);
        expect(opportunity.whyNow).toMatch(/^(emotional|resonance|alignment|coherence)/i);
      });
    });

    it('should prevent silent decay through proactive detection', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      // Validate decay prevention
      opportunities.forEach(opportunity => {
        // Check for proactive language
        expect(opportunity.description).toMatch(/^(prevent|avoid|mitigate|address|resolve)/i);
        
        // Validate risk assessment
        expect(opportunity.whyNow).toMatch(/^(risk|threat|vulnerability|exposure|decay)/i);
        
        // Ensure actionable prevention
        expect(opportunity.suggestedMove).toMatch(/^(implement|deploy|activate|initiate|launch)/i);
      });
    });

    it('should codify all strategic logic in opportunity detection', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        // Validate strategic logic codification
        expect(opportunity).toHaveProperty('type');
        expect(opportunity).toHaveProperty('confidence');
        expect(opportunity).toHaveProperty('description');
        expect(opportunity).toHaveProperty('whyNow');
        expect(opportunity).toHaveProperty('suggestedMove');
        
        // Validate logical consistency
        expect(opportunity.description).toMatch(new RegExp(opportunity.type.replace(/-/g, ' '), 'i'));
        expect(opportunity.whyNow).toMatch(new RegExp(opportunity.type.replace(/-/g, ' '), 'i'));
        expect(opportunity.suggestedMove).toMatch(new RegExp(opportunity.type.replace(/-/g, ' '), 'i'));
      });
    });

    it('should support AI copilot enhancement through clear interfaces', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        // Validate AI copilot support
        expect(opportunity.description).toMatch(/^(The|This|These|Our|We)/);
        expect(opportunity.description).toMatch(/[.!?]$/);
        expect(opportunity.whyNow).toMatch(/^(Because|Given|Since|As|When)/);
        expect(opportunity.suggestedMove).toMatch(/^(Implement|Integrate|Enhance|Optimize|Upgrade)/);
        
        // Validate structured data
        expect(typeof opportunity.type).toBe('string');
        expect(typeof opportunity.confidence).toBe('number');
        expect(typeof opportunity.description).toBe('string');
        expect(typeof opportunity.whyNow).toBe('string');
        expect(typeof opportunity.suggestedMove).toBe('string');
      });
    });

    it('should elevate precision as policy in opportunity detection', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        // Validate precision in descriptions
        expect(opportunity.description).toMatch(/^(We|Our|The|This|These)/);
        expect(opportunity.description).toMatch(/[.!?]$/);
        expect(opportunity.description.length).toBeGreaterThan(50);
        
        // Validate precision in whyNow
        expect(opportunity.whyNow).toMatch(/^(Because|Given|Since|As|When)/);
        expect(opportunity.whyNow).toContain('opportunity');
        
        // Validate precision in suggested moves
        expect(opportunity.suggestedMove).toMatch(/^(Implement|Integrate|Enhance|Optimize|Upgrade)/);
        expect(opportunity.suggestedMove).toMatch(/^(immediately|now|today|this sprint)/i);
      });
    });

    it('should de-risk everything through comprehensive validation', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        // Validate risk assessment
        expect(opportunity.description).toMatch(/^(prevent|avoid|mitigate|address|resolve)/i);
        expect(opportunity.whyNow).toMatch(/^(risk|threat|vulnerability|exposure|decay)/i);
        expect(opportunity.suggestedMove).toMatch(/^(implement|deploy|activate|initiate|launch)/i);
        
        // Validate comprehensive coverage
        expect(opportunity.description.length).toBeGreaterThan(50);
        expect(opportunity.whyNow.length).toBeGreaterThan(50);
        expect(opportunity.suggestedMove.length).toBeGreaterThan(50);
      });
    });

    it('should validate everything through rigorous checks', async () => {
      (runAudit as jest.Mock).mockResolvedValue({
        timestamp: Date.now(),
        modularityScore: 0.6,
        emotionalResonanceScore: 75,
        directiveCoverage: { total: 100, covered: 85, percent: 85, missing: ['directive1'] },
        uxConsistencyScore: 0.7,
        summary: []
      });

      const opportunities = await scanForOpportunities();

      opportunities.forEach(opportunity => {
        // Validate structure
        expect(opportunity).toHaveProperty('type');
        expect(opportunity).toHaveProperty('confidence');
        expect(opportunity).toHaveProperty('description');
        expect(opportunity).toHaveProperty('whyNow');
        expect(opportunity).toHaveProperty('suggestedMove');
        
        // Validate content
        expect(opportunity.description).toMatch(/^(We|Our|The|This|These)/);
        expect(opportunity.description).toMatch(/[.!?]$/);
        expect(opportunity.whyNow).toMatch(/^(Because|Given|Since|As|When)/);
        expect(opportunity.suggestedMove).toMatch(/^(Implement|Integrate|Enhance|Optimize|Upgrade)/);
        
        // Validate coherence
        expect(opportunity.description.toLowerCase()).toContain(opportunity.type.replace(/-/g, ' '));
        expect(opportunity.whyNow.toLowerCase()).toContain(opportunity.type.replace(/-/g, ' '));
        expect(opportunity.suggestedMove.toLowerCase()).toContain(opportunity.type.replace(/-/g, ' '));
      });
    });
  });
}); 