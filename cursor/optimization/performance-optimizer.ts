/**
 * optimization/performance-optimizer.ts
 * 
 * Purpose:
 * Optimizes system performance through metric caching and recovery process optimization,
 * ensuring fast response times and efficient resource usage.
 */

import { TrustEvolutionTracker } from '../agents/trust-scorer/evolution-tracker';
import { SmartRevisionLoop } from '../self-healing/smart-revision-loop';
import { EnhancedVisionProcessor } from '../vision-injection/enhanced-vision-processor';
import { ResourceMonitor } from './resource-monitor';

interface CacheConfig {
  ttl: number;           // Time to live in milliseconds
  maxSize: number;       // Maximum number of cached items
  cleanupInterval: number; // Cleanup interval in milliseconds
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
}

interface PerformanceMetrics {
  responseTime: number;
  resourceUsage: {
    cpu: number;
    memory: number;
  };
  cacheHitRate: number;
  recoveryTime: number;
  timestamp: number;
}

export class PerformanceOptimizer {
  private readonly DEFAULT_TTL = 1000 * 60 * 5; // 5 minutes
  private readonly DEFAULT_MAX_SIZE = 1000;
  private readonly DEFAULT_CLEANUP_INTERVAL = 1000 * 60; // 1 minute

  private metricCache: Map<string, CacheEntry<any>> = new Map();
  private recoveryCache: Map<string, CacheEntry<any>> = new Map();
  private performanceHistory: PerformanceMetrics[] = [];
  private resourceMonitor: ResourceMonitor;

  private readonly config: CacheConfig = {
    ttl: this.DEFAULT_TTL,
    maxSize: this.DEFAULT_MAX_SIZE,
    cleanupInterval: this.DEFAULT_CLEANUP_INTERVAL
  };

  constructor(
    private trustTracker: TrustEvolutionTracker,
    private revisionLoop: SmartRevisionLoop,
    private visionProcessor: EnhancedVisionProcessor
  ) {
    this.resourceMonitor = new ResourceMonitor();
    this.startCacheCleanup();
    this.startPerformanceMonitoring();
  }

  /**
   * Gets cached metrics or fetches fresh data
   */
  async getMetrics(component: string): Promise<any> {
    const cacheKey = `metrics:${component}`;
    const cached = this.getFromCache(this.metricCache, cacheKey);

    if (cached) {
      return cached;
    }

    const metrics = await this.fetchMetrics(component);
    this.setInCache(this.metricCache, cacheKey, metrics);
    return metrics;
  }

  /**
   * Gets cached recovery data or fetches fresh data
   */
  async getRecoveryData(component: string): Promise<any> {
    const cacheKey = `recovery:${component}`;
    const cached = this.getFromCache(this.recoveryCache, cacheKey);

    if (cached) {
      return cached;
    }

    const data = await this.fetchRecoveryData(component);
    this.setInCache(this.recoveryCache, cacheKey, data);
    return data;
  }

  /**
   * Records performance metrics
   */
  recordPerformance(metrics: PerformanceMetrics): void {
    this.performanceHistory.push({
      ...metrics,
      timestamp: Date.now()
    });

    this.cleanupOldMetrics();
  }

  /**
   * Gets performance statistics
   */
  getPerformanceStats(): {
    averageResponseTime: number;
    averageRecoveryTime: number;
    cacheHitRate: number;
    resourceUsage: {
      cpu: number;
      memory: number;
    };
  } {
    const recentMetrics = this.getRecentMetrics();
    const count = recentMetrics.length;

    if (count === 0) {
      return {
        averageResponseTime: 0,
        averageRecoveryTime: 0,
        cacheHitRate: 0,
        resourceUsage: { cpu: 0, memory: 0 }
      };
    }

    const sum = recentMetrics.reduce(
      (acc, metric) => ({
        responseTime: acc.responseTime + metric.responseTime,
        recoveryTime: acc.recoveryTime + metric.recoveryTime,
        cacheHitRate: acc.cacheHitRate + metric.cacheHitRate,
        cpu: acc.cpu + metric.resourceUsage.cpu,
        memory: acc.memory + metric.resourceUsage.memory
      }),
      { responseTime: 0, recoveryTime: 0, cacheHitRate: 0, cpu: 0, memory: 0 }
    );

    return {
      averageResponseTime: sum.responseTime / count,
      averageRecoveryTime: sum.recoveryTime / count,
      cacheHitRate: sum.cacheHitRate / count,
      resourceUsage: {
        cpu: sum.cpu / count,
        memory: sum.memory / count
      }
    };
  }

  /**
   * Clears all caches
   */
  async clearAllCaches(): Promise<void> {
    this.metricCache.clear();
    this.recoveryCache.clear();
    console.log('All caches cleared');
  }

  /**
   * Reduces cache size
   */
  async reduceCacheSize(): Promise<void> {
    const newMaxSize = Math.floor(this.config.maxSize * 0.5);
    this.config.maxSize = newMaxSize;

    // Evict entries until we're under the new size limit
    while (this.metricCache.size > newMaxSize) {
      this.evictLeastUsed(this.metricCache);
    }
    while (this.recoveryCache.size > newMaxSize) {
      this.evictLeastUsed(this.recoveryCache);
    }

    console.log(`Cache size reduced to ${newMaxSize} entries`);
  }

