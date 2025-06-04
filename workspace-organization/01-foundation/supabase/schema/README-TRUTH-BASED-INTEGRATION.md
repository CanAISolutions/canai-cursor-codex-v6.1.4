# Truth-Based Integration System

A comprehensive system for integrating interface definitions with database schemas through Make.com scenarios and webhook handlers with emotional sovereignty.

## Overview

The Truth-Based Integration System connects CANAI's interface catalog with Supabase database schemas, generates Make.com integration scenarios, and creates webhook handlers. It implements the concepts of emotional sovereignty and trust transparency throughout the integration process.

## Features

- **Interface Catalog Loading**: Loads interface definitions from CANAI-INTERFACE-CATALOG.json
- **Database Schema Loading**: Loads database schemas from supabase-schema.json
- **Field Mapping**: Maps interface fields to database columns with appropriate transformations
- **Make.com Scenario Generation**: Creates integration scenarios for Make.com
- **Webhook Handler Generation**: Creates Express.js webhook handlers
- **Emotional Sovereignty**: Ensures trust scores and emotional validation throughout the process
- **Truth Mapping Guide**: Generates comprehensive documentation of all mappings

## Components

### 1. Interface Catalog Loader

`real-interface-catalog-loader.ts` loads and provides access to the CANAI interface catalog.

```typescript
// Example usage
const loader = new InterfaceCatalogLoader();
await loader.loadCatalog();
const promptLogs = loader.getInterface('PromptLogs');
```

### 2. Supabase Schema Loader

`real-supabase-schema-loader.ts` loads and provides access to the Supabase database schema.

```typescript
// Example usage
const loader = new SupabaseSchemaLoader();
await loader.loadSchema();
const promptLogsTable = loader.getTable('prompt_logs');
```

### 3. Field Mapper

`real-field-mapper.ts` maps interface fields to database columns with transformations and validations.

```typescript
// Example usage
const fieldMapper = new FieldMapper();
const mappings = fieldMapper.mapInterfaceToTable(interfaceFields, tableColumns);
```

### 4. Make.com Scenario Builder

`real-makecom-scenario-builder.ts` generates Make.com integration scenarios for interface-to-database mappings.

```typescript
// Example usage
const scenarioBuilder = new MakeComScenarioBuilder();
const scenario = scenarioBuilder.buildScenario(interfaceName, interfaceData, fieldMappings);
```

### 5. Webhook Handler Generator

`real-webhook-handler-generator.ts` creates Express.js webhook handlers for receiving and processing data.

```typescript
// Example usage
const handlerGenerator = new WebhookHandlerGenerator();
const handlerCode = handlerGenerator.generateWebhookHandler(interfaceName, interfaceData, fieldMappings);
```

### 6. Truth Mapping Engine

`real-truth-mapping-engine.ts` orchestrates the entire system, connecting all components together.

```typescript
// Example usage
const engine = new TruthMappingEngine('./output');
await engine.initialize();
await engine.mapInterface('PromptLogs');
await engine.mapAllInterfaces();
await engine.generateUltimateTruthMappingGuide();
```

## Emotional Sovereignty Implementation

The system implements emotional sovereignty and trust transparency through:

1. **Trust Score Calculation**: Each mapping includes a trust score (0-5) based on field mapping quality, required field coverage, and transformation complexity.

2. **Emotional Impact Assessment**: Fields are categorized by emotional impact (positive, neutral, requires_validation) to ensure emotional sovereignty is preserved.

3. **Validation Rules**: Generated webhook handlers include validation rules that respect emotional sovereignty, with trust score thresholds (minimum 4.2).

4. **Empowering Responses**: API responses include empowering messages and next steps to enhance user experience.

5. **Graceful Error Handling**: All error states include supportive messaging that preserves user dignity.

## Trust Transparency

The system ensures trust transparency through:

1. **Ultimate Truth Mapping Guide**: A comprehensive document showing all mappings, trust scores, and emotional sovereignty assessments.

2. **Field Mapping Documentation**: Detailed explanation of how each field is mapped and transformed.

3. **Trust Score Methodology**: Clear documentation of how trust scores are calculated.

4. **Emotional Sovereignty Validation**: Explicit validation of emotional sovereignty preservation for each mapping.

## Proof of Concept: PromptLogs Interface

The implementation focuses on creating a proof of concept with the PromptLogs interface, mapping it to the prompt_logs table in Supabase, generating a Make.com scenario, and creating a webhook handler.

## Getting Started

### Prerequisites

- Node.js 14+
- TypeScript 4.5+
- Express.js (for webhook handlers)
- Supabase client (for database integration)
- Make.com account (for integration scenarios)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

### Usage

Run the demonstration script to see the system in action:

```bash
npm run start
```

This will:
1. Load the interface catalog and database schema
2. Map the PromptLogs interface to the prompt_logs table
3. Generate a Make.com scenario for the mapping
4. Create a webhook handler for the interface
5. Generate the Ultimate Truth Mapping Guide

The outputs will be in the `./demo-output` directory.

### Integration with Your System

To integrate with your own system:

1. Update the interface catalog in `CANAI-INTERFACE-CATALOG.json`
2. Update the database schema in `supabase-schema.json`
3. Run the system to generate mappings, scenarios, and handlers
4. Deploy the webhook handlers to your API server
5. Import the Make.com scenarios into your Make.com account

## Extensibility

The system is designed to be extensible:

- **New Interfaces**: Add new interfaces to the catalog and run the system to generate mappings
- **New Database Tables**: Add new tables to the schema and the system will map interfaces to them
- **Custom Transformations**: Extend the field mapper to support additional transformation types
- **Additional Integrations**: Extend the system to support other integration platforms beyond Make.com

## Trust-First Truth Validation

The system implements Test-First Truth by:

1. **Schema Validation**: Using Zod for runtime validation of all data
2. **Transformation Validation**: Ensuring data integrity during transformations
3. **Error Handling**: Comprehensive error handling with clear error messages
4. **Emotional Sovereignty Checks**: Validating trust scores and emotional impact

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 