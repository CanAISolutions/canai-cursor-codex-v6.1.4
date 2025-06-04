/**
 * Simplified Progress Tracker for Master Implementation Plan V6.1.4
 * Core tracking functionality without external dependencies
 */

// Types for progress tracking
export interface BuildTask {
  task_id: string;
  phase: number;
  task_name: string;
  description: string;
  duration_hours: number;
  owner: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Blocked' | 'Failed';
  start_date?: string;
  end_date?: string;
  dependencies: string[];
  implementation_files: string[];
  acceptance_criteria: string[];
  validation_query: string;
  cursor_prompt: string;
  progress_percentage: number;
  blocker_reason?: string;
  completion_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectProgress {
  phase: number;
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  blocked_tasks: number;
  completion_percentage: number;
}

export interface ValidationResult {
  validation_type: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  details: string;
  timestamp: string;
}

export interface SacredMetrics {
  spark_resonance: number;
  emotional_trust_score: number;
  trust_continuity: number;
  target_spark_resonance: number;
  target_emotional_trust_score: number;
  target_trust_continuity: number;
  status: 'PASS' | 'FAIL';
}

/**
 * Simplified progress tracking class
 */
export class SimpleProgressTracker {
  private tasks: BuildTask[] = [];
  private initialized = false;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Initialize with sample task data for demonstration
    this.tasks = [
      {
        task_id: 'T1.1',
        phase: 1,
        task_name: 'Initialize Supabase Project',
        description: 'Create Supabase project initialization with PRODUCTION-READY code only.',
        duration_hours: 2,
        owner: 'Backend Developer',
        priority: 'Critical',
        status: 'Not Started',
        dependencies: [],
        implementation_files: ['src/lib/supabase.ts', 'src/lib/database-connection.ts'],
        acceptance_criteria: [
          'Supabase client initialized with real credentials',
          'Connection validation function working',
          'Error handling for missing environment variables',
          'TypeScript types properly configured',
          'Health check endpoint functional'
        ],
        validation_query: 'SELECT 1 as connection_test;',
        cursor_prompt: 'Create Supabase project initialization with PRODUCTION-READY code only...',
        progress_percentage: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      // Add more sample tasks as needed
    ];
    this.initialized = true;
  }