  /**
   * Optimizes cache settings
   */
  async optimizeCacheSettings(): Promise<void> {
    // Adjust TTL based on performance metrics
    const stats = this.getPerformanceStats();
    if (stats.cacheHitRate < 0.5) {
      this.config.ttl = Math.floor(this.config.ttl * 0.8); // Reduce TTL if hit rate is low
    } else if (stats.cacheHitRate > 0.8) {
      this.config.ttl = Math.floor(this.config.ttl * 1.2); // Increase TTL if hit rate is high
    }

    // Adjust cleanup interval based on resource usage
    const usage = await this.getResourceUsage();
    if (usage.memory > 0.8) {
      this.config.cleanupInterval = Math.floor(this.config.cleanupInterval * 0.5); // More frequent cleanup
    }

    console.log('Cache settings optimized:', {
      ttl: this.config.ttl,
      maxSize: this.config.maxSize,
      cleanupInterval: this.config.cleanupInterval
    });
  }

  /**
   * Starts the cache cleanup loop
   */
  private startCacheCleanup(): void {
    setInterval(() => {
      this.cleanupCache(this.metricCache);
      this.cleanupCache(this.recoveryCache);
    }, this.config.cleanupInterval);
  }

  /**
   * Starts the performance monitoring loop
   */
  private startPerformanceMonitoring(): void {
    setInterval(async () => {
      const metrics = await this.collectPerformanceMetrics();
      this.recordPerformance(metrics);
    }, 1000 * 60); // Every minute
  }

  /**
   * Gets data from cache
   */
  private getFromCache<T>(cache: Map<string, CacheEntry<T>>, key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.config.ttl) {
      cache.delete(key);
      return null;
    }

    entry.accessCount++;
    return entry.value;
  }

  /**
   * Sets data in cache
   */
  private setInCache<T>(cache: Map<string, CacheEntry<T>>, key: string, value: T): void {
    if (cache.size >= this.config.maxSize) {
      this.evictLeastUsed(cache);
    }

    cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 0
    });
  }

  /**
   * Evicts least used entries from cache
   */
  private evictLeastUsed<T>(cache: Map<string, CacheEntry<T>>): void {
    let minAccessCount = Infinity;
    let keyToEvict: string | null = null;

    for (const [key, entry] of cache.entries()) {
      if (entry.accessCount < minAccessCount) {
        minAccessCount = entry.accessCount;
        keyToEvict = key;
      }
    }

    if (keyToEvict) {
      cache.delete(keyToEvict);
    }
  }

  /**
   * Cleans up expired entries from cache
   */
  private cleanupCache<T>(cache: Map<string, CacheEntry<T>>): void {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        cache.delete(key);
      }
    }
  }

  /**
   * Fetches fresh metrics
   */
  private async fetchMetrics(component: string): Promise<any> {
    const startTime = Date.now();
    const metrics = await this.trustTracker.calculateEvolutionMetrics(component);
    const responseTime = Date.now() - startTime;

    this.recordPerformance({
      responseTime,
      resourceUsage: await this.getResourceUsage(),
      cacheHitRate: 0,
      recoveryTime: 0,
      timestamp: Date.now()
    });

    return metrics;
  }

  /**
   * Fetches fresh recovery data
   */
  private async fetchRecoveryData(component: string): Promise<any> {
    const startTime = Date.now();
    const data = await this.revisionLoop.getRecoveryMetrics(component);
    const responseTime = Date.now() - startTime;

    this.recordPerformance({
      responseTime,
      resourceUsage: await this.getResourceUsage(),
      cacheHitRate: 0,
      recoveryTime: data?.recoveryTime ?? 0,
      timestamp: Date.now()
    });

    return data;
  }

  /**
   * Gets recent performance metrics
   */
  private getRecentMetrics(): PerformanceMetrics[] {
    const cutoff = Date.now() - this.DEFAULT_TTL;
    return this.performanceHistory.filter(metric => metric.timestamp >= cutoff);
  }

  /**
   * Cleans up old performance metrics
   */
  private cleanupOldMetrics(): void {
    const cutoff = Date.now() - this.DEFAULT_TTL;
    this.performanceHistory = this.performanceHistory.filter(
      metric => metric.timestamp >= cutoff
    );
  }

  /**
   * Collects current performance metrics
   */
  private async collectPerformanceMetrics(): Promise<PerformanceMetrics> {
    const startTime = Date.now();
    const resourceUsage = await this.getResourceUsage();
    const responseTime = Date.now() - startTime;

    const cacheHitRate = this.calculateCacheHitRate();
    const recoveryTime = await this.getAverageRecoveryTime();

    return {
      responseTime,
      resourceUsage,
      cacheHitRate,
      recoveryTime,
      timestamp: Date.now()
    };
  }

  /**
   * Gets current resource usage
   */
  private async getResourceUsage(): Promise<{ cpu: number; memory: number }> {
    const usage = await this.resourceMonitor.getResourceUsage();
    const { isWarning, isCritical, exceededResources } = this.resourceMonitor.checkResourceThresholds(usage);

    if (isCritical) {
      console.warn(`Critical resource usage detected for: ${exceededResources.join(', ')}`);
      // TODO: Implement critical resource handling
    } else if (isWarning) {
      console.warn(`Warning: High resource usage detected for: ${exceededResources.join(', ')}`);
      // TODO: Implement warning resource handling
    }

    return {
      cpu: usage.cpu,
      memory: usage.memory
    };
  }

  /**
   * Calculates cache hit rate
   */
  private calculateCacheHitRate(): number {
    const totalHits = this.metricCache.size + this.recoveryCache.size;
    const totalRequests = totalHits + this.performanceHistory.length;
    return totalRequests > 0 ? totalHits / totalRequests : 0;
  }

  /**
   * Gets average recovery time
   */
  private async getAverageRecoveryTime(): Promise<number> {
    const recentMetrics = this.getRecentMetrics();
    if (recentMetrics.length === 0) return 0;

    const totalRecoveryTime = recentMetrics.reduce(
      (sum, metric) => sum + metric.recoveryTime,
      0
    );

    return totalRecoveryTime / recentMetrics.length;
  }
} 