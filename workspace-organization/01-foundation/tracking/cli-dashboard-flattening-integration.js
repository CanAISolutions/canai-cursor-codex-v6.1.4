#!/usr/bin/env node
// CanAI TASK F1: CLI Dashboard Flattening Integration
// Sacred Covenant: Display flattened JSONB data with emotional sovereignty prioritization
// Target: Real-time flattened data display with trust transparency
// Framework: Codex v6.1.4 - Emotional Sovereignty + Test-First Truth

const { createClient } = require('@supabase/supabase-js');
const chalk = require('chalk');
const Table = require('cli-table3');
const ora = require('ora');
const inquirer = require('inquirer');

// Environment validation
function validateEnvironment() {
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
  const missing = required.filter(env => !process.env[env]);
  
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

// CLI Dashboard with Flattened Data Integration
class FlattenedDataDashboard {
  constructor() {
    this.trustScoreThreshold = 4.2;
    this.performanceThreshold = 200; // ms
  }

  async showFlattenedTaskOverview() {
    try {
      console.log(chalk.cyan('\n🚀 TASK F1: Flattened Task Overview (Emotional Sovereignty Priority)\n'));
      
      const { data: tasks, error } = await supabase
        .rpc('flatten_all_active_tasks');
      
      if (error) {
        console.error(chalk.red('❌ Error fetching flattened tasks:'), error.message);
        return;
      }
      
      if (!tasks || tasks.length === 0) {
        console.log(chalk.yellow('📋 No active tasks found'));
        return;
      }
      
      // Display header
      console.log(chalk.bold.white('Task ID'.padEnd(15)) + 
                  chalk.bold.white('Trust Score'.padEnd(12)) + 
                  chalk.bold.white('Performance'.padEnd(12)) + 
                  chalk.bold.white('Energy Fit'.padEnd(20)) + 
                  chalk.bold.white('Priority'.padEnd(10)) + 
                  chalk.bold.white('Sacred Reversal'));
      console.log(chalk.gray('─'.repeat(85)));
      
      // Display tasks with emotional sovereignty prioritization
      tasks.forEach(task => {
        const trustColor = task.trust_score >= this.trustScoreThreshold ? chalk.green : chalk.red;
        const performanceColor = task.performance_status === 'optimal' ? chalk.green : 
                                task.performance_status === 'acceptable' ? chalk.yellow : chalk.red;
        const energyColor = task.energy_fit === 'low_energy_suitable' ? chalk.green :
                           task.energy_fit === 'medium_energy_suitable' ? chalk.yellow : chalk.red;
        const sacredColor = task.sacred_reversal_passed ? chalk.green : chalk.red;
        
        console.log(
          chalk.white(task.task_id.padEnd(15)) +
          trustColor(task.trust_score.toFixed(1).padEnd(12)) +
          performanceColor(task.performance_status.padEnd(12)) +
          energyColor(task.energy_fit.padEnd(20)) +
          chalk.cyan(task.priority_score.toFixed(0).padEnd(10)) +
          sacredColor(task.sacred_reversal_passed ? '✅' : '❌')
        );
      });
      
      // Display summary statistics
      const avgTrustScore = tasks.reduce((sum, task) => sum + task.trust_score, 0) / tasks.length;
      const optimalPerformanceCount = tasks.filter(task => task.performance_status === 'optimal').length;
      const sacredCompliantCount = tasks.filter(task => task.sacred_reversal_passed).length;
      
      console.log(chalk.gray('\n─'.repeat(85)));
      console.log(chalk.bold.cyan('📊 Emotional Sovereignty Summary:'));
      console.log(chalk.white(`   Average Trust Score: ${avgTrustScore >= this.trustScoreThreshold ? chalk.green(avgTrustScore.toFixed(2)) : chalk.red(avgTrustScore.toFixed(2))}`));
      console.log(chalk.white(`   Optimal Performance: ${chalk.cyan(optimalPerformanceCount)}/${tasks.length} tasks`));
      console.log(chalk.white(`   Sacred Reversal Compliance: ${chalk.green(sacredCompliantCount)}/${tasks.length} tasks`));
      
    } catch (error) {
      console.error(chalk.red('❌ Dashboard error:'), error.message);
    }
  }

  async showDetailedTaskMetrics(taskId) {
    try {
      console.log(chalk.cyan(`\n🔍 TASK F1: Detailed Metrics for ${taskId}\n`));
      
      const { data: taskMetrics, error } = await supabase
        .rpc('flatten_task_metrics', { task_id_param: taskId });
      
      if (error) {
        console.error(chalk.red('❌ Error fetching task metrics:'), error.message);
        return;
      }
      
      if (!taskMetrics || taskMetrics.length === 0) {
        console.log(chalk.yellow(`📋 No metrics found for task ${taskId}`));
        return;
      }
      
      const task = taskMetrics[0];
      
      // Display task header
      console.log(chalk.bold.white(`📋 ${task.task_name}`));
      console.log(chalk.gray(`   Status: ${task.status} | Progress: ${task.progress_percentage}%`));
      console.log(chalk.gray(`   Complexity: ${task.complexity_rating}/5 | Energy Level: ${task.energy_level}`));
      
      // Emotional Sovereignty Metrics
      console.log(chalk.bold.cyan('\n🌟 Emotional Sovereignty Metrics:'));
      const trustColor = task.trust_score >= this.trustScoreThreshold ? chalk.green : chalk.red;
      console.log(chalk.white(`   Trust Score: ${trustColor(task.trust_score.toFixed(2))} (Target: ${this.trustScoreThreshold})`));
      console.log(chalk.white(`   Emotional Impact: ${chalk.cyan(task.emotional_impact_score)}/5`));
      console.log(chalk.white(`   User Empowerment: ${chalk.cyan((task.user_empowerment_score * 100).toFixed(1))}%`));
      console.log(chalk.white(`   Sacred Reversal Test: ${task.sacred_reversal_passed ? chalk.green('✅ PASSED') : chalk.red('❌ FAILED')}`));
      
      // Performance Metrics
      console.log(chalk.bold.cyan('\n⚡ Performance Metrics:'));
      const latencyColor = task.p99_latency < this.performanceThreshold ? chalk.green : chalk.red;
      console.log(chalk.white(`   P99 Latency: ${latencyColor(task.p99_latency)}ms (Target: <${this.performanceThreshold}ms)`));
      console.log(chalk.white(`   Avg Response Time: ${chalk.cyan(task.avg_response_time)}ms`));
      console.log(chalk.white(`   Error Rate: ${chalk.cyan((task.error_rate * 100).toFixed(2))}%`));
      console.log(chalk.white(`   Throughput: ${chalk.cyan(task.throughput)} req/min`));
      
      // Trust Transparency Indicators
      console.log(chalk.bold.cyan('\n🔍 Trust Transparency:'));
      const trustDeltaColor = task.trust_delta >= 0 ? chalk.green : chalk.red;
      console.log(chalk.white(`   Trust Delta: ${trustDeltaColor(task.trust_delta >= 0 ? '+' : '')}${trustDeltaColor(task.trust_delta.toFixed(2))}`));
      console.log(chalk.white(`   Empowerment Trend: ${this.getEmpowermentTrendColor(task.empowerment_trend)(task.empowerment_trend)}`));
      console.log(chalk.white(`   Performance Status: ${this.getPerformanceStatusColor(task.performance_status)(task.performance_status)}`));
      
      // Time Tracking
      console.log(chalk.bold.cyan('\n⏱️  Time Tracking:'));
      console.log(chalk.white(`   Estimated Hours: ${chalk.cyan(task.estimated_hours)}`));
      console.log(chalk.white(`   Actual Hours: ${chalk.cyan(task.actual_hours)}`));
      const efficiency = task.actual_hours > 0 ? (task.estimated_hours / task.actual_hours * 100) : 100;
      const efficiencyColor = efficiency >= 90 ? chalk.green : efficiency >= 70 ? chalk.yellow : chalk.red;
      console.log(chalk.white(`   Efficiency: ${efficiencyColor(efficiency.toFixed(1))}%`));
      
      // Timestamps
      if (task.start_time) {
        console.log(chalk.gray(`\n   Started: ${new Date(task.start_time).toLocaleString()}`));
      }
      if (task.end_time) {
        console.log(chalk.gray(`   Completed: ${new Date(task.end_time).toLocaleString()}`));
      }
      console.log(chalk.gray(`   Last Updated: ${new Date(task.last_updated).toLocaleString()}`));
      
    } catch (error) {
      console.error(chalk.red('❌ Task metrics error:'), error.message);
    }
  }

  async showPerformanceMonitoring() {
    try {
      console.log(chalk.cyan('\n📊 TASK F1: Performance Monitoring Dashboard\n'));
      
      // Get JSONB query performance
      const { data: queryPerformance, error: queryError } = await supabase
        .rpc('validate_jsonb_query_performance');
      
      if (queryError) {
        console.error(chalk.red('❌ Error fetching query performance:'), queryError.message);
        return;
      }
      
      // Get flattening function performance
      const { data: flatteningPerformance, error: flatteningError } = await supabase
        .rpc('monitor_flattening_performance');
      
      if (flatteningError) {
        console.error(chalk.red('❌ Error fetching flattening performance:'), flatteningError.message);
        return;
      }
      
      // Display JSONB Query Performance
      console.log(chalk.bold.cyan('🔍 JSONB Query Performance:'));
      if (queryPerformance && queryPerformance.length > 0) {
        queryPerformance.forEach(metric => {
          const statusColor = metric.performance_status === 'OPTIMAL' ? chalk.green :
                             metric.performance_status === 'ACCEPTABLE' ? chalk.yellow : chalk.red;
          console.log(chalk.white(`   ${metric.query_type}: ${statusColor(metric.performance_status)} (${metric.avg_execution_time}ms avg)`));
        });
      } else {
        console.log(chalk.gray('   No query performance data available'));
      }
      
      // Display Flattening Function Performance
      console.log(chalk.bold.cyan('\n🔄 Flattening Function Performance:'));
      if (flatteningPerformance && flatteningPerformance.length > 0) {
        flatteningPerformance.forEach(metric => {
          const statusColor = metric.performance_status === 'OPTIMAL' ? chalk.green :
                             metric.performance_status === 'ACCEPTABLE' ? chalk.yellow : chalk.red;
          const complianceColor = metric.emotional_sovereignty_compliance ? chalk.green : chalk.red;
          console.log(chalk.white(`   ${metric.function_name}: ${statusColor(metric.performance_status)} (${metric.avg_execution_time_ms}ms avg)`));
          console.log(chalk.gray(`     Emotional Sovereignty: ${complianceColor(metric.emotional_sovereignty_compliance ? '✅ Compliant' : '❌ Non-compliant')}`));
        });
      } else {
        console.log(chalk.gray('   No flattening performance data available'));
      }
      
      // Get emotional sovereignty compliance
      const { data: complianceData, error: complianceError } = await supabase
        .rpc('validate_flattening_emotional_sovereignty');
      
      if (!complianceError && complianceData) {
        console.log(chalk.bold.cyan('\n🌟 Emotional Sovereignty Compliance:'));
        complianceData.forEach(validation => {
          const statusColor = validation.compliance_status === 'COMPLIANT' ? chalk.green : chalk.red;
          console.log(chalk.white(`   ${validation.validation_type}: ${statusColor(validation.compliance_status)}`));
          console.log(chalk.gray(`     Trust Score Maintained: ${validation.trust_score_maintained ? chalk.green('✅') : chalk.red('❌')}`));
          console.log(chalk.gray(`     User Empowerment Preserved: ${validation.user_empowerment_preserved ? chalk.green('✅') : chalk.red('❌')}`));
          console.log(chalk.gray(`     Sacred Reversal Passed: ${validation.sacred_reversal_passed ? chalk.green('✅') : chalk.red('❌')}`));
        });
      }
      
    } catch (error) {
      console.error(chalk.red('❌ Performance monitoring error:'), error.message);
    }
  }

  async testFlatteningFunctions() {
    try {
      console.log(chalk.cyan('\n🧪 TASK F1: Flattening Functions Test\n'));
      
      // Test business plan flattening
      const testBusinessPlan = {
        businessName: 'Test AI Startup',
        industry: 'Artificial Intelligence',
        targetMarket: 'Small Businesses',
        financials: {
          revenueModel: 'SaaS Subscription',
          startupCosts: 50000,
          monthlyRevenueTarget: 10000,
          breakEvenMonths: 8
        },
        emotionalDrivers: {
          motivation: 'Empower small businesses with AI',
          fears: ['Market competition', 'Technical complexity'],
          successVision: 'Leading AI platform for SMBs',
          personalStakes: 'Financial independence and impact'
        },
        trustMetrics: {
          planConfidence: 4.3,
          empowermentLevel: 0.8
        }
      };
      
      console.log(chalk.bold.cyan('🏢 Testing Business Plan Flattening:'));
      const startTime = performance.now();
      
      const { data: flattenedData, error } = await supabase
        .rpc('flatten_product_interface', {
          interface_data: testBusinessPlan,
          product_type: 'business_plan'
        });
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      if (error) {
        console.error(chalk.red('❌ Flattening test failed:'), error.message);
        return;
      }
      
      // Display results
      const performanceColor = executionTime < 50 ? chalk.green : chalk.red;
      console.log(chalk.white(`   Execution Time: ${performanceColor(executionTime.toFixed(2))}ms (Target: <50ms)`));
      console.log(chalk.white(`   Product Type: ${chalk.cyan(flattenedData.product_type)}`));
      console.log(chalk.white(`   Business Name: ${chalk.cyan(flattenedData.business_name)}`));
      console.log(chalk.white(`   Revenue Model: ${chalk.cyan(flattenedData.revenue_model)}`));
      console.log(chalk.white(`   Startup Costs: ${chalk.cyan('$' + flattenedData.startup_costs.toLocaleString())}`));
      console.log(chalk.white(`   Trust in Plan: ${flattenedData.trust_in_plan >= 4.2 ? chalk.green(flattenedData.trust_in_plan) : chalk.red(flattenedData.trust_in_plan)}`));
      console.log(chalk.white(`   Sacred Reversal: ${flattenedData.sacred_reversal_passed ? chalk.green('✅ PASSED') : chalk.red('❌ FAILED')}`));
      console.log(chalk.white(`   Emotional Sovereignty: ${flattenedData.emotional_sovereignty_validated ? chalk.green('✅ VALIDATED') : chalk.red('❌ FAILED')}`));
      
      // Test error handling
      console.log(chalk.bold.cyan('\n🚨 Testing Error Handling:'));
      const { data: errorTest } = await supabase
        .rpc('flatten_product_interface', {
          interface_data: null,
          product_type: 'business_plan'
        });
      
      if (errorTest && errorTest.error) {
        console.log(chalk.white(`   Error Handling: ${chalk.green('✅ WORKING')}`));
        console.log(chalk.white(`   Error Type: ${chalk.cyan(errorTest.error)}`));
        console.log(chalk.white(`   User Guidance: ${chalk.cyan(errorTest.user_guidance)}`));
        console.log(chalk.white(`   Trust Impact: ${chalk.cyan(errorTest.trust_impact)}`));
        console.log(chalk.white(`   Emotional Sovereignty Maintained: ${errorTest.emotional_sovereignty_maintained ? chalk.green('✅') : chalk.red('❌')}`));
      }
      
    } catch (error) {
      console.error(chalk.red('❌ Flattening test error:'), error.message);
    }
  }

  getEmpowermentTrendColor(trend) {
    switch (trend) {
      case 'increasing': return chalk.green;
      case 'stable': return chalk.yellow;
      case 'needs_attention': return chalk.red;
      default: return chalk.gray;
    }
  }

  getPerformanceStatusColor(status) {
    switch (status) {
      case 'optimal': return chalk.green;
      case 'acceptable': return chalk.yellow;
      case 'needs_optimization': return chalk.red;
      default: return chalk.gray;
    }
  }
}

// Command line interface
async function main() {
  const dashboard = new FlattenedDataDashboard();
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log(chalk.bold.cyan('🚀 CanAI TASK F1: Flattened Data Dashboard'));
  console.log(chalk.gray('Sacred Covenant: Emotional Sovereignty + Performance Optimization\n'));
  
  switch (command) {
    case 'overview':
      await dashboard.showFlattenedTaskOverview();
      break;
      
    case 'task':
      const taskId = args[1];
      if (!taskId) {
        console.error(chalk.red('❌ Please provide a task ID: node cli-dashboard-flattening-integration.js task TASK_ID'));
        process.exit(1);
      }
      await dashboard.showDetailedTaskMetrics(taskId);
      break;
      
    case 'performance':
      await dashboard.showPerformanceMonitoring();
      break;
      
    case 'test':
      await dashboard.testFlatteningFunctions();
      break;
      
    case 'help':
    default:
      console.log(chalk.bold.white('Available Commands:'));
      console.log(chalk.cyan('  overview') + chalk.gray('     - Show flattened task overview with emotional sovereignty priority'));
      console.log(chalk.cyan('  task <id>') + chalk.gray('    - Show detailed metrics for specific task'));
      console.log(chalk.cyan('  performance') + chalk.gray('  - Show JSONB and flattening performance monitoring'));
      console.log(chalk.cyan('  test') + chalk.gray('        - Test flattening functions with sample data'));
      console.log(chalk.cyan('  help') + chalk.gray('        - Show this help message'));
      console.log(chalk.gray('\nExamples:'));
      console.log(chalk.gray('  node cli-dashboard-flattening-integration.js overview'));
      console.log(chalk.gray('  node cli-dashboard-flattening-integration.js task F1_001'));
      console.log(chalk.gray('  node cli-dashboard-flattening-integration.js performance'));
      console.log(chalk.gray('  node cli-dashboard-flattening-integration.js test'));
      break;
  }
}

// Run the dashboard
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ Dashboard error:'), error.message);
    process.exit(1);
  });
}

module.exports = { FlattenedDataDashboard }; 