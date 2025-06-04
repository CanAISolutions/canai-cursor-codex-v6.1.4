# Boot Sequence Implementation Plan - Production Ready

> **Document Type**: Executable Implementation Plan  
> **Status**: Active Implementation  
> **Version**: 1.0.0  
> **Last Updated**: 2025-05-28  
> **Compliance**: Codex v6.1.4 Standards, Zero Tolerance for Stubs

## Executive Summary

The boot sequence currently contains test-safe fallbacks, stub implementations, and incomplete functionality that violates Codex standards. This plan provides concrete implementation steps to replace all placeholder code with production-ready implementations.

## Current State Analysis - Actual Issues Found

### Critical Issues Identified

1. **cursor/utils/dreamstate-utils.ts**: Contains test-safe fallbacks returning hardcoded values (0.85)
2. **cursor/utils/modularity-utils.ts**: Contains stub implementations and TODO comments
3. **Missing Dependencies**: Several imported utilities don't exist or are incomplete
4. **Boot Sequence Modules**: All modules 01-10 rely on these stub implementations

### Specific Code Issues

```typescript
// ISSUE 1: dreamstate-utils.ts - Line 15-20
export function calculateDreamAlignmentScore(
  currentState: Record<string, any> | undefined | null,
  dreamState: Record<string, any> | undefined | null
): number {
  if (!currentState || !dreamState) {
    return 0.85; // DEFAULT ALIGNMENT SCORE FOR TESTING - PRODUCTION VIOLATION
  }
  return 0.85; // DEFAULT ALIGNMENT SCORE FOR TESTING - PRODUCTION VIOLATION
}

// ISSUE 2: modularity-utils.ts - Line 23-30
export function introspectModules(paths: string[]): ModuleMetadata[] {
  // Test-safe implementation - PRODUCTION VIOLATION
  return [{
    name: 'test-module', // HARDCODED TEST DATA
    dependencies: [],
    exports: ['testFunction'],
    complexity: 0.5,
    coverage: 0.9
  }];
}
```

## Implementation Plan - Concrete Actions

### Phase 1: Replace Stub Implementations (IMMEDIATE)

#### Task 1.1: Fix dreamstate-utils.ts
**File**: `cursor/utils/dreamstate-utils.ts`
**Action**: Replace all test-safe fallbacks with real implementations

```typescript
// REPLACE THIS STUB:
export function calculateDreamAlignmentScore(
  currentState: Record<string, any> | undefined | null,
  dreamState: Record<string, any> | undefined | null
): number {
  if (!currentState || !dreamState) {
    return 0.85; // DEFAULT - STUB
  }
  return 0.85; // DEFAULT - STUB
}

// WITH THIS REAL IMPLEMENTATION:
export function calculateDreamAlignmentScore(
  currentState: Record<string, any> | undefined | null,
  dreamState: Record<string, any> | undefined | null
): number {
  if (!currentState || !dreamState) {
    throw new Error('Invalid state provided to calculateDreamAlignmentScore');
  }

  // Real emotional alignment calculation
  const emotionalAlignment = calculateEmotionalAlignment(currentState, dreamState);
  const schemaAlignment = calculateSchemaAlignment(currentState, dreamState);
  const trustAlignment = calculateTrustAlignment(currentState, dreamState);
  
  // Weighted scoring based on emotional sovereignty principles
  const score = (emotionalAlignment * 0.5) + (schemaAlignment * 0.3) + (trustAlignment * 0.2);
  
  return Math.max(0, Math.min(1, score));
}

function calculateEmotionalAlignment(current: any, target: any): number {
  // Implementation based on VAD metrics from emotional sovereignty
  const vadCurrent = extractVADMetrics(current);
  const vadTarget = extractVADMetrics(target);
  
  const valenceAlignment = 1 - Math.abs(vadCurrent.valence - vadTarget.valence);
  const arousalAlignment = 1 - Math.abs(vadCurrent.arousal - vadTarget.arousal);
  const dominanceAlignment = 1 - Math.abs(vadCurrent.dominance - vadTarget.dominance);
  
  return (valenceAlignment + arousalAlignment + dominanceAlignment) / 3;
}

function calculateSchemaAlignment(current: any, target: any): number {
  // Implementation based on schema lock validation
  const currentSchema = extractSchemaSignature(current);
  const targetSchema = extractSchemaSignature(target);
  
  const matchingFields = currentSchema.filter(field => targetSchema.includes(field));
  return matchingFields.length / Math.max(currentSchema.length, targetSchema.length);
}

function calculateTrustAlignment(current: any, target: any): number {
  // Implementation based on trust score principles
  const trustMetrics = {
    consistency: calculateConsistency(current, target),
    reliability: calculateReliability(current),
    transparency: calculateTransparency(current)
  };
  
  return (trustMetrics.consistency + trustMetrics.reliability + trustMetrics.transparency) / 3;
}
```

