/**
 * optimization/resource-monitor.ts
 * 
 * Purpose:
 * Monitors system resource usage (CPU and memory) to optimize performance
 * and prevent resource exhaustion.
 */

import * as os from 'os';

interface ResourceUsage {
  cpu: number;
  memory: number;
  timestamp: number;
}

interface ResourceThresholds {
  cpuWarning: number;
  cpuCritical: number;
  memoryWarning: number;
  memoryCritical: number;
}

export class ResourceMonitor {
  private readonly DEFAULT_CPU_WARNING = 0.7;  // 70%
  private readonly DEFAULT_CPU_CRITICAL = 0.9; // 90%
  private readonly DEFAULT_MEMORY_WARNING = 0.8;  // 80%
  private readonly DEFAULT_MEMORY_CRITICAL = 0.95; // 95%

  private readonly thresholds: ResourceThresholds = {
    cpuWarning: this.DEFAULT_CPU_WARNING,
    cpuCritical: this.DEFAULT_CPU_CRITICAL,
    memoryWarning: this.DEFAULT_MEMORY_WARNING,
    memoryCritical: this.DEFAULT_MEMORY_CRITICAL
  };

  private lastCpuUsage: number[] = [];
  private lastCpuTime: number = 0;

  constructor() {
    this.initializeCpuUsage();
  }

  /**
   * Gets current resource usage
   */
  async getResourceUsage(): Promise<ResourceUsage> {
    const [cpuUsage, memoryUsage] = await Promise.all([
      this.getCpuUsage(),
      this.getMemoryUsage()
    ]);

    return {
      cpu: cpuUsage,
      memory: memoryUsage,
      timestamp: Date.now()
    };
  }

  /**
   * Checks if resource usage exceeds thresholds
   */
  checkResourceThresholds(usage: ResourceUsage): {
    isWarning: boolean;
    isCritical: boolean;
    exceededResources: string[];
  } {
    const exceededResources: string[] = [];
    let isWarning = false;
    let isCritical = false;

    if (usage.cpu >= this.thresholds.cpuCritical) {
      exceededResources.push('CPU');
      isCritical = true;
    } else if (usage.cpu >= this.thresholds.cpuWarning) {
      exceededResources.push('CPU');
      isWarning = true;
    }

    if (usage.memory >= this.thresholds.memoryCritical) {
      exceededResources.push('Memory');
      isCritical = true;
    } else if (usage.memory >= this.thresholds.memoryWarning) {
      exceededResources.push('Memory');
      isWarning = true;
    }

    return {
      isWarning,
      isCritical,
      exceededResources
    };
  }

  /**
   * Updates resource thresholds
   */
  updateThresholds(newThresholds: Partial<ResourceThresholds>): void {
    this.thresholds.cpuWarning = newThresholds.cpuWarning ?? this.thresholds.cpuWarning;
    this.thresholds.cpuCritical = newThresholds.cpuCritical ?? this.thresholds.cpuCritical;
    this.thresholds.memoryWarning = newThresholds.memoryWarning ?? this.thresholds.memoryWarning;
    this.thresholds.memoryCritical = newThresholds.memoryCritical ?? this.thresholds.memoryCritical;
  }

  /**
   * Gets current CPU usage
   */
  private async getCpuUsage(): Promise<number> {
    const cpus = os.cpus();
    const currentCpuTime = cpus.reduce((acc, cpu) => {
      return acc + Object.values(cpu.times).reduce((sum, time) => sum + time, 0);
    }, 0);

    const currentCpuUsage = cpus.map(cpu => {
      const total = Object.values(cpu.times).reduce((sum, time) => sum + time, 0);
      const idle = cpu.times.idle;
      return 1 - (idle / total);
    });

    if (this.lastCpuTime === 0) {
      this.lastCpuTime = currentCpuTime;
      this.lastCpuUsage = currentCpuUsage;
      return 0;
    }

    const cpuUsage = currentCpuUsage.map((usage, i) => {
      const lastUsage = this.lastCpuUsage[i] || 0;
      return (usage + lastUsage) / 2;
    });

    this.lastCpuTime = currentCpuTime;
    this.lastCpuUsage = currentCpuUsage;

    return cpuUsage.reduce((sum, usage) => sum + usage, 0) / cpuUsage.length;
  }

  /**
   * Gets current memory usage
   */
  private async getMemoryUsage(): Promise<number> {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    return 1 - (freeMemory / totalMemory);
  }

  /**
   * Initializes CPU usage tracking
   */
  private initializeCpuUsage(): void {
    const cpus = os.cpus();
    this.lastCpuTime = cpus.reduce((acc, cpu) => {
      return acc + Object.values(cpu.times).reduce((sum, time) => sum + time, 0);
    }, 0);
    this.lastCpuUsage = cpus.map(cpu => {
      const total = Object.values(cpu.times).reduce((sum, time) => sum + time, 0);
      const idle = cpu.times.idle;
      return 1 - (idle / total);
    });
  }
} 