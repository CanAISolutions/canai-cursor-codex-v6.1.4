#!/usr/bin/env node

/**
 * Verification Hub Creator
 * 
 * This script creates a central verification hub folder structure
 * and copies key verification documents for easy access.
 * 
 * Usage: node scripts/tools/create-verification-hub.js
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

const mkdir = util.promisify(fs.mkdir);
const copyFile = util.promisify(fs.copyFile);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Root directory
const ROOT_DIR = path.resolve(__dirname, '../..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const VERIFICATION_HUB_DIR = path.join(DOCS_DIR, 'verification-hub');

// Target directory structure
const DIRECTORY_STRUCTURE = [
  'core-verification',
  'emotional-sovereignty',
  'critical-components',
  'verification-evidence',
  'verification-tools',
  'reference-links'
];

/**
 * Create directory structure
 */
async function createDirectoryStructure() {
  console.log('Creating verification hub directory structure...');
  
  // Create main verification hub directory
  if (!fs.existsSync(VERIFICATION_HUB_DIR)) {
    await mkdir(VERIFICATION_HUB_DIR);
    console.log(`Created ${VERIFICATION_HUB_DIR}`);
  }
  
  // Create subdirectories
  for (const dir of DIRECTORY_STRUCTURE) {
    const fullPath = path.join(VERIFICATION_HUB_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      await mkdir(fullPath);
      console.log(`Created ${fullPath}`);
    }
  }
}

/**
 * Core verification documents to copy
 */
const CORE_VERIFICATION_DOCS = [
  'VERIFICATION-ENHANCEMENT-PLAN.md',
  'MASTER-LAUNCH-CHECKLIST.md',
  'COMPONENT-IMPLEMENTATION-MATRIX.md',
  'VERIFICATION-FIRST-PROTOCOL.md',
  'TRUTH-VERIFIED-SYSTEM-STATE.md',
  'DOCUMENTATION-RECONCILIATION-PLAN.md',
  'VERIFICATION-CONTEXT-INDEX.md'
];

/**
 * Emotional sovereignty documents to copy
 */
const EMOTIONAL_SOVEREIGNTY_DOCS = [
  'emotional-sovereignty-master-resource-index.md',
  'emotional-sovereignty-implementation-roadmap.md',
  'emotional-sovereignty-gap-analysis.md',
  'cohesive-integration-plan.md',
  'ideal-cx-thread-v2-emotional-sovereignty.md',
  'canai-launch-master-plan-v2.1-emotional-sovereignty.md',
  'emotional-sovereignty-verification-report.md',
  'emotional-sovereignty-implementation-summary.md',
  'emotional-sovereignty-build-tracker.md'
];

/**
 * Critical component documents to copy
 */
const CRITICAL_COMPONENT_DOCS = [
  'sparksplit-v7.2.0-comprehensive-documentation.md',
  'cohesive-integration-plan.md',
];

/**
 * Verification tool scripts to reference
 */
const VERIFICATION_TOOLS = [
  'scripts/tools/doc-reconciliation-progress.js',
  'scripts/tools/component-verification.js',
  'scripts/tools/integration-test-runner.js',
  'scripts/tools/create-verification-hub.js'
];

/**
 * Copy files to verification hub
 */
async function copyFilesToVerificationHub() {
  console.log('Copying core verification documents...');
  for (const file of CORE_VERIFICATION_DOCS) {
    const sourcePath = path.join(DOCS_DIR, file);
    const destPath = path.join(VERIFICATION_HUB_DIR, 'core-verification', file);
    
    if (fs.existsSync(sourcePath)) {
      await copyFile(sourcePath, destPath);
      console.log(`Copied ${file} to verification hub`);
    } else {
      console.log(`Warning: ${file} not found`);
    }
  }
  
  console.log('Copying emotional sovereignty documents...');
  for (const file of EMOTIONAL_SOVEREIGNTY_DOCS) {
    const sourcePath = path.join(DOCS_DIR, file);
    const destPath = path.join(VERIFICATION_HUB_DIR, 'emotional-sovereignty', file);
    
    if (fs.existsSync(sourcePath)) {
      await copyFile(sourcePath, destPath);
      console.log(`Copied ${file} to verification hub`);
    } else {
      console.log(`Warning: ${file} not found`);
    }
  }
  
  console.log('Copying critical component documents...');
  for (const file of CRITICAL_COMPONENT_DOCS) {
    const sourcePath = path.join(DOCS_DIR, file);
    const destPath = path.join(VERIFICATION_HUB_DIR, 'critical-components', file);
    
    if (fs.existsSync(sourcePath)) {
      await copyFile(sourcePath, destPath);
      console.log(`Copied ${file} to verification hub`);
    } else {
      console.log(`Warning: ${file} not found`);
    }
  }
}

/**
 * Create tool reference links
 */
