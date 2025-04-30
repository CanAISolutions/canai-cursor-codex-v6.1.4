/**
 * modularity-utils.ts
 * 
 * Purpose: Evaluate modular cohesion and folder integrity across the system.
 * Used during audits, agent alignment, and safe prompt evolution gating.
 */

export interface ModularityScoreReport {
    score: number;                 // 0–1
    violations: string[];
    suggestions: string[];
  }
  
  export function evaluateModularCohesion(systemSnapshot: string): number {
    // Placeholder: should parse AST or folder map in production
    const signals = {
      overCoupledFiles: systemSnapshot.includes("import '../../../'"),
      exportBloat: systemSnapshot.split("export ").length > 15,
      misalignedNames: systemSnapshot.includes("utils" && "fixer"),
    };
  
    let score = 1;
    const deductions = [];
  
    if (signals.overCoupledFiles) {
      score -= 0.2;
      deductions.push("Cross-folder import detected — possible coupling.");
    }
  
    if (signals.exportBloat) {
      score -= 0.2;
      deductions.push("Export count unusually high — risk of responsibility sprawl.");
    }
  
    if (signals.misalignedNames) {
      score -= 0.1;
      deductions.push("Filename/folder intent mismatch — modular clarity violation.");
    }
  
    return Math.max(0, score);
  }
  
  export function generateModularityReport(systemSnapshot: string): ModularityScoreReport {
    const score = evaluateModularCohesion(systemSnapshot);
    const violations: string[] = [];
    const suggestions: string[] = [];
  
    if (score < 0.9) violations.push("Modular cohesion weakened.");
    if (score < 0.8) suggestions.push("Split responsibilities into smaller utilities.");
    if (score < 0.7) suggestions.push("Audit folder structure and isolate logic contracts.");
  
    return {
      score,
      violations,
      suggestions,
    };
  }
  