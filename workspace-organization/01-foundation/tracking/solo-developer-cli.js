#!/usr/bin/env node
// Solo Developer CLI Dashboard for 13-Day CanAI Implementation Plan
// Lightweight interface for task management with emotional sovereignty validation

const { createClient } = require('@supabase/supabase-js');
const chalk = require('chalk');
const readline = require('readline');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'your-supabase-url',
  process.env.SUPABASE_SERVICE_KEY || 'your-service-key'
);

// CLI Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class SoloDeveloperCLI {
  constructor() {
    this.currentDay = this.calculateCurrentDay();
    this.commands = {
      'dashboard': this.showDashboard.bind(this),
      'start': this.startTask.bind(this),
      'complete': this.completeTask.bind(this),
      'update': this.updateTask.bind(this),
      'metrics': this.showMetrics.bind(this),
      'blockers': this.showBlockers.bind(this),
      'checkpoint': this.validateCheckpoint.bind(this),
      'next': this.showNextTasks.bind(this),
      'backup': this.createBackup.bind(this),
      'help': this.showHelp.bind(this),
      'exit': this.exit.bind(this)
    };
  }

  calculateCurrentDay() {
    // Calculate current day based on implementation start date
    // For demo purposes, using a fixed calculation
    const startDate = new Date('2025-01-01'); // Adjust to actual start date
    const currentDate = new Date();
    const daysDiff = Math.ceil((currentDate - startDate) / (24 * 60 * 60 * 1000));
    return Math.max(1, Math.min(13, daysDiff));
  }

  async showDashboard() {
    console.clear();
    console.log(chalk.blue.bold('🚀 CanAI 13-Day Implementation Dashboard\n'));
    console.log(chalk.yellow(`📅 Day ${this.currentDay} of 13 - Emotional Sovereignty Implementation\n`));

    try {
      // Get today's tasks
      const { data: todayTasks, error: tasksError } = await supabase
        .from('task_tracker_13day')
        .select('*')
        .eq('day_number', this.currentDay)
        .order('task_sequence');

      if (tasksError) throw tasksError;

      console.log(chalk.green.bold('📋 Today\'s Tasks:'));
      if (todayTasks && todayTasks.length > 0) {
        todayTasks.forEach(task => {
          const status = this.getStatusIcon(task.status);
          const progress = task.progress_percentage || 0;
          const trustImpact = task.trust_score_delta > 0 ? '📈' : task.trust_score_delta < 0 ? '📉' : '➡️';
          console.log(`  ${status} ${task.task_name} (${progress}%) - ${task.estimated_hours}h ${trustImpact}`);
          if (task.user_empowerment_indicator) {
            console.log(chalk.cyan(`    💡 ${task.user_empowerment_indicator}`));
          }
        });
      } else {
        console.log('  No tasks scheduled for today');
      }

      // Get current metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('task_metrics_realtime')
        .select('metric_name, current_value, target_value, meets_target, emotional_sovereignty_impact')
        .order('measurement_time', { ascending: false })
        .limit(5);

      if (!metricsError && metrics && metrics.length > 0) {
        console.log(chalk.blue.bold('\n📊 Current Metrics:'));
        metrics.forEach(metric => {
          const status = metric.meets_target ? '✅' : '❌';
          const unit = this.getMetricUnit(metric.metric_name);
          console.log(`  ${status} ${metric.metric_name}: ${metric.current_value}${unit} (target: ${metric.target_value}${unit})`);
          if (metric.emotional_sovereignty_impact) {
            console.log(chalk.magenta(`    🌟 ${metric.emotional_sovereignty_impact}`));
          }
        });
      }

      // Get blockers
      const { data: blockers, error: blockersError } = await supabase.rpc('detect_blockers');
      if (!blockersError && blockers && blockers.length > 0) {
        console.log(chalk.red.bold('\n🚫 Active Blockers:'));
        blockers.forEach(blocker => {
          const urgency = blocker.urgency_level === 'HIGH' ? '🔥' : blocker.urgency_level === 'MEDIUM' ? '⚠️' : 'ℹ️';
          console.log(`  ${urgency} ${blocker.task_name}: ${blocker.blocker_description}`);
          console.log(chalk.yellow(`    💡 ${blocker.suggested_action}`));
          if (blocker.emotional_impact) {
            console.log(chalk.red(`    💔 ${blocker.emotional_impact}`));
          }
        });
      }

      // Get next tasks
      const { data: nextTasks, error: nextError } = await supabase
        .from('task_tracker_13day')
        .select('task_id, task_name, estimated_hours, emotional_impact_score')
        .eq('status', 'not_started')
        .order('day_number', { ascending: true })
        .order('task_sequence', { ascending: true })
        .limit(3);

      if (!nextError && nextTasks && nextTasks.length > 0) {
        console.log(chalk.cyan.bold('\n⏭️  Next Tasks:'));
        nextTasks.forEach(task => {
          const emotionalImpact = '⭐'.repeat(task.emotional_impact_score || 3);
          console.log(`  📝 ${task.task_name} (${task.estimated_hours}h) ${emotionalImpact}`);
        });
      }

      // Show daily progress
      const { data: dailyProgress, error: progressError } = await supabase.rpc('monitor_daily_progress');
      if (!progressError && dailyProgress && dailyProgress.length > 0) {
        const todayProgress = dailyProgress.find(p => p.day_number === this.currentDay);
        if (todayProgress) {
          console.log(chalk.green.bold('\n📈 Today\'s Progress:'));
          console.log(`  Completion: ${todayProgress.completion_rate}%`);
          console.log(`  Hours Used: ${todayProgress.hours_used}/${todayProgress.hours_planned}`);
          console.log(`  Efficiency: ${todayProgress.efficiency_score}%`);
          console.log(`  Emotional Sovereignty: ${todayProgress.emotional_sovereignty_score}/5.0`);
          console.log(`  Trust Impact: ${todayProgress.trust_impact_total > 0 ? '+' : ''}${todayProgress.trust_impact_total}`);
        }
      }

      console.log(chalk.gray('\n💡 Commands: start <task_id> | complete <task_id> | metrics | blockers | checkpoint | help | exit'));

    } catch (error) {
      console.error(chalk.red('Error loading dashboard:'), error.message);
    }
  }

  async startTask(taskId) {
    if (!taskId) {
      console.log(chalk.red('Please provide a task ID. Usage: start <task_id>'));
      return;
    }

    try {
      // Check if task can be started (dependencies met)
      const { data: task, error: taskError } = await supabase
        .from('task_tracker_13day')
        .select('*')
        .eq('task_id', taskId)
        .single();

      if (taskError) throw taskError;

      if (!task) {
        console.log(chalk.red(`Task ${taskId} not found`));
        return;
      }

      if (task.status !== 'not_started') {
        console.log(chalk.yellow(`Task ${taskId} is already ${task.status}`));
        return;
      }

      // Check dependencies
      if (task.dependencies && task.dependencies.length > 0) {
        const { data: depTasks, error: depError } = await supabase
          .from('task_tracker_13day')
          .select('task_id, status')
          .in('task_id', task.dependencies);

        if (!depError && depTasks) {
          const incompleteDeps = depTasks.filter(dep => dep.status !== 'completed');
          if (incompleteDeps.length > 0) {
            console.log(chalk.red(`Cannot start ${taskId}. Incomplete dependencies:`));
            incompleteDeps.forEach(dep => console.log(`  - ${dep.task_id}: ${dep.status}`));
            return;
          }
        }
      }

      // Start the task
      const { error: updateError } = await supabase
        .from('task_tracker_13day')
        .update({ 
          status: 'in_progress', 
          start_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('task_id', taskId);

      if (updateError) throw updateError;

      // Log the interaction
      await supabase.rpc('log_cursor_interaction', {
        task_id_param: taskId,
        interaction_type_param: 'task_start',
        prompt_text: `Started task ${taskId}: ${task.task_name}`,
        success_param: true,
        emotional_impact: `User begins work on empowering task: ${task.user_empowerment_indicator}`,
        trust_notes: `Task started with trust score delta: ${task.trust_score_delta}`
      });

      console.log(chalk.green(`✅ Started task ${taskId}: ${task.task_name}`));
      console.log(chalk.cyan(`💡 ${task.user_empowerment_indicator}`));
      console.log(chalk.blue(`🎯 Estimated time: ${task.estimated_hours} hours`));
      console.log(chalk.magenta(`🌟 Emotional impact: ${task.emotional_impact_score}/5`));

    } catch (error) {
      console.error(chalk.red('Error starting task:'), error.message);
    }
  }

  async completeTask(taskId, notes = '') {
    if (!taskId) {
      console.log(chalk.red('Please provide a task ID. Usage: complete <task_id> [notes]'));
      return;
    }

    try {
      // Get task details
      const { data: task, error: taskError } = await supabase
        .from('task_tracker_13day')
        .select('*')
        .eq('task_id', taskId)
        .single();

      if (taskError) throw taskError;

      if (!task) {
        console.log(chalk.red(`Task ${taskId} not found`));
        return;
      }

      if (task.status !== 'in_progress') {
        console.log(chalk.yellow(`Task ${taskId} is not in progress (current status: ${task.status})`));
        return;
      }

      // Prompt for Sacred Reversal Test validation
      const sacredReversalPassed = await this.promptSacredReversalTest(task);
      
      // Calculate actual hours if start time exists
      let actualHours = task.estimated_hours;
      if (task.start_time) {
        const startTime = new Date(task.start_time);
        const endTime = new Date();
        actualHours = (endTime - startTime) / (1000 * 60 * 60); // Convert to hours
      }

      // Update task as completed
      const { error: updateError } = await supabase
        .from('task_tracker_13day')
        .update({ 
          status: 'completed', 
          end_time: new Date().toISOString(),
          progress_percentage: 100,
          actual_hours: actualHours,
          implementation_notes: notes,
          sacred_reversal_test_passed: sacredReversalPassed,
          updated_at: new Date().toISOString()
        })
        .eq('task_id', taskId);

      if (updateError) throw updateError;

      // Log the completion
      await supabase.rpc('log_cursor_interaction', {
        task_id_param: taskId,
        interaction_type_param: 'task_complete',
        prompt_text: `Completed task ${taskId}: ${task.task_name}`,
        response_text: notes,
        success_param: true,
        emotional_impact: `User completes empowering task, gaining: ${task.user_empowerment_indicator}`,
        trust_notes: `Task completed with Sacred Reversal Test: ${sacredReversalPassed ? 'PASSED' : 'FAILED'}`
      });

      console.log(chalk.green(`🎉 Completed task ${taskId}: ${task.task_name}`));
      console.log(chalk.cyan(`💡 Achievement: ${task.user_empowerment_indicator}`));
      console.log(chalk.blue(`⏱️  Time: ${actualHours.toFixed(1)}h (estimated: ${task.estimated_hours}h)`));
      console.log(chalk.magenta(`🌟 Sacred Reversal Test: ${sacredReversalPassed ? '✅ PASSED' : '❌ FAILED'}`));
      
      if (task.trust_score_delta > 0) {
        console.log(chalk.green(`📈 Trust Score Impact: +${task.trust_score_delta}`));
      }

    } catch (error) {
      console.error(chalk.red('Error completing task:'), error.message);
    }
  }

  async promptSacredReversalTest(task) {
    return new Promise((resolve) => {
      console.log(chalk.yellow('\n🌟 Sacred Reversal Test Validation:'));
      console.log(chalk.cyan(`Task: ${task.task_name}`));
      console.log(chalk.cyan(`Empowerment: ${task.user_empowerment_indicator}`));
      console.log(chalk.white('\nIf this implementation were experienced by you — exhausted from building dreams,'));
      console.log(chalk.white('uncertain about the next step, carrying the weight of others\' expectations —'));
      console.log(chalk.white('would you feel **seen**, **honored**, **empowered**, and **less alone**?'));
      
      rl.question(chalk.yellow('\nDoes this task pass the Sacred Reversal Test? (y/n): '), (answer) => {
        resolve(answer.toLowerCase().startsWith('y'));
      });
    });
  }

  async updateTask(taskId, field, value) {
    if (!taskId || !field || value === undefined) {
      console.log(chalk.red('Usage: update <task_id> <field> <value>'));
      console.log(chalk.gray('Fields: progress, notes, energy_level, complexity_rating'));
      return;
    }

    try {
      const updateData = { updated_at: new Date().toISOString() };
      
      switch (field) {
        case 'progress':
          updateData.progress_percentage = parseInt(value);
          break;
        case 'notes':
          updateData.implementation_notes = value;
          break;
        case 'energy_level':
          updateData.energy_level = value;
          break;
        case 'complexity_rating':
          updateData.complexity_rating = parseInt(value);
          break;
        default:
          console.log(chalk.red(`Unknown field: ${field}`));
          return;
      }

      const { error } = await supabase
        .from('task_tracker_13day')
        .update(updateData)
        .eq('task_id', taskId);

      if (error) throw error;

      console.log(chalk.green(`✅ Updated ${taskId}.${field} to: ${value}`));

    } catch (error) {
      console.error(chalk.red('Error updating task:'), error.message);
    }
  }

  async showMetrics() {
    try {
      const { data: metrics, error } = await supabase
        .from('task_metrics_realtime')
        .select('*')
        .order('measurement_time', { ascending: false })
        .limit(10);

      if (error) throw error;

      console.log(chalk.blue.bold('\n📊 Recent Metrics:'));
      if (metrics && metrics.length > 0) {
        metrics.forEach(metric => {
          const status = metric.meets_target ? '✅' : '❌';
          const unit = this.getMetricUnit(metric.metric_name);
          const time = new Date(metric.measurement_time).toLocaleTimeString();
          console.log(`  ${status} ${metric.metric_name}: ${metric.current_value}${unit} (${time})`);
          if (metric.emotional_sovereignty_impact) {
            console.log(chalk.magenta(`    🌟 ${metric.emotional_sovereignty_impact}`));
          }
        });
      } else {
        console.log('  No metrics available');
      }
    } catch (error) {
      console.error(chalk.red('Error loading metrics:'), error.message);
    }
  }

  async showBlockers() {
    try {
      const { data: blockers, error } = await supabase.rpc('detect_blockers');

      if (error) throw error;

      console.log(chalk.red.bold('\n🚫 Current Blockers:'));
      if (blockers && blockers.length > 0) {
        blockers.forEach(blocker => {
          const urgency = blocker.urgency_level === 'HIGH' ? '🔥' : 
                         blocker.urgency_level === 'MEDIUM' ? '⚠️' : 'ℹ️';
          console.log(`\n  ${urgency} ${blocker.task_name} (${blocker.blocker_type})`);
          console.log(`     ${blocker.blocker_description}`);
          console.log(chalk.yellow(`     💡 ${blocker.suggested_action}`));
          if (blocker.emotional_impact) {
            console.log(chalk.red(`     💔 ${blocker.emotional_impact}`));
          }
          if (blocker.trust_recovery_needed) {
            console.log(chalk.orange('     🔄 Trust recovery needed'));
          }
        });
      } else {
        console.log(chalk.green('  🎉 No blockers detected!'));
      }
    } catch (error) {
      console.error(chalk.red('Error loading blockers:'), error.message);
    }
  }

  async validateCheckpoint(day) {
    const checkpointDay = day ? parseInt(day) : this.currentDay;
    
    if (![6, 9, 12].includes(checkpointDay)) {
      console.log(chalk.yellow(`Day ${checkpointDay} is not a checkpoint day. Checkpoints are on days 6, 9, and 12.`));
      return;
    }

    try {
      const { data: result, error } = await supabase.rpc('validate_checkpoint', {
        checkpoint_day: checkpointDay
      });

      if (error) throw error;

      if (result && result.length > 0) {
        const checkpoint = result[0];
        console.log(chalk.blue.bold(`\n🎯 Checkpoint ${checkpointDay} Validation:`));
        
        const statusColor = checkpoint.checkpoint_status === 'PASS' ? chalk.green : 
                           checkpoint.checkpoint_status === 'WARNING' ? chalk.yellow : chalk.red;
        
        console.log(`  Status: ${statusColor(checkpoint.checkpoint_status)}`);
        console.log(`  Tasks: ${checkpoint.tasks_completed}/${checkpoint.tasks_total} (${((checkpoint.tasks_completed/checkpoint.tasks_total)*100).toFixed(1)}%)`);
        console.log(`  Metrics: ${checkpoint.critical_metrics_met}/${checkpoint.critical_metrics_total} (${((checkpoint.critical_metrics_met/checkpoint.critical_metrics_total)*100).toFixed(1)}%)`);
        console.log(`  Emotional Sovereignty: ${checkpoint.emotional_sovereignty_score}/5.0`);
        console.log(`  Trust Score Impact: ${checkpoint.trust_score_impact > 0 ? '+' : ''}${checkpoint.trust_score_impact}`);
        console.log(`  Sacred Reversal Compliance: ${checkpoint.sacred_reversal_compliance}%`);

        if (checkpoint.blockers && checkpoint.blockers.length > 0) {
          console.log(chalk.red('\n  🚫 Blockers:'));
          checkpoint.blockers.forEach(blocker => console.log(`    - ${blocker}`));
        }

        if (checkpoint.recommendations && checkpoint.recommendations.length > 0) {
          console.log(chalk.cyan('\n  💡 Recommendations:'));
          checkpoint.recommendations.forEach(rec => console.log(`    - ${rec}`));
        }
      }
    } catch (error) {
      console.error(chalk.red('Error validating checkpoint:'), error.message);
    }
  }

  async showNextTasks() {
    try {
      const { data: tasks, error } = await supabase
        .from('task_tracker_13day')
        .select('task_id, task_name, estimated_hours, day_number, dependencies, emotional_impact_score, user_empowerment_indicator')
        .eq('status', 'not_started')
        .order('day_number', { ascending: true })
        .order('task_sequence', { ascending: true })
        .limit(5);

      if (error) throw error;

      console.log(chalk.cyan.bold('\n⏭️  Next Available Tasks:'));
      if (tasks && tasks.length > 0) {
        for (const task of tasks) {
          const emotionalImpact = '⭐'.repeat(task.emotional_impact_score || 3);
          console.log(`\n  📝 ${task.task_id}: ${task.task_name}`);
          console.log(`     Day ${task.day_number} • ${task.estimated_hours}h • ${emotionalImpact}`);
          console.log(chalk.cyan(`     💡 ${task.user_empowerment_indicator}`));
          
          if (task.dependencies && task.dependencies.length > 0) {
            console.log(chalk.gray(`     Dependencies: ${task.dependencies.join(', ')}`));
          }
        }
      } else {
        console.log('  🎉 All tasks completed!');
      }
    } catch (error) {
      console.error(chalk.red('Error loading next tasks:'), error.message);
    }
  }

  async createBackup() {
    try {
      const { data: backup, error } = await supabase.rpc('backup_task_state', {
        backup_type_param: 'manual'
      });

      if (error) throw error;

      if (backup && backup.length > 0) {
        console.log(chalk.green(`✅ Backup created: ${backup[0].backup_id}`));
        console.log(chalk.gray(`   Timestamp: ${new Date().toISOString()}`));
      }
    } catch (error) {
      console.error(chalk.red('Error creating backup:'), error.message);
    }
  }

  showHelp() {
    console.log(chalk.blue.bold('🚀 CanAI Solo Developer CLI - 13-Day Implementation\n'));
    
    console.log(chalk.red.bold('🎯 CURSOR-RULES.md COMPLIANCE:'));
    console.log(chalk.yellow('⚠️  CRITICAL: Use this prefix for ALL Cursor interactions:'));
    console.log(chalk.cyan('Follow CURSOR-RULES.md for production-ready code with no placeholders, real services (Supabase Pro, AWS Lambda, k6), comprehensive error handling, and emotional sovereignty (trust scores >4.2). Log all interactions to cursor_interactions_log.\n'));
    
    console.log(chalk.green.bold('📋 AVAILABLE COMMANDS:'));
    console.log('  dashboard, dash     - Show current progress and metrics');
    console.log('  start <task_id>     - Begin working on a task');
    console.log('  complete <task_id>  - Mark task as complete with Sacred Reversal Test');
    console.log('  update <task_id>    - Update task status or notes');
    console.log('  metrics             - Show current performance metrics');
    console.log('  blockers            - Show active blockers and recommendations');
    console.log('  next                - Show next available tasks');
    console.log('  prioritize [energy] - Get energy-aware task prioritization');
    console.log('  checkpoint <day>    - Validate checkpoint (Days 6, 9, 12)');
    console.log('  backup              - Create task state backup');
    console.log('  compliance          - Weekly rule compliance check');
    console.log('  help                - Show this help message');
    console.log('  exit                - Exit the CLI\n');
    
    console.log(chalk.blue.bold('🌟 CHECKPOINT PROMPTS:'));
    console.log('For Days 6, 9, 12 - Use specialized prompts from:');
    console.log(chalk.cyan('workspace-organization/01-foundation/tracking/cursor-prompt-templates.ts'));
    console.log(chalk.cyan('Section: CHECKPOINT_PROMPTS\n'));
    
    console.log(chalk.magenta.bold('💝 EMOTIONAL SOVEREIGNTY:'));
    console.log('Every task includes Sacred Reversal Test validation:');
    console.log('  ✅ Recognition - Honors user intent');
    console.log('  ✅ Respect - Respects user time and expertise');
    console.log('  ✅ Empowerment - Makes users feel more capable');
    console.log('  ✅ Partnership - Strengthens trusted advisor relationship\n');
    
    console.log(chalk.gray('💡 Example: start D01_T01, complete D01_T01, checkpoint 6'));
  }

  getStatusIcon(status) {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🔄';
      case 'blocked': return '🚫';
      case 'failed': return '❌';
      default: return '⏳';
    }
  }

  getMetricUnit(metricName) {
    if (metricName.includes('latency') || metricName.includes('time')) return 'ms';
    if (metricName.includes('accuracy') || metricName.includes('rate') || metricName.includes('percentage')) return '%';
    if (metricName.includes('count') || metricName.includes('number')) return '';
    return '';
  }

  exit() {
    console.log(chalk.green('\n🌟 Thank you for building emotional sovereignty into CanAI!'));
    console.log(chalk.cyan('Every task completed brings users closer to empowerment and trust.'));
    rl.close();
    process.exit(0);
  }

  async run() {
    console.log(chalk.blue.bold('🚀 CanAI Solo Developer CLI'));
    console.log(chalk.cyan('Emotional Sovereignty Implementation Tracker\n'));
    
    await this.showDashboard();
    
    const promptUser = () => {
      rl.question(chalk.yellow('\ncanai> '), async (input) => {
        const [command, ...args] = input.trim().split(' ');
        
        if (this.commands[command]) {
          await this.commands[command](...args);
        } else if (command) {
          console.log(chalk.red(`Unknown command: ${command}. Type 'help' for available commands.`));
        }
        
        if (command !== 'exit') {
          promptUser();
        }
      });
    };
    
    promptUser();
  }
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  const cli = new SoloDeveloperCLI();
  cli.run().catch(console.error);
}

module.exports = SoloDeveloperCLI; 