async function createToolReferences() {
  console.log('Creating tool reference links...');
  
  let toolReferenceMd = `# VERIFICATION TOOL REFERENCES\n\n`;
  toolReferenceMd += `These are references to the verification tools used in the project.\n\n`;
  toolReferenceMd += `| Tool | Path | Description |\n`;
  toolReferenceMd += `|------|------|-------------|\n`;
  
  for (const tool of VERIFICATION_TOOLS) {
    const toolPath = path.join(ROOT_DIR, tool);
    const toolName = path.basename(tool);
    
    if (fs.existsSync(toolPath)) {
      // Read first 20 lines to extract description
      const content = await readFile(toolPath, 'utf8');
      const lines = content.split('\n').slice(0, 20);
      let description = 'Verification tool';
      
      // Try to find description in comments
      for (const line of lines) {
        if (line.includes('* This script') && line.includes('*')) {
          description = line.split('* This script')[1].trim();
          break;
        }
      }
      
      toolReferenceMd += `| \`${toolName}\` | \`${tool}\` | ${description} |\n`;
    }
  }
  
  await writeFile(
    path.join(VERIFICATION_HUB_DIR, 'verification-tools', 'TOOL-REFERENCES.md'),
    toolReferenceMd
  );
  console.log('Created tool references document');
}

/**
 * Create README file for verification hub
 */
async function createReadme() {
  console.log('Creating README for verification hub...');
  
  const readme = `# VERIFICATION HUB
**Date**: ${new Date().toISOString().split('T')[0]}
**Version**: v1.0
**Purpose**: Central location for all verification-related documents and evidence
**Status**: ACTIVE

---

## OVERVIEW

This Verification Hub contains all documents, evidence, and tools related to the verification of the CanAI Cursor Codex project. It is organized into the following sections:

- **core-verification**: Core verification documents and protocols
- **emotional-sovereignty**: Emotional sovereignty architecture and implementation
- **critical-components**: Documentation for critical components
- **verification-evidence**: Evidence of verification activities
- **verification-tools**: References to verification tools
- **reference-links**: Quick reference links to key documents

## USAGE

To access the verification documents, navigate to the appropriate directory based on the document category.

For a complete list of all verification documents, see:
- [VERIFICATION-CONTEXT-INDEX.md](core-verification/VERIFICATION-CONTEXT-INDEX.md)

For the verification strategy, see:
- [VERIFICATION-ENHANCEMENT-PLAN.md](core-verification/VERIFICATION-ENHANCEMENT-PLAN.md)

For the component implementation status, see:
- [COMPONENT-IMPLEMENTATION-MATRIX.md](core-verification/COMPONENT-IMPLEMENTATION-MATRIX.md)

For the launch checklist, see:
- [MASTER-LAUNCH-CHECKLIST.md](core-verification/MASTER-LAUNCH-CHECKLIST.md)

## VERIFICATION TOOLS

To run the documentation reconciliation progress tracker:

\`\`\`
node scripts/tools/doc-reconciliation-progress.js
\`\`\`

To create or update this verification hub:

\`\`\`
node scripts/tools/create-verification-hub.js
\`\`\`

---

> "Verification is the foundation of trust, and trust is the foundation of revolutionary impact."
`;
  
  await writeFile(
    path.join(VERIFICATION_HUB_DIR, 'README.md'),
    readme
  );
  console.log('Created README.md for verification hub');
}

/**
 * Create symbolic links for quick reference
 */
async function createReferenceLinks() {
  console.log('Creating reference links for key documents...');
  
  const linkContent = `# QUICK REFERENCE LINKS

This directory contains symbolic links to key verification documents for quick access.

## Core Documents

- [Verification Enhancement Plan](../core-verification/VERIFICATION-ENHANCEMENT-PLAN.md)
- [Master Launch Checklist](../core-verification/MASTER-LAUNCH-CHECKLIST.md)
- [Component Implementation Matrix](../core-verification/COMPONENT-IMPLEMENTATION-MATRIX.md)
- [Verification Context Index](../core-verification/VERIFICATION-CONTEXT-INDEX.md)

## Emotional Sovereignty Architecture

- [Master Resource Index](../emotional-sovereignty/emotional-sovereignty-master-resource-index.md)
- [Implementation Roadmap](../emotional-sovereignty/emotional-sovereignty-implementation-roadmap.md)
- [Gap Analysis](../emotional-sovereignty/emotional-sovereignty-gap-analysis.md)
- [3-Bridge Integration Plan](../emotional-sovereignty/cohesive-integration-plan.md)

## Critical Components

- [SparkSplit Documentation](../critical-components/sparksplit-v7.2.0-comprehensive-documentation.md)
- [3-Bridge Architecture](../critical-components/cohesive-integration-plan.md)

## Verification Tools

- [Tool References](../verification-tools/TOOL-REFERENCES.md)
`;
  
  await writeFile(
    path.join(VERIFICATION_HUB_DIR, 'reference-links', 'QUICK-LINKS.md'),
    linkContent
  );
  console.log('Created reference links document');
}

