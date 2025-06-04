# Interface Extractor Tool

## Overview

The Interface Extractor is a comprehensive TypeScript analysis tool that scans your entire codebase to find and catalog all interface definitions with their field structures, types, and metadata.

## What It Does

- **Scans** all TypeScript files in your project
- **Extracts** interface definitions with complete field information
- **Categorizes** interfaces by domain (Payment, Emotional Intelligence, Testing, etc.)
- **Analyzes** field types, optional/required status, and relationships
- **Generates** both JSON and Markdown reports

## Usage

### Run the Extractor

```bash
# Method 1: Direct TypeScript execution
npx ts-node scripts/tools/interface-extractor.ts

# Method 2: Using the JavaScript runner
node scripts/tools/run-interface-extractor.js

# Method 3: View sample of existing report
node scripts/tools/show-interface-sample.js
```

### Output Files

The script generates two files with timestamps:

1. **`interface-extraction-report-[timestamp].json`** - Complete data in JSON format
2. **`interface-extraction-report-[timestamp].md`** - Human-readable Markdown summary

## Report Contents

### JSON Report Structure

```json
{
  "timestamp": "2025-05-29T19:40:35.133Z",
  "totalInterfaces": 1245,
  "totalFiles": 407,
  "categories": {
    "Emotional Intelligence": 276,
    "Testing & Validation": 162,
    "Memory & AI": 146,
    // ... more categories
  },
  "interfaces": [
    {
      "name": "DebugConfig",
      "filePath": "C:\\Projects\\canai-cursor-codex-v6.1.4\\agents\\debug\\src\\config.ts",
      "relativePath": "agents\\debug\\src\\config.ts",
      "lineNumber": 1,
      "exported": true,
      "fields": [
        {
          "name": "logLevel",
          "type": "'debug' | 'info' | 'warn' | 'error'",
          "optional": false,
          "description": "Log level configuration"
        }
        // ... more fields
      ],
      "category": "Utilities & Services",
      "description": "Configuration for debug logging",
      "extends": ["BaseConfig"]
    }
    // ... more interfaces
  ],
  "summary": {
    "byCategory": { /* interfaces grouped by category */ },
    "byFile": { /* interfaces grouped by file */ },
    "fieldStatistics": {
      "totalFields": 6694,
      "optionalFields": 833,
      "requiredFields": 5861,
      "mostCommonTypes": {
        "string": 2097,
        "number": 1840,
        "boolean": 627
        // ... more types
      }
    }
  }
}
```

### Markdown Report Features

- **Categories Overview** - Count of interfaces per category
- **Field Statistics** - Total fields, required vs optional, common types
- **Detailed Interface Listings** - Each interface with:
  - File path and line number
  - Export status
  - Field table with types and requirements
  - Inheritance information
  - JSDoc descriptions

## Categories

The tool automatically categorizes interfaces into:

- **Payment & Financial** - Stripe, payment processing, invoices
- **Business Entities** - Clients, projects, business data
- **Emotional Intelligence** - Trust scores, emotional context, sovereignty
- **Memory & AI** - Memory injection, AI processing, learning
- **Security & Monitoring** - Authentication, rate limiting, security
- **Testing & Validation** - Test configurations, validation results
- **API & Types** - API definitions, type declarations
- **Prompts & Content** - Prompt definitions, content generation
- **Utilities & Services** - Configuration, logging, utilities
- **Other** - Uncategorized interfaces

## Key Statistics from Latest Run

- **Total Interfaces Found:** 1,245
- **Total TypeScript Files:** 1,029 (407 contained interfaces)
- **Total Fields Analyzed:** 6,694
- **Most Common Types:** string (2,097), number (1,840), boolean (627)

## Use Cases

### 1. **API Documentation**
Generate comprehensive API documentation from interface definitions.

### 2. **Data Modeling Analysis**
Understand your data structures and relationships across the codebase.

### 3. **Type Safety Auditing**
Identify inconsistent typing patterns and missing type definitions.

### 4. **Migration Planning**
Plan data structure migrations by understanding current field usage.

### 5. **Code Architecture Review**
Analyze interface distribution and categorization for architectural insights.

### 6. **Integration Mapping**
Map data fields for external integrations (Make.com, Airtable, etc.).

## Advanced Usage

### Custom Categories

Modify the `categorizeInterface()` method in `interface-extractor.ts` to add custom categorization logic:

```typescript
private categorizeInterface(filePath: string, name: string): string {
  // Add your custom categorization logic here
  if (filePath.includes('your-domain') || name.includes('YourPrefix')) {
    return 'Your Custom Category';
  }
  // ... existing logic
}
```

### Filtering Results

Use the JSON report to filter interfaces programmatically:

```javascript
const report = JSON.parse(fs.readFileSync('interface-extraction-report-[timestamp].json'));

// Find all interfaces with more than 10 fields
const largeInterfaces = report.interfaces.filter(i => i.fields.length > 10);

// Find all exported interfaces in a specific category
const exportedEmotional = report.summary.byCategory['Emotional Intelligence']
  .filter(i => i.exported);

// Find interfaces using specific types
const stringArrayInterfaces = report.interfaces.filter(i => 
  i.fields.some(f => f.type.includes('string[]'))
);
```

## Performance Notes

- Processes ~1,000 TypeScript files in under 30 seconds
- Memory usage scales with codebase size
- Excludes `node_modules`, `.git`, `dist`, `build`, `coverage` directories
- Handles complex TypeScript types including generics, unions, and arrays

## Troubleshooting

### Common Issues

1. **TypeScript Compilation Errors**
   - Ensure `typescript` is installed: `npm install typescript`
   - Use `ts-node` for direct execution: `npm install -g ts-node`

2. **Memory Issues with Large Codebases**
   - Increase Node.js memory: `node --max-old-space-size=4096`

3. **Permission Errors**
   - Ensure write permissions in the project directory
   - Run with appropriate user permissions

### Error Handling

The script includes robust error handling:
- Continues processing if individual files fail
- Logs warnings for problematic files
- Provides detailed error messages for debugging

## Integration with CanAI Codex

This tool integrates with the CanAI Codex v6.1.4 standards:

- **Test-First Truth** - Validates interface completeness
- **Emotional Intelligence** - Categorizes emotional data structures
- **Trust Scoring** - Analyzes trust-related interfaces
- **Memory Integration** - Maps memory and AI interfaces
- **Performance Optimization** - Efficient processing with progress tracking 