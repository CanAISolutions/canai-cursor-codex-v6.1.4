#!/usr/bin/env node

// ============================================================================
// 🗺️ SCHEMA MAP CLI - COMMAND LINE SYSTEM MAP ACCESS
// ============================================================================

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// 🔧 CLI FUNCTIONS
// ============================================================================

async function getCompleteSystemMap() {
  const { data, error } = await supabase.rpc('generate_system_map');
  if (error) throw error;
  return data;
}

async function getTableSchema(tableName = null) {
  const { data, error } = await supabase.rpc('get_table_schema', { 
    target_table: tableName 
  });
  if (error) throw error;
  return data;
}

async function getRelationships() {
  const { data, error } = await supabase.rpc('get_relationships');
  if (error) throw error;
  return data;
}

async function getSparkSplitSchema() {
  const { data, error } = await supabase.rpc('get_sparksplit_schema');
  if (error) throw error;
  return data;
}

// ============================================================================
// 📊 DISPLAY FUNCTIONS
// ============================================================================

function displaySummary(systemMap) {
  console.log('\n🗺️  SYSTEM MAP SUMMARY');
  console.log('='.repeat(50));
  console.log(`📊 Database: ${systemMap.database_name}`);
  console.log(`🔢 Version: ${systemMap.schema_version}`);
  console.log(`🚀 Phase: ${systemMap.deployment_phase}`);
  console.log('\n📈 STATISTICS:');
  console.log(`   Tables: ${systemMap.summary.total_tables}`);
  console.log(`   Relationships: ${systemMap.summary.total_relationships}`);
  console.log(`   Indexes: ${systemMap.summary.total_indexes}`);
  console.log(`   Functions: ${systemMap.summary.total_functions}`);
  console.log(`   SparkSplit Tables: ${systemMap.summary.sparksplit_tables}`);
  console.log(`   Database Size: ${systemMap.summary.database_size_mb} MB`);
  console.log(`   Generated: ${systemMap.summary.generated_at}`);
}

function displayTables(systemMap) {
  console.log('\n📋 TABLES OVERVIEW');
  console.log('='.repeat(50));
  
  Object.entries(systemMap.tables).forEach(([tableName, tableInfo]) => {
    console.log(`\n🔸 ${tableName}`);
    console.log(`   Columns: ${tableInfo.columns.length}`);
    console.log(`   Rows: ${tableInfo.row_count}`);
    console.log(`   Size: ${Math.round(tableInfo.size_bytes / 1024)} KB`);
  });
}

function displayRelationships(relationships) {
  console.log('\n🔗 RELATIONSHIPS');
  console.log('='.repeat(50));
  
  relationships.forEach((rel, index) => {
    console.log(`${index + 1}. ${rel.from_table}.${rel.from_column} → ${rel.to_table}.${rel.to_column}`);
  });
}

