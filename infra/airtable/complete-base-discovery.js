/**
 * CanAI Complete Airtable Base Discovery
 * 
 * Purpose: Comprehensive discovery and documentation of actual Airtable structure
 * Output: Complete field mapping, relationships, and data patterns
 * 
 * Usage: node infra/airtable/complete-base-discovery.js
 */

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const config = {
  apiKey: process.env.AIRTABLE_API_KEY || '',
  baseId: process.env.AIRTABLE_BASE_ID || '',
  baseUrl: 'https://api.airtable.com/v0'
};

class AirtableBaseDiscovery {
  constructor() {
    this.discoveredTables = [];
    this.baseStructure = {
      baseId: config.baseId,
      discoveredAt: new Date().toISOString(),
      totalTables: 0,
      tables: {},
      relationships: [],
      summary: {}
    };
  }

  async discoverCompleteBase() {
    console.log('🔍 CanAI Complete Airtable Base Discovery');
    console.log('=========================================');
    console.log(`📊 Base ID: ${config.baseId}`);
    console.log(`🕐 Started: ${new Date().toISOString()}\n`);

    try {
      // Step 1: Try to get base metadata (if permissions allow)
      await this.attemptBaseMetadata();
      
      // Step 2: Discover tables from known URLs and systematic search
      await this.discoverAllTables();
      
      // Step 3: Analyze each table comprehensively
      await this.analyzeAllTables();
      
      // Step 4: Detect relationships between tables
      await this.detectRelationships();
      
      // Step 5: Generate comprehensive documentation
      await this.generateDocumentation();
      
      console.log('\n🎉 Discovery Complete!');
      console.log('======================');
      console.log(`📊 Total Tables Discovered: ${this.baseStructure.totalTables}`);
      console.log(`📄 Documentation saved to: infra/airtable/base-structure.json`);
      console.log(`📋 Human-readable report: infra/airtable/base-discovery-report.md`);
      
    } catch (error) {
      console.error('❌ Discovery failed:', error.message);
      throw error;
    }
  }

  async attemptBaseMetadata() {
    console.log('🔍 Step 1: Attempting Base Metadata Discovery');
    
    try {
      // Try the meta endpoint first
      const metaResponse = await this.makeRequest('https://api.airtable.com/v0/meta/bases');
      if (metaResponse.bases) {
        const ourBase = metaResponse.bases.find(base => base.id === config.baseId);
        if (ourBase) {
          console.log(`✅ Base found in meta: ${ourBase.name}`);
          this.baseStructure.baseName = ourBase.name;
          this.baseStructure.permissionLevel = ourBase.permissionLevel;
        }
      }
    } catch (error) {
      console.log('⚠️ Meta endpoint not accessible, continuing with direct discovery');
    }

    try {
      // Try base metadata endpoint
      const baseResponse = await this.makeRequest(`${config.baseUrl}/${config.baseId}`);
      if (baseResponse.tables) {
        console.log(`✅ Base metadata accessible - Found ${baseResponse.tables.length} tables`);
        this.baseStructure.tables = baseResponse.tables.reduce((acc, table) => {
          acc[table.id] = {
            id: table.id,
            name: table.name,
            description: table.description || '',
            fields: {},
            records: []
          };
          return acc;
        }, {});
        this.baseStructure.totalTables = baseResponse.tables.length;
        return true;
      }
    } catch (error) {
      console.log('⚠️ Base metadata not accessible, using direct table discovery');
    }
    
    return false;
  }

  async discoverAllTables() {
    console.log('\n🔍 Step 2: Discovering All Tables');
    
    // Known tables from URLs
    const knownTables = [
      { name: 'PromptLogs', id: 'tbloOnbwQ2LG7QVLB' },
      { name: 'SessionAnalytics', id: 'tblBMHTFbglxhWEkq' },
      { name: 'SparkSplitAnalytics', id: 'tblJMbF0FONE8WZVI' }
    ];

    // If we don't have base metadata, discover tables manually
    if (this.baseStructure.totalTables === 0) {
      console.log('📋 Testing known tables from URLs...');
      
      for (const table of knownTables) {
        try {
          const response = await this.makeRequest(`${config.baseUrl}/${config.baseId}/${table.id}?maxRecords=1`);
          if (response.records !== undefined) {
            console.log(`✅ Confirmed table: ${table.name} (${table.id})`);
            this.baseStructure.tables[table.id] = {
              id: table.id,
              name: table.name,
              description: '',
              fields: {},
              records: []
            };
            this.baseStructure.totalTables++;
          }
        } catch (error) {
          console.log(`❌ Table not accessible: ${table.name} - ${error.message}`);
        }
      }

      // Try to discover additional tables by systematic ID search
      console.log('\n🔍 Searching for additional tables...');
      await this.systematicTableSearch();
    }
  }

