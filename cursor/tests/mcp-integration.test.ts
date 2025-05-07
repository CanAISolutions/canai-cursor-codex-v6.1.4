/**
 * mcp-integration.test.ts
 * 
 * Purpose:
 * Integration tests for all MCP files, covering validation,
 * scoring, fallback, and logging functionality.
 * 
 * TAP-Status: Locked
 * Codex: v6.1.4
 */

import { generateAIBlueprint } from '../../prompts/ai_blueprint.mcp';
import { generateBrandIdentity } from '../../prompts/ai_brand_identity.mcp';
import { generateEmailCampaign } from '../../prompts/email_campaign.mcp';
import { generateReverseStrategy } from '../../prompts/reverse_strategy.mcp';
import { generateSiteAudit } from '../../prompts/site_audit.mcp';
import { generateSocialContent } from '../../prompts/social_content.mcp';
import { generateBusinessPlan } from '../../prompts/business-plan.mcp';

describe('MCP Integration Tests', () => {
  // Test data
  const validInputs = {
    aiBlueprint: {
      industry: 'Technology',
      targetAudience: 'Enterprise',
      goals: ['Automation', 'Efficiency'],
      constraints: ['Budget', 'Timeline'],
      tone: 'professional'
    },
    brandIdentity: {
      companyName: 'TechCorp',
      industry: 'SaaS',
      targetAudience: 'B2B',
      values: ['Innovation', 'Trust'],
      tone: 'professional'
    },
    emailCampaign: {
      campaignGoal: 'Lead Generation',
      targetAudience: 'Decision Makers',
      keyMessage: 'Product Launch',
      callToAction: 'Schedule Demo',
      tone: 'professional'
    },
    reverseStrategy: {
      targetOutcome: 'Market Leadership',
      currentState: 'Growth Phase',
      constraints: ['Resources', 'Time'],
      timeline: '6 months',
      tone: 'strategic'
    },
    siteAudit: {
      siteUrl: 'https://example.com',
      auditType: 'Comprehensive',
      focusAreas: ['SEO', 'Performance'],
      goals: ['Optimization', 'Conversion'],
      tone: 'analytical'
    },
    socialContent: {
      platform: 'LinkedIn',
      contentType: 'Article',
      targetAudience: ['Professionals'],
      keyMessage: 'Industry Insights',
      tone: 'professional'
    },
    businessPlan: {
      businessType: 'SaaS',
      targetMarket: 'Enterprise',
      goals: ['Growth', 'Revenue'],
      constraints: ['Budget', 'Time'],
      tone: 'strategic'
    }
  };

  const invalidInputs = {
    aiBlueprint: {
      industry: '', // Missing required field
      targetAudience: 'Enterprise',
      goals: [], // Empty array
      constraints: ['Budget'],
      tone: 'invalid' // Invalid tone
    },
    brandIdentity: {
      companyName: '', // Missing required field
      industry: 'SaaS',
      targetAudience: '', // Missing required field
      values: [], // Empty array
      tone: 'invalid' // Invalid tone
    },
    emailCampaign: {
      campaignGoal: '', // Missing required field
      targetAudience: 'Decision Makers',
      keyMessage: '', // Missing required field
      callToAction: '', // Missing required field
      tone: 'invalid' // Invalid tone
    },
    reverseStrategy: {
      targetOutcome: '', // Missing required field
      currentState: '', // Missing required field
      constraints: [], // Empty array
      timeline: '', // Missing required field
      tone: 'invalid' // Invalid tone
    },
    siteAudit: {
      siteUrl: '', // Missing required field
      auditType: '', // Missing required field
      focusAreas: [], // Empty array
      goals: [], // Empty array
      tone: 'invalid' // Invalid tone
    },
    socialContent: {
      platform: '', // Missing required field
      contentType: '', // Missing required field
      targetAudience: [], // Empty array
      keyMessage: '', // Missing required field
      tone: 'invalid' // Invalid tone
    },
    businessPlan: {
      businessType: '', // Missing required field
      targetMarket: '', // Missing required field
      goals: [], // Empty array
      constraints: [], // Empty array
      tone: 'invalid' // Invalid tone
    }
  };

  // Test valid inputs
  describe('Valid Input Tests', () => {
    test('AI Blueprint - Valid Input', async () => {
      const result = await generateAIBlueprint(validInputs.aiBlueprint);
      expect(result.validationStatus.isValid).toBe(true);
      expect(result.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
      expect(result.output).toBeDefined();
    });

    test('Brand Identity - Valid Input', async () => {
      const result = await generateBrandIdentity(validInputs.brandIdentity);
      expect(result.validationStatus.isValid).toBe(true);
      expect(result.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
      expect(result.output).toBeDefined();
    });

    test('Email Campaign - Valid Input', async () => {
      const result = await generateEmailCampaign(validInputs.emailCampaign);
      expect(result.validationStatus.isValid).toBe(true);
      expect(result.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
      expect(result.output).toBeDefined();
    });

    test('Reverse Strategy - Valid Input', async () => {
      const result = await generateReverseStrategy(validInputs.reverseStrategy);
      expect(result.validationStatus.isValid).toBe(true);
      expect(result.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
      expect(result.output).toBeDefined();
    });

    test('Site Audit - Valid Input', async () => {
      const result = await generateSiteAudit(validInputs.siteAudit);
      expect(result.validationStatus.isValid).toBe(true);
      expect(result.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
      expect(result.output).toBeDefined();
    });

    test('Social Content - Valid Input', async () => {
      const result = await generateSocialContent(validInputs.socialContent);
      expect(result.validationStatus.isValid).toBe(true);
      expect(result.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
      expect(result.output).toBeDefined();
    });

    test('Business Plan - Valid Input', async () => {
      const result = await generateBusinessPlan(validInputs.businessPlan);
      expect(result.validationStatus.isValid).toBe(true);
      expect(result.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
      expect(result.output).toBeDefined();
    });
  });

  // Test invalid inputs
  describe('Invalid Input Tests', () => {
    test('AI Blueprint - Invalid Input', async () => {
      const result = await generateAIBlueprint(invalidInputs.aiBlueprint);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues.length).toBeGreaterThan(0);
      expect(result.metadata.trustScore).toBe(0);
    });

    test('Brand Identity - Invalid Input', async () => {
      const result = await generateBrandIdentity(invalidInputs.brandIdentity);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues.length).toBeGreaterThan(0);
      expect(result.metadata.trustScore).toBe(0);
    });

    test('Email Campaign - Invalid Input', async () => {
      const result = await generateEmailCampaign(invalidInputs.emailCampaign);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues.length).toBeGreaterThan(0);
      expect(result.metadata.trustScore).toBe(0);
    });

    test('Reverse Strategy - Invalid Input', async () => {
      const result = await generateReverseStrategy(invalidInputs.reverseStrategy);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues.length).toBeGreaterThan(0);
      expect(result.metadata.trustScore).toBe(0);
    });

    test('Site Audit - Invalid Input', async () => {
      const result = await generateSiteAudit(invalidInputs.siteAudit);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues.length).toBeGreaterThan(0);
      expect(result.metadata.trustScore).toBe(0);
    });

    test('Social Content - Invalid Input', async () => {
      const result = await generateSocialContent(invalidInputs.socialContent);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues.length).toBeGreaterThan(0);
      expect(result.metadata.trustScore).toBe(0);
    });

    test('Business Plan - Invalid Input', async () => {
      const result = await generateBusinessPlan(invalidInputs.businessPlan);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues.length).toBeGreaterThan(0);
      expect(result.metadata.trustScore).toBe(0);
    });
  });

  // Test scoring thresholds
  describe('Scoring Threshold Tests', () => {
    test('AI Blueprint - Scoring Threshold', async () => {
      const result = await generateAIBlueprint(validInputs.aiBlueprint);
      expect(result.score?.overall).toBeGreaterThanOrEqual(0.75);
      expect(result.empathyMetrics?.emotionalResonance).toBeGreaterThanOrEqual(0.7);
    });

    test('Brand Identity - Scoring Threshold', async () => {
      const result = await generateBrandIdentity(validInputs.brandIdentity);
      expect(result.score?.overall).toBeGreaterThanOrEqual(0.75);
      expect(result.empathyMetrics?.emotionalResonance).toBeGreaterThanOrEqual(0.7);
    });

    test('Email Campaign - Scoring Threshold', async () => {
      const result = await generateEmailCampaign(validInputs.emailCampaign);
      expect(result.score?.overall).toBeGreaterThanOrEqual(0.75);
      expect(result.empathyMetrics?.emotionalResonance).toBeGreaterThanOrEqual(0.7);
    });

    test('Reverse Strategy - Scoring Threshold', async () => {
      const result = await generateReverseStrategy(validInputs.reverseStrategy);
      expect(result.score?.overall).toBeGreaterThanOrEqual(0.75);
      expect(result.empathyMetrics?.emotionalResonance).toBeGreaterThanOrEqual(0.7);
    });

    test('Site Audit - Scoring Threshold', async () => {
      const result = await generateSiteAudit(validInputs.siteAudit);
      expect(result.score?.overall).toBeGreaterThanOrEqual(0.75);
      expect(result.empathyMetrics?.emotionalResonance).toBeGreaterThanOrEqual(0.7);
    });

    test('Social Content - Scoring Threshold', async () => {
      const result = await generateSocialContent(validInputs.socialContent);
      expect(result.score?.overall).toBeGreaterThanOrEqual(0.75);
      expect(result.empathyMetrics?.emotionalResonance).toBeGreaterThanOrEqual(0.7);
    });

    test('Business Plan - Scoring Threshold', async () => {
      const result = await generateBusinessPlan(validInputs.businessPlan);
      expect(result.score?.overall).toBeGreaterThanOrEqual(0.75);
      expect(result.empathyMetrics?.emotionalResonance).toBeGreaterThanOrEqual(0.7);
    });
  });

  // Test fallback trigger logic
  describe('Fallback Trigger Tests', () => {
    test('AI Blueprint - Fallback Trigger', async () => {
      const result = await generateAIBlueprint(invalidInputs.aiBlueprint);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.output).toBeUndefined();
    });

    test('Brand Identity - Fallback Trigger', async () => {
      const result = await generateBrandIdentity(invalidInputs.brandIdentity);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.output).toBeUndefined();
    });

    test('Email Campaign - Fallback Trigger', async () => {
      const result = await generateEmailCampaign(invalidInputs.emailCampaign);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.output).toBeUndefined();
    });

    test('Reverse Strategy - Fallback Trigger', async () => {
      const result = await generateReverseStrategy(invalidInputs.reverseStrategy);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.output).toBeUndefined();
    });

    test('Site Audit - Fallback Trigger', async () => {
      const result = await generateSiteAudit(invalidInputs.siteAudit);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.output).toBeUndefined();
    });

    test('Social Content - Fallback Trigger', async () => {
      const result = await generateSocialContent(invalidInputs.socialContent);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.output).toBeUndefined();
    });

    test('Business Plan - Fallback Trigger', async () => {
      const result = await generateBusinessPlan(invalidInputs.businessPlan);
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.output).toBeUndefined();
    });
  });

  // Test log write confirmation
  describe('Log Write Tests', () => {
    test('AI Blueprint - Log Write', async () => {
      const result = await generateAIBlueprint(validInputs.aiBlueprint);
      expect(result.metadata.timestamp).toBeDefined();
      expect(result.validationStatus.issues).toBeDefined();
      expect(result.score).toBeDefined();
      expect(result.empathyMetrics).toBeDefined();
    });

    test('Brand Identity - Log Write', async () => {
      const result = await generateBrandIdentity(validInputs.brandIdentity);
      expect(result.metadata.timestamp).toBeDefined();
      expect(result.validationStatus.issues).toBeDefined();
      expect(result.score).toBeDefined();
      expect(result.empathyMetrics).toBeDefined();
    });

    test('Email Campaign - Log Write', async () => {
      const result = await generateEmailCampaign(validInputs.emailCampaign);
      expect(result.metadata.timestamp).toBeDefined();
      expect(result.validationStatus.issues).toBeDefined();
      expect(result.score).toBeDefined();
      expect(result.empathyMetrics).toBeDefined();
    });

    test('Reverse Strategy - Log Write', async () => {
      const result = await generateReverseStrategy(validInputs.reverseStrategy);
      expect(result.metadata.timestamp).toBeDefined();
      expect(result.validationStatus.issues).toBeDefined();
      expect(result.score).toBeDefined();
      expect(result.empathyMetrics).toBeDefined();
    });

    test('Site Audit - Log Write', async () => {
      const result = await generateSiteAudit(validInputs.siteAudit);
      expect(result.metadata.timestamp).toBeDefined();
      expect(result.validationStatus.issues).toBeDefined();
      expect(result.score).toBeDefined();
      expect(result.empathyMetrics).toBeDefined();
    });

    test('Social Content - Log Write', async () => {
      const result = await generateSocialContent(validInputs.socialContent);
      expect(result.metadata.timestamp).toBeDefined();
      expect(result.validationStatus.issues).toBeDefined();
      expect(result.score).toBeDefined();
      expect(result.empathyMetrics).toBeDefined();
    });

    test('Business Plan - Log Write', async () => {
      const result = await generateBusinessPlan(validInputs.businessPlan);
      expect(result.metadata.timestamp).toBeDefined();
      expect(result.validationStatus.issues).toBeDefined();
      expect(result.score).toBeDefined();
      expect(result.empathyMetrics).toBeDefined();
    });
  });
}); 