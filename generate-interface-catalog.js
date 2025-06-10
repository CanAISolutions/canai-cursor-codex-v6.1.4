"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs"));
const ts = __importStar(require("typescript"));
class InterfaceCatalogGenerator {
    constructor() {
        this.warnings = [];
        this.supabaseSchema = null;
        // Key files to extract from (based on our analysis)
        this.keyFiles = {
            database: [
                'workspace-organization/01-foundation/supabase/schema/supabase-schema-mapping.ts'
            ],
            products: [
                'prompts/ad_amplify.ts',
                'prompts/blogblitz.ts',
                'prompts/profile_makeover.ts',
                'prompts/business_plan.ts',
                'prompts/email_campaign.ts',
                'prompts/site_audit.ts',
                'prompts/social_content.ts',
                'prompts/reverse_strategy.ts',
                'prompts/ai_blueprint.ts',
                'prompts/ai_brand_identity.ts',
                'prompts/sparksplit.ts'
            ],
            api: [
                'api/types/airtable.ts',
                'api/types/prompt.ts',
                'api/types/openai.ts',
                'api/services/schema-api.ts'
            ],
            emotional: [
                'cursor/types/emotional-sovereignty.ts',
                'workspace-organization/03-emotional-intelligence/orchestrator/core/emotional-sovereignty-orchestrator.ts'
            ],
            analytics: [
                'analytics/sparksplit-analytics.ts',
                'analytics/session.ts',
                'analytics/goldmine-intelligence-engine.ts'
            ]
        };
        this.catalog = {
            metadata: {
                version: 'v1.0',
                generated: new Date().toISOString().split('T')[0],
                framework: 'CanAI Codex v6.1.4',
                totalInterfaces: 0,
                categories: ['database_schemas', 'prompts', 'api_webhooks', 'emotional_intelligence', 'analytics'],
                codeOwners: ['solo-dev'],
                verification: {
                    validatedInterfaces: 0,
                    warningsLogged: 0,
                    assumptions: []
                }
            },
            interfaces: {}
        };
        // Load Supabase schema if available
        try {
            const schemaPath = 'workspace-organization/01-foundation/supabase/schema/supabase-schema.json';
            if (fs.existsSync(schemaPath)) {
                this.supabaseSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
            }
        }
        catch (e) {
            this.warnings.push({
                type: 'schema_load_error',
                message: 'Could not load supabase-schema.json',
                error: e.message
            });
        }
    }
    async generate() {
        console.log('🚀 Starting interface catalog generation...');
        // Process each category
        for (const [category, files] of Object.entries(this.keyFiles)) {
            console.log(`\n📁 Processing ${category} interfaces...`);
            for (const filePath of files) {
                if (fs.existsSync(filePath)) {
                    await this.extractInterfacesFromFile(filePath, category);
                }
                else {
                    this.warnings.push({
                        type: 'file_not_found',
                        file: filePath,
                        category
                    });
                }
            }
        }
        // Update metadata
        this.catalog.metadata.totalInterfaces = Object.keys(this.catalog.interfaces).length;
        this.catalog.metadata.verification.warningsLogged = this.warnings.length;
        this.catalog.metadata.verification.validatedInterfaces =
            Object.values(this.catalog.interfaces).filter(i => i.supabaseMapping).length;
        // Save catalog
        fs.writeFileSync('CANAI-DEFINITIVE-INTERFACE-CATALOG-2025.json', JSON.stringify(this.catalog, null, 2));
        // Save warnings
        if (this.warnings.length > 0) {
            fs.writeFileSync('interface_warnings.json', JSON.stringify(this.warnings, null, 2));
        }
        console.log(`\n✅ Catalog generated successfully!`);
        console.log(`📊 Total interfaces: ${this.catalog.metadata.totalInterfaces}`);
        console.log(`⚠️  Warnings: ${this.warnings.length}`);
    }
    async extractInterfacesFromFile(filePath, category) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);
        const visit = (node) => {
            if (ts.isInterfaceDeclaration(node) && node.name) {
                const interfaceName = node.name.text;
                // Skip if it's a utility interface
                if (this.isUtilityInterface(interfaceName)) {
                    return;
                }
                console.log(`  📋 Found interface: ${interfaceName}`);
                const interfaceDef = this.extractInterfaceDefinition(node, filePath, category, interfaceName);
                this.catalog.interfaces[interfaceName] = interfaceDef;
            }
            ts.forEachChild(node, visit);
        };
        visit(sourceFile);
    }
    extractInterfaceDefinition(node, filePath, category, interfaceName) {
        const fields = [];
        // Extract fields
        node.members.forEach(member => {
            if (ts.isPropertySignature(member) && member.name) {
                const fieldName = member.name.getText();
                const fieldType = member.type ? member.type.getText() : 'any';
                const isRequired = !member.questionToken;
                fields.push({
                    name: fieldName,
                    type: fieldType,
                    required: isRequired,
                    description: this.getFieldDescription(member),
                    constraints: this.getFieldConstraints(fieldName, fieldType)
                });
            }
        });
        // Determine properties based on interface name and category
        const interfaceDef = {
            category: this.mapCategory(category),
            path: filePath,
            purpose: this.getPurpose(interfaceName, category),
            integrationPriority: this.getPriority(interfaceName, category),
            fields,
            webhookCompatible: this.isWebhookCompatible(interfaceName, fields),
            emotionalSovereignty: this.checkEmotionalSovereignty(fields),
            developerNotes: {
                tips: this.getDeveloperTips(interfaceName, category)
            }
        };
        // Add Supabase mapping for database interfaces
        if (category === 'database') {
            interfaceDef.supabaseMapping = this.generateSupabaseMapping(interfaceName, fields);
        }
        return interfaceDef;
    }
    mapCategory(category) {
        const categoryMap = {
            database: 'database_schemas',
            products: 'prompts',
            api: 'api_webhooks',
            emotional: 'emotional_intelligence',
            analytics: 'analytics'
        };
        return categoryMap[category] || category;
    }
    getPurpose(interfaceName, category) {
        // Define purposes based on known interfaces
        const purposes = {
            PromptLogs: 'Log prompt interactions with trust scores and emotional metrics',
            SessionAnalytics: 'Track user sessions with emotional journey and trust evolution',
            SparkSplitAnalytics: 'Revolutionary trust transparency comparison analytics',
            UserContext: 'Comprehensive user profile with emotional intelligence tracking',
            EmotionalSovereigntyRequest: 'Request emotional sovereignty validation',
            EmotionalSovereigntyResponse: 'Response with emotional sovereignty metrics'
        };
        return purposes[interfaceName] || `${category} interface for ${interfaceName}`;
    }
    getPriority(interfaceName, category) {
        // Critical interfaces
        const critical = ['PromptLogs', 'SessionAnalytics', 'SparkSplitAnalytics', 'UserContext'];
        if (critical.includes(interfaceName))
            return 'critical';
        // High priority categories
        if (category === 'database' || category === 'products')
            return 'high';
        if (category === 'emotional')
            return 'high';
        // Medium priority
        if (category === 'api' || category === 'analytics')
            return 'medium';
        return 'low';
    }
    isWebhookCompatible(interfaceName, fields) {
        // Webhook compatible if it has request/response pattern or is used in Make.com
        if (interfaceName.includes('Request') || interfaceName.includes('Response'))
            return true;
        if (interfaceName.includes('Webhook'))
            return true;
        // Check if it has simple serializable fields
        const hasComplexTypes = fields.some(f => f.type.includes('Function') ||
            f.type.includes('Symbol') ||
            f.type.includes('undefined'));
        return !hasComplexTypes;
    }
    checkEmotionalSovereignty(fields) {
        const emotionalFields = ['trustScore', 'emotionalDepth', 'emotionalProfile', 'sentimentScore',
            'aweScore', 'ownershipScore', 'wonderScore', 'calmScore', 'powerScore'];
        const hasEmotionalFields = fields.some(f => emotionalFields.includes(f.name));
        if (hasEmotionalFields) {
            return {
                status: 'supported',
                notes: 'Contains emotional sovereignty fields'
            };
        }
        return {
            status: 'needs_review',
            notes: 'Consider adding emotional sovereignty fields like trustScore or emotionalDepth'
        };
    }
    generateSupabaseMapping(interfaceName, fields) {
        // Convert interface name to snake_case table name
        const tableName = this.camelToSnakeCase(interfaceName);
        const columns = {};
        const transformation = {};
        fields.forEach(field => {
            const snakeCaseField = this.camelToSnakeCase(field.name);
            columns[snakeCaseField] = this.mapTypeToSupabase(field.type);
            transformation[field.name] = snakeCaseField;
        });
        return {
            table: tableName,
            columns,
            transformation
        };
    }
    camelToSnakeCase(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
    }
    mapTypeToSupabase(tsType) {
        const typeMap = {
            'string': 'varchar',
            'number': 'numeric',
            'boolean': 'boolean',
            'Date': 'timestamp',
            'any': 'jsonb',
            'object': 'jsonb'
        };
        // Handle arrays
        if (tsType.includes('[]'))
            return 'array';
        // Handle complex types
        if (tsType.includes('|') || tsType.includes('&'))
            return 'jsonb';
        return typeMap[tsType] || 'jsonb';
    }
    getFieldDescription(member) {
        // Extract JSDoc comments if available
        const sourceFile = member.getSourceFile();
        const comments = ts.getLeadingCommentRanges(sourceFile.text, member.pos);
        if (comments && comments.length > 0) {
            const comment = sourceFile.text.slice(comments[0].pos, comments[0].end);
            // Extract description from JSDoc
            const match = comment.match(/@description\s+(.+)/);
            if (match)
                return match[1].trim();
        }
        // Generate description based on field name
        return this.generateFieldDescription(member.name?.getText() || '');
    }
    generateFieldDescription(fieldName) {
        const descriptions = {
            trustScore: 'Trust score (0-5) measuring user confidence in the system',
            emotionalDepth: 'Emotional depth score (0-1) indicating emotional engagement',
            sessionId: 'Unique session identifier',
            userId: 'User identifier for tracking across sessions',
            timestamp: 'When the event occurred',
            createdAt: 'Record creation timestamp',
            updatedAt: 'Last update timestamp'
        };
        return descriptions[fieldName] || `${fieldName} field`;
    }
    getFieldConstraints(fieldName, fieldType) {
        // Define known constraints
        if (fieldName.includes('Score') && fieldType === 'number') {
            if (fieldName === 'trustScore') {
                return { type: 'range', min: 0, max: 5 };
            }
            return { type: 'range', min: 0, max: 1 };
        }
        if (fieldType.includes('|')) {
            const values = fieldType.split('|').map(t => t.trim().replace(/['"]/g, ''));
            return { type: 'enum', values };
        }
        return null;
    }
    getDeveloperTips(interfaceName, category) {
        const tips = {
            PromptLogs: 'Ensure unique sessionId and valid trustScore (0-5)',
            SessionAnalytics: 'Track emotional journey across the entire session',
            SparkSplitAnalytics: 'Use for A/B testing trust transparency'
        };
        return tips[interfaceName] || `Implement ${interfaceName} according to ${category} best practices`;
    }
    isUtilityInterface(name) {
        const utilityPatterns = ['Options', 'Config', 'Props', 'State', 'Context'];
        return utilityPatterns.some(pattern => name.endsWith(pattern));
    }
}
// Run the generator
const generator = new InterfaceCatalogGenerator();
generator.generate().catch(console.error);
