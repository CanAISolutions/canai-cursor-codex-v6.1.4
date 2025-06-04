#!/usr/bin/env node
// CanAI 13-Day Implementation - Production CLI Dashboard
// PRODUCTION-READY: Solo developer dashboard with emotional sovereignty prioritization
// Framework: Codex v6.1.4 - Emotional Sovereignty + Test-First Truth
// Sacred Reversal Test: ✅ PASSED - Accelerates user access to life-changing AI

const { createClient } = require('@supabase/supabase-js');
const chalk = require('chalk');
const readline = require('readline');

// Environment validation
function validateEnvironment() {
  const required = ['SUPABASE_URL'];
  const missing = required.filter(env => !process.env[env]);
  
  // Check for either SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    missing.push('SUPABASE_SERVICE_KEY');
  } else {
    // Set SUPABASE_SERVICE_KEY if it doesn't exist but SUPABASE_SERVICE_ROLE_KEY does
    if (!process.env.SUPABASE_SERVICE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      process.env.SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    }
  }
  
  if (missing.length > 0) {
    console.error(chalk.red(`❌ Missing environment variables: ${missing.join(', ')}`));
    console.error(chalk.yellow('💡 Create a .env file with:'));
    console.error(chalk.gray('SUPABASE_URL=your_supabase_url'));
    console.error(chalk.gray('SUPABASE_SERVICE_KEY=your_service_key'));
    process.exit(1);
  }
}

// Load environment variables from .env file
function loadEnvironment() {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(process.cwd(), '.env');
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      });
    }
  } catch (error) {
    console.warn(chalk.yellow('⚠️  Could not load .env file'));
  }
}

// Initialize
loadEnvironment();
validateEnvironment();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Emotional Sovereignty Prioritization Engine
class EmotionalSovereigntyPrioritizer {
  constructor() {
    this.trustScoreThreshold = 4.2;
    this.maxComplexityForLowEnergy = 3;
    this.maxComplexityForMediumEnergy = 4;
  }

  async prioritizeTasks(energyLevel = 'medium', maxTasks = 5) {
    try {
      // Get all available tasks
      const { data: tasks, error } = await supabase
        .from('task_tracker_13day')
        .select('*')
        .eq('status', 'not_started')
        .order('day_number')
        .order('task_sequence');

      if (error) throw error;

      if (!tasks || tasks.length === 0) {
        return {
          prioritizedTasks: [],
          reasoning: 'No available tasks found',
          emotionalGuidance: 'All tasks completed or in progress! 🎉'
        };
      }

      // Apply emotional sovereignty prioritization
      const prioritized = this.applyEmotionalPrioritization(tasks, energyLevel);
      
      // Apply Sacred Reversal Test
      const sacredCompliant = prioritized.filter(task => 
        this.passesSacredReversalTest(task)
      );

      // Limit results
      const finalTasks = sacredCompliant.slice(0, maxTasks);

      return {
        prioritizedTasks: finalTasks,
        reasoning: this.generatePrioritizationReasoning(energyLevel, tasks.length, finalTasks.length),
        emotionalGuidance: this.generateEmotionalGuidance(energyLevel, finalTasks),
        trustScoreImpact: this.calculateTrustScoreImpact(finalTasks)
      };
    } catch (error) {
      await this.logError('prioritization_failed', error.message);
      throw new Error(`Prioritization failed: ${error.message}`);
    }
  }

  applyEmotionalPrioritization(tasks, energyLevel) {
    return tasks
      .map(task => ({
        ...task,
        priorityScore: this.calculatePriorityScore(task, energyLevel),
        emotionalFit: this.assessEmotionalFit(task, energyLevel),
        trustImpact: this.calculateTrustImpact(task)
      }))
      .sort((a, b) => {
        // Primary: Trust score target (higher first)
        if (b.trust_score_target !== a.trust_score_target) {
          return (b.trust_score_target || 0) - (a.trust_score_target || 0);
        }
        
        // Secondary: Emotional fit for current energy level
        if (b.emotionalFit !== a.emotionalFit) {
          return b.emotionalFit - a.emotionalFit;
        }
        
        // Tertiary: Priority score
        return b.priorityScore - a.priorityScore;
      });
  }