  async getAllTasks(filters?: {
    phase?: number;
    status?: string;
    owner?: string;
    priority?: string;
  }): Promise<BuildTask[]> {
    let filteredTasks = [...this.tasks];

    if (filters?.phase) {
      filteredTasks = filteredTasks.filter(task => task.phase === filters.phase);
    }
    if (filters?.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    if (filters?.owner) {
      filteredTasks = filteredTasks.filter(task => task.owner === filters.owner);
    }
    if (filters?.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    return filteredTasks;
  }

  async getProjectProgress(): Promise<ProjectProgress[]> {
    const phases = Array.from(new Set(this.tasks.map(t => t.phase))).sort();
    
    return phases.map(phase => {
      const phaseTasks = this.tasks.filter(t => t.phase === phase);
      const completed = phaseTasks.filter(t => t.status === 'Completed').length;
      const inProgress = phaseTasks.filter(t => t.status === 'In Progress').length;
      const blocked = phaseTasks.filter(t => t.status === 'Blocked').length;
      
      return {
        phase,
        total_tasks: phaseTasks.length,
        completed_tasks: completed,
        in_progress_tasks: inProgress,
        blocked_tasks: blocked,
        completion_percentage: phaseTasks.length > 0 ? Math.round((completed / phaseTasks.length) * 100) : 0,
      };
    });
  }

  async updateTaskStatus(
    taskId: string, 
    newStatus: BuildTask['status'], 
    notes?: string,
    progressPercentage?: number
  ): Promise<void> {
    const taskIndex = this.tasks.findIndex(task => task.task_id === taskId);
    
    if (taskIndex === -1) {
      throw new Error(`Task ${taskId} not found`);
    }

    const task = this.tasks[taskIndex];
    task.status = newStatus;
    task.updated_at = new Date().toISOString();

    if (notes) {
      task.completion_notes = notes;
    }

    if (progressPercentage !== undefined) {
      task.progress_percentage = Math.max(0, Math.min(100, progressPercentage));
    }

    if (newStatus === 'In Progress' && !task.start_date) {
      task.start_date = new Date().toISOString();
    }

    if (newStatus === 'Completed') {
      task.end_date = new Date().toISOString();
      task.progress_percentage = 100;
    }

    console.log(`Task ${taskId} status updated to ${newStatus}`);
  }

  async checkTaskDependencies(taskId: string): Promise<boolean> {
    const task = this.tasks.find(t => t.task_id === taskId);
    if (!task) return false;

    // Check if all dependencies are completed
    for (const depId of task.dependencies) {
      const depTask = this.tasks.find(t => t.task_id === depId);
      if (!depTask || depTask.status !== 'Completed') {
        return false;
      }
    }

    return true;
  }

  async runTaskValidation(taskId: string): Promise<ValidationResult> {
    const task = this.tasks.find(t => t.task_id === taskId);
    
    if (!task) {
      return {
        validation_type: 'task_completion',
        status: 'FAIL',
        details: `Task ${taskId} not found`,
        timestamp: new Date().toISOString(),
      };
    }

    // Simple validation based on task status
    const status = task.status === 'Completed' ? 'PASS' : 'FAIL';
    
    return {
      validation_type: 'task_completion',
      status,
      details: `Task ${taskId} validation: ${status}`,
      timestamp: new Date().toISOString(),
    };
  }

  async getSacredMetrics(): Promise<SacredMetrics> {
    // Mock sacred metrics for demonstration
    return {
      spark_resonance: 95.5,
      emotional_trust_score: 4.7,
      trust_continuity: 98.2,
      target_spark_resonance: 97.0,
      target_emotional_trust_score: 4.9,
      target_trust_continuity: 99.0,
      status: 'FAIL', // Not meeting all targets yet
    };
  }

  async getReadyTasks(): Promise<BuildTask[]> {
    const readyTasks: BuildTask[] = [];
    
    for (const task of this.tasks) {
      if (task.status === 'Not Started') {
        const dependenciesReady = await this.checkTaskDependencies(task.task_id);
        if (dependenciesReady) {
          readyTasks.push(task);
        }
      }
    }
    
    return readyTasks;
  }

  async getBlockedTasks(): Promise<BuildTask[]> {
    return this.tasks.filter(task => task.status === 'Blocked');
  }

  async blockTask(taskId: string, reason: string): Promise<void> {
    const task = this.tasks.find(t => t.task_id === taskId);
    if (task) {
      task.status = 'Blocked';
      task.blocker_reason = reason;
      task.updated_at = new Date().toISOString();
      console.log(`Task ${taskId} blocked: ${reason}`);
    }
  }

  async unblockTask(taskId: string, resolution: string): Promise<void> {
    const task = this.tasks.find(t => t.task_id === taskId);
    if (task) {
      task.status = 'Not Started';
      task.blocker_reason = undefined;
      task.completion_notes = `Unblocked: ${resolution}`;
      task.updated_at = new Date().toISOString();
      console.log(`Task ${taskId} unblocked: ${resolution}`);
    }
  }

  async generateProgressReport(): Promise<{
    overview: ProjectProgress[];
    sacredMetrics: SacredMetrics;
    readyTasks: BuildTask[];
    blockedTasks: BuildTask[];
    criticalPath: BuildTask[];
    recommendations: string[];
  }> {
    const [
      overview,
      sacredMetrics,
      readyTasks,
      blockedTasks,
    ] = await Promise.all([
      this.getProjectProgress(),
      this.getSacredMetrics(),
      this.getReadyTasks(),
      this.getBlockedTasks(),
    ]);

    // Calculate critical path
    const criticalPath = this.tasks.filter(task => 
      task.priority === 'Critical' && 
      task.status !== 'Completed'
    );

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (blockedTasks.length > 0) {
      recommendations.push(`${blockedTasks.length} tasks are blocked and need immediate attention`);
    }
    
    if (sacredMetrics.status === 'FAIL') {
      recommendations.push('Sacred metrics are below target - review emotional intelligence implementation');
    }
    
    if (readyTasks.length === 0) {
      recommendations.push('No tasks ready for execution - check dependencies and blockers');
    }

    return {
      overview,
      sacredMetrics,
      readyTasks,
      blockedTasks,
      criticalPath,
      recommendations,
    };
  }
}

// Export singleton instance
const simpleProgressTracker = new SimpleProgressTracker();

// Export convenience functions
export const getAllTasks = (filters?: Parameters<SimpleProgressTracker['getAllTasks']>[0]) => 
  simpleProgressTracker.getAllTasks(filters);

export const updateTaskStatus = (taskId: string, status: BuildTask['status'], notes?: string, progress?: number) =>
  simpleProgressTracker.updateTaskStatus(taskId, status, notes, progress);

export const getProjectProgress = () => simpleProgressTracker.getProjectProgress();

export const getSacredMetrics = () => simpleProgressTracker.getSacredMetrics();

export const generateProgressReport = () => simpleProgressTracker.generateProgressReport();

export default simpleProgressTracker; 