function displayTableDetails(tableName, tableInfo) {
  console.log(`\n📋 TABLE: ${tableName}`);
  console.log('='.repeat(50));
  
  if (tableInfo.columns) {
    console.log('\n📝 COLUMNS:');
    tableInfo.columns.forEach((col) => {
      const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(required)';
      const defaultVal = col.column_default ? ` default: ${col.column_default}` : '';
      console.log(`   ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
    });
  }
}

// ============================================================================
// 💾 EXPORT FUNCTIONS
// ============================================================================

async function exportToFile(data, filename, format = 'json') {
  const outputDir = 'docs/system-maps';
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const filePath = path.join(outputDir, filename);
  
  if (format === 'json') {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } else if (format === 'markdown') {
    fs.writeFileSync(filePath, data);
  }
  
  console.log(`✅ Exported to: ${filePath}`);
  return filePath;
}

async function generateMarkdownDocs(systemMap, relationships) {
  let markdown = `# Database Schema Documentation\n\n`;
  markdown += `**Database**: ${systemMap.database_name}\n`;
  markdown += `**Version**: ${systemMap.schema_version}\n`;
  markdown += `**Phase**: ${systemMap.deployment_phase}\n`;
  markdown += `**Generated**: ${systemMap.summary.generated_at}\n\n`;

  // Summary
  markdown += `## Summary\n\n`;
  markdown += `- **Tables**: ${systemMap.summary.total_tables}\n`;
  markdown += `- **Relationships**: ${systemMap.summary.total_relationships}\n`;
  markdown += `- **Indexes**: ${systemMap.summary.total_indexes}\n`;
  markdown += `- **Functions**: ${systemMap.summary.total_functions}\n`;
  markdown += `- **SparkSplit Tables**: ${systemMap.summary.sparksplit_tables}\n`;
  markdown += `- **Database Size**: ${systemMap.summary.database_size_mb} MB\n\n`;

  // Tables
  markdown += `## Tables\n\n`;
  Object.entries(systemMap.tables).forEach(([tableName, tableInfo]) => {
    markdown += `### ${tableName}\n\n`;
    markdown += `| Column | Type | Nullable | Default |\n`;
    markdown += `|--------|------|----------|----------|\n`;
    
    tableInfo.columns.forEach((col) => {
      markdown += `| ${col.column_name} | ${col.data_type} | ${col.is_nullable} | ${col.column_default || ''} |\n`;
    });
    markdown += `\n`;
  });

  // Relationships
  markdown += `## Relationships\n\n`;
  markdown += `| From Table | From Column | To Table | To Column |\n`;
  markdown += `|------------|-------------|----------|----------|\n`;
  relationships.forEach((rel) => {
    markdown += `| ${rel.from_table} | ${rel.from_column} | ${rel.to_table} | ${rel.to_column} |\n`;
  });

  return markdown;
}

// ============================================================================
// 🚀 CLI COMMANDS
// ============================================================================

async function runCommand(command, args) {
  try {
    switch (command) {
      case 'summary':
        const systemMap = await getCompleteSystemMap();
        displaySummary(systemMap);
        break;

      case 'tables':
        const tablesMap = await getCompleteSystemMap();
        displayTables(tablesMap);
        break;

      case 'table':
        const tableName = args[0];
        if (!tableName) {
          console.error('❌ Table name required: npm run schema-map table <table_name>');
          process.exit(1);
        }
        const tableInfo = await getTableSchema(tableName);
        displayTableDetails(tableName, tableInfo);
        break;

      case 'relationships':
        const relationships = await getRelationships();
        displayRelationships(relationships);
        break;

      case 'sparksplit':
        const sparkSplitSchema = await getSparkSplitSchema();
        console.log('\n🔥 SPARKSPLIT SCHEMA');
        console.log('='.repeat(50));
        console.log(JSON.stringify(sparkSplitSchema, null, 2));
        break;

      case 'export':
        const format = args[0] || 'json';
        const exportMap = await getCompleteSystemMap();
        
        if (format === 'json') {
          await exportToFile(exportMap, 'system-map.json', 'json');
        } else if (format === 'markdown') {
          const exportRelationships = await getRelationships();
          const markdown = await generateMarkdownDocs(exportMap, exportRelationships);
          await exportToFile(markdown, 'system-map.md', 'markdown');
        } else {
          console.error('❌ Invalid format. Use: json or markdown');
          process.exit(1);
        }
        break;

      case 'validate':
        const validateMap = await getCompleteSystemMap();
        console.log('\n✅ SCHEMA VALIDATION');
        console.log('='.repeat(50));
        
        const issues = [];
        const recommendations = [];
        
        if (validateMap.summary.total_tables < 18) {
          issues.push(`Only ${validateMap.summary.total_tables} tables found, expected at least 18`);
        }
        
        if (validateMap.summary.sparksplit_tables < 4) {
          issues.push(`Only ${validateMap.summary.sparksplit_tables} SparkSplit tables found, expected 4`);
        }
        
        if (validateMap.summary.total_relationships < 15) {
          recommendations.push('Consider adding more foreign key relationships');
        }
        
        if (issues.length === 0) {
          console.log('✅ Schema validation passed!');
        } else {
          console.log('❌ Issues found:');
          issues.forEach(issue => console.log(`   - ${issue}`));
        }
        
        if (recommendations.length > 0) {
          console.log('\n💡 Recommendations:');
          recommendations.forEach(rec => console.log(`   - ${rec}`));
        }
        break;

      case 'help':
      default:
        displayHelp();
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function displayHelp() {
  console.log('\n🗺️  SCHEMA MAP CLI');
  console.log('='.repeat(50));
  console.log('Usage: node scripts/tools/schema-map-cli.js <command> [args]');
  console.log('\nCommands:');
  console.log('  summary           Show system map summary');
  console.log('  tables            List all tables');
  console.log('  table <name>      Show specific table details');
  console.log('  relationships     Show all foreign key relationships');
  console.log('  sparksplit        Show SparkSplit schema');
  console.log('  export [format]   Export schema (json|markdown)');
  console.log('  validate          Validate schema integrity');
  console.log('  help              Show this help message');
  console.log('\nExamples:');
  console.log('  node scripts/tools/schema-map-cli.js summary');
  console.log('  node scripts/tools/schema-map-cli.js table sparksplit_analytics');
  console.log('  node scripts/tools/schema-map-cli.js export markdown');
  console.log('  node scripts/tools/schema-map-cli.js validate');
}

// ============================================================================
// 🎯 MAIN EXECUTION
// ============================================================================

if (require.main === module) {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  runCommand(command, args);
}

module.exports = {
  getCompleteSystemMap,
  getTableSchema,
  getRelationships,
  getSparkSplitSchema,
  exportToFile,
  generateMarkdownDocs
}; 