  async systematicTableSearch() {
    // This is a basic search - in practice, table IDs are hard to predict
    // But we can try common patterns or look for references in existing data
    console.log('⚠️ Systematic search limited without base metadata access');
    console.log('💡 Recommendation: Ensure API token has schema.bases:read permission for complete discovery');
  }

  async analyzeAllTables() {
    console.log('\n🔍 Step 3: Comprehensive Table Analysis');
    
    for (const tableId of Object.keys(this.baseStructure.tables)) {
      await this.analyzeTable(tableId);
    }
  }

  async analyzeTable(tableId) {
    const table = this.baseStructure.tables[tableId];
    console.log(`\n📊 Analyzing: ${table.name} (${tableId})`);
    
    try {
      // Get multiple records to understand data patterns
      const response = await this.makeRequest(`${config.baseUrl}/${config.baseId}/${tableId}?maxRecords=10`);
      
      if (response.records && response.records.length > 0) {
        console.log(`   📋 Found ${response.records.length} sample records`);
        
        // Analyze field structure
        const allFields = new Set();
        const fieldTypes = {};
        const fieldSamples = {};
        
        response.records.forEach(record => {
          Object.keys(record.fields).forEach(fieldName => {
            allFields.add(fieldName);
            const value = record.fields[fieldName];
            
            // Determine field type
            let type = typeof value;
            if (Array.isArray(value)) {
              type = 'array';
              if (value.length > 0 && typeof value[0] === 'object' && value[0].id) {
                type = 'linked_record';
              }
            } else if (value && typeof value === 'object' && value.specialValue) {
              type = 'formula_or_rollup';
            }
            
            fieldTypes[fieldName] = type;
            
            // Store sample value (truncated for readability)
            if (!fieldSamples[fieldName]) {
              fieldSamples[fieldName] = this.truncateValue(value);
            }
          });
        });

        // Store field analysis
        Array.from(allFields).forEach(fieldName => {
          table.fields[fieldName] = {
            type: fieldTypes[fieldName],
            sampleValue: fieldSamples[fieldName],
            appearsInRecords: response.records.filter(r => r.fields[fieldName] !== undefined).length
          };
        });

        // Store sample records (first 3, truncated)
        table.records = response.records.slice(0, 3).map(record => ({
          id: record.id,
          fields: Object.keys(record.fields).reduce((acc, key) => {
            acc[key] = this.truncateValue(record.fields[key]);
            return acc;
          }, {})
        }));

        console.log(`   ✅ Analyzed ${allFields.size} fields`);
        
        // Log field summary
        Array.from(allFields).forEach(fieldName => {
          const field = table.fields[fieldName];
          console.log(`      - ${fieldName}: ${field.type} (${field.appearsInRecords}/${response.records.length} records)`);
        });

      } else {
        console.log(`   ⚠️ No records found in ${table.name}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error analyzing ${table.name}: ${error.message}`);
    }
  }

  async detectRelationships() {
    console.log('\n🔍 Step 4: Detecting Table Relationships');
    
    const relationships = [];
    
    for (const [tableId, table] of Object.entries(this.baseStructure.tables)) {
      for (const [fieldName, field] of Object.entries(table.fields)) {
        if (field.type === 'linked_record') {
          // Try to determine which table this links to
          const linkedTableInfo = await this.analyzeLinkedField(tableId, fieldName, field.sampleValue);
          if (linkedTableInfo) {
            relationships.push({
              sourceTable: table.name,
              sourceTableId: tableId,
              sourceField: fieldName,
              targetTable: linkedTableInfo.tableName,
              targetTableId: linkedTableInfo.tableId,
              relationshipType: 'linked_record'
            });
            console.log(`   🔗 Found relationship: ${table.name}.${fieldName} → ${linkedTableInfo.tableName}`);
          }
        }
      }
    }
    
    this.baseStructure.relationships = relationships;
    console.log(`✅ Detected ${relationships.length} relationships`);
  }

  async analyzeLinkedField(tableId, fieldName, sampleValue) {
    // This would require additional API calls to determine the target table
    // For now, we'll note it as a linked field
    return null; // Placeholder - would need more complex analysis
  }

  async generateDocumentation() {
    console.log('\n📄 Step 5: Generating Documentation');
    
    // Generate JSON structure file
    const structureFile = path.join(__dirname, 'base-structure.json');
    fs.writeFileSync(structureFile, JSON.stringify(this.baseStructure, null, 2), 'utf8');
    console.log(`✅ JSON structure saved: ${structureFile}`);
    
    // Generate human-readable report
    const reportFile = path.join(__dirname, 'base-discovery-report.md');
    const report = this.generateMarkdownReport();
    fs.writeFileSync(reportFile, report, 'utf8');
    console.log(`✅ Markdown report saved: ${reportFile}`);
    
    // Generate field mapping for development
    const mappingFile = path.join(__dirname, 'field-mapping.json');
    const mapping = this.generateFieldMapping();
    fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2), 'utf8');
    console.log(`✅ Field mapping saved: ${mappingFile}`);
  }

  generateMarkdownReport() {
    let report = `# CanAI Airtable Base Discovery Report\n\n`;
    report += `**Base ID:** ${this.baseStructure.baseId}\n`;
    report += `**Discovery Date:** ${this.baseStructure.discoveredAt}\n`;
    report += `**Total Tables:** ${this.baseStructure.totalTables}\n\n`;

    report += `## 📊 Table Overview\n\n`;
    
    for (const [tableId, table] of Object.entries(this.baseStructure.tables)) {
      report += `### ${table.name} (${tableId})\n\n`;
      report += `**Fields:** ${Object.keys(table.fields).length}\n`;
      report += `**Sample Records:** ${table.records.length}\n\n`;
      
      report += `#### Fields\n\n`;
      report += `| Field Name | Type | Sample Value | Coverage |\n`;
      report += `|------------|------|--------------|----------|\n`;
      
      for (const [fieldName, field] of Object.entries(table.fields)) {
        const sampleStr = JSON.stringify(field.sampleValue).substring(0, 30);
        report += `| ${fieldName} | ${field.type} | ${sampleStr}... | ${field.appearsInRecords} records |\n`;
      }
      
      report += `\n`;
    }

    if (this.baseStructure.relationships.length > 0) {
      report += `## 🔗 Relationships\n\n`;
      this.baseStructure.relationships.forEach(rel => {
        report += `- **${rel.sourceTable}.${rel.sourceField}** → **${rel.targetTable}**\n`;
      });
      report += `\n`;
    }

    report += `## 🎯 Next Steps\n\n`;
    report += `1. **Review field mappings** in \`field-mapping.json\`\n`;
    report += `2. **Update test scripts** to use actual field names\n`;
    report += `3. **Configure Make.com integration** with correct field references\n`;
    report += `4. **Set up proper CRUD operations** for each table type\n\n`;

    return report;
  }

  generateFieldMapping() {
    const mapping = {
      generatedAt: new Date().toISOString(),
      baseId: this.baseStructure.baseId,
      tables: {}
    };

    for (const [tableId, table] of Object.entries(this.baseStructure.tables)) {
      mapping.tables[table.name] = {
        tableId: tableId,
        fields: Object.keys(table.fields).reduce((acc, fieldName) => {
          acc[fieldName] = {
            type: table.fields[fieldName].type,
            apiName: fieldName // In case we need to map display names to API names
          };
          return acc;
        }, {})
      };
    }

    return mapping;
  }

  truncateValue(value) {
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...';
    }
    if (Array.isArray(value) && value.length > 3) {
      return [...value.slice(0, 3), '...'];
    }
    return value;
  }

  async makeRequest(url) {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  }
}

// Execute discovery
if (require.main === module) {
  const discovery = new AirtableBaseDiscovery();
  discovery.discoverCompleteBase()
    .then(() => {
      console.log('\n🎉 Complete base discovery finished successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Discovery failed:', error.message);
      process.exit(1);
    });
}

module.exports = AirtableBaseDiscovery; 