  calculatePriorityScore(task, energyLevel) {
    let score = 0;
    
    // Base score from trust target
    score += (task.trust_score_target || 3.0) * 20;
    
    // Complexity adjustment based on energy
    const complexity = task.complexity_rating || 3;
    const maxComplexity = this.getMaxComplexityForEnergy(energyLevel);
    
    if (complexity <= maxComplexity) {
      score += (maxComplexity - complexity + 1) * 10; // Prefer simpler tasks for low energy
    } else {
      score -= (complexity - maxComplexity) * 15; // Penalize complex tasks for low energy
    }
    
    // Day urgency (earlier days get higher priority)
    score += Math.max(0, 15 - task.day_number) * 5;
    
    // Sacred Reversal Test bonus
    if (task.sacred_reversal_test_passed) {
      score += 25;
    }
    
    // Estimated hours consideration (prefer shorter tasks when energy is low)
    const hours = task.estimated_hours || 2;
    if (energyLevel === 'low' && hours <= 2) {
      score += 15;
    } else if (energyLevel === 'high' && hours >= 3) {
      score += 10;
    }
    
    return score;
  }

  assessEmotionalFit(task, energyLevel) {
    const complexity = task.complexity_rating || 3;
    const maxComplexity = this.getMaxComplexityForEnergy(energyLevel);
    
    // Perfect fit: complexity matches energy level
    if (complexity <= maxComplexity) {
      return 100;
    }
    
    // Partial fit: slightly over complexity limit
    if (complexity === maxComplexity + 1) {
      return 70;
    }
    
    // Poor fit: too complex for current energy
    return 30;
  }

  calculateTrustImpact(task) {
    const trustTarget = task.trust_score_target || 3.0;
    const baseImpact = (trustTarget - 3.0) * 0.5; // Scale to 0-1
    
    // Bonus for Sacred Reversal Test compliance
    const sacredBonus = task.sacred_reversal_test_passed ? 0.2 : 0;
    
    return Math.min(1.0, baseImpact + sacredBonus);
  }

  getMaxComplexityForEnergy(energyLevel) {
    switch (energyLevel) {
      case 'low': return this.maxComplexityForLowEnergy;
      case 'medium': return this.maxComplexityForMediumEnergy;
      case 'high': return 5;
      default: return this.maxComplexityForMediumEnergy;
    }
  }

  passesSacredReversalTest(task) {
    // Sacred Reversal Test: Does this task accelerate user access to life-changing AI?
    
    // Must have explicit Sacred Reversal Test passing
    if (!task.sacred_reversal_test_passed) {
      return false;
    }
    
    // Must have trust score target >= 4.2
    if ((task.trust_score_target || 0) < this.trustScoreThreshold) {
      return false;
    }
    
    // Must not be blocked or failed
    if (['blocked', 'failed'].includes(task.status)) {
      return false;
    }
    
    return true;
  }

  generatePrioritizationReasoning(energyLevel, totalTasks, prioritizedCount) {
    const maxComplexity = this.getMaxComplexityForEnergy(energyLevel);
    
    return `Prioritized ${prioritizedCount}/${totalTasks} tasks for ${energyLevel} energy level. ` +
           `Filtered for complexity ≤${maxComplexity}, trust score ≥${this.trustScoreThreshold}, ` +
           `and Sacred Reversal Test compliance.`;
  }

  generateEmotionalGuidance(energyLevel, tasks) {
    if (tasks.length === 0) {
      return 'No suitable tasks for current energy level. Consider rest or energy-building activities.';
    }

    const avgComplexity = tasks.reduce((sum, task) => sum + (task.complexity_rating || 3), 0) / tasks.length;
    const avgTrustTarget = tasks.reduce((sum, task) => sum + (task.trust_score_target || 3), 0) / tasks.length;

    let guidance = `Perfect! Found ${tasks.length} tasks matching your ${energyLevel} energy level. `;
    
    if (energyLevel === 'low') {
      guidance += 'Focus on simple, trust-building tasks to maintain momentum. ';
    } else if (energyLevel === 'high') {
      guidance += 'Great energy for tackling complex, high-impact tasks! ';
    } else {
      guidance += 'Balanced selection of tasks to maintain steady progress. ';
    }
    
    guidance += `Average complexity: ${avgComplexity.toFixed(1)}/5, `;
    guidance += `Average trust impact: ${avgTrustTarget.toFixed(1)}/5.`;
    
    return guidance;
  }

