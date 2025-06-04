// ============================================================================
// 🚀 SCHEMA API ROUTES - REST ENDPOINTS FOR SYSTEM MAP
// ============================================================================

import express from 'express';
import { SchemaApiService } from '../services/schema-api';

const router = express.Router();

// Initialize schema service
const schemaApi = new SchemaApiService(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// ============================================================================
// 📊 SCHEMA ENDPOINTS
// ============================================================================

/**
 * GET /api/schema/complete
 * Returns complete system map with all schema information
 */
router.get('/complete', async (req, res) => {
  try {
    const systemMap = await schemaApi.getCompleteSystemMap();
    res.json({
      success: true,
      data: systemMap,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate complete system map',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/summary
 * Returns summary statistics only
 */
router.get('/summary', async (req, res) => {
  try {
    const summary = await schemaApi.getSchemaSummary();
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get schema summary',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/tables
 * Returns all table schemas
 */
router.get('/tables', async (req, res) => {
  try {
    const tables = await schemaApi.getTableSchema();
    res.json({
      success: true,
      data: tables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get table schemas',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/tables/:tableName
 * Returns specific table schema
 */
router.get('/tables/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const table = await schemaApi.getTableSchema(tableName);
    res.json({
      success: true,
      data: table
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to get schema for table: ${req.params.tableName}`,
      message: error.message
    });
  }
});

/**
 * GET /api/schema/relationships
 * Returns all foreign key relationships
 */
router.get('/relationships', async (req, res) => {
  try {
    const relationships = await schemaApi.getRelationships();
    res.json({
      success: true,
      data: relationships,
      count: relationships.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get relationships',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/sparksplit
 * Returns SparkSplit specific schema
 */
router.get('/sparksplit', async (req, res) => {
  try {
    const sparkSplitSchema = await schemaApi.getSparkSplitSchema();
    res.json({
      success: true,
      data: sparkSplitSchema
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get SparkSplit schema',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/docs/markdown
 * Returns schema documentation in markdown format
 */
router.get('/docs/markdown', async (req, res) => {
  try {
    const markdown = await schemaApi.generateMarkdownDocs();
    res.setHeader('Content-Type', 'text/markdown');
    res.send(markdown);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate markdown documentation',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/export/json
 * Returns complete schema as downloadable JSON
 */
router.get('/export/json', async (req, res) => {
  try {
    const jsonSchema = await schemaApi.exportSchemaJson();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="schema-export.json"');
    res.send(jsonSchema);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to export schema as JSON',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/validate
 * Validates schema integrity and returns issues/recommendations
 */
router.get('/validate', async (req, res) => {
  try {
    const validation = await schemaApi.validateSchemaIntegrity();
    res.json({
      success: true,
      data: validation,
      status: validation.isValid ? 'VALID' : 'ISSUES_FOUND'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to validate schema',
      message: error.message
    });
  }
});

// ============================================================================
// 🔧 UTILITY ENDPOINTS
// ============================================================================

/**
 * GET /api/schema/health
 * Health check for schema API
 */
router.get('/health', async (req, res) => {
  try {
    const summary = await schemaApi.getSchemaSummary();
    res.json({
      success: true,
      status: 'healthy',
      database_info: {
        total_tables: summary.total_tables,
        sparksplit_tables: summary.sparksplit_tables,
        database_size_mb: summary.database_size_mb
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;

// ============================================================================
// 📝 API DOCUMENTATION
// ============================================================================

/*
API Endpoints:

1. GET /api/schema/complete
   - Returns complete system map with all schema information
   - Response: Full system map JSON

2. GET /api/schema/summary  
   - Returns summary statistics only
   - Response: Summary object with counts and metrics

3. GET /api/schema/tables
   - Returns all table schemas
   - Response: Object with table names as keys, schema as values

4. GET /api/schema/tables/:tableName
   - Returns specific table schema
   - Response: Single table schema object

5. GET /api/schema/relationships
   - Returns all foreign key relationships
   - Response: Array of relationship objects

6. GET /api/schema/sparksplit
   - Returns SparkSplit specific schema
   - Response: SparkSplit tables and metadata

7. GET /api/schema/docs/markdown
   - Returns schema documentation in markdown
   - Response: Markdown text

8. GET /api/schema/export/json
   - Downloads complete schema as JSON file
   - Response: JSON file download

9. GET /api/schema/validate
   - Validates schema integrity
   - Response: Validation results with issues and recommendations

10. GET /api/schema/health
    - Health check for schema API
    - Response: Health status and basic database info

Usage Examples:

curl http://localhost:3000/api/schema/summary
curl http://localhost:3000/api/schema/tables/sparksplit_analytics
curl http://localhost:3000/api/schema/relationships
curl http://localhost:3000/api/schema/validate
*/ 