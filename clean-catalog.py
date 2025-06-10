import json

# Load the catalog
with open('CANAI-DEFINITIVE-INTERFACE-CATALOG-2025.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

# Track changes
changes_made = 0

# Clean interface names
for interface_name in list(catalog['interfaces']):
    clean_name = interface_name.replace('\r', '')
    
    if clean_name != interface_name:
        # Move the entry to a clean name
        catalog['interfaces'][clean_name] = catalog['interfaces'].pop(interface_name)
        changes_made += 1
        
        # Clean the purpose field if it contains the interface name with \r
        if 'purpose' in catalog['interfaces'][clean_name]:
            purpose = catalog['interfaces'][clean_name]['purpose']
            if '\r' in purpose:
                catalog['interfaces'][clean_name]['purpose'] = purpose.replace('\r', '')
                changes_made += 1
        
        # Clean supabaseMapping table names if they exist
        if 'supabaseMapping' in catalog['interfaces'][clean_name] and 'table' in catalog['interfaces'][clean_name]['supabaseMapping']:
            table_name = catalog['interfaces'][clean_name]['supabaseMapping']['table']
            if '\r' in table_name:
                catalog['interfaces'][clean_name]['supabaseMapping']['table'] = table_name.replace('\r', '')
                changes_made += 1

# Also clean any \r in nested fields and values
def clean_nested_values(obj):
    global changes_made
    if isinstance(obj, dict):
        for key, value in list(obj.items()):
            if isinstance(value, str) and '\r' in value:
                obj[key] = value.replace('\r', '')
                changes_made += 1
            elif isinstance(value, (dict, list)):
                clean_nested_values(value)
    elif isinstance(obj, list):
        for item in obj:
            clean_nested_values(item)

# Clean all nested values
clean_nested_values(catalog)

# Save the cleaned catalog
with open('CANAI-DEFINITIVE-INTERFACE-CATALOG-2025-CLEANED.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2)

print(f"Cleaning complete. Made {changes_made} replacements. Saved to CANAI-DEFINITIVE-INTERFACE-CATALOG-2025-CLEANED.json") 