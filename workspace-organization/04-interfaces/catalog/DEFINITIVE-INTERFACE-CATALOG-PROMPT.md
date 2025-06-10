# CANAI DEFINITIVE INTERFACE CATALOG CREATION PROMPT

## GOAL
Create a comprehensive and definitive CANAI-INTERFACE-CATALOG-DEFINITIVE.json that serves as the single source of truth for ALL system interfaces, combining the completeness of the original catalog with the expanded interfaces in V2.

## CRITICAL REQUIREMENTS

1. **COMPLETENESS**: Include EVERY interface from both the original catalog AND the V2 catalog with FULL definition details.

2. **ACCURACY**: Ensure 100% accuracy by validating each interface definition directly against actual code implementations.

3. **SOURCES OF TRUTH**:
   - ALWAYS check the actual TypeScript interface definitions in the codebase
   - Verify paths listed in both catalog files to find the actual interface code
   - Prioritize code implementation over catalog descriptions when discrepancies exist

4. **INTERFACE VERIFICATION PROCESS**:
   - Start with complete list of interfaces from both catalogs
   - For each interface, find and verify its code definition by path
   - Confirm ALL fields, types, descriptions, and relationships
   - Never exclude any interface from either catalog
   - Ensure V1 interfaces like GoldmineOutput, UserAIProfile, etc. have COMPLETE definitions

5. **OUTPUT FORMAT**:
   - Follow the structure of V2 catalog's enhanced metadata section
   - Include ALL original interfaces with complete definitions (fields, types, descriptions)
   - Include ALL new V2 interfaces with complete definitions
   - Maintain relationships, usage patterns, and integration guides
   - Add accurate "isOriginal" flag for interfaces from V1 catalog

## HOW TO FIND INTERFACES

1. **CODE SEARCH TECHNIQUES**:
   - Search for interface definitions using file paths listed in both catalogs
   - Search for specific interface names using `grep_search` to find declarations
   - Use TypeScript-aware searches to find interface definitions and exports
   - Check `/workspace-organization/`, `/cursor/types/`, and other key directories

2. **VERIFICATION METHODS**:
   - Compare field names, types, and required status between code and catalogs
   - Verify descriptions match actual usage context
   - Validate relationship mappings against actual code dependencies
   - Ensure enums and other constraints are accurately represented

## OUTPUT REQUIREMENTS

1. **STRUCTURE**:
   - Follow JSON format with proper nesting
   - Use consistent field naming and structure
   - Group interfaces by category
   - Include complete metadata section

2. **FIELDS TO INCLUDE FOR EACH INTERFACE**:
   - Full path to code definition
   - Category
   - Purpose
   - Integration priority
   - isOriginal flag (for V1 interfaces)
   - Complete fields object with:
     - Type
     - Required status
     - Description
     - Enum values (if applicable)
     - Range constraints (if applicable)
   - Relationships array
   - Usage patterns array

3. **METADATA**:
   - Combined total interface count
   - All categories
   - Comprehensive integration priorities
   - Generation timestamp
   - Framework version
   - Purpose statement

## WEBHOOK INTEGRATION SUPPORT

1. **ENSURE WEBHOOK MAPPINGS**:
   - Include complete makeComWebhooks section
   - Map all interfaces to appropriate endpoints
   - Include HTTP methods and descriptions
   - Categorize by priority

2. **DATA FLOW DOCUMENTATION**:
   - Document complete data flow patterns
   - Show relationships between interfaces
   - Clarify input/processing/output flows

## VERIFICATION CHECKLIST

- [ ] All 38 interfaces from original catalog included with COMPLETE definitions
- [ ] All 27 new interfaces from V2 catalog included with COMPLETE definitions
- [ ] Every interface verified against actual code implementation
- [ ] No interfaces missing or incomplete
- [ ] Accurate relationships between interfaces
- [ ] Complete webhook integration mapping
- [ ] Consistent structure and formatting
- [ ] 100% field-level accuracy compared to code
- [ ] Categories correctly assigned
- [ ] Integration priorities accurately reflected

Remember: This catalog will be used for critical API integration and automation. Its accuracy directly impacts system reliability and emotional sovereignty. Thorough verification against actual code is ESSENTIAL. 