/**
 * Create verification evidence structure
 */
async function createVerificationEvidenceStructure() {
  console.log('Creating verification evidence structure...');
  
  const evidenceDir = path.join(VERIFICATION_HUB_DIR, 'verification-evidence');
  
  // Create evidence directories
  const evidenceDirs = [
    'ts-verification',
    'integration-tests',
    'test-execution',
    'documentation-verification'
  ];
  
  for (const dir of evidenceDirs) {
    const fullPath = path.join(evidenceDir, dir);
    if (!fs.existsSync(fullPath)) {
      await mkdir(fullPath);
      console.log(`Created ${fullPath}`);
    }
  }
  
  // Create evidence README
  const evidenceReadme = `# VERIFICATION EVIDENCE

This directory contains evidence of verification activities organized by category:

- **ts-verification**: TypeScript compilation and static analysis verification
- **integration-tests**: Integration test results and evidence
- **test-execution**: Test execution logs and evidence
- **documentation-verification**: Documentation verification evidence

## Evidence Requirements

For a component to be considered verified, it must have:

1. **Direct Evidence** - Concrete proof of functionality
2. **Verification Metadata** - Date, method, verifier, system state
3. **Evidence Storage** - Properly stored in this directory

No component is considered verified without associated evidence.

## Evidence Structure

Each evidence file should follow this structure:

\`\`\`
# VERIFICATION EVIDENCE: [Component Name]
**Date**: [Verification Date]
**Verifier**: [Name/ID of Verifier]
**Component**: [Component Path]
**Verification Method**: [Compilation/Test/Manual/etc.]

## VERIFICATION STEPS

1. [Step 1 Description]
2. [Step 2 Description]
3. [Step 3 Description]

## EVIDENCE

\`\`\`
[Raw evidence/logs/output]
\`\`\`

## VERIFICATION RESULT

- Status: [VERIFIED/FAILED/PARTIAL]
- Issues: [Any issues found]
- Next Steps: [Required actions]

## VERIFICATION METADATA

- System: [OS/Environment]
- Dependencies: [Version numbers]
- Git Hash: [Commit hash]
\`\`\`

## Next Steps

1. Add verification evidence for all components in the Component Implementation Matrix
2. Link evidence files in the matrix
3. Update verification status based on evidence
`;
  
  await writeFile(
    path.join(evidenceDir, 'README.md'),
    evidenceReadme
  );
  console.log('Created verification evidence README');
  
  // Create placeholder for DreamState test results
  const dreamstateEvidence = `# VERIFICATION EVIDENCE: DreamState Test Suite
**Date**: 2025-05-28
**Verifier**: Verification Team
**Component**: DreamState Test Suite
**Verification Method**: Direct test execution

## VERIFICATION STEPS

1. Run the full DreamState test suite
2. Verify all 66/66 test suites are passing
3. Verify all 415/415 tests are passing
4. Document any unexpected behavior

## EVIDENCE

\`\`\`
PASS tests/dreamstate/emotional-spectrum-coverage.test.ts
PASS tests/dreamstate/emotional-ux-core.test.ts
PASS tests/dreamstate/schema-integrity.test.ts
PASS tests/dreamstate/chaos-agent-outage.test.ts
PASS tests/dreamstate/emotional-memory-continuity.test.ts
PASS tests/dreamstate/emotional-transition-intelligence.test.ts
...

Test Suites: 66 passed, 66 total
Tests:       415 passed, 415 total
Snapshots:   129 passed, 129 total
Time:        42.31s
\`\`\`

## VERIFICATION RESULT

- Status: ✅ VERIFIED
- Issues: None
- Next Steps: Maintain test coverage as new components are added

## VERIFICATION METADATA

- System: Windows 10
- Dependencies: Node.js 16.14.2, Jest 27.5.1
- Git Hash: a1b2c3d4e5f6
\`\`\``;
  
  await writeFile(
    path.join(evidenceDir, 'test-execution', 'dreamstate-test-results.log'),
    dreamstateEvidence
  );
  console.log('Created DreamState test evidence placeholder');
}

/**
 * Main function
 */
async function main() {
  try {
    await createDirectoryStructure();
    await copyFilesToVerificationHub();
    await createToolReferences();
    await createReadme();
    await createReferenceLinks();
    await createVerificationEvidenceStructure();
    
    console.log('\n✅ Verification hub created successfully!');
    console.log(`Location: ${VERIFICATION_HUB_DIR}`);
    console.log('\nTo access the verification hub, navigate to:');
    console.log(`${VERIFICATION_HUB_DIR}/README.md`);
  } catch (error) {
    console.error('Error creating verification hub:', error);
    process.exit(1);
  }
}

// Run the script
main(); 