#### Task 1.2: Fix modularity-utils.ts
**File**: `cursor/utils/modularity-utils.ts`
**Action**: Replace stub implementations with real module introspection

```typescript
// REPLACE THIS STUB:
export function introspectModules(paths: string[]): ModuleMetadata[] {
  // Test-safe implementation - VIOLATION
  return [{
    name: 'test-module',
    dependencies: [],
    exports: ['testFunction'],
    complexity: 0.5,
    coverage: 0.9
  }];
}

// WITH THIS REAL IMPLEMENTATION:
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

export function introspectModules(paths: string[]): ModuleMetadata[] {
  const modules: ModuleMetadata[] = [];
  
  for (const modulePath of paths) {
    try {
      const moduleData = analyzeModuleFile(modulePath);
      modules.push(moduleData);
    } catch (error) {
      Logger.error(`Failed to introspect module ${modulePath}`, error);
      // Continue with other modules rather than failing completely
    }
  }
  
  return modules;
}

function analyzeModuleFile(filePath: string): ModuleMetadata {
  const sourceCode = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );
  
  const dependencies = extractDependencies(sourceFile);
  const exports = extractExports(sourceFile);
  const complexity = calculateCyclomaticComplexity(sourceFile);
  
  return {
    name: path.basename(filePath, path.extname(filePath)),
    dependencies,
    exports,
    complexity,
    coverage: calculateTestCoverage(filePath)
  };
}

function extractDependencies(sourceFile: ts.SourceFile): string[] {
  const dependencies: string[] = [];
  
  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
      const moduleSpecifier = node.moduleSpecifier.getText().replace(/['"]/g, '');
      dependencies.push(moduleSpecifier);
    }
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  return dependencies;
}

function extractExports(sourceFile: ts.SourceFile): string[] {
  const exports: string[] = [];
  
  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      if (node.name) {
        exports.push(node.name.text);
      }
    }
    if (ts.isVariableStatement(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      node.declarationList.declarations.forEach(decl => {
        if (ts.isIdentifier(decl.name)) {
          exports.push(decl.name.text);
        }
      });
    }
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  return exports;
}
```

#### Task 1.3: Create Missing Utility Functions
**Files to Create**:
- `cursor/utils/system-validation-utils.ts`
- `cursor/utils/schema-validation-utils.ts`
- `cursor/codex/codex-memory-utils.ts`

**Implementation for system-validation-utils.ts**:
```typescript
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

export interface ValidationResult {
  passed: boolean;
  issues: string[];
}

export async function validateSystemModules(): Promise<ValidationResult> {
  const issues: string[] = [];
  
  // Check critical directories exist
  const criticalDirs = [
    'cursor/boot_sequence',
    'cursor/utils',
    'cursor/services',
    'cursor/components',
    'prompts',
    'tests'
  ];
  
  for (const dir of criticalDirs) {
    if (!fs.existsSync(dir)) {
      issues.push(`Critical directory missing: ${dir}`);
    }
  }
  
  // Check critical files exist
  const criticalFiles = [
    'cursor/boot_sequence/README.md',
    'cursor/utils/logger.ts',
    'cursor/event-bus/eventBus.ts',
    'package.json',
    'tsconfig.json'
  ];
  
  for (const file of criticalFiles) {
    if (!fs.existsSync(file)) {
      issues.push(`Critical file missing: ${file}`);
    }
  }
  
  // Validate TypeScript compilation
  try {
    const { execSync } = require('child_process');
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
  } catch (error) {
    issues.push(`TypeScript compilation failed: ${error.message}`);
  }
  
  return {
    passed: issues.length === 0,
    issues
  };
}

export async function validateTypesAndSchemas(): Promise<ValidationResult> {
  const issues: string[] = [];
  
  // Check schema lock file exists and is valid
  const schemaLockPath = '.codex-lock.json';
  if (!fs.existsSync(schemaLockPath)) {
    issues.push('Schema lock file missing: .codex-lock.json');
  } else {
    try {
      const schemaLock = JSON.parse(fs.readFileSync(schemaLockPath, 'utf-8'));
      if (!schemaLock.version || !schemaLock.schemas) {
        issues.push('Invalid schema lock file structure');
      }
    } catch (error) {
      issues.push(`Schema lock file is invalid JSON: ${error.message}`);
    }
  }
  
  // Validate TypeScript types
  const typeFiles = [
    'types/index.ts',
    'cursor/types/boot-sequence.ts',
    'cursor/types/emotional-sovereignty.ts'
  ];
  
  for (const typeFile of typeFiles) {
    if (fs.existsSync(typeFile)) {
      try {
        const content = fs.readFileSync(typeFile, 'utf-8');
        if (content.includes('any') && !content.includes('// @ts-ignore')) {
          issues.push(`Type file ${typeFile} contains 'any' types without justification`);
        }
      } catch (error) {
        issues.push(`Failed to read type file ${typeFile}: ${error.message}`);
      }
    }
  }
  
  return {
    passed: issues.length === 0,
    issues
  };
}
```

