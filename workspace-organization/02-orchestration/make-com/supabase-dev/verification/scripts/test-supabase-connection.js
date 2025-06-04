/**
 * Supabase Connection Verification Script
 * Tests database connectivity, schema validation, and basic operations
 * Part of Make.com Supabase Implementation Verification
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration with environment variable checks
const config = {
  supabaseUrl: process.env.SUPABASE_URL || 'NOT_SET',
  supabaseKey: process.env.SUPABASE_ANON_KEY || 'NOT_SET',
  testTimeout: 5000 // 5 second timeout
};

// Expected schema tables based on our schema mapping
const expectedTables = [
  'user_context',
  'session_analytics', 
  'prompt_logs',
  'sparksplit_comparisons',
  'emotional_intelligence',
  'trust_metrics',
  'competitive_advantage_metrics',
  'trust_transparency_metrics',
  'goldmine_output',
  'performance_metrics',
  'error_logs',
  'webhook_logs',
  'system_configs',
  'system_health',
  'airtable_sync',
  'prompt_types',
  'sparksplit_analytics',
  'analytics_aggregates',
  'emotional_states',
  'trust_factors',
  'processing_results'
];

class SupabaseVerifier {
  constructor() {
    this.results = {
      connection: false,
      authentication: false,
      tables: [],
      tableCount: 0,
      missingTables: [],
      jsonbSupport: false,
      performance: null,
      errors: []
    };
    
    this.supabase = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '🔍';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async verifyCredentials() {
    this.log('Checking Supabase credentials...');
    
    if (config.supabaseUrl === 'NOT_SET') {
      this.results.errors.push('SUPABASE_URL environment variable not set');
      this.log('SUPABASE_URL not found in environment variables', 'error');
      return false;
    }
    
    if (config.supabaseKey === 'NOT_SET') {
      this.results.errors.push('SUPABASE_ANON_KEY environment variable not set');
      this.log('SUPABASE_ANON_KEY not found in environment variables', 'error');
      return false;
    }
    
    // Validate URL format
    try {
      new URL(config.supabaseUrl);
      this.log(`Supabase URL format valid: ${config.supabaseUrl.substring(0, 30)}...`, 'success');
    } catch (error) {
      this.results.errors.push(`Invalid SUPABASE_URL format: ${error.message}`);
      this.log('Invalid SUPABASE_URL format', 'error');
      return false;
    }
    
    return true;
  }

  async testConnection() {
    this.log('Testing Supabase connection...');
    
    try {
      this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
      
      // Test with a simple query to verify connection
      const { data, error } = await this.supabase
        .from('user_context')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        this.results.errors.push(`Connection test failed: ${error.message}`);
        this.log(`Connection failed: ${error.message}`, 'error');
        return false;
      }
      
      this.results.connection = true;
      this.results.authentication = true;
      this.log('Supabase connection successful!', 'success');
      return true;
      
    } catch (error) {
      this.results.errors.push(`Connection error: ${error.message}`);
      this.log(`Connection error: ${error.message}`, 'error');
      return false;
    }
  }

  async validateTablesIndividually() {
    this.log('Testing individual table access...');
    const foundTables = [];
    
    for (const tableName of expectedTables) {
      try {
        const { data, error } = await this.supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          foundTables.push(tableName);
          this.log(`✓ Table accessible: ${tableName}`);
        } else {
          this.log(`✗ Table not accessible: ${tableName} - ${error.message}`);
        }
      } catch (error) {
        this.log(`✗ Table error: ${tableName} - ${error.message}`);
      }
    }
    
    this.results.tables = foundTables;
    this.results.tableCount = foundTables.length;
    this.results.missingTables = expectedTables.filter(
      expected => !foundTables.includes(expected)
    );
    
    this.log(`Found ${foundTables.length}/${expectedTables.length} tables`, 
      foundTables.length === expectedTables.length ? 'success' : 'error');
    
    return foundTables.length === expectedTables.length;
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        overallStatus: this.results.connection && 
                     this.results.missingTables.length === 0 ? 'PASS' : 'FAIL',
        confidence: this.calculateConfidence()
      },
      details: this.results,
      recommendations: this.generateRecommendations()
    };
    
    // Save report to file
    const reportPath = path.join(__dirname, '../results/supabase-connection-test.json');
    try {
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    } catch (error) {
      this.log(`Failed to save report: ${error.message}`, 'error');
    }
    
    return report;
  }

  calculateConfidence() {
    let score = 0;
    
    if (this.results.connection) score += 50;
    if (this.results.authentication) score += 20;
    if (this.results.missingTables.length === 0) score += 30;
    
    return score;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (!this.results.connection) {
      recommendations.push('🔴 CRITICAL: Obtain valid Supabase credentials and configure environment variables');
    }
    
    if (this.results.missingTables.length > 0) {
      recommendations.push(`🔴 CRITICAL: Deploy missing tables: ${this.results.missingTables.join(', ')}`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ SUCCESS: Supabase infrastructure ready for Make.com integration');
    }
    
    return recommendations;
  }

  async runFullVerification() {
    this.log('🚀 Starting Supabase verification process...');
    
    try {
      // Step 1: Verify credentials
      if (!await this.verifyCredentials()) {
        return this.generateReport();
      }
      
      // Step 2: Test connection
      if (!await this.testConnection()) {
        return this.generateReport();
      }
      
      // Step 3: Validate schema
      await this.validateTablesIndividually();
      
      const report = this.generateReport();
      
      // Display summary
      this.log('\n📊 VERIFICATION SUMMARY:', 'info');
      this.log(`Overall Status: ${report.summary.overallStatus}`);
      this.log(`Confidence Score: ${report.summary.confidence}/100`);
      this.log(`Tables Found: ${this.results.tableCount}/${expectedTables.length}`);
      
      if (report.details.errors.length > 0) {
        this.log('\n🚨 ERRORS:', 'error');
        report.details.errors.forEach(error => this.log(`  - ${error}`, 'error'));
      }
      
      this.log('\n💡 RECOMMENDATIONS:', 'info');
      report.recommendations.forEach(rec => this.log(`  ${rec}`));
      
      return report;
      
    } catch (error) {
      this.results.errors.push(`Verification process error: ${error.message}`);
      this.log(`Verification failed: ${error.message}`, 'error');
      return this.generateReport();
    }
  }
}

// Run verification if called directly
if (require.main === module) {
  const verifier = new SupabaseVerifier();
  verifier.runFullVerification()
    .then(report => {
      process.exit(report.summary.overallStatus === 'PASS' ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

module.exports = SupabaseVerifier; 