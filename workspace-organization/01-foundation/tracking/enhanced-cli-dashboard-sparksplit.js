#!/usr/bin/env node
// 🌟 **ENHANCED CLI DASHBOARD WITH SPARKSPLIT ANALYTICS**
// Sacred Covenant: Enhanced dashboard with SparkSplit analytics and competitive advantage monitoring
// Target: Real-time SparkSplit analytics, emotional compass display, competitive advantage tracking
// Framework: Codex v6.1.4 - Emotional Sovereignty + Test-First Truth
// Created: 2025-06-01

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

// Enhanced CLI Dashboard with SparkSplit Analytics
class EnhancedSparkSplitDashboard {
  constructor() {
    this.trustScoreThreshold = 4.2;
    this.performanceThreshold = 2000; // ms for SparkSplit generation
    this.competitiveAdvantageThreshold = 0.7;
    this.sacredReversalThreshold = 0.95;
  }

  async showMainDashboard() {
    try {
      console.clear();
      console.log(chalk.bold.cyan('🌟 CanAI Enhanced CLI Dashboard with SparkSplit Analytics\n'));
      console.log(chalk.gray('Sacred Covenant: Trust transparency through competitive advantage monitoring\n'));
      
      // Show overview metrics
      await this.showOverviewMetrics();
      
      // Show SparkSplit analytics summary
      await this.showSparkSplitSummary();
      
      // Show competitive advantage status
      await this.showCompetitiveAdvantageStatus();
      
      // Show emotional sovereignty compliance
      await this.showEmotionalSovereigntyCompliance();
      
      console.log(chalk.gray('\n─'.repeat(80)));
      console.log(chalk.bold.white('Available Commands:'));
      console.log(chalk.cyan('  sparksplit    ') + chalk.gray('- SparkSplit analytics dashboard'));
      console.log(chalk.cyan('  competitive   ') + chalk.gray('- Competitive advantage monitoring'));
      console.log(chalk.cyan('  emotional     ') + chalk.gray('- Emotional compass scoring'));
      console.log(chalk.cyan('  trust         ') + chalk.gray('- Trust transparency metrics'));
      console.log(chalk.cyan('  performance   ') + chalk.gray('- Performance monitoring'));
      console.log(chalk.cyan('  help          ') + chalk.gray('- Show all commands'));
      console.log(chalk.cyan('  exit          ') + chalk.gray('- Exit dashboard'));
      
    } catch (error) {
      console.error(chalk.red('❌ Dashboard error:'), error.message);
    }
  }

  async showOverviewMetrics() {
    try {
      const spinner = ora('Loading overview metrics...').start();
      
      // Get overall system metrics
      const { data: metrics, error } = await supabase
        .rpc('get_sparksplit_analytics', { 
          date_range_days: 7,
          prompt_type_filter: null 
        });
      
      spinner.stop();
      
      if (error) {
        console.error(chalk.red('❌ Error fetching overview metrics:'), error.message);
        return;
      }
      
      console.log(chalk.bold.cyan('📊 System Overview (Last 7 Days)\n'));
      
      if (!metrics || metrics.length === 0) {
        console.log(chalk.yellow('📋 No metrics data available'));
        return;
      }
      
      // Create metrics table
      const table = new Table({
        head: ['Metric', 'Current', 'Target', 'Status', 'Trend'],
        colWidths: [25, 12, 12, 12, 15]
      });
      
      metrics.forEach(metric => {
        const statusColor = metric.status === 'healthy' ? chalk.green : 
                           metric.status === 'warning' ? chalk.yellow : chalk.red;
        const trendColor = metric.trend === 'improving' || metric.trend === 'growing' ? chalk.green :
                          metric.trend === 'stable' ? chalk.yellow : chalk.red;
        
        table.push([
          chalk.white(metric.metric_name.replace(/_/g, ' ').toUpperCase()),
          chalk.cyan(this.formatMetricValue(metric.current_value, metric.metric_name)),
          chalk.gray(this.formatMetricValue(metric.target_value, metric.metric_name)),
          statusColor(metric.status.toUpperCase()),
          trendColor(metric.trend.toUpperCase())
        ]);
      });
      
      console.log(table.toString());
      
    } catch (error) {
      console.error(chalk.red('❌ Overview metrics error:'), error.message);
    }
  }

