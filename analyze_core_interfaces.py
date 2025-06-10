import csv
import json
from collections import defaultdict

# Define categories based on the requirements
categories = {
    'database_schemas': ['supabase-schema-mapping', 'schema', 'Record', 'Table'],
    'prompts': ['Prompt', 'prompt', 'MCP'],
    'analytics': ['Analytics', 'Metrics', 'analytics', 'Dashboard'],
    'emotional_intelligence': ['Emotional', 'Trust', 'Sovereignty', 'Sacred'],
    'api_webhooks': ['Request', 'Response', 'Webhook', 'API'],
    'sparksplit': ['SparkSplit', 'Spark', 'Comparison'],
    'core_services': ['Service', 'Engine', 'Orchestrator'],
    'ai_operations': ['Memory', 'AI', 'Intelligence']
}

# Load interfaces
interfaces_by_category = defaultdict(list)
interfaces_by_file = defaultdict(list)
all_interfaces = []

# Known critical tables from your documentation
critical_tables = [
    'PromptLogs', 'SessionAnalytics', 'SparkSplitAnalytics', 'GoldmineOutput',
    'UserContext', 'EmotionalIntelligence', 'TrustMetrics', 'PerformanceMetrics',
    'WebhookLogs', 'AirtableSync', 'ErrorLogs', 'ProcessingResults', 'SystemHealth',
    'PromptTypes', 'EmotionalStates', 'TrustFactors', 'SystemConfigs', 'AnalyticsAggregates'
]

# Read and categorize interfaces
with open('interfaces_list.csv', 'r') as f:
    for line in f:
        path, interface_name = line.strip().split(',')
        
        # Skip non-core directories
        if any(skip in path for skip in ['node_modules', 'canai-orbital', 'tests', 'dist']):
            continue
            
        # Store interface info
        interface_info = {
            'name': interface_name,
            'path': path,
            'category': 'uncategorized'
        }
        
        # Categorize based on name patterns
        for category, patterns in categories.items():
            if any(pattern in interface_name for pattern in patterns):
                interface_info['category'] = category
                interfaces_by_category[category].append(interface_info)
                break
        
        # If still uncategorized, check file path
        if interface_info['category'] == 'uncategorized':
            if 'workspace-organization' in path and 'schema' in path:
                interface_info['category'] = 'database_schemas'
            elif 'api' in path:
                interface_info['category'] = 'api_webhooks'
            elif 'analytics' in path:
                interface_info['category'] = 'analytics'
            elif 'cursor' in path and 'emotional' in path.lower():
                interface_info['category'] = 'emotional_intelligence'
            
            interfaces_by_category[interface_info['category']].append(interface_info)
        
        all_interfaces.append(interface_info)
        interfaces_by_file[path].append(interface_name)

# Print summary
print("CORE INTERFACE ANALYSIS")
print("=" * 70)
print(f"Total core interfaces: {len(all_interfaces)}")
print(f"\nCategory breakdown:")
print("-" * 50)

total_categorized = 0
for category, interfaces in sorted(interfaces_by_category.items()):
    if category != 'uncategorized':
        total_categorized += len(interfaces)
    print(f"{category:25s}: {len(interfaces):4d} interfaces")

print(f"\nCategorization rate: {total_categorized}/{len(all_interfaces)} ({total_categorized/len(all_interfaces)*100:.1f}%)")

# Check for critical tables
print(f"\n\nCRITICAL TABLE COVERAGE (18 tables)")
print("-" * 50)
found_tables = []
missing_tables = []

for table in critical_tables:
    found = False
    for interface in all_interfaces:
        if table.lower() in interface['name'].lower():
            found = True
            found_tables.append(table)
            break
    if not found:
        missing_tables.append(table)

print(f"Found: {len(found_tables)}/{len(critical_tables)} tables")
if missing_tables:
    print(f"Missing: {', '.join(missing_tables)}")

# Key files with most interfaces
print(f"\n\nKEY FILES (most interfaces)")
print("-" * 50)
sorted_files = sorted(interfaces_by_file.items(), key=lambda x: len(x[1]), reverse=True)
for path, interfaces in sorted_files[:15]:
    print(f"{len(interfaces):3d} interfaces: {path}")

# Database schema files
print(f"\n\nDATABASE SCHEMA FILES")
print("-" * 50)
schema_files = [f for f in interfaces_by_file.keys() if 'schema' in f.lower() and 'supabase' in f.lower()]
for file in sorted(schema_files):
    print(f"{file}: {len(interfaces_by_file[file])} interfaces")

# Product prompt files  
print(f"\n\nPRODUCT PROMPT FILES")
print("-" * 50)
prompt_files = [f for f in interfaces_by_file.keys() if 'prompts' in f or '.mcp.' in f]
for file in sorted(prompt_files):
    print(f"{file}: {len(interfaces_by_file[file])} interfaces")

# Save analysis for next step
with open('interface_analysis.json', 'w') as f:
    json.dump({
        'total_interfaces': len(all_interfaces),
        'categories': {k: len(v) for k, v in interfaces_by_category.items()},
        'critical_tables_found': found_tables,
        'critical_tables_missing': missing_tables,
        'key_files': dict(sorted_files[:20]),
        'schema_files': schema_files,
        'prompt_files': prompt_files
    }, f, indent=2) 