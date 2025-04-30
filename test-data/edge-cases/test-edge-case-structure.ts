// ✅ test-edge-case-structure.ts
// @codex-purpose: Enforce edge-case file integrity and blueprint triad structure
// @codex-system: edge-case test infrastructure
// @codex-critical: Prevents silent drift, incomplete triads, or non-Codex compliant test inputs
// @codex-verified: v1.4.2

import fs from 'fs';
import path from 'path';

const edgeCaseDir = path.resolve(__dirname);
const expectedSuffixes = ['.input.json', '.json'];
const validExpected = ['.expected-error.json', '.expected-output.json'];

const blueprintFiles = fs.readdirSync(edgeCaseDir).filter(f =>
  f.endsWith('.json') &&
  !f.endsWith('.input.json') &&
  !f.includes('.expected-error') &&
  !f.includes('.expected-output')
);

const errors: string[] = [];

blueprintFiles.forEach(baseFile => {
  const base = baseFile.replace('.json', '');
  const basePath = path.join(edgeCaseDir, baseFile);
  const blueprint = JSON.parse(fs.readFileSync(basePath, 'utf8'));

  // 🧱 Check for input.json and .json presence
  expectedSuffixes.forEach(suffix => {
    const file = path.join(edgeCaseDir, `${base}${suffix}`);
    if (!fs.existsSync(file)) {
      errors.push(`❌ Missing ${base}${suffix} — add this file to complete the triad.`);
    }
  });

  // 🧠 Validate at least one expected result
  const matchingExpecteds = validExpected.filter(suffix =>
    fs.existsSync(path.join(edgeCaseDir, `${base}${suffix}`))
  );

  if (matchingExpecteds.length === 0) {
    errors.push(`❌ Missing expected output or error file for: ${base}`);
  } else if (matchingExpecteds.length > 1) {
    errors.push(`⚠️ Multiple expected files for ${base} — keep only one of .expected-error or .expected-output`);
  }

  // 📦 Check _meta presence and required fields
  if (!blueprint._meta) {
    errors.push(`❌ Missing _meta block in ${base}.json`);
  } else {
    const requiredMetaFields = [
      'description', 'triggerField', 'guardrailFor',
      'assert', 'snapshotCompatible', 'lastVerifiedAgainst'
    ];
    requiredMetaFields.forEach(field => {
      if (blueprint._meta[field] === undefined) {
        errors.push(`❌ Missing _meta.${field} in ${base}.json`);
      }
    });
  }

  // 🧾 Check for Codex comment block headers
  const rawFile = fs.readFileSync(basePath, 'utf8');
  const codexHeaders = ['@codex-purpose', '@codex-system', '@codex-critical', '@codex-verified'];
  codexHeaders.forEach(h => {
    if (!rawFile.includes(h)) {
      errors.push(`❌ Missing ${h} in header comment of ${base}.json`);
    }
  });
});

// 🔊 Output results
if (errors.length > 0) {
  errors.forEach(e => console.error(e));
  console.error(`❌ ${errors.length} issue(s) found. Fix all to preserve Codex compliance.`);
  process.exit(1);
} else {
  console.log(`✅ All edge-case triads are Codex-compliant and structurally complete.`);
}
