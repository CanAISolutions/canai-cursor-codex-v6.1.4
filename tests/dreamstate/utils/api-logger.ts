/**
 * API Logger Utility for Test Verification
 * 
 * This utility provides functions to log and verify real API calls during testing.
 * It creates logs that can be used as evidence of real API interactions.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

interface ApiCallLog {
  timestamp: string;
  requestId: string;
  endpoint: string;
  model?: string;
  executionTime: number;
  ratelimitRemaining?: string;
  ratelimitReset?: string;
  responseFirstTokens?: string;
  error?: any;
}

class ApiLogger {
  private logDirPath: string;
  private testName: string;
  private logsCache: ApiCallLog[] = [];

  constructor(testName: string) {
    this.testName = testName;
    // Use project root relative path
    this.logDirPath = path.resolve(process.cwd(), 'logs/api-verification');
  }

  /**
   * Log an API call with relevant headers and metadata
   */
  async logApiCall(apiCall: ApiCallLog): Promise<void> {
    // Add to memory cache
    this.logsCache.push(apiCall);
    
    // Create logs directory if it doesn't exist
    try {
      await fs.mkdir(this.logDirPath, { recursive: true });
    } catch (error) {
      console.error('Failed to create logs directory:', error);
    }
    
    // Generate log filename with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `${this.testName}-${timestamp}.json`;
    const filePath = path.join(this.logDirPath, filename);
    
    // Write log file
    try {
      await fs.writeFile(filePath, JSON.stringify(apiCall, null, 2));
      console.log(`📝 API call logged to ${filename}`);
    } catch (error) {
      console.error('Failed to write API log:', error);
    }
    
    // Update aggregated log file
    await this.updateAggregatedLog();
  }
  
  /**
   * Get all logged API calls
   */
  getApiCalls(): ApiCallLog[] {
    return this.logsCache;
  }
  
  /**
   * Update the aggregated log file with all cached logs
   */
  private async updateAggregatedLog(): Promise<void> {
    const aggregatedLogPath = path.join(this.logDirPath, `${this.testName}-aggregated.json`);
    
    try {
      await fs.writeFile(
        aggregatedLogPath, 
        JSON.stringify({
          testName: this.testName,
          timestamp: new Date().toISOString(),
          apiCalls: this.logsCache
        }, null, 2)
      );
    } catch (error) {
      console.error('Failed to update aggregated log:', error);
    }
  }
  
  /**
   * Verify if any real API calls have been made
   */
  hasRealApiCalls(): boolean {
    return this.logsCache.length > 0 && 
           this.logsCache.some(call => !!call.requestId);
  }
}

/**
 * Create an API logger instance for a specific test
 */
export function createApiLogger(testName: string): ApiLogger {
  return new ApiLogger(testName);
} 