### Phase 2: Implement Missing Dependencies (HIGH PRIORITY)

#### Task 2.1: Create codex-memory-utils.ts
**File**: `cursor/codex/codex-memory-utils.ts`

```typescript
import * as fs from 'fs';
import { Logger } from '../utils/logger';
import { EventBus } from '../event-bus/eventBus';

export interface CodexMemoryValidation {
  passed: boolean;
  issues: string[];
}

export async function checkCodexMemoryIntegrity(): Promise<CodexMemoryValidation> {
  const issues: string[] = [];
  
  try {
    // Check codex lock file integrity
    const codexLockPath = '.codex-lock.json';
    if (!fs.existsSync(codexLockPath)) {
      issues.push('Codex lock file missing');
    } else {
      const lockData = JSON.parse(fs.readFileSync(codexLockPath, 'utf-8'));
      
      // Validate lock file structure
      if (!lockData.version) {
        issues.push('Codex lock file missing version');
      }
      
      if (!lockData.schemas) {
        issues.push('Codex lock file missing schemas');
      }
      
      // Check for schema drift
      const currentSchemas = await scanCurrentSchemas();
      const lockedSchemas = lockData.schemas;
      
      for (const [schemaName, currentHash] of Object.entries(currentSchemas)) {
        if (lockedSchemas[schemaName] !== currentHash) {
          issues.push(`Schema drift detected in ${schemaName}`);
        }
      }
    }
    
    // Check memory journal integrity
    const memoryJournalPath = 'cursor/self-awareness/selfAwarenessJournal.ts';
    if (fs.existsSync(memoryJournalPath)) {
      const journalContent = fs.readFileSync(memoryJournalPath, 'utf-8');
      if (journalContent.includes('console.log')) {
        issues.push('Memory journal contains console.log statements');
      }
    }
    
    // Emit memory check event
    EventBus.getInstance().emit('codex.memory.checked', {
      passed: issues.length === 0,
      issues
    });
    
  } catch (error) {
    Logger.error('Codex memory integrity check failed', error);
    issues.push(`Memory check failed: ${error.message}`);
  }
  
  return {
    passed: issues.length === 0,
    issues
  };
}

async function scanCurrentSchemas(): Promise<Record<string, string>> {
  const schemas: Record<string, string> = {};
  const crypto = require('crypto');
  
  // Scan for schema files
  const schemaFiles = [
    'types/index.ts',
    'cursor/types/boot-sequence.ts',
    'cursor/types/emotional-sovereignty.ts'
  ];
  
  for (const file of schemaFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const hash = crypto.createHash('sha256').update(content).digest('hex');
      schemas[file] = hash;
    }
  }
  
  return schemas;
}
```

### Phase 3: Update Boot Sequence Modules (HIGH PRIORITY)

#### Task 3.1: Update 01_dreamstate_alignment.ts
**Action**: Remove dependency on stub implementations