  async showSparkSplitSummary() {
    try {
      console.log(chalk.bold.cyan('\n🚀 SparkSplit Analytics Summary\n'));
      
      // Get recent SparkSplit comparisons
      const { data: comparisons, error } = await supabase
        .from('sparksplit_comparisons')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error(chalk.red('❌ Error fetching SparkSplit data:'), error.message);
        return;
      }
      
      if (!comparisons || comparisons.length === 0) {
        console.log(chalk.yellow('📋 No SparkSplit comparisons found'));
        return;
      }
      
      // Display recent comparisons
      console.log(chalk.white('Recent Comparisons:'));
      comparisons.forEach((comp, index) => {
        const trustColor = comp.trust_delta >= 0.3 ? chalk.green : chalk.yellow;
        const advantageColor = comp.competitive_advantage >= this.competitiveAdvantageThreshold ? chalk.green : chalk.red;
        const sacredColor = comp.sacred_reversal_passed ? chalk.green : chalk.red;
        
        console.log(chalk.gray(`  ${index + 1}. ${comp.prompt_type} (${new Date(comp.created_at).toLocaleTimeString()})`));
        console.log(chalk.white(`     Trust Δ: ${trustColor(comp.trust_delta?.toFixed(2) || '0.00')} | `) +
                   chalk.white(`Advantage: ${advantageColor((comp.competitive_advantage * 100)?.toFixed(1) || '0.0')}% | `) +
                   chalk.white(`Sacred: ${sacredColor(comp.sacred_reversal_passed ? '✅' : '❌')}`));
      });
      
      // Calculate summary stats
      const avgTrustDelta = comparisons.reduce((sum, comp) => sum + (comp.trust_delta || 0), 0) / comparisons.length;
      const avgAdvantage = comparisons.reduce((sum, comp) => sum + (comp.competitive_advantage || 0), 0) / comparisons.length;
      const sacredPassRate = comparisons.filter(comp => comp.sacred_reversal_passed).length / comparisons.length;
      
      console.log(chalk.gray('\nSummary:'));
      console.log(chalk.white(`  Avg Trust Delta: ${avgTrustDelta >= 0.3 ? chalk.green(avgTrustDelta.toFixed(2)) : chalk.yellow(avgTrustDelta.toFixed(2))}`));
      console.log(chalk.white(`  Avg Competitive Advantage: ${avgAdvantage >= this.competitiveAdvantageThreshold ? chalk.green((avgAdvantage * 100).toFixed(1)) : chalk.red((avgAdvantage * 100).toFixed(1))}%`));
      console.log(chalk.white(`  Sacred Reversal Pass Rate: ${sacredPassRate >= this.sacredReversalThreshold ? chalk.green((sacredPassRate * 100).toFixed(1)) : chalk.red((sacredPassRate * 100).toFixed(1))}%`));
      
    } catch (error) {
      console.error(chalk.red('❌ SparkSplit summary error:'), error.message);
    }
  }

  async showCompetitiveAdvantageStatus() {
    try {
      console.log(chalk.bold.cyan('\n🎯 Competitive Advantage Status\n'));
      
      // Get competitive advantage insights
      const { data: insights, error } = await supabase
        .rpc('get_competitive_advantage_insights');
      
      if (error) {
        console.error(chalk.red('❌ Error fetching competitive insights:'), error.message);
        return;
      }
      
      if (!insights || insights.length === 0) {
        console.log(chalk.yellow('📋 No competitive advantage data available'));
        return;
      }
      
      // Display competitive advantages
      insights.forEach(insight => {
        const valueColor = insight.metric_value >= 0.9 ? chalk.green :
                          insight.metric_value >= 0.7 ? chalk.yellow : chalk.red;
        const positionColor = insight.competitive_position === 'first_in_market' || 
                             insight.competitive_position === 'unbeatable' ? chalk.green : chalk.cyan;
        
        console.log(chalk.white(`${insight.insight_type.replace(/_/g, ' ').toUpperCase()}:`));
        console.log(chalk.white(`  Score: ${valueColor((insight.metric_value * 100).toFixed(1))}% | `) +
                   chalk.white(`Position: ${positionColor(insight.competitive_position.replace(/_/g, ' '))} | `) +
                   chalk.white(`Impact: ${chalk.cyan(insight.market_impact.replace(/_/g, ' '))}`));
        console.log(chalk.gray(`  Replication Difficulty: ${insight.replication_difficulty.replace(/_/g, ' ')}\n`));
      });
      
    } catch (error) {
      console.error(chalk.red('❌ Competitive advantage error:'), error.message);
    }
  }

  async showEmotionalSovereigntyCompliance() {
    try {
      console.log(chalk.bold.cyan('\n🌟 Emotional Sovereignty Compliance\n'));
      
      // Get recent trust transparency metrics
      const { data: trustMetrics, error } = await supabase
        .from('trust_transparency_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error(chalk.red('❌ Error fetching trust metrics:'), error.message);
        return;
      }
      
      if (!trustMetrics || trustMetrics.length === 0) {
        console.log(chalk.yellow('📋 No trust transparency data available'));
        return;
      }
      
      // Calculate compliance metrics
      const avgTrustImpact = trustMetrics.reduce((sum, metric) => sum + (metric.trust_impact_score || 0), 0) / trustMetrics.length;
      const avgEducationalValue = trustMetrics.reduce((sum, metric) => sum + (metric.educational_value || 0), 0) / trustMetrics.length;
      const avgEmotionalResonance = trustMetrics.reduce((sum, metric) => sum + (metric.emotional_resonance_score || 0), 0) / trustMetrics.length;
      
      const sacredCompliance = {
        makes_user_feel_seen: trustMetrics.filter(m => m.makes_user_feel_seen).length / trustMetrics.length,
        makes_user_feel_empowered: trustMetrics.filter(m => m.makes_user_feel_empowered).length / trustMetrics.length,
        makes_user_feel_less_alone: trustMetrics.filter(m => m.makes_user_feel_less_alone).length / trustMetrics.length,
        builds_trust_with_dreams: trustMetrics.filter(m => m.builds_trust_with_dreams).length / trustMetrics.length
      };
      
      // Display compliance metrics
      console.log(chalk.white('Trust Building Metrics:'));
      console.log(chalk.white(`  Trust Impact Score: ${avgTrustImpact >= 0.7 ? chalk.green(avgTrustImpact.toFixed(2)) : chalk.yellow(avgTrustImpact.toFixed(2))}`));
      console.log(chalk.white(`  Educational Value: ${avgEducationalValue >= 0.8 ? chalk.green(avgEducationalValue.toFixed(2)) : chalk.yellow(avgEducationalValue.toFixed(2))}`));
      console.log(chalk.white(`  Emotional Resonance: ${avgEmotionalResonance >= 0.8 ? chalk.green(avgEmotionalResonance.toFixed(2)) : chalk.yellow(avgEmotionalResonance.toFixed(2))}`));
      
      console.log(chalk.white('\nSacred Reversal Test Compliance:'));
      Object.entries(sacredCompliance).forEach(([key, value]) => {
        const complianceColor = value >= 0.95 ? chalk.green : value >= 0.85 ? chalk.yellow : chalk.red;
        console.log(chalk.white(`  ${key.replace(/_/g, ' ')}: ${complianceColor((value * 100).toFixed(1))}%`));
      });
      
    } catch (error) {
      console.error(chalk.red('❌ Emotional sovereignty error:'), error.message);
    }
  }

  async showDetailedSparkSplitAnalytics() {
    try {
      console.clear();
      console.log(chalk.bold.cyan('🚀 Detailed SparkSplit Analytics Dashboard\n'));
      
      // Get comprehensive analytics
      const { data: analytics, error } = await supabase
        .rpc('get_sparksplit_analytics', { 
          date_range_days: 30,
          prompt_type_filter: null 
        });
      
      if (error) {
        console.error(chalk.red('❌ Error fetching analytics:'), error.message);
        return;
      }
      
      if (!analytics || analytics.length === 0) {
        console.log(chalk.yellow('📋 No analytics data available'));
        return;
      }
      
      // Create detailed analytics table
      const table = new Table({
        head: ['Metric', 'Current Value', 'Target', 'Status', 'Trend', 'Emotional Impact'],
        colWidths: [20, 15, 12, 12, 12, 18]
      });
      
      analytics.forEach(metric => {
        const statusColor = metric.status === 'healthy' ? chalk.green : 
                           metric.status === 'warning' ? chalk.yellow : chalk.red;
        const trendColor = this.getTrendColor(metric.trend);
        const impactColor = this.getEmotionalImpactColor(metric.emotional_impact);
        
        table.push([
          chalk.white(metric.metric_name.replace(/_/g, ' ')),
          chalk.cyan(this.formatMetricValue(metric.current_value, metric.metric_name)),
          chalk.gray(this.formatMetricValue(metric.target_value, metric.metric_name)),
          statusColor(metric.status),
          trendColor(metric.trend),
          impactColor(metric.emotional_impact)
        ]);
      });
      
      console.log(table.toString());
      
      // Show performance insights
      await this.showPerformanceInsights();
      
      // Show emotional compass breakdown
      await this.showEmotionalCompassBreakdown();
      
    } catch (error) {
      console.error(chalk.red('❌ Detailed analytics error:'), error.message);
    }
  }

  async showEmotionalCompassBreakdown() {
    try {
      console.log(chalk.bold.cyan('\n🧭 Emotional Compass Breakdown\n'));
      
      // Get recent comparisons with emotional compass scores
      const { data: comparisons, error } = await supabase
        .from('sparksplit_comparisons')
        .select('canai_awe_score, canai_ownership_score, canai_wonder_score, canai_calm_score, canai_power_score, sterile_awe_score, sterile_ownership_score, sterile_wonder_score, sterile_calm_score, sterile_power_score, created_at')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error(chalk.red('❌ Error fetching compass data:'), error.message);
        return;
      }
      
      if (!comparisons || comparisons.length === 0) {
        console.log(chalk.yellow('📋 No emotional compass data available'));
        return;
      }
      
      // Calculate average scores
      const compassMetrics = {
        awe: {
          canai: comparisons.reduce((sum, comp) => sum + (comp.canai_awe_score || 0), 0) / comparisons.length,
          sterile: comparisons.reduce((sum, comp) => sum + (comp.sterile_awe_score || 0), 0) / comparisons.length
        },
        ownership: {
          canai: comparisons.reduce((sum, comp) => sum + (comp.canai_ownership_score || 0), 0) / comparisons.length,
          sterile: comparisons.reduce((sum, comp) => sum + (comp.sterile_ownership_score || 0), 0) / comparisons.length
        },
        wonder: {
          canai: comparisons.reduce((sum, comp) => sum + (comp.canai_wonder_score || 0), 0) / comparisons.length,
          sterile: comparisons.reduce((sum, comp) => sum + (comp.sterile_wonder_score || 0), 0) / comparisons.length
        },
        calm: {
          canai: comparisons.reduce((sum, comp) => sum + (comp.canai_calm_score || 0), 0) / comparisons.length,
          sterile: comparisons.reduce((sum, comp) => sum + (comp.sterile_calm_score || 0), 0) / comparisons.length
        },
        power: {
          canai: comparisons.reduce((sum, comp) => sum + (comp.canai_power_score || 0), 0) / comparisons.length,
          sterile: comparisons.reduce((sum, comp) => sum + (comp.sterile_power_score || 0), 0) / comparisons.length
        }
      };
      
      // Display compass comparison
      Object.entries(compassMetrics).forEach(([dimension, scores]) => {
        const advantage = scores.canai - scores.sterile;
        const advantageColor = advantage > 0.2 ? chalk.green : advantage > 0.1 ? chalk.yellow : chalk.red;
        
        console.log(chalk.white(`${dimension.toUpperCase()}:`));
        console.log(chalk.white(`  CanAI: ${chalk.cyan(scores.canai.toFixed(2))} | Sterile: ${chalk.gray(scores.sterile.toFixed(2))} | `) +
                   chalk.white(`Advantage: ${advantageColor(advantage >= 0 ? '+' : '')}${advantageColor(advantage.toFixed(2))}`));
      });
      
      // Calculate overall emotional advantage
      const overallCanaiScore = Object.values(compassMetrics).reduce((sum, scores) => sum + scores.canai, 0) / 5;
      const overallSterileScore = Object.values(compassMetrics).reduce((sum, scores) => sum + scores.sterile, 0) / 5;
      const overallAdvantage = overallCanaiScore - overallSterileScore;
      
      console.log(chalk.gray('\n─'.repeat(60)));
      console.log(chalk.bold.white('Overall Emotional Advantage:'));
      console.log(chalk.white(`  CanAI Average: ${chalk.cyan(overallCanaiScore.toFixed(2))}`));
      console.log(chalk.white(`  Sterile Average: ${chalk.gray(overallSterileScore.toFixed(2))}`));
      console.log(chalk.white(`  Total Advantage: ${overallAdvantage >= 0.2 ? chalk.green('+' + overallAdvantage.toFixed(2)) : chalk.yellow('+' + overallAdvantage.toFixed(2))}`));
      
    } catch (error) {
      console.error(chalk.red('❌ Emotional compass error:'), error.message);
    }
  }

  async showPerformanceInsights() {
    try {
      console.log(chalk.bold.cyan('\n⚡ Performance Insights\n'));
      
      // Get recent performance data
      const { data: comparisons, error } = await supabase
        .from('sparksplit_comparisons')
        .select('generation_time_ms, created_at')
        .not('generation_time_ms', 'is', null)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error(chalk.red('❌ Error fetching performance data:'), error.message);
        return;
      }
      
      if (!comparisons || comparisons.length === 0) {
        console.log(chalk.yellow('📋 No performance data available'));
        return;
      }
      
      // Calculate performance metrics
      const generationTimes = comparisons.map(comp => comp.generation_time_ms);
      const avgTime = generationTimes.reduce((sum, time) => sum + time, 0) / generationTimes.length;
      const minTime = Math.min(...generationTimes);
      const maxTime = Math.max(...generationTimes);
      const p95Time = generationTimes.sort((a, b) => a - b)[Math.floor(generationTimes.length * 0.95)];
      
      const targetMet = avgTime < this.performanceThreshold;
      
      console.log(chalk.white('Generation Time Performance:'));
      console.log(chalk.white(`  Average: ${targetMet ? chalk.green(avgTime.toFixed(0)) : chalk.red(avgTime.toFixed(0))}ms (Target: <${this.performanceThreshold}ms)`));
      console.log(chalk.white(`  Minimum: ${chalk.cyan(minTime.toFixed(0))}ms`));
      console.log(chalk.white(`  Maximum: ${chalk.gray(maxTime.toFixed(0))}ms`));
      console.log(chalk.white(`  P95: ${p95Time < this.performanceThreshold ? chalk.green(p95Time.toFixed(0)) : chalk.yellow(p95Time.toFixed(0))}ms`));
      
      // Performance status
      const performanceStatus = targetMet ? 'EXCELLENT' : avgTime < this.performanceThreshold * 1.2 ? 'ACCEPTABLE' : 'NEEDS_IMPROVEMENT';
      const statusColor = performanceStatus === 'EXCELLENT' ? chalk.green : 
                         performanceStatus === 'ACCEPTABLE' ? chalk.yellow : chalk.red;
      
      console.log(chalk.white(`  Status: ${statusColor(performanceStatus)}`));
      
    } catch (error) {
      console.error(chalk.red('❌ Performance insights error:'), error.message);
    }
  }

  formatMetricValue(value, metricName) {
    if (metricName.includes('time') || metricName.includes('generation')) {
      return `${value.toFixed(0)}ms`;
    } else if (metricName.includes('rate') || metricName.includes('advantage') || metricName.includes('pass')) {
      return `${(value * 100).toFixed(1)}%`;
    } else if (metricName.includes('score') || metricName.includes('delta')) {
      return value.toFixed(2);
    } else {
      return value.toString();
    }
  }

  getTrendColor(trend) {
    switch (trend) {
      case 'improving':
      case 'growing':
      case 'excellent':
      case 'strengthening':
        return chalk.green;
      case 'stable':
      case 'optimizing':
        return chalk.yellow;
      case 'declining':
      case 'degrading':
        return chalk.red;
      default:
        return chalk.gray;
    }
  }

  getEmotionalImpactColor(impact) {
    switch (impact) {
      case 'empowering':
      case 'revolutionary':
      case 'sovereignty_preserving':
        return chalk.green;
      case 'trust_building':
      case 'respectful':
        return chalk.cyan;
      case 'neutral':
        return chalk.yellow;
      default:
        return chalk.gray;
    }
  }
}