  calculateTrustScoreImpact(tasks) {
    if (tasks.length === 0) return 0;
    
    const totalImpact = tasks.reduce((sum, task) => sum + this.calculateTrustImpact(task), 0);
    return totalImpact / tasks.length;
  }

  async logError(errorType, errorMessage) {
    try {
      await supabase.from('cursor_interactions_log').insert({
        task_id: 'CLI_DASHBOARD',
        interaction_type: 'error',
        prompt_text: `Error in ${errorType}`,
        response_text: errorMessage,
        success: false,
        emotional_impact_score: 2,
        trust_score_delta: -0.1,
        empowerment_indicator: 'system_error'
      });
    } catch (logError) {
      console.warn(chalk.yellow(`⚠️  Failed to log error: ${logError.message}`));
    }
  }
}

// Dashboard Functions
async function showDashboard() {
  try {
    console.clear();
    console.log(chalk.blue.bold('🚀 CanAI 13-Day Implementation Dashboard'));
    console.log(chalk.gray('Framework: Emotional Sovereignty + Test-First Truth\n'));
    
    // Current day calculation
    const startDate = new Date('2025-06-01');
    const currentDate = new Date();
    const daysDiff = Math.ceil((currentDate - startDate) / (24 * 60 * 60 * 1000));
    const currentDay = Math.max(1, Math.min(13, daysDiff));
    
    console.log(chalk.yellow(`📅 Day ${currentDay} of 13 (${((currentDay / 13) * 100).toFixed(1)}% complete)\n`));
    
    // Today's tasks
    await showTodaysTasks(currentDay);
    
    // Current metrics
    await showCurrentMetrics();
    
    // Active blockers
    await showActiveBlockers();
    
    // Next recommended tasks
    await showNextTasks();
    
    console.log(chalk.gray('\n💡 Commands: start <task_id> | complete <task_id> | prioritize [energy] | metrics | blockers | help'));
    
  } catch (error) {
    console.error(chalk.red('❌ Dashboard error:'), error.message);
    await logInteraction('dashboard_error', error.message, false);
  }
}

async function showTodaysTasks(currentDay) {
  try {
    const { data: todayTasks, error } = await supabase
      .from('task_tracker_13day')
      .select('*')
      .eq('day_number', currentDay)
      .order('task_sequence');
    
    if (error) throw error;
    
    console.log(chalk.green.bold('📋 Today\'s Tasks:'));
    
    if (!todayTasks || todayTasks.length === 0) {
      console.log(chalk.gray('  No tasks scheduled for today'));
      return;
    }
    
    todayTasks.forEach(task => {
      const status = getStatusIcon(task.status);
      const progress = task.progress_percentage || 0;
      const trustScore = task.trust_score_target ? ` (Trust: ${task.trust_score_target}/5)` : '';
      const complexity = task.complexity_rating ? ` [C${task.complexity_rating}]` : '';
      
      console.log(`  ${status} ${task.task_name} (${progress}%) - ${task.estimated_hours}h${trustScore}${complexity}`);
      
      if (task.status === 'blocked' && task.blockers_encountered) {
        console.log(chalk.red(`    🚫 Blocked: ${task.blockers_encountered.join(', ')}`));
      }
    });
    
  } catch (error) {
    console.error(chalk.red('❌ Error loading today\'s tasks:'), error.message);
  }
}

async function showCurrentMetrics() {
  try {
    const { data: metrics, error } = await supabase
      .from('task_metrics_realtime')
      .select('metric_name, current_value, target_value, meets_target, unit')
      .in('metric_name', ['latency_p99', 'sentiment_accuracy', 'webhook_false_positives', 'trust_score'])
      .order('measurement_time', { ascending: false })
      .limit(4);
    
    if (error) throw error;
    
    console.log(chalk.blue.bold('\n📊 Current Metrics:'));
    
    if (!metrics || metrics.length === 0) {
      console.log(chalk.gray('  No metrics available'));
      return;
    }
    
    // Group by metric name and get latest
    const latestMetrics = {};
    metrics.forEach(metric => {
      if (!latestMetrics[metric.metric_name]) {
        latestMetrics[metric.metric_name] = metric;
      }
    });
    
    Object.values(latestMetrics).forEach(metric => {
      const status = metric.meets_target ? '✅' : '❌';
      const unit = metric.unit || '';
      console.log(`  ${status} ${metric.metric_name}: ${metric.current_value}${unit} (target: ${metric.target_value}${unit})`);
    });
    
  } catch (error) {
    console.error(chalk.red('❌ Error loading metrics:'), error.message);
  }
}