```typescript
/**
 * 01_dreamstate_alignment.ts
 * 
 * Purpose: Ensure emotional, architectural, and operational alignment with CanAI Dream-State
 * Triggered: On boot, self-check, agent activation, or periodic system refresh
 * Enforces: Codex compliance, UX tone integrity, modular architecture trust
 */

import { calculateDreamAlignmentScore } from "../utils/dreamstate-utils";
import { readSelfAwarenessJournal, recordAlignmentDelta } from "../self-awareness/selfAwarenessJournal";
import { emitSystemLog } from "../utils/log-utils"; // Changed from audit-utils
import { Logger } from "../utils/logger";
import { EventBus } from "../event-bus/eventBus";

interface DreamstateAlignmentResult {
  score: number;
  passed: boolean;
  issues?: string[];
}

/**
 * Runs the dreamstate alignment check to ensure the system is emotionally aligned
 * with its intended purpose and capabilities.
 * 
 * What: Validates the emotional alignment between current system state and target state
 * Why: Ensures emotional sovereignty principles are maintained during boot
 * How: Compares current and target states using VAD metrics and alignment scoring
 */
export async function runDreamstateAlignmentCheck(): Promise<DreamstateAlignmentResult> {
  try {
    Logger.info('Starting dreamstate alignment check');
    EventBus.getInstance().emit('dreamstate.alignment.start', { timestamp: Date.now() });
    
    const priorState = await readSelfAwarenessJournal();
    const targetState = await getTargetDreamState();
    
    const score = calculateDreamAlignmentScore(priorState, targetState);
    const threshold = 0.92; // Codex-mandated threshold
    const passed = score >= threshold;
    
    const issues: string[] = [];
    
    if (!passed) {
      issues.push(`Dream alignment score ${score} below threshold ${threshold}`);
      
      // Analyze specific alignment issues
      const alignmentAnalysis = await analyzeDreamstateGaps(priorState, targetState);
      issues.push(...alignmentAnalysis.issues);
      
      await emitSystemLog({
        component: 'boot_sequence',
        module: 'dreamstate_alignment',
        status: 'warning',
        details: { score, threshold, issues }
      });
    } else {
      await emitSystemLog({
        component: 'boot_sequence',
        module: 'dreamstate_alignment',
        status: 'success',
        details: { score, threshold }
      });
    }

    await recordAlignmentDelta({ lastEmotionalScore: score });
    
    EventBus.getInstance().emit('dreamstate.alignment.complete', { passed, score, issues });

    return {
      score,
      passed,
      issues: passed ? undefined : issues,
    };
  } catch (error) {
    Logger.error('Dreamstate alignment check failed', error);
    
    await emitSystemLog({
      component: 'boot_sequence',
      module: 'dreamstate_alignment',
      status: 'error',
      details: { error: error.message }
    });
    
    EventBus.getInstance().emit('dreamstate.alignment.error', { error: error.message });
    
    return {
      score: 0,
      passed: false,
      issues: ['Alignment check failed due to technical error']
    };
  }
}

async function getTargetDreamState(): Promise<any> {
  // Load target dream state from configuration
  const targetState = {
    emotional: {
      valence: 0.8,  // Positive emotional tone
      arousal: 0.6,  // Moderate energy level
      dominance: 0.7 // Strong sense of control/empowerment
    },
    trust: {
      transparency: 0.9,
      reliability: 0.95,
      empathy: 0.85
    },
    schema: {
      version: '6.1.4',
      integrity: true
    }
  };
  
  return targetState;
}

async function analyzeDreamstateGaps(current: any, target: any): Promise<{ issues: string[] }> {
  const issues: string[] = [];
  
  // Analyze emotional gaps
  if (current?.emotional && target?.emotional) {
    const emotionalGap = Math.abs(current.emotional.valence - target.emotional.valence);
    if (emotionalGap > 0.2) {
      issues.push(`Emotional valence gap: ${emotionalGap.toFixed(2)}`);
    }
  }
  
  // Analyze trust gaps
  if (current?.trust && target?.trust) {
    const trustGap = Math.abs(current.trust.transparency - target.trust.transparency);
    if (trustGap > 0.1) {
      issues.push(`Trust transparency gap: ${trustGap.toFixed(2)}`);
    }
  }
  
  return { issues };
}
```

### Phase 4: Create Comprehensive Tests (HIGH PRIORITY)

#### Task 4.1: Create Real Tests for Boot Sequence
**File**: `tests/boot_sequence/01_dreamstate_alignment.test.ts`

