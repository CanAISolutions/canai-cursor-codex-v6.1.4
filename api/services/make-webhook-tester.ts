import { EventBus } from '../../cursor/event-bus';
import fetch from 'node-fetch';

/**
 * Interface for webhook test options
 */
export interface WebhookTestOptions {
  endpoint: string;
  payload: any;
  expectedResponseCode: number;
  timeoutMs: number;
}

/**
 * Interface for webhook test results
 */
export interface WebhookTestResult {
  success: boolean;
  responseTime: number;
  statusCode: number;
  processingComplete: boolean;
  dataFlowVerified: boolean;
  errors?: string[];
}

/**
 * Interface for data flow test options
 */
export interface DataFlowTestOptions {
  sourceSystem: 'memberstack' | 'webflow' | 'api' | 'stripe';
  destinationSystem: 'webflow' | 'api' | 'analytics' | 'crm';
  testData: any;
  flowName: string;
  timeoutMs: number;
}

/**
 * Interface for data flow test results
 */
export interface DataFlowTestResult {
  success: boolean;
  dataIntegrity: boolean;
  transformationAccuracy: number;
  flowTime: number;
  errors?: string[];
}

/**
 * Interface for error scenario test options
 */
export interface ErrorScenarioTestOptions {
  scenario: 'timeout' | 'invalid_data' | 'api_failure' | 'auth_error';
  endpoint: string;
  payload: any;
  timeoutMs: number;
}

/**
 * Interface for error scenario test results
 */
export interface ErrorScenarioTestResult {
  errorDetected: boolean;
  errorHandled: boolean;
  retryAttempted?: boolean;
  validationErrorReported?: boolean;
  fallbackProcessExecuted?: boolean;
  securityProtocolsTriggered?: boolean;
  recoverySuccessful: boolean;
  errors?: string[];
}

/**
 * Interface for MakeWebhookTester constructor options
 */
export interface MakeWebhookTesterOptions {
  baseUrl: string;
  eventBus: EventBus;
}

/**
 * MakeWebhookTester class for testing Make.com scenarios
 * 
 * This class provides methods to test webhook endpoints, data flows,
 * and error handling for Make.com scenarios. It implements the Test-First
 * Truth principle by providing direct evidence of webhook functionality.
 */
export class MakeWebhookTester {
  private baseUrl: string;
  private eventBus: EventBus;
  private testEnvironmentReady: boolean = false;

  /**
   * Constructor for MakeWebhookTester
   * 
   * @param options Configuration options
   */
  constructor(options: MakeWebhookTesterOptions) {
    this.baseUrl = options.baseUrl;
    this.eventBus = options.eventBus;
  }

  /**
   * Initialize the test environment
   * 
   * @returns Promise that resolves when initialization is complete
   */
  public async initialize(): Promise<void> {
    // Set up test environment, reset state, and prepare for testing
    try {
      const response = await fetch(`${this.baseUrl}/api/test/initialize-webhook-testing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        this.testEnvironmentReady = true;
        this.eventBus.emit('make.test.initialized', { 
          timestamp: new Date().toISOString(),
          success: true
        });
      } else {
        throw new Error(`Failed to initialize test environment: ${response.statusText}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.eventBus.emit('make.test.error', { 
        phase: 'initialization',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Clean up the test environment
   * 
   * @returns Promise that resolves when cleanup is complete
   */
  public async cleanup(): Promise<void> {
    // Clean up test environment and reset state
    try {
      const response = await fetch(`${this.baseUrl}/api/test/cleanup-webhook-testing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        this.testEnvironmentReady = false;
        this.eventBus.emit('make.test.cleaned', { 
          timestamp: new Date().toISOString(),
          success: true
        });
      } else {
        throw new Error(`Failed to clean up test environment: ${response.statusText}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.eventBus.emit('make.test.error', { 
        phase: 'cleanup',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Test a webhook endpoint
   * 
   * @param options Webhook test options
   * @returns Promise that resolves to webhook test results
   */
  public async testWebhook(options: WebhookTestOptions): Promise<WebhookTestResult> {
    this.ensureTestEnvironmentReady();
    
    try {
      // Start timer for response time measurement
      const startTime = Date.now();
      
      // Send request to webhook endpoint
      const response = await fetch(`${this.baseUrl}${options.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Mode': 'true'
        },
        body: JSON.stringify(options.payload)
      });
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      
      // Get processing status from test API
      const processingStatus = await this.getProcessingStatus(options.endpoint, options.payload.id);
      
      const result: WebhookTestResult = {
        success: response.status === options.expectedResponseCode,
        responseTime,
        statusCode: response.status,
        processingComplete: processingStatus.complete,
        dataFlowVerified: processingStatus.dataFlowVerified
      };
      
      if (!result.success) {
        result.errors = [`Expected status code ${options.expectedResponseCode} but got ${response.status}`];
      }
      
      this.eventBus.emit('make.test.webhook', { 
        endpoint: options.endpoint,
        result,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.eventBus.emit('make.test.error', { 
        phase: 'webhook',
        endpoint: options.endpoint,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: false,
        responseTime: 0,
        statusCode: 500,
        processingComplete: false,
        dataFlowVerified: false,
        errors: [errorMessage]
      };
    }
  }

  /**
   * Test a data flow between systems
   * 
   * @param options Data flow test options
   * @returns Promise that resolves to data flow test results
   */
  public async testDataFlow(options: DataFlowTestOptions): Promise<DataFlowTestResult> {
    this.ensureTestEnvironmentReady();
    
    try {
      // Start timer for flow time measurement
      const startTime = Date.now();
      
      // Initiate data flow test
      const response = await fetch(`${this.baseUrl}/api/test/data-flow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceSystem: options.sourceSystem,
          destinationSystem: options.destinationSystem,
          testData: options.testData,
          flowName: options.flowName
        })
      });
      
      if (!response.ok) {
        throw new Error(`Data flow test failed: ${response.statusText}`);
      }
      
      // Get data flow results
      const flowResult = await response.json();
      
      // Calculate flow time
      const flowTime = Date.now() - startTime;
      
      const result: DataFlowTestResult = {
        success: flowResult.success,
        dataIntegrity: flowResult.dataIntegrity,
        transformationAccuracy: flowResult.transformationAccuracy,
        flowTime
      };
      
      if (!result.success) {
        result.errors = flowResult.errors;
      }
      
      this.eventBus.emit('make.test.dataFlow', { 
        flowName: options.flowName,
        result,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.eventBus.emit('make.test.error', { 
        phase: 'dataFlow',
        flowName: options.flowName,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: false,
        dataIntegrity: false,
        transformationAccuracy: 0,
        flowTime: 0,
        errors: [errorMessage]
      };
    }
  }

  /**
   * Test an error scenario
   * 
   * @param options Error scenario test options
   * @returns Promise that resolves to error scenario test results
   */
  public async testErrorScenario(options: ErrorScenarioTestOptions): Promise<ErrorScenarioTestResult> {
    this.ensureTestEnvironmentReady();
    
    try {
      // Initiate error scenario test
      const response = await fetch(`${this.baseUrl}/api/test/error-scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: options.scenario,
          endpoint: options.endpoint,
          payload: options.payload
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error scenario test failed: ${response.statusText}`);
      }
      
      // Get error scenario results
      const errorResult = await response.json();
      
      // Create result object based on scenario type
      const result: ErrorScenarioTestResult = {
        errorDetected: errorResult.errorDetected,
        errorHandled: errorResult.errorHandled,
        recoverySuccessful: errorResult.recoverySuccessful
      };
      
      // Add scenario-specific properties
      switch (options.scenario) {
        case 'timeout':
          result.retryAttempted = errorResult.retryAttempted;
          break;
        case 'invalid_data':
          result.validationErrorReported = errorResult.validationErrorReported;
          break;
        case 'api_failure':
          result.fallbackProcessExecuted = errorResult.fallbackProcessExecuted;
          break;
        case 'auth_error':
          result.securityProtocolsTriggered = errorResult.securityProtocolsTriggered;
          break;
      }
      
      if (!result.errorDetected || !result.errorHandled) {
        result.errors = errorResult.errors;
      }
      
      this.eventBus.emit('make.test.errorScenario', { 
        scenario: options.scenario,
        result,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.eventBus.emit('make.test.error', { 
        phase: 'errorScenario',
        scenario: options.scenario,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      return {
        errorDetected: false,
        errorHandled: false,
        recoverySuccessful: false,
        errors: [errorMessage]
      };
    }
  }

  /**
   * Get processing status for a webhook request
   * 
   * @param endpoint Webhook endpoint
   * @param id Request ID
   * @returns Promise that resolves to processing status
   */
  private async getProcessingStatus(endpoint: string, id: string): Promise<{complete: boolean, dataFlowVerified: boolean}> {
    try {
      const response = await fetch(`${this.baseUrl}/api/test/processing-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint, id })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get processing status: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.eventBus.emit('make.test.error', { 
        phase: 'processingStatus',
        endpoint,
        id,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      return { complete: false, dataFlowVerified: false };
    }
  }

  /**
   * Ensure test environment is ready
   * 
   * @throws Error if test environment is not ready
   */
  private ensureTestEnvironmentReady(): void {
    if (!this.testEnvironmentReady) {
      throw new Error('Test environment is not ready. Call initialize() first.');
    }
  }
} 