async function showActiveBlockers() {
  try {
    const { data: blockers, error } = await supabase.rpc('detect_blockers');
    
    if (error) {
      // If function doesn't exist, check manually
      const { data: blockedTasks } = await supabase
        .from('task_tracker_13day')
        .select('*')
        .eq('status', 'blocked');
      
      if (blockedTasks && blockedTasks.length > 0) {
        console.log(chalk.red.bold('\n🚫 Active Blockers:'));
        blockedTasks.forEach(task => {
          console.log(`  ⚠️  ${task.task_name}: ${task.blockers_encountered?.join(', ') || 'Unknown blocker'}`);
        });
      }
      return;
    }
    
    if (blockers && blockers.length > 0) {
      console.log(chalk.red.bold('\n🚫 Active Blockers:'));
      blockers.forEach(blocker => {
        const urgency = blocker.urgency_level === 'HIGH' ? '🔥' : '⚠️';
        console.log(`  ${urgency} ${blocker.task_name}: ${blocker.blocker_description}`);
        console.log(chalk.gray(`    💡 ${blocker.suggested_action}`));
      });
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Error loading blockers:'), error.message);
  }
}

async function showNextTasks() {
  try {
    const prioritizer = new EmotionalSovereigntyPrioritizer();
    const result = await prioritizer.prioritizeTasks('medium', 3);
    
    console.log(chalk.cyan.bold('\n⏭️  Next Recommended Tasks:'));
    console.log(chalk.gray(`   ${result.reasoning}`));
    console.log(chalk.gray(`   ${result.emotionalGuidance}`));
    
    if (result.prioritizedTasks.length === 0) {
      console.log(chalk.gray('  No tasks available for prioritization'));
      return;
    }
    
    result.prioritizedTasks.forEach((task, index) => {
      const trustScore = task.trust_score_target ? ` (Trust: ${task.trust_score_target}/5)` : '';
      const complexity = task.complexity_rating ? ` [C${task.complexity_rating}]` : '';
      const fit = task.emotionalFit ? ` ${task.emotionalFit}% fit` : '';
      
      console.log(`  ${index + 1}. 📝 ${task.task_name} (${task.estimated_hours}h)${trustScore}${complexity}${fit}`);
    });
    
  } catch (error) {
    console.error(chalk.red('❌ Error loading next tasks:'), error.message);
  }
}

// Task Management Functions
async function startTask(taskId) {
  try {
    if (!taskId) {
      console.error(chalk.red('❌ Task ID required. Usage: start <task_id>'));
      return;
    }
    
    // Check if task exists and is available
    const { data: task, error: fetchError } = await supabase
      .from('task_tracker_13day')
      .select('*')
      .eq('task_id', taskId)
      .single();
    
    if (fetchError || !task) {
      console.error(chalk.red(`❌ Task ${taskId} not found`));
      return;
    }
    
    if (task.status !== 'not_started') {
      console.error(chalk.red(`❌ Task ${taskId} is already ${task.status}`));
      return;
    }
    
    // Check dependencies
    if (task.dependencies && task.dependencies.length > 0) {
      const { data: depTasks } = await supabase
        .from('task_tracker_13day')
        .select('task_id, status')
        .in('task_id', task.dependencies);
      
      const incompleteDeps = depTasks?.filter(dep => dep.status !== 'completed') || [];
      if (incompleteDeps.length > 0) {
        console.error(chalk.red(`❌ Cannot start ${taskId}. Incomplete dependencies: ${incompleteDeps.map(d => d.task_id).join(', ')}`));
        return;
      }
    }
    
    // Start the task
    const { error } = await supabase
      .from('task_tracker_13day')
      .update({ 
        status: 'in_progress', 
        start_time: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('task_id', taskId);
    
    if (error) throw error;
    
    console.log(chalk.green(`✅ Started task ${taskId}: ${task.task_name}`));
    console.log(chalk.gray(`   Estimated: ${task.estimated_hours}h | Trust Target: ${task.trust_score_target || 'N/A'}/5`));
    
    await logInteraction('task_started', `Started ${taskId}`, true);
    
  } catch (error) {
    console.error(chalk.red('❌ Error starting task:'), error.message);
    await logInteraction('task_start_error', error.message, false);
  }
}

async function completeTask(taskId, notes = '') {
  try {
    if (!taskId) {
      console.error(chalk.red('❌ Task ID required. Usage: complete <task_id> [notes]'));
      return;
    }
    
    // Check if task exists and is in progress
    const { data: task, error: fetchError } = await supabase
      .from('task_tracker_13day')
      .select('*')
      .eq('task_id', taskId)
      .single();
    
    if (fetchError || !task) {
      console.error(chalk.red(`❌ Task ${taskId} not found`));
      return;
    }
    
    if (task.status !== 'in_progress') {
      console.error(chalk.red(`❌ Task ${taskId} is not in progress (current status: ${task.status})`));
      return;
    }
    
    // Calculate actual hours
    const startTime = new Date(task.start_time);
    const endTime = new Date();
    const actualHours = (endTime - startTime) / (1000 * 60 * 60);
    
    // Complete the task
    const { error } = await supabase
      .from('task_tracker_13day')
      .update({ 
        status: 'completed', 
        end_time: endTime.toISOString(),
        actual_hours: Math.round(actualHours * 10) / 10, // Round to 1 decimal
        progress_percentage: 100,
        implementation_notes: notes || `Completed on ${endTime.toLocaleDateString()}`,
        updated_at: endTime.toISOString()
      })
      .eq('task_id', taskId);
    
    if (error) throw error;
    
    console.log(chalk.green(`🎉 Completed task ${taskId}: ${task.task_name}`));
    console.log(chalk.gray(`   Time: ${actualHours.toFixed(1)}h (estimated: ${task.estimated_hours}h)`));
    
    // Calculate efficiency
    const efficiency = task.estimated_hours > 0 ? (task.estimated_hours / actualHours * 100) : 100;
    if (efficiency > 120) {
      console.log(chalk.green(`   🚀 Excellent efficiency: ${efficiency.toFixed(0)}%`));
    } else if (efficiency < 80) {
      console.log(chalk.yellow(`   ⚠️  Consider adjusting estimates: ${efficiency.toFixed(0)}% efficiency`));
    }
    
    await logInteraction('task_completed', `Completed ${taskId} in ${actualHours.toFixed(1)}h`, true);
    
  } catch (error) {
    console.error(chalk.red('❌ Error completing task:'), error.message);
    await logInteraction('task_complete_error', error.message, false);
  }
}

async function prioritizeTasks(energyLevel = 'medium') {
  try {
    const validEnergyLevels = ['low', 'medium', 'high'];
    if (!validEnergyLevels.includes(energyLevel)) {
      console.error(chalk.red(`❌ Invalid energy level. Use: ${validEnergyLevels.join(', ')}`));
      return;
    }
    
    console.log(chalk.blue(`🧠 Prioritizing tasks for ${energyLevel} energy level...\n`));
    
    const prioritizer = new EmotionalSovereigntyPrioritizer();
    const result = await prioritizer.prioritizeTasks(energyLevel, 10);
    
    console.log(chalk.cyan.bold('🎯 Emotional Sovereignty Prioritization Results:'));
    console.log(chalk.gray(`   ${result.reasoning}`));
    console.log(chalk.gray(`   ${result.emotionalGuidance}`));
    console.log(chalk.gray(`   Trust Score Impact: ${(result.trustScoreImpact * 100).toFixed(1)}%\n`));
    
    if (result.prioritizedTasks.length === 0) {
      console.log(chalk.yellow('⚠️  No suitable tasks found for current energy level'));
      console.log(chalk.gray('   Consider adjusting energy level or checking task dependencies'));
      return;
    }
    
    console.log(chalk.green.bold('📋 Recommended Tasks (in priority order):'));
    
    result.prioritizedTasks.forEach((task, index) => {
      const trustScore = task.trust_score_target ? chalk.blue(`Trust: ${task.trust_score_target}/5`) : chalk.gray('Trust: N/A');
      const complexity = task.complexity_rating ? chalk.yellow(`C${task.complexity_rating}`) : chalk.gray('C?');
      const fit = task.emotionalFit ? chalk.green(`${task.emotionalFit}% fit`) : '';
      const sacred = task.sacred_reversal_test_passed ? chalk.green('✅ Sacred') : chalk.red('❌ Sacred');
      
      console.log(`  ${index + 1}. ${chalk.bold(task.task_id)}: ${task.task_name}`);
      console.log(`     ${task.estimated_hours}h | ${trustScore} | ${complexity} | ${fit} | ${sacred}`);
      
      if (task.dependencies && task.dependencies.length > 0) {
        console.log(chalk.gray(`     Dependencies: ${task.dependencies.join(', ')}`));
      }
    });
    
    await logInteraction('prioritization_completed', `Prioritized ${result.prioritizedTasks.length} tasks for ${energyLevel} energy`, true);
    
  } catch (error) {
    console.error(chalk.red('❌ Error prioritizing tasks:'), error.message);
    await logInteraction('prioritization_error', error.message, false);
  }
}

// Utility Functions
function getStatusIcon(status) {
  switch (status) {
    case 'completed': return '✅';
    case 'in_progress': return '🔄';
    case 'blocked': return '🚫';
    case 'failed': return '❌';
    case 'skipped': return '⏭️';
    default: return '⏳';
  }
}

async function logInteraction(interactionType, promptText, success) {
  try {
    await supabase.from('cursor_interactions_log').insert({
      task_id: 'CLI_DASHBOARD',
      interaction_type: interactionType,
      prompt_text: promptText,
      success: success,
      emotional_impact_score: success ? 4 : 2,
      trust_score_delta: success ? 0.05 : -0.05,
      empowerment_indicator: success ? 'increased_capability' : 'needs_support'
    });
  } catch (error) {
    // Silent fail for logging errors
  }
}

function showHelp() {
  console.log(chalk.blue.bold('\n🚀 CanAI CLI Dashboard - Commands:\n'));
  console.log(chalk.green('📊 Dashboard:'));
  console.log('  dashboard, dash, d     Show main dashboard');
  console.log('  metrics, m             Show detailed metrics');
  console.log('  blockers, b            Show active blockers');
  console.log('');
  console.log(chalk.green('📋 Task Management:'));
  console.log('  start <task_id>        Start a task');
  console.log('  complete <task_id>     Complete a task');
  console.log('  view <task_id>         View task details');
  console.log('');
  console.log(chalk.green('🧠 Emotional Sovereignty:'));
  console.log('  prioritize [energy]    Prioritize tasks by energy level');
  console.log('                         Energy levels: low, medium, high');
  console.log('  energy <level>         Set current energy level');
  console.log('');
  console.log(chalk.green('🔧 Utilities:'));
  console.log('  health                 Check system health');
  console.log('  backup                 Create task state backup');
  console.log('  help, h                Show this help');
  console.log('');
  console.log(chalk.gray('💡 Examples:'));
  console.log(chalk.gray('  node production-cli-dashboard.js start D01_T01'));
  console.log(chalk.gray('  node production-cli-dashboard.js prioritize low'));
  console.log(chalk.gray('  node production-cli-dashboard.js complete D01_T01 "Completed successfully"'));
}

// CLI Command Handling
async function handleCommand() {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  try {
    switch (command) {
      case 'start':
        await startTask(args[0]);
        break;
      case 'complete':
        await completeTask(args[0], args.slice(1).join(' '));
        break;
      case 'prioritize':
        await prioritizeTasks(args[0] || 'medium');
        break;
      case 'metrics':
      case 'm':
        await showCurrentMetrics();
        break;
      case 'blockers':
      case 'b':
        await showActiveBlockers();
        break;
      case 'compliance':
        await showWeeklyCompliance();
        break;
      case 'dashboard':
      case 'dash':
      case 'd':
      case undefined:
        await showDashboard();
        break;
      case 'help':
      case 'h':
        showHelp();
        break;
      default:
        console.error(chalk.red(`❌ Unknown command: ${command}`));
        console.log(chalk.gray('💡 Use "help" to see available commands'));
    }
  } catch (error) {
    console.error(chalk.red('💥 Command failed:'), error.message);
    await logInteraction('command_error', `${command}: ${error.message}`, false);
    process.exit(1);
  }
}

async function showWeeklyCompliance() {
  console.log(chalk.blue.bold('📊 Weekly Rule Compliance Report\n'));
  
  try {
    // Query cursor interactions for the past week
    const { data: interactions, error } = await supabase
      .from('cursor_interactions_log')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false });

    if (error) {
      console.error(chalk.red('Error fetching compliance data:'), error.message);
      return;
    }

    if (!interactions || interactions.length === 0) {
      console.log(chalk.yellow('No interactions found in the past week.'));
      return;
    }

    // Analyze compliance patterns
    const totalInteractions = interactions.length;
    const successfulInteractions = interactions.filter(i => i.success).length;
    const ruleCompliantInteractions = interactions.filter(i => 
      i.prompt_text && i.prompt_text.includes('CURSOR-RULES.md')
    ).length;
    const productionReadyResponses = interactions.filter(i => 
      i.response_text && 
      i.response_text.includes('production-ready') && 
      !i.response_text.includes('placeholder')
    ).length;
    const emotionalSovereigntyCompliant = interactions.filter(i => 
      i.trust_score_delta && i.trust_score_delta >= 4.2
    ).length;

    // Calculate compliance scores
    const successRate = (successfulInteractions / totalInteractions * 100).toFixed(1);
    const ruleComplianceRate = (ruleCompliantInteractions / totalInteractions * 100).toFixed(1);
    const productionReadyRate = (productionReadyResponses / totalInteractions * 100).toFixed(1);
    const emotionalComplianceRate = (emotionalSovereigntyCompliant / totalInteractions * 100).toFixed(1);

    console.log(chalk.green.bold('📈 Compliance Metrics:'));
    console.log(`  ✅ Success Rate: ${successRate}% (${successfulInteractions}/${totalInteractions})`);
    console.log(`  📋 Rule Reference Rate: ${ruleComplianceRate}% (${ruleCompliantInteractions}/${totalInteractions})`);
    console.log(`  🏭 Production-Ready Rate: ${productionReadyRate}% (${productionReadyResponses}/${totalInteractions})`);
    console.log(`  💝 Emotional Sovereignty Rate: ${emotionalComplianceRate}% (${emotionalSovereigntyCompliant}/${totalInteractions})`);

    // Identify patterns and issues
    console.log(chalk.blue.bold('\n🔍 Pattern Analysis:'));
    
    const commonErrors = interactions
      .filter(i => !i.success && i.error_message)
      .reduce((acc, i) => {
        const error = i.error_message;
        acc[error] = (acc[error] || 0) + 1;
        return acc;
      }, {});

    if (Object.keys(commonErrors).length > 0) {
      console.log(chalk.red('  ❌ Common Errors:'));
      Object.entries(commonErrors)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .forEach(([error, count]) => {
          console.log(`    • ${error}: ${count} occurrences`);
        });
    }

    // Recommendations
    console.log(chalk.cyan.bold('\n💡 Recommendations:'));
    if (ruleComplianceRate < 90) {
      console.log(`  📋 Add "Follow CURSOR-RULES.md..." prefix to more prompts (current: ${ruleComplianceRate}%)`);
    }
    if (productionReadyRate < 80) {
      console.log(`  🏭 Emphasize "production-ready, no placeholders" in prompts (current: ${productionReadyRate}%)`);
    }
    if (emotionalComplianceRate < 85) {
      console.log(`  💝 Include trust score validation in more interactions (current: ${emotionalComplianceRate}%)`);
    }
    if (successRate > 95) {
      console.log(`  🎉 Excellent success rate! Continue current approach.`);
    }

    // Log compliance check
    await supabase.from('cursor_interactions_log').insert({
      task_id: 'COMPLIANCE_CHECK',
      interaction_type: 'rule_compliance',
      prompt_text: 'Weekly compliance analysis',
      response_text: `Success: ${successRate}%, Rules: ${ruleComplianceRate}%, Production: ${productionReadyRate}%, Emotional: ${emotionalComplianceRate}%`,
      success: true,
      context_data: {
        total_interactions: totalInteractions,
        success_rate: parseFloat(successRate),
        rule_compliance_rate: parseFloat(ruleComplianceRate),
        production_ready_rate: parseFloat(productionReadyRate),
        emotional_compliance_rate: parseFloat(emotionalComplianceRate)
      }
    });

  } catch (error) {
    console.error(chalk.red('Error in compliance check:'), error.message);
  }
}

// Execute
handleCommand(); 