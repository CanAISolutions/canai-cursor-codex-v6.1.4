import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { 
  EventBus,
  emitSystemLog,
  SystemLogLevel 
} from '../../cursor/event-bus';
import { 
  MakeWebhookTester, 
  WebhookTestResult 
} from '../../api/services/make-webhook-tester';

// Initialize dependencies
// Create a mock EventBus since the real one may have a private constructor
const eventBus = {
  emit: (event: string, data: any) => {
    // Mock implementation that logs to console during tests
    console.log(`Event emitted: ${event}`, data);
  }
} as EventBus;

/**
 * Make.com Scenarios Integration Tests
 * 
 * This test suite verifies the integration between our API and Make.com scenarios,
 * focusing on webhook functionality and data flow validation.
 * 
 * These tests implement the Test-First Truth principle by providing evidence
 * of proper webhook reception, data processing, and end-to-end flows.
 */
describe('Make.com Scenarios Integration', () => {
  // Create webhook tester instance
  const webhookTester = new MakeWebhookTester({
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    eventBus
  });

  beforeAll(async () => {
    // Set up test environment
    await webhookTester.initialize();
    emitSystemLog({
      level: SystemLogLevel.INFO,
      message: 'Make.com Scenario Integration Test Suite initialized',
      context: {
        testSuite: 'make-scenario-verification',
        timestamp: new Date().toISOString()
      }
    }, eventBus);
  });

  afterAll(async () => {
    // Clean up test environment
    await webhookTester.cleanup();
  });

  describe('Webhook Endpoints', () => {
    test('should successfully receive and process memberstack webhook', async () => {
      // Arrange
      const testUuid = uuidv4();
      const payload = {
        id: testUuid,
        auth: { 
          email: `test-${testUuid}@example.com` 
        },
        customFields: {
          name: `Test Client ${testUuid}`,
          'profile-pic-url': 'https://example.com/profile.png'
        },
        metaData: {
          'last-updated': new Date().toISOString()
        }
      };
      
      // Act
      const result: WebhookTestResult = await webhookTester.testWebhook({
        endpoint: '/api/webhook/memberstack',
        payload,
        expectedResponseCode: 200,
        timeoutMs: 5000
      });
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.responseTime).toBeLessThan(2000); // Response time < 2 seconds
      expect(result.processingComplete).toBe(true);
      expect(result.dataFlowVerified).toBe(true);
    });

    test('should successfully receive and process webflow webhook', async () => {
      // Arrange
      const testUuid = uuidv4();
      const payload = {
        projectId: testUuid,
        name: `Test Project ${testUuid}`,
        description: 'Test project description',
        created: new Date().toISOString(),
        owner: `test-${testUuid}@example.com`
      };
      
      // Act
      const result: WebhookTestResult = await webhookTester.testWebhook({
        endpoint: '/api/webhook/webflow',
        payload,
        expectedResponseCode: 200,
        timeoutMs: 5000
      });
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.responseTime).toBeLessThan(2000);
      expect(result.processingComplete).toBe(true);
      expect(result.dataFlowVerified).toBe(true);
    });

    test('should successfully receive and process admin webhook', async () => {
      // Arrange
      const testUuid = uuidv4();
      const payload = {
        adminId: 'admin-1',
        action: 'create_project',
        projectData: {
          projectId: testUuid,
          name: `Admin Project ${testUuid}`,
          description: 'Admin created project',
          created: new Date().toISOString()
        }
      };
      
      // Act
      const result: WebhookTestResult = await webhookTester.testWebhook({
        endpoint: '/api/webhook/admin',
        payload,
        expectedResponseCode: 200,
        timeoutMs: 5000
      });
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.responseTime).toBeLessThan(2000);
      expect(result.processingComplete).toBe(true);
      expect(result.dataFlowVerified).toBe(true);
    });

    test('should successfully receive and process blueprint webhook', async () => {
      // Arrange
      const testUuid = uuidv4();
      const payload = {
        projectId: testUuid,
        blueprintId: `blueprint-${testUuid}`,
        updates: {
          title: 'Updated Blueprint Title',
          sections: ['section1', 'section2'],
          lastModified: new Date().toISOString()
        }
      };
      
      // Act
      const result: WebhookTestResult = await webhookTester.testWebhook({
        endpoint: '/api/webhook/blueprint',
        payload,
        expectedResponseCode: 200,
        timeoutMs: 5000
      });
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.responseTime).toBeLessThan(2000);
      expect(result.processingComplete).toBe(true);
      expect(result.dataFlowVerified).toBe(true);
    });
  });

  describe('Data Flow Validation', () => {
    test('should correctly flow data from Memberstack to Webflow via Make.com', async () => {
      // Arrange
      const testUuid = uuidv4();
      const clientData = {
        id: testUuid,
        name: `Data Flow Test Client ${testUuid}`,
        email: `dataflow-${testUuid}@example.com`,
        logo: 'https://example.com/logo.png'
      };
      
      // Act
      const result = await webhookTester.testDataFlow({
        sourceSystem: 'memberstack',
        destinationSystem: 'webflow',
        testData: clientData,
        flowName: 'client_creation',
        timeoutMs: 10000
      });
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.dataIntegrity).toBe(true);
      expect(result.transformationAccuracy).toBeGreaterThanOrEqual(0.95);
      expect(result.flowTime).toBeLessThan(5000);
    });
    
    test('should correctly flow data from Webflow to API via Make.com', async () => {
      // Arrange
      const testUuid = uuidv4();
      const projectData = {
        id: testUuid,
        name: `Data Flow Test Project ${testUuid}`,
        description: 'Data flow test project',
        created: new Date().toISOString()
      };
      
      // Act
      const result = await webhookTester.testDataFlow({
        sourceSystem: 'webflow',
        destinationSystem: 'api',
        testData: projectData,
        flowName: 'project_creation',
        timeoutMs: 10000
      });
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.dataIntegrity).toBe(true);
      expect(result.transformationAccuracy).toBeGreaterThanOrEqual(0.95);
      expect(result.flowTime).toBeLessThan(5000);
    });

    test('should correctly flow data from API to Analytics via Make.com', async () => {
      // Arrange
      const testUuid = uuidv4();
      const analyticsData = {
        eventId: testUuid,
        eventType: 'test_event',
        timestamp: new Date().toISOString(),
        userId: `user-${testUuid}`,
        properties: {
          action: 'verify',
          component: 'make-scenario',
          result: 'success'
        }
      };
      
      // Act
      const result = await webhookTester.testDataFlow({
        sourceSystem: 'api',
        destinationSystem: 'analytics',
        testData: analyticsData,
        flowName: 'analytics_logging',
        timeoutMs: 10000
      });
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.dataIntegrity).toBe(true);
      expect(result.transformationAccuracy).toBeGreaterThanOrEqual(0.95);
      expect(result.flowTime).toBeLessThan(5000);
    });

    test('should correctly flow data from Stripe to CRM via Make.com', async () => {
      // Arrange
      const testUuid = uuidv4();
      const stripeData = {
        eventId: `evt_${testUuid}`,
        type: 'customer.subscription.created',
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: `sub_${testUuid}`,
            customer: `cus_${testUuid}`,
            plan: {
              id: 'plan_premium',
              nickname: 'Premium Plan'
            },
            current_period_start: Math.floor(Date.now() / 1000),
            current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
          }
        }
      };
      
      // Act
      const result = await webhookTester.testDataFlow({
        sourceSystem: 'stripe',
        destinationSystem: 'crm',
        testData: stripeData,
        flowName: 'subscription_creation',
        timeoutMs: 10000
      });
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.dataIntegrity).toBe(true);
      expect(result.transformationAccuracy).toBeGreaterThanOrEqual(0.95);
      expect(result.flowTime).toBeLessThan(5000);
    });
  });

  describe('Error Handling', () => {
    test('should handle webhook timeout correctly', async () => {
      // Arrange
      const testUuid = uuidv4();
      const payload = {
        id: testUuid,
        simulateTimeout: true
      };
      
      // Act
      const result = await webhookTester.testErrorScenario({
        scenario: 'timeout',
        endpoint: '/api/webhook/memberstack',
        payload,
        timeoutMs: 2000
      });
      
      // Assert
      expect(result.errorDetected).toBe(true);
      expect(result.errorHandled).toBe(true);
      expect(result.retryAttempted).toBe(true);
      expect(result.recoverySuccessful).toBe(true);
    });

    test('should handle invalid data correctly', async () => {
      // Arrange
      const testUuid = uuidv4();
      const payload = {
        id: testUuid,
        // Missing required fields to trigger validation error
        invalidData: true
      };
      
      // Act
      const result = await webhookTester.testErrorScenario({
        scenario: 'invalid_data',
        endpoint: '/api/webhook/webflow',
        payload,
        timeoutMs: 5000
      });
      
      // Assert
      expect(result.errorDetected).toBe(true);
      expect(result.errorHandled).toBe(true);
      expect(result.validationErrorReported).toBe(true);
      expect(result.recoverySuccessful).toBe(true);
    });

    test('should handle API failure correctly', async () => {
      // Arrange
      const testUuid = uuidv4();
      const payload = {
        id: testUuid,
        simulateApiFailure: true
      };
      
      // Act
      const result = await webhookTester.testErrorScenario({
        scenario: 'api_failure',
        endpoint: '/api/webhook/admin',
        payload,
        timeoutMs: 5000
      });
      
      // Assert
      expect(result.errorDetected).toBe(true);
      expect(result.errorHandled).toBe(true);
      expect(result.fallbackProcessExecuted).toBe(true);
      expect(result.recoverySuccessful).toBe(true);
    });

    test('should handle authentication error correctly', async () => {
      // Arrange
      const testUuid = uuidv4();
      const payload = {
        id: testUuid,
        simulateAuthError: true
      };
      
      // Act
      const result = await webhookTester.testErrorScenario({
        scenario: 'auth_error',
        endpoint: '/api/webhook/blueprint',
        payload,
        timeoutMs: 5000
      });
      
      // Assert
      expect(result.errorDetected).toBe(true);
      expect(result.errorHandled).toBe(true);
      expect(result.securityProtocolsTriggered).toBe(true);
      expect(result.recoverySuccessful).toBe(true);
    });
  });
}); 