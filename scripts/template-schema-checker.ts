/**
 * template-schema-checker.ts
 * What: Compares /system-templates/audit-self-heal/ templates with live uses in /cursor/fallback/, /cursor/plugins/, /cursor/services/, /cursor/tests/
 * Why: Detects field mismatches, missing keys, and structural drift in JSON/Markdown templates
 * How: Outputs a markdown report to /cursor/system-intel/drift-findings.md
 * Phase: 2.8.8
 */

import * as fs from 'fs';
import * as path from 'path';

const TEMPLATE_DIR = 'system-templates/audit-self-heal';
const TARGET_DIRS = [
  'cursor/fallback',
  'cursor/plugins',
  'cursor/services',
  'cursor/tests',
];
const OUTPUT_REPORT = 'cursor/system-intel/drift-findings.md';
const LOG_PATH = 'cursor/auto-actions.log.md';

function readJson(filePath: string) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function readMarkdown(filePath: string) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

function compareJson(template: any, target: any) {
  const templateKeys = Object.keys(template || {});
  const targetKeys = Object.keys(target || {});
  const missing = templateKeys.filter(k => !targetKeys.includes(k));
  const extra = targetKeys.filter(k => !templateKeys.includes(k));
  const mismatches = templateKeys.filter(k => targetKeys.includes(k) && typeof template[k] !== typeof target[k]);
  return { missing, extra, mismatches };
}

function compareMarkdown(template: string, target: string) {
  // Simple check: look for required anchors/sections
  const anchors = ['#', '##', '- '];
  const missingAnchors = anchors.filter(a => template.includes(a) && !target.includes(a));
  return { missingAnchors };
}

function scan() {
  let report = '# Template Schema Drift Findings\n\n';
  // JSON templates
  ['intent-token.json'].forEach(file => {
    const templatePath = path.join(TEMPLATE_DIR, file);
    const templateJson = readJson(templatePath);
    for (const dir of TARGET_DIRS) {
      const targetPath = path.join(dir, file);
      if (fs.existsSync(targetPath)) {
        const targetJson = readJson(targetPath);
        const { missing, extra, mismatches } = compareJson(templateJson, targetJson);
        if (missing.length || extra.length || mismatches.length) {
          report += `## ${dir}/${file}\n`;
          if (missing.length) report += `- Missing keys: ${missing.join(', ')}\n`;
          if (extra.length) report += `- Extra keys: ${extra.join(', ')}\n`;
          if (mismatches.length) report += `- Type mismatches: ${mismatches.join(', ')}\n`;
        }
      } else {
        report += `## ${dir}/${file}\n- File missing\n`;
      }
    }
  });
  // Markdown templates
  ['README.md', 'log-expectation.md'].forEach(file => {
    const templatePath = path.join(TEMPLATE_DIR, file);
    const templateMd = readMarkdown(templatePath);
    for (const dir of TARGET_DIRS) {
      const targetPath = path.join(dir, file);
      if (fs.existsSync(targetPath)) {
        const targetMd = readMarkdown(targetPath);
        const { missingAnchors } = compareMarkdown(templateMd, targetMd);
        if (missingAnchors.length) {
          report += `## ${dir}/${file}\n- Missing anchors/sections: ${missingAnchors.join(', ')}\n`;
        }
      } else {
        report += `## ${dir}/${file}\n- File missing\n`;
      }
    }
  });
  fs.writeFileSync(OUTPUT_REPORT, report);
}

if (require.main === module) {
  scan();
  const logEntry = `\n[${new Date().toISOString()}] TemplateSchemaChecker: Drift findings written to ${OUTPUT_REPORT}`;
  fs.appendFileSync(LOG_PATH, logEntry);
} 