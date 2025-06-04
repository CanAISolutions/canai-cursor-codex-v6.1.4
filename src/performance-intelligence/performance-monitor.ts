/**
 * PerformanceMonitor Class
 * 
 * Tracks performance metrics for operations to ensure optimal system performance.
 * Provides tools for measuring execution time, memory usage, and operation tracking.
 */
export class PerformanceMonitor {
  private sessionStartTime: number | null = null;
  private operationStartTime: number | null = null;
  private operations: Map<string, number[]> = new Map();
  
  /**
   * Starts a performance monitoring session
   * 
   * @param sessionName - Optional name to identify the session
   */
  startSession(sessionName?: string): void {
    this.sessionStartTime = performance.now();
    
    if (sessionName) {
      console.debug(`Starting performance session: ${sessionName}`);
    }
  }
  
  /**
   * Ends the current performance monitoring session
   * 
   * @returns Duration in milliseconds
   */
  endSession(): number {
    if (!this.sessionStartTime) {
      console.warn('Attempted to end a session that was not started');
      return 0;
    }
    
    const duration = performance.now() - this.sessionStartTime;
    this.sessionStartTime = null;
    
    return duration;
  }
  
  /**
   * Starts timing an operation
   * 
   * @param operationName - Name of the operation being timed
   */
  startOperation(operationName: string): void {
    this.operationStartTime = performance.now();
  }
  
  /**
   * Ends timing the current operation
   * 
   * @returns Duration in milliseconds
   */
  endOperation(): number {
    if (!this.operationStartTime) {
      console.warn('Attempted to end an operation that was not started');
      return 0;
    }
    
    const duration = performance.now() - this.operationStartTime;
    this.operationStartTime = null;
    
    return duration;
  }
  
  /**
   * Records an operation's duration for statistical analysis
   * 
   * @param operationName - Name of the operation
   * @param duration - Duration in milliseconds
   */
  recordOperation(operationName: string, duration: number): void {
    if (!this.operations.has(operationName)) {
      this.operations.set(operationName, []);
    }
    
    this.operations.get(operationName)?.push(duration);
  }
  
  /**
   * Gets average duration for an operation
   * 
   * @param operationName - Name of the operation
   * @returns Average duration in milliseconds, or -1 if no data
   */
  getAverageDuration(operationName: string): number {
    const durations = this.operations.get(operationName);
    
    if (!durations || durations.length === 0) {
      return -1;
    }
    
    const sum = durations.reduce((total, duration) => total + duration, 0);
    return sum / durations.length;
  }
  
  /**
   * Gets all operations statistics
   * 
   * @returns Map of operation names to statistics
   */
  getAllOperationStats(): Map<string, { avg: number, min: number, max: number, count: number }> {
    const stats = new Map<string, { avg: number, min: number, max: number, count: number }>();
    
    this.operations.forEach((durations, operationName) => {
      if (durations.length === 0) return;
      
      const sum = durations.reduce((total, duration) => total + duration, 0);
      const avg = sum / durations.length;
      const min = Math.min(...durations);
      const max = Math.max(...durations);
      
      stats.set(operationName, { avg, min, max, count: durations.length });
    });
    
    return stats;
  }
  
  /**
   * Resets all performance metrics
   */
  reset(): void {
    this.sessionStartTime = null;
    this.operationStartTime = null;
    this.operations.clear();
  }
} 