```typescript
import { runDreamstateAlignmentCheck } from '../../cursor/boot_sequence/01_dreamstate_alignment';
import { calculateDreamAlignmentScore } from '../../cursor/utils/dreamstate-utils';
import { readSelfAwarenessJournal } from '../../cursor/self-awareness/selfAwarenessJournal';

// Mock only external dependencies, not our implementations
jest.mock('../../cursor/self-awareness/selfAwarenessJournal');
jest.mock('../../cursor/utils/log-utils');

describe('Dreamstate Alignment Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should pass when alignment score is above threshold', async () => {
    // Arrange
    const mockCurrentState = {
      emotional: { valence: 0.8, arousal: 0.6, dominance: 0.7 },
      trust: { transparency: 0.9, reliability: 0.95, empathy: 0.85 }
    };
    
    (readSelfAwarenessJournal as jest.Mock).mockResolvedValue(mockCurrentState);
    
    // Act
    const result = await runDreamstateAlignmentCheck();
    
    // Assert
    expect(result.passed).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0.92);
    expect(result.issues).toBeUndefined();
  });

  test('should fail when alignment score is below threshold', async () => {
    // Arrange
    const mockCurrentState = {
      emotional: { valence: 0.3, arousal: 0.2, dominance: 0.1 },
      trust: { transparency: 0.4, reliability: 0.3, empathy: 0.2 }
    };
    
    (readSelfAwarenessJournal as jest.Mock).mockResolvedValue(mockCurrentState);
    
    // Act
    const result = await runDreamstateAlignmentCheck();
    
    // Assert
    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(0.92);
    expect(result.issues).toBeDefined();
    expect(result.issues.length).toBeGreaterThan(0);
  });

  test('should handle errors gracefully', async () => {
    // Arrange
    (readSelfAwarenessJournal as jest.Mock).mockRejectedValue(new Error('Test error'));
    
    // Act
    const result = await runDreamstateAlignmentCheck();
    
    // Assert
    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
    expect(result.issues).toEqual(['Alignment check failed due to technical error']);
  });

  test('calculateDreamAlignmentScore should work with real data', () => {
    // Test the actual implementation, not a mock
    const currentState = {
      emotional: { valence: 0.8, arousal: 0.6, dominance: 0.7 },
      trust: { transparency: 0.9, reliability: 0.95, empathy: 0.85 }
    };
    
    const targetState = {
      emotional: { valence: 0.8, arousal: 0.6, dominance: 0.7 },
      trust: { transparency: 0.9, reliability: 0.95, empathy: 0.85 }
    };
    
    const score = calculateDreamAlignmentScore(currentState, targetState);
    
    expect(score).toBeGreaterThan(0.9); // Perfect alignment should score high
    expect(score).toBeLessThanOrEqual(1.0); // Score should not exceed 1
  });
});
```

## Implementation Timeline

### Week 1: Foundation Fixes
- [ ] Day 1: Fix dreamstate-utils.ts stub implementations
- [ ] Day 2: Fix modularity-utils.ts stub implementations  
- [ ] Day 3: Create missing utility files
- [ ] Day 4: Update boot sequence module 01
- [ ] Day 5: Create comprehensive tests

### Week 2: Complete Boot Sequence
- [ ] Day 1-2: Update modules 02-04 (high priority)
- [ ] Day 3-4: Update modules 05-10 (medium priority)
- [ ] Day 5: Integration testing and verification

### Week 3: Quality Assurance
- [ ] Day 1-2: Run full test suite and fix issues
- [ ] Day 3: Performance testing
- [ ] Day 4: Security audit
- [ ] Day 5: Final verification and documentation

## Success Criteria

1. **Zero Stub Implementations**: No test-safe fallbacks or hardcoded values
2. **Real Functionality**: All functions perform actual calculations/validations
3. **Comprehensive Tests**: 90%+ test coverage with real assertions
4. **Production Ready**: Code passes all quality gates and linting
5. **Emotional Sovereignty**: All implementations align with emotional sovereignty principles

## Verification Process

Each implementation will be verified through:
1. **Code Review**: Manual inspection for stub removal
2. **Unit Testing**: Comprehensive test coverage
3. **Integration Testing**: End-to-end boot sequence testing
4. **Performance Testing**: Boot time and resource usage
5. **Quality Gates**: ESLint, TypeScript strict mode, no console.log

This plan provides concrete, actionable steps to transform the boot sequence from a collection of stubs into a production-ready system component. 