// Main CLI interface
async function main() {
  const dashboard = new EnhancedSparkSplitDashboard();
  
  console.log(chalk.bold.cyan('🌟 CanAI Enhanced CLI Dashboard with SparkSplit Analytics'));
  console.log(chalk.gray('Sacred Covenant: Trust transparency through competitive advantage monitoring\n'));
  
  while (true) {
    try {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Select dashboard view:',
          choices: [
            { name: '🏠 Main Dashboard Overview', value: 'main' },
            { name: '🚀 Detailed SparkSplit Analytics', value: 'sparksplit' },
            { name: '🎯 Competitive Advantage Monitoring', value: 'competitive' },
            { name: '🧭 Emotional Compass Analysis', value: 'emotional' },
            { name: '🔍 Trust Transparency Metrics', value: 'trust' },
            { name: '⚡ Performance Monitoring', value: 'performance' },
            { name: '❌ Exit', value: 'exit' }
          ]
        }
      ]);
      
      switch (action) {
        case 'main':
          await dashboard.showMainDashboard();
          break;
        case 'sparksplit':
          await dashboard.showDetailedSparkSplitAnalytics();
          break;
        case 'competitive':
          await dashboard.showCompetitiveAdvantageStatus();
          break;
        case 'emotional':
          await dashboard.showEmotionalCompassBreakdown();
          break;
        case 'trust':
          await dashboard.showEmotionalSovereigntyCompliance();
          break;
        case 'performance':
          await dashboard.showPerformanceInsights();
          break;
        case 'exit':
          console.log(chalk.green('\n✅ Dashboard session completed'));
          console.log(chalk.gray('Sacred Promise: Every interaction serves user empowerment and trust transparency\n'));
          process.exit(0);
          break;
      }
      
      // Wait for user input before continuing
      await inquirer.prompt([
        {
          type: 'input',
          name: 'continue',
          message: 'Press Enter to continue...'
        }
      ]);
      
    } catch (error) {
      console.error(chalk.red('❌ Dashboard error:'), error.message);
      break;
    }
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.length > 0) {
  const dashboard = new EnhancedSparkSplitDashboard();
  
  switch (args[0]) {
    case 'main':
      dashboard.showMainDashboard().then(() => process.exit(0));
      break;
    case 'sparksplit':
      dashboard.showDetailedSparkSplitAnalytics().then(() => process.exit(0));
      break;
    case 'competitive':
      dashboard.showCompetitiveAdvantageStatus().then(() => process.exit(0));
      break;
    case 'emotional':
      dashboard.showEmotionalCompassBreakdown().then(() => process.exit(0));
      break;
    case 'trust':
      dashboard.showEmotionalSovereigntyCompliance().then(() => process.exit(0));
      break;
    case 'performance':
      dashboard.showPerformanceInsights().then(() => process.exit(0));
      break;
    default:
      console.log(chalk.yellow('Unknown command. Available commands: main, sparksplit, competitive, emotional, trust, performance'));
      process.exit(1);
  }
} else {
  main().catch(error => {
    console.error(chalk.red('❌ Fatal error:'), error.message);
    process.exit(1);
  });
}

module.exports = { EnhancedSparkSplitDashboard }; 