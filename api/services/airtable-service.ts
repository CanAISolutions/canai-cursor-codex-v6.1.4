/**
 * Airtable Service Layer for CanAI Emotional Intelligence Platform
 * 
 * Comprehensive service layer providing type-safe operations for all 18 optimized tables
 * in the revolutionary emotional intelligence infrastructure.
 * 
 * @version 2.0.0 - 18-Table Optimized Architecture
 * @author CanAI Codex v6.1.4
 * @trust_score 4.7
 */

import {
  AirtableConfig,
  AirtableRecord,
  AirtableResponse,
  AirtableFieldValue,
  CreateRecordRequest,
  UpdateRecordRequest,
  QueryOptions,
  BulkOperationResult,
  TableName,
  AIRTABLE_TABLES,
  AirtableError,
  RateLimitError,
  ValidationError,
  
  // Type imports for all 18 optimized tables
  SparkSplitAnalytics,
  TrustMetrics,
  TrustEvolution,
  EmotionalCompass,
  PromptLogs,
  SessionAnalytics,
  UserContext,
  OutputGoldmine,
  PredictiveInsights,
  RevenueAttribution,
  ConversionFunnels,
  GrowthMetrics,
  EmotionalIntelligence,
  EmotionalJourney,
  SentimentAnalysis,
  BehavioralPatterns,
  SystemEvolution,
  MetaIntelligence,
  InnovationMetrics,
  FutureInsights,
  FeedbackLogs,
  DeliveryCostLogs,
  ReferralTriggers,
  AIMiningAgents
} from '../types/airtable';

// Helper type to make interfaces compatible with Airtable field constraints
type AirtableCompatible<T> = T & Record<string, AirtableFieldValue>;

/**
 * Main Airtable service class providing comprehensive API operations
 * for the emotional intelligence platform infrastructure.
 */
export class AirtableService {
  private config: Required<AirtableConfig>;
  private lastRequestTime: number = 0;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue: boolean = false;

  constructor(config: AirtableConfig) {
    // Set default configuration values
    this.config = {
      baseId: config.baseId,
      apiKey: config.apiKey,
      rateLimitMs: config.rateLimitMs || 200, // 5 requests per second
      retryAttempts: config.retryAttempts || 3,
      timeout: config.timeout || 30000 // 30 seconds
    };

    this.validateConfig();
  }

  /**
   * Validates the Airtable configuration
   */
  private validateConfig(): void {
    if (!this.config.baseId) {
      throw new ValidationError('baseId', this.config.baseId, 'non-empty string');
    }
    if (!this.config.apiKey) {
      throw new ValidationError('apiKey', this.config.apiKey, 'non-empty string');
    }
    if (!this.config.baseId.startsWith('app')) {
      throw new ValidationError('baseId', this.config.baseId, 'Airtable base ID starting with "app"');
    }
    if (!this.config.apiKey.startsWith('pat')) {
      throw new ValidationError('apiKey', this.config.apiKey, 'Airtable personal access token starting with "pat"');
    }
  }

  /**
   * Makes a rate-limited HTTP request to the Airtable API
   */
  private async makeRequest<T = any>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.executeRequest<T>(method, endpoint, data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  /**
   * Processes the request queue with rate limiting
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (!request) continue;

      // Enforce rate limiting
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      if (timeSinceLastRequest < this.config.rateLimitMs) {
        await this.sleep(this.config.rateLimitMs - timeSinceLastRequest);
      }

      this.lastRequestTime = Date.now();
      await request();
    }

    this.isProcessingQueue = false;
  }

  /**
   * Executes the actual HTTP request with retry logic
   */
  private async executeRequest<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    attempt: number = 1
  ): Promise<T> {
    const url = `https://api.airtable.com/v0/${this.config.baseId}/${endpoint}`;
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.config.timeout)
    };

    if (data && (method === 'POST' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        await this.handleErrorResponse(response, attempt, method, endpoint, data);
      }

      const result = await response.json();
      return result as T;
    } catch (error) {
      if (attempt < this.config.retryAttempts) {
        await this.sleep(Math.pow(2, attempt) * 1000); // Exponential backoff
        return this.executeRequest<T>(method, endpoint, data, attempt + 1);
      }
      throw new AirtableError(`Request failed after ${this.config.retryAttempts} attempts: ${error}`);
    }
  }

  /**
   * Handles error responses from the Airtable API
   */
  private async handleErrorResponse(
    response: Response,
    attempt: number,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<never> {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      // Ignore JSON parsing errors
    }
    
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '30');
      if (attempt < this.config.retryAttempts) {
        await this.sleep(retryAfter * 1000);
        return this.executeRequest(method, endpoint, data, attempt + 1);
      }
      throw new RateLimitError(retryAfter);
    }

    throw new AirtableError(
      errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData?.error?.type
    );
  }

  /**
   * Utility function for sleeping/delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validates field data against expected types
   */
  private validateFields<T>(fields: T, tableName: string): void {
    if (!fields || typeof fields !== 'object') {
      throw new ValidationError('fields', fields, 'object');
    }

    // Additional validation logic can be added here for specific field types
    // This is a basic implementation that can be extended
  }

  // ===== GENERIC CRUD OPERATIONS =====

  /**
   * Creates a new record in the specified table
   */
  async createRecord<T extends Record<string, AirtableFieldValue>>(
    tableName: TableName,
    fields: T
  ): Promise<AirtableRecord<T>> {
    this.validateFields(fields, tableName);
    
    const data = { fields };
    const response = await this.makeRequest<{ id: string; fields: T; createdTime: string }>(
      'POST',
      tableName,
      data
    );

    return {
      id: response.id,
      fields: response.fields,
      createdTime: response.createdTime
    };
  }

  /**
   * Retrieves records from the specified table
   */
  async getRecords<T extends Record<string, AirtableFieldValue>>(
    tableName: TableName,
    options?: QueryOptions
  ): Promise<AirtableResponse<T>> {
    let endpoint = tableName;
    
    if (options) {
      const params = new URLSearchParams();
      
      if (options.filterByFormula) params.append('filterByFormula', options.filterByFormula);
      if (options.maxRecords) params.append('maxRecords', options.maxRecords.toString());
      if (options.pageSize) params.append('pageSize', options.pageSize.toString());
      if (options.view) params.append('view', options.view);
      if (options.offset) params.append('offset', options.offset);
      
      if (options.sort) {
        options.sort.forEach((sort, index) => {
          params.append(`sort[${index}][field]`, sort.field);
          params.append(`sort[${index}][direction]`, sort.direction);
        });
      }

      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return this.makeRequest<AirtableResponse<T>>('GET', endpoint);
  }

  /**
   * Retrieves a single record by ID
   */
  async getRecord<T extends Record<string, AirtableFieldValue>>(
    tableName: TableName,
    recordId: string
  ): Promise<AirtableRecord<T>> {
    return this.makeRequest<AirtableRecord<T>>('GET', `${tableName}/${recordId}`);
  }

  /**
   * Updates an existing record
   */
  async updateRecord<T extends Record<string, AirtableFieldValue>>(
    tableName: TableName,
    recordId: string,
    fields: Partial<T>
  ): Promise<AirtableRecord<T>> {
    this.validateFields(fields, tableName);
    
    const data = { fields };
    return this.makeRequest<AirtableRecord<T>>('PATCH', `${tableName}/${recordId}`, data);
  }

  /**
   * Deletes a record
   */
  async deleteRecord(tableName: TableName, recordId: string): Promise<{ deleted: boolean; id: string }> {
    return this.makeRequest<{ deleted: boolean; id: string }>('DELETE', `${tableName}/${recordId}`);
  }

  /**
   * Creates multiple records in batch
   */
  async createRecords<T extends Record<string, AirtableFieldValue>>(
    tableName: TableName,
    records: Array<{ fields: T }>
  ): Promise<BulkOperationResult> {
    const batchSize = 10; // Airtable limit
    const results: BulkOperationResult = { successful: 0, failed: 0, errors: [] };

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      try {
        const response = await this.makeRequest<{ records: AirtableRecord<T>[] }>(
          'POST',
          tableName,
          { records: batch }
        );
        results.successful += response.records.length;
      } catch (error) {
        results.failed += batch.length;
        results.errors.push({
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  // ===== SPECIALIZED METHODS FOR KEY TABLES =====

  /**
   * Creates a new session log entry with trust and emotional intelligence scoring
   */
  async logSession(sessionData: Omit<PromptLogs, 'timestamp'>): Promise<AirtableRecord<AirtableCompatible<PromptLogs>>> {
    const fields: AirtableCompatible<PromptLogs> = {
      ...sessionData,
      timestamp: new Date()
    } as AirtableCompatible<PromptLogs>;

    return this.createRecord(AIRTABLE_TABLES.PROMPT_LOGS, fields);
  }

  /**
   * Updates trust metrics for a user
   */
  async updateTrustMetrics(userId: string, trustData: Partial<TrustMetrics>): Promise<AirtableRecord<AirtableCompatible<TrustMetrics>>> {
    // First, try to find existing record
    const existingRecords = await this.getRecords<AirtableCompatible<TrustMetrics>>(
      AIRTABLE_TABLES.TRUST_METRICS,
      { filterByFormula: `{user_id} = "${userId}"` }
    );

    const fields: AirtableCompatible<TrustMetrics> = {
      user_id: userId,
      last_updated: new Date(),
      ...trustData
    } as AirtableCompatible<TrustMetrics>;

    if (existingRecords.records.length > 0) {
      // Update existing record
      return this.updateRecord(AIRTABLE_TABLES.TRUST_METRICS, existingRecords.records[0].id, fields);
    } else {
      // Create new record
      return this.createRecord(AIRTABLE_TABLES.TRUST_METRICS, fields);
    }
  }

  /**
   * Records a trust evolution event
   */
  async recordTrustEvolution(evolutionData: TrustEvolution): Promise<AirtableRecord<AirtableCompatible<TrustEvolution>>> {
    const fields: AirtableCompatible<TrustEvolution> = {
      ...evolutionData,
      timestamp: new Date()
    } as AirtableCompatible<TrustEvolution>;

    return this.createRecord(AIRTABLE_TABLES.TRUST_METRICS, fields);
  }

  /**
   * Creates a SparkSplit analytics entry for trust transparency
   */
  async createSparkSplitAnalytics(analyticsData: SparkSplitAnalytics): Promise<AirtableRecord<AirtableCompatible<SparkSplitAnalytics>>> {
    return this.createRecord(AIRTABLE_TABLES.SPARK_SPLIT_ANALYTICS, analyticsData as AirtableCompatible<SparkSplitAnalytics>);
  }

  /**
   * Updates user context with emotional and behavioral insights
   */
  async updateUserContext(userId: string, contextData: Partial<UserContext>): Promise<AirtableRecord<AirtableCompatible<UserContext>>> {
    const existingRecords = await this.getRecords<AirtableCompatible<UserContext>>(
      AIRTABLE_TABLES.USER_CONTEXT,
      { filterByFormula: `{user_id} = "${userId}"` }
    );

    const fields: AirtableCompatible<UserContext> = {
      user_id: userId,
      ...contextData
    } as AirtableCompatible<UserContext>;

    if (existingRecords.records.length > 0) {
      return this.updateRecord(AIRTABLE_TABLES.USER_CONTEXT, existingRecords.records[0].id, fields);
    } else {
      return this.createRecord(AIRTABLE_TABLES.USER_CONTEXT, fields);
    }
  }

  /**
   * Records system evolution and meta-learning insights
   */
  async recordSystemEvolution(evolutionData: Omit<SystemEvolution, 'timestamp'>): Promise<AirtableRecord<AirtableCompatible<SystemEvolution>>> {
    const fields: AirtableCompatible<SystemEvolution> = {
      ...evolutionData,
      timestamp: new Date()
    } as AirtableCompatible<SystemEvolution>;

    return this.createRecord(AIRTABLE_TABLES.SYSTEM_EVOLUTION, fields);
  }

  /**
   * Captures compound intelligence in the output goldmine
   */
  async captureOutputGoldmine(goldmineData: OutputGoldmine): Promise<AirtableRecord<AirtableCompatible<OutputGoldmine>>> {
    return this.createRecord(AIRTABLE_TABLES.GOLDMINE_OUTPUT, goldmineData as AirtableCompatible<OutputGoldmine>);
  }

  // ===== ANALYTICS AND INSIGHTS METHODS =====

  /**
   * Gets trust analytics for a user over time
   */
  async getTrustAnalytics(userId: string, timeRange?: { start: Date; end: Date }): Promise<{
    currentMetrics: TrustMetrics | null;
    evolution: TrustEvolution[];
    sparkSplitAnalytics: SparkSplitAnalytics[];
  }> {
    // Get current trust metrics
    const metricsResponse = await this.getRecords<AirtableCompatible<TrustMetrics>>(
      AIRTABLE_TABLES.TRUST_METRICS,
      { filterByFormula: `{user_id} = "${userId}"` }
    );

    // Get trust evolution history
    let evolutionFilter = `{user_id} = "${userId}"`;
    if (timeRange) {
      evolutionFilter += ` AND {timestamp} >= "${timeRange.start.toISOString()}" AND {timestamp} <= "${timeRange.end.toISOString()}"`;
    }

    const evolutionResponse = await this.getRecords<AirtableCompatible<TrustEvolution>>(
      AIRTABLE_TABLES.TRUST_METRICS,
      { 
        filterByFormula: evolutionFilter,
        sort: [{ field: 'timestamp', direction: 'desc' }]
      }
    );

    // Get SparkSplit analytics
    const sparkSplitResponse = await this.getRecords<AirtableCompatible<SparkSplitAnalytics>>(
      AIRTABLE_TABLES.SPARK_SPLIT_ANALYTICS,
      { filterByFormula: `{user_id} = "${userId}"` }
    );

    return {
      currentMetrics: metricsResponse.records[0]?.fields || null,
      evolution: evolutionResponse.records.map(r => r.fields),
      sparkSplitAnalytics: sparkSplitResponse.records.map(r => r.fields)
    };
  }

  /**
   * Gets emotional intelligence insights for a user
   */
  async getEmotionalIntelligenceInsights(userId: string): Promise<{
    journey: EmotionalJourney[];
    intelligence: EmotionalIntelligence[];
    sentiment: SentimentAnalysis[];
    patterns: BehavioralPatterns[];
  }> {
    const [journeyResponse, intelligenceResponse, sentimentResponse, patternsResponse] = await Promise.all([
      this.getRecords<AirtableCompatible<EmotionalJourney>>(
        AIRTABLE_TABLES.EMOTIONAL_JOURNEY,
        { filterByFormula: `{user_id} = "${userId}"` }
      ),
      this.getRecords<AirtableCompatible<EmotionalIntelligence>>(
        AIRTABLE_TABLES.EMOTIONAL_INTELLIGENCE,
        { filterByFormula: `{session_id} CONTAINS "${userId}"` } // Assuming session_id contains user info
      ),
      this.getRecords<AirtableCompatible<SentimentAnalysis>>(
        AIRTABLE_TABLES.SENTIMENT_ANALYSIS,
        { filterByFormula: `{content_id} CONTAINS "${userId}"` }
      ),
      this.getRecords<AirtableCompatible<BehavioralPatterns>>(
        AIRTABLE_TABLES.BEHAVIORAL_PATTERNS,
        { filterByFormula: `{user_id} = "${userId}"` }
      )
    ]);

    return {
      journey: journeyResponse.records.map(r => r.fields),
      intelligence: intelligenceResponse.records.map(r => r.fields),
      sentiment: sentimentResponse.records.map(r => r.fields),
      patterns: patternsResponse.records.map(r => r.fields)
    };
  }

  /**
   * Gets system-wide analytics and performance metrics
   */
  async getSystemAnalytics(): Promise<{
    evolution: SystemEvolution[];
    metaIntelligence: MetaIntelligence[];
    innovation: InnovationMetrics[];
    futureInsights: FutureInsights[];
  }> {
    const [evolutionResponse, metaResponse, innovationResponse, futureResponse] = await Promise.all([
      this.getRecords<AirtableCompatible<SystemEvolution>>(AIRTABLE_TABLES.SYSTEM_EVOLUTION),
      this.getRecords<AirtableCompatible<MetaIntelligence>>(AIRTABLE_TABLES.META_INTELLIGENCE),
      this.getRecords<AirtableCompatible<InnovationMetrics>>(AIRTABLE_TABLES.INNOVATION_METRICS),
      this.getRecords<AirtableCompatible<FutureInsights>>(AIRTABLE_TABLES.FUTURE_INSIGHTS)
    ]);

    return {
      evolution: evolutionResponse.records.map(r => r.fields),
      metaIntelligence: metaResponse.records.map(r => r.fields),
      innovation: innovationResponse.records.map(r => r.fields),
      futureInsights: futureResponse.records.map(r => r.fields)
    };
  }

  // ===== HEALTH CHECK AND DIAGNOSTICS =====

  /**
   * Performs a health check on the Airtable connection and key tables
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Array<{
      name: string;
      status: 'pass' | 'fail';
      message: string;
      responseTime?: number;
    }>;
  }> {
    const checks = [];
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    // Test basic connectivity
    try {
      const start = Date.now();
      await this.getRecords(AIRTABLE_TABLES.SYSTEM_EVOLUTION, { maxRecords: 1 });
      const responseTime = Date.now() - start;
      
      checks.push({
        name: 'Airtable Connectivity',
        status: 'pass' as const,
        message: 'Successfully connected to Airtable API',
        responseTime
      });
    } catch (error) {
      checks.push({
        name: 'Airtable Connectivity',
        status: 'fail' as const,
        message: `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      overallStatus = 'unhealthy';
    }

    // Test key tables accessibility
    const keyTables = [
      AIRTABLE_TABLES.PROMPT_LOGS,
      AIRTABLE_TABLES.TRUST_METRICS,
      AIRTABLE_TABLES.SESSION_ANALYTICS,
      AIRTABLE_TABLES.SPARK_SPLIT_ANALYTICS
    ];

    for (const table of keyTables) {
      try {
        const start = Date.now();
        await this.getRecords(table, { maxRecords: 1 });
        const responseTime = Date.now() - start;
        
        checks.push({
          name: `Table Access: ${table}`,
          status: 'pass' as const,
          message: 'Table accessible',
          responseTime
        });
      } catch (error) {
        checks.push({
          name: `Table Access: ${table}`,
          status: 'fail' as const,
          message: `Failed to access table: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        if (overallStatus === 'healthy') overallStatus = 'degraded';
      }
    }

    return { status: overallStatus, checks };
  }
}

/**
 * Factory function to create a configured AirtableService instance
 */
export function createAirtableService(config?: Partial<AirtableConfig>): AirtableService {
  const defaultConfig: AirtableConfig = {
    baseId: config?.baseId || process.env.AIRTABLE_BASE_ID || '',
    apiKey: config?.apiKey || process.env.AIRTABLE_API_KEY || '',
    rateLimitMs: config?.rateLimitMs || 200,
    retryAttempts: config?.retryAttempts || 3,
    timeout: config?.timeout || 30000
  };

  return new AirtableService(defaultConfig);
}

// Export singleton instance for convenience (only if environment variables are available)
export const airtableService = (() => {
  try {
    if (process.env.AIRTABLE_BASE_ID && process.env.AIRTABLE_API_KEY) {
      return createAirtableService();
    }
    // Return null if environment variables are not available
    return null;
  } catch (error) {
    // Return null if there's any error creating the singleton
    return null;
  }
})(); 