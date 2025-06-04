/**
 * 📊 Test Infrastructure Performance Monitor
 * 
 * Simplified performance monitoring for test suites,
 * providing session tracking and basic metrics collection.
 * 
 * @fileoverview Test performance monitoring utilities
 * @version 1.0.0
 * @since 2025-05-27
 */

export interface TestPerformanceMetrics {
  duration: number;
  memoryUsage?: number;
  operationCount?: number;
  startTime: number;
  endTime: number;
}

export interface SessionMetrics {
  sessionName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  operations: string[];
  metadata: Record<string, any>;
}

/**
 * Performance monitoring utility for test infrastructure
 * 
 * Provides tools for tracking timing, memory usage, and performance markers
 * during test execution
 */
export class PerformanceMonitor {
  private currentSession: SessionMetrics | null;
  private sessionHistory: SessionMetrics[];
  private operationCount: number;
  private startTime: number;
  private endTime: number | null;
  private memoryUsage: number;
  private active: boolean;
  private markers: Map<string, number>;
  private measurements: Map<string, number>;

  constructor() {
    this.currentSession = null;
    this.sessionHistory = [];
    this.operationCount = 0;
    this.startTime = 0;
    this.endTime = null;
    this.memoryUsage = 0;
    this.active = false;
    this.markers = new Map();
    this.measurements = new Map();
  }

  /**
   * Start a new performance monitoring session
   */
  startSession(sessionName: string = 'test-session'): void {
    // End current session if one is active
    if (this.currentSession && !this.currentSession.endTime) {
      this.endSession();
    }

    this.currentSession = {
      sessionName,
      startTime: performance.now(),
      operations: [],
      metadata: {}
    };
    this.operationCount = 0;
    this.startTime = Date.now();
    this.memoryUsage = this.getCurrentMemoryUsage();
    this.active = true;
    this.markers.clear();
    this.measurements.clear();
  }

  /**
   * End the current performance monitoring session
   */
  endSession(): TestPerformanceMetrics {
    if (!this.currentSession) {
      throw new Error('No active session to end');
    }

    const endTime = performance.now();
    const duration = endTime - this.currentSession.startTime;

    this.currentSession.endTime = endTime;
    this.currentSession.duration = duration;

    // Add to history
    this.sessionHistory.push({ ...this.currentSession });

    const metrics: TestPerformanceMetrics = {
      duration,
      startTime: this.currentSession.startTime,
      endTime,
      operationCount: this.operationCount
    };

    // Clear current session
    this.currentSession = null;

    this.endTime = endTime;
    this.active = false;

    return metrics;
  }

  /**
   * Record an operation during the current session
   */
  recordOperation(operationName: string, metadata: Record<string, any> = {}): void {
    if (this.currentSession) {
      this.currentSession.operations.push(operationName);
      this.currentSession.metadata[operationName] = metadata;
      this.operationCount++;
    }
  }

  /**
   * Get the current session information
   */
  getCurrentSession(): SessionMetrics | null {
    return this.currentSession;
  }

  /**
   * Get session history
   */
  getSessionHistory(): SessionMetrics[] {
    return [...this.sessionHistory];
  }

  /**
   * Get the last completed session duration
   */
  getLastSessionDuration(): number {
    const lastSession = this.sessionHistory[this.sessionHistory.length - 1];
    return lastSession?.duration || 0;
  }

  /**
   * Clear all session history
   */
  clearHistory(): void {
    this.sessionHistory = [];
  }

  /**
   * Get performance statistics
   */
  getStatistics(): {
    totalSessions: number;
    averageDuration: number;
    totalOperations: number;
    averageOperationsPerSession: number;
  } {
    const completedSessions = this.sessionHistory.filter(s => s.duration !== undefined);
    const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalOperations = completedSessions.reduce((sum, s) => sum + s.operations.length, 0);

    return {
      totalSessions: completedSessions.length,
      averageDuration: completedSessions.length > 0 ? totalDuration / completedSessions.length : 0,
      totalOperations,
      averageOperationsPerSession: completedSessions.length > 0 ? totalOperations / completedSessions.length : 0
    };
  }

  /**
   * Measure the performance of an async operation
   */
  async measureOperation<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      this.recordOperation(operationName, { duration, success: true });
      
      return { result, duration };
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.recordOperation(operationName, { duration, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      
      throw error;
    }
  }

  /**
   * Measure the performance of a synchronous operation
   */
  measureSync<T>(
    operationName: string,
    operation: () => T
  ): { result: T; duration: number } {
    const startTime = performance.now();
    
    try {
      const result = operation();
      const duration = performance.now() - startTime;
      
      this.recordOperation(operationName, { duration, success: true });
      
      return { result, duration };
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.recordOperation(operationName, { duration, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      
      throw error;
    }
  }

  /**
   * Gets the current session duration
   * 
   * @returns Duration in milliseconds
   */
  getDuration(): number {
    const endTime = this.endTime || Date.now();
    return endTime - this.startTime;
  }

  /**
   * Gets memory usage information for the current session
   * 
   * @returns Memory usage in bytes
   */
  getMemoryUsage(): number {
    if (!this.active) {
      return 0;
    }
    
    return this.getCurrentMemoryUsage() - this.memoryUsage;
  }

  /**
   * Places a performance marker at the current time
   * 
   * @param name - Marker name
   * @returns The time when the marker was placed
   */
  mark(name: string): number {
    if (!this.active) {
      throw new Error('No active session for performance marking');
    }
    
    const time = Date.now();
    this.markers.set(name, time);
    
    return time;
  }

  /**
   * Measures time between two markers
   * 
   * @param startMarker - Start marker name
   * @param endMarker - End marker name
   * @returns Time difference in milliseconds
   */
  measureBetweenMarks(startMarker: string, endMarker: string): number {
    if (!this.markers.has(startMarker) || !this.markers.has(endMarker)) {
      throw new Error(`Markers ${startMarker} and ${endMarker} must both exist`);
    }
    
    const startTime = this.markers.get(startMarker)!;
    const endTime = this.markers.get(endMarker)!;
    const duration = endTime - startTime;
    
    // Store the measurement
    const measurementName = `${startMarker}_to_${endMarker}`;
    this.measurements.set(measurementName, duration);
    
    return duration;
  }

  /**
   * Gets a stored measurement value
   * 
   * @param name - Measurement name
   * @returns Measurement value in milliseconds
   */
  getMeasurement(name: string): number {
    return this.measurements.get(name) || 0;
  }

  /**
   * Gets the current memory usage
   * 
   * @returns Current memory usage in bytes
   */
  private getCurrentMemoryUsage(): number {
    // In a real implementation, this would use proper memory measurement
    // For now, we'll return a placeholder value
    return 1000000; // 1MB
  }
} 