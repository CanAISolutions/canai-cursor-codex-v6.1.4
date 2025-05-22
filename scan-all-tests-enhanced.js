const fs = require('fs').promises;
const path = require('path');
const { parse } = require('@typescript-eslint/parser');
const { remark } = require('remark');
const remarkGfm = require('remark-gfm'); // For parsing Markdown tables

const DEFAULT_CONCURRENCY = 50;
const DEFAULT_EXCLUDE_DIRS = [];
const EXCLUDE_CONFIG_FILE = 'exclude-config.json';

// Find the project root by locating the nearest package.json
async function findProjectRoot(startDir) {
  let currentDir = path.resolve(startDir);
  const rootDir = path.parse(currentDir).root;

  while (currentDir !== rootDir) {
    try {
      await fs.access(path.join(currentDir, 'package.json'));
      return currentDir;
    } catch {
      currentDir = path.dirname(currentDir);
    }
  }
  throw new Error('Project root not found (no package.json found)');
}

// Parse Markdown table from a file
async function parseMarkdownTable(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const processor = remark().use(remarkGfm);
    const ast = processor.parse(content);
    const mappings = [];

    let inTable = false;
    let headers = [];
    for (const node of ast.children) {
      if (node.type === 'table') {
        headers = node.children[0].children.map(cell => cell.children[0]?.value || '');
        for (const row of node.children.slice(1)) {
          const rowData = {};
          row.children.forEach((cell, i) => {
            rowData[headers[i]] = cell.children[0]?.value || '';
          });
          mappings.push(rowData);
        }
      }
    }
    return mappings;
  } catch (error) {
    console.warn(`Failed to parse Markdown ${filePath}: ${error.message}`);
    return [];
  }
}

// Combine mappings from both Markdown files
async function loadMappings(projectRoot) {
  const legacyMappingPath = path.join(projectRoot, 'docs/reference/dreamstate-legacy-mapping.md');
  const testMappingPath = path.join(projectRoot, 'docs/reference/dreamstate-test-mapping.md');
  const legacyMappings = await parseMarkdownTable(legacyMappingPath);
  const testMappings = await parseMarkdownTable(testMappingPath);

  const combinedMappings = {};
  const testMetadata = {};

  // Process dreamstate-legacy-mapping.md
  for (const mapping of legacyMappings) {
    const dreamStateTest = mapping['DreamState Test']?.replace(/\s+/g, '-').toLowerCase() + '.test.ts';
    const legacyFile = mapping['Legacy Source File'];
    if (legacyFile && !legacyFile.includes('tests-archive')) {
      combinedMappings[legacyFile] = dreamStateTest;
    }
  }

  // Process dreamstate-test-mapping.md
  for (const mapping of testMappings) {
    const testFile = mapping['Test File'];
    const legacyFiles = mapping['Mapped Legacy File(s)']?.split(', ').filter(f => f && !f.includes('tests-archive')) || [];
    const confidence = parseFloat(mapping['Confidence']?.replace('%', '')) || 100;
    for (const legacyFile of legacyFiles) {
      combinedMappings[legacyFile] = testFile;
    }
    testMetadata[testFile] = {
      confidence,
      systemPaths: mapping['Defended System Paths']?.split(', ') || [],
      functions: mapping['Asserted Functions']?.split(', ') || [],
      codexPillar: mapping['Codex Pillar'] || '',
    };
  }

  return { combinedMappings, testMetadata };
}

/**
 * Recursively find all .test.ts and .spec.ts files, with optional directory exclusions.
 * WHAT: Scans all directories for test files, unless excluded via excludeDirs.
 * WHY: Ensures full coverage, with opt-in flexibility for exclusions.
 * HOW: Recursively traverses directories, skipping any whose path includes an excludeDirs substring.
 * @param {string} dir - Directory to start scanning from
 * @param {RegExp[]} patterns - File patterns to match (default: .test.ts, .spec.ts)
 * @param {string[]} excludeDirs - Array of directory substrings to exclude (default: [])
 * @returns {Promise<string[]>} - List of matching test file paths
 */
async function findAllTestFiles(dir, patterns = [/\.test\.ts$/, /\.spec\.ts$/], excludeDirs = []) {
  let results = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      // Exclude directories if their path contains any excludeDirs substring (opt-in, not default)
      if (entry.isDirectory() && !excludeDirs.some(ex => fullPath.includes(ex))) {
        results = results.concat(await findAllTestFiles(fullPath, patterns, excludeDirs));
      } else if (entry.isFile() && patterns.some(pattern => pattern.test(entry.name))) {
        results.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Skipping directory ${dir}: ${error.message}`);
  }
  return results;
}

// Parse imports from a TypeScript file
async function parseImports(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const ast = parse(content, {
      sourceType: 'module',
      loc: true,
      range: true,
    });

    const imports = new Set();
    function traverse(node) {
      if (node.type === 'ImportDeclaration' && node.source && node.source.value) {
        imports.add(node.source.value);
      }
      for (const key in node) {
        if (node[key] && typeof node[key] === 'object') {
          traverse(node[key]);
        }
      }
    }
    traverse(ast);
    return Array.from(imports);
  } catch (error) {
    console.warn(`Failed to parse ${filePath}: ${error.message}`);
    return [];
  }
}

// Utility: Load tsconfig.json and parse path aliases
function loadTsconfigPaths(projectRoot) {
  // WHAT: Loads and parses tsconfig.json for path alias resolution
  // WHY: Ensures imports using aliases are correctly resolved
  // HOW: Reads compilerOptions.paths and baseUrl
  try {
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    if (!require('fs').existsSync(tsconfigPath)) return { baseUrl: '.', paths: {} };
    const tsconfig = JSON.parse(require('fs').readFileSync(tsconfigPath, 'utf8'));
    const baseUrl = tsconfig.compilerOptions?.baseUrl || '.';
    const paths = tsconfig.compilerOptions?.paths || {};
    return { baseUrl, paths };
  } catch {
    return { baseUrl: '.', paths: {} };
  }
}

// Utility: Resolve import path using tsconfig paths
function resolveAlias(importPath, paths, baseUrl, projectRoot) {
  // WHAT: Resolves path aliases from tsconfig.json
  // WHY: Supports @alias/* and similar imports
  // HOW: Matches importPath to alias patterns and returns resolved path
  for (const [alias, targets] of Object.entries(paths)) {
    // Support wildcard alias (e.g., @app/*)
    if (alias.endsWith('/*') && importPath.startsWith(alias.slice(0, -1))) {
      const subPath = importPath.slice(alias.length - 1);
      const target = targets[0].replace('/*', subPath);
      return path.resolve(projectRoot, baseUrl, target);
    }
    // Support direct alias (e.g., config/*)
    if (alias === importPath && Array.isArray(targets) && targets.length > 0) {
      return path.resolve(projectRoot, baseUrl, targets[0]);
    }
  }
  return null;
}

// Modularized: Local import validation with alias and symlink support
async function checkLocalImport(testFilePath, importPath, combinedMappings, projectRoot) {
  // WHAT: Resolves and validates local file imports, including aliases and symlinks
  // WHY: Ensures local dependencies exist, are mapped, and symlinks/aliases are handled
  // HOW: Checks file existence, resolves aliases, and uses realpathSync for symlinks
  const { baseUrl, paths } = loadTsconfigPaths(projectRoot);
  let localRelativePath;
  let absolutePath;
  // Try to resolve alias first
  const aliasResolved = resolveAlias(importPath, paths, baseUrl, projectRoot);
  if (aliasResolved) {
    absolutePath = aliasResolved;
    localRelativePath = path.relative(projectRoot, absolutePath).replace(/\\/g, '/');
  } else {
    localRelativePath = importPath.startsWith('.')
      ? path.relative(projectRoot, path.resolve(path.dirname(testFilePath), importPath)).replace(/\\/g, '/')
      : path.relative(projectRoot, path.resolve(projectRoot, importPath.slice(1))).replace(/\\/g, '/');
    absolutePath = path.join(projectRoot, localRelativePath);
  }
  const result = { importPath };
  try {
    // Symlink resolution: use realpathSync if available
    const realAbsolutePath = require('fs').realpathSync.native
      ? require('fs').realpathSync.native(absolutePath)
      : require('fs').realpathSync(absolutePath);
    await fs.access(realAbsolutePath);
    result.status = 'ok';
  } catch {
    result.status = 'broken';
    result.message = `File does not exist or symlink is broken: ${absolutePath}`;
    return result;
  }
  if (!combinedMappings[localRelativePath]) {
    result.status = 'missing_mapping';
    result.message = `No legacy mapping for ${localRelativePath}`;
  }
  return result;
}

// Modularized: External dependency validation
async function checkExternalImport(importPath, combinedMappings, packageJson) {
  // WHAT: Validates external dependencies
  // WHY: Ensures all required packages are installed and mapped
  // HOW: Checks package.json for all dependency types
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
    ...packageJson.optionalDependencies, // Now includes optional dependencies
  };
  const result = { importPath };
  if (allDeps[importPath] || allDeps[importPath.split('/')[0]]) {
    result.status = 'ok';
  } else {
    result.status = 'not_installed';
    result.message = `External dependency ${importPath} not found in package.json`;
  }
  if (!combinedMappings[importPath]) {
    result.status = result.status === 'ok' ? 'missing_mapping' : result.status;
    result.message = result.message || `No legacy mapping for ${importPath}`;
  }
  return result;
}

// Modularized: Main import check dispatcher
async function checkImport(testFilePath, importPath, combinedMappings, projectRoot, packageJson) {
  // WHAT: Dispatches import validation to local or external logic
  // WHY: Improves maintainability and clarity
  // HOW: Uses modularized functions for each import type
  const isLocal = importPath.startsWith('.') || importPath.startsWith('/');
  if (isLocal) {
    return checkLocalImport(testFilePath, importPath, combinedMappings, projectRoot);
  } else {
    return checkExternalImport(importPath, combinedMappings, packageJson);
  }
}

/**
 * Parse CLI arguments for exclusions and concurrency.
 * WHAT: Supports --exclude and --concurrency flags for dynamic config.
 * WHY: Allows flexible, user-driven exclusion and performance tuning.
 * HOW: Parses process.argv and/or loads exclude-config.json if present.
 */
function parseCliConfig() {
  const args = process.argv.slice(2);
  let excludeDirs = [...DEFAULT_EXCLUDE_DIRS];
  let concurrencyLimit = DEFAULT_CONCURRENCY;

  // CLI: --exclude "dir1,dir2" --concurrency 20
  args.forEach((arg, idx) => {
    if (arg === '--exclude' && args[idx + 1]) {
      excludeDirs = args[idx + 1].split(',').map(s => s.trim()).filter(Boolean);
    }
    if (arg === '--concurrency' && args[idx + 1]) {
      const parsed = parseInt(args[idx + 1], 10);
      if (!isNaN(parsed) && parsed > 0) concurrencyLimit = parsed;
    }
  });

  // Config file fallback
  try {
    const configPath = path.join(process.cwd(), EXCLUDE_CONFIG_FILE);
    if (require('fs').existsSync(configPath)) {
      const config = JSON.parse(require('fs').readFileSync(configPath, 'utf8'));
      if (Array.isArray(config.excludeDirs)) excludeDirs = config.excludeDirs;
      if (typeof config.concurrencyLimit === 'number') concurrencyLimit = config.concurrencyLimit;
    }
  } catch (e) {
    // Ignore config file errors, fallback to CLI/defaults
  }

  return { excludeDirs, concurrencyLimit };
}

// Main function to generate the report
async function generateReport(excludeDirs = [], concurrencyLimit = DEFAULT_CONCURRENCY) {
  const projectRoot = await findProjectRoot(__dirname);
  const { combinedMappings, testMetadata } = await loadMappings(projectRoot);

  let packageJson = {};
  try {
    packageJson = JSON.parse(await fs.readFile(path.join(projectRoot, 'package.json'), 'utf8'));
  } catch (error) {
    console.warn(`Failed to load package.json: ${error.message}. External dependency checks may be incomplete.`);
  }

  // Find all test files, including archived by default (unless excluded via excludeDirs)
  const testFiles = await findAllTestFiles(projectRoot, [/\.test\.ts$/, /\.spec\.ts$/], excludeDirs);
  if (testFiles.length === 0) {
    console.warn('No .test.ts or .spec.ts files found in the project.');
    return;
  }

  // Process test files concurrently
  const report = [];
  const detailedReport = [];
  for (let i = 0; i < testFiles.length; i += concurrencyLimit) {
    const batch = testFiles.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(
      batch.map(async testFilePath => {
        const imports = await parseImports(testFilePath);
        const importReports = await Promise.all(
          imports.map(importPath => checkImport(testFilePath, importPath, combinedMappings, projectRoot, packageJson))
        );
        const relativePath = path.relative(projectRoot, testFilePath).replace(/\\/g, '/');
        // WHAT: Flag archived tests by path pattern (e.g., /tests-archive/)
        // WHY: To provide visibility and actionable insights for legacy/archived tests
        // HOW: Set isArchived and archivedComment fields in the report entry
        const isArchived = /\/tests-archive\//.test(relativePath);
        // Determine if this archived test is missing a mapping
        const hasMapping = !!testMetadata[relativePath] || Object.values(combinedMappings).includes(relativePath);
        let archivedComment = undefined;
        if (isArchived) {
          if (hasMapping) {
            archivedComment = 'Test is archived and mapped to legacy; review for correctness.';
          } else {
            archivedComment = 'Test is archived, but no legacy mapping found. Please review for potential reactivation.';
          }
        }
        // Build detailed import info
        const detailedImports = importReports.map((imp, idx) => {
          const importPath = imports[idx];
          const isExternal = !importPath.startsWith('.') && !importPath.startsWith('/');
          return {
            importPath,
            status: imp.status,
            message: imp.message,
            dependencyType: isExternal ? 'external' : 'internal',
            legacyMapping: combinedMappings[importPath] || null,
          };
        });
        // Flags
        const hasBroken = detailedImports.some(imp => imp.status === 'broken');
        const hasMissingMapping = detailedImports.some(imp => imp.status === 'missing_mapping');
        const hasUnresolvedDep = detailedImports.some(imp => imp.status === 'not_installed');
        // Compose detailed report entry
        detailedReport.push({
          testFilePath: relativePath,
          isArchived,
          archivedComment,
          imports: detailedImports,
          confidence: testMetadata[relativePath]?.confidence ?? 100,
          codexPillar: testMetadata[relativePath]?.codexPillar ?? 'Unknown',
          flags: {
            hasBroken,
            hasMissingMapping,
            hasUnresolvedDep,
          },
        });
        return {
          testFilePath: relativePath,
          isArchived,
          archivedComment,
          imports: importReports,
          metadata: testMetadata[relativePath] || { confidence: 100, systemPaths: [], functions: [], codexPillar: 'Unknown' },
        };
      })
    );
    report.push(...batchResults);
  }

  // Write summary report to file
  const reportPath = path.join(projectRoot, 'test-dependency-index.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

  // Write detailed report to file
  const detailedReportPath = path.join(projectRoot, 'test-dependency-details.json');
  await fs.writeFile(detailedReportPath, JSON.stringify(detailedReport, null, 2), 'utf8');

  // Enhanced summary: include archived test stats and action items
  const totalTestFiles = report.length;
  const totalImports = report.reduce((sum, r) => sum + r.imports.length, 0);
  const brokenImports = report.flatMap(r => r.imports).filter(i => i.status === 'broken').length;
  const missingMappings = report.flatMap(r => r.imports).filter(i => i.status === 'missing_mapping').length;
  const notInstalled = report.flatMap(r => r.imports).filter(i => i.status === 'not_installed').length;
  const lowConfidenceTests = report.filter(r => r.metadata.confidence < 95).length;
  const archivedTests = report.filter(r => r.isArchived);
  const archivedMissingMapping = archivedTests.filter(r => !r.metadata || r.archivedComment?.includes('without mapping')).length;

  console.log(`Scan completed. Dependency index saved to ${reportPath}`);
  console.log(`Detailed dependency report saved to ${detailedReportPath}`);
  console.log('**Summary:**');
  console.log(`- Test files scanned: ${totalTestFiles}`);
  console.log(`- Total imports: ${totalImports}`);
  console.log(`- Broken imports: ${brokenImports}`);
  console.log(`- Missing legacy mappings: ${missingMappings}`);
  console.log(`- Uninstalled dependencies: ${notInstalled}`);
  console.log(`- Tests with confidence <95%: ${lowConfidenceTests}`);
  console.log(`- Archived tests scanned: ${archivedTests.length}`);
  console.log(`- Archived tests missing mapping: ${archivedMissingMapping}`);
  if (archivedTests.length > 0) {
    console.log('**Action Items for Archived Tests:**');
    archivedTests.forEach(r => {
      if (r.archivedComment) {
        console.log(`- ${r.testFilePath}: ${r.archivedComment}`);
      }
    });
  }
  if (brokenImports > 0 || missingMappings > 0 || notInstalled > 0 || lowConfidenceTests > 0 || archivedMissingMapping > 0) {
    console.log('**Note:** Issues detected. Review the report for details. Escalate low-confidence or unmapped archived tests to Cofounder.');
  }

  return reportPath;
}

// Utility: Generate summary report from detailed report
async function generateSummaryFromDetails() {
  const fsPath = path.join(__dirname, 'test-dependency-details.json');
  const outPath = path.join(__dirname, 'test-dependency-summary.json');
  let details;
  try {
    details = JSON.parse(await fs.readFile(fsPath, 'utf8'));
  } catch (e) {
    console.error('Failed to read test-dependency-details.json:', e.message);
    return;
  }
  const summary = details.map(entry => {
    const brokenImportCount = entry.imports.filter(i => i.status === 'broken').length;
    const missingMappingCount = entry.imports.filter(i => i.status === 'missing_mapping').length;
    const notInstalledCount = entry.imports.filter(i => i.status === 'not_installed').length;
    const flags = [];
    if (entry.isArchived) flags.push('archived');
    if (missingMappingCount > 0) flags.push('missing_mapping');
    if (brokenImportCount > 0) flags.push('broken');
    if (notInstalledCount > 0) flags.push('not_installed');
    return {
      testFilePath: entry.testFilePath,
      brokenImportCount,
      missingMappingCount,
      notInstalledCount,
      isArchived: entry.isArchived,
      archivedComment: entry.archivedComment,
      confidence: entry.confidence,
      codexPillar: entry.codexPillar,
      flags,
    };
  });
  // Sort by severity: most broken first (sum of broken+missing+not installed)
  summary.sort((a, b) => {
    const aSeverity = a.brokenImportCount + a.missingMappingCount + a.notInstalledCount;
    const bSeverity = b.brokenImportCount + b.missingMappingCount + b.notInstalledCount;
    return bSeverity - aSeverity;
  });
  await fs.writeFile(outPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`Test dependency summary saved to ${outPath}`);
}

// Utility: Generate DreamState test sourcing intelligence map
async function generateDreamStateSourcingMap() {
  const fsPath = path.join(__dirname, 'test-dependency-summary.json');
  const outPath = path.join(__dirname, 'cursor', 'reports', 'dreamstate-test-sourcing-map.json');
  let summary;
  try {
    summary = JSON.parse(await fs.readFile(fsPath, 'utf8'));
  } catch (e) {
    console.error('Failed to read test-dependency-summary.json:', e.message);
    return;
  }
  // Ensure output directory exists
  const outDir = path.dirname(outPath);
  try { await fs.mkdir(outDir, { recursive: true }); } catch {}
  const map = summary.map(entry => {
    let classification = 'requires_refactor';
    const majorBreakage = entry.confidence < 75 || entry.flags.includes('archived') || entry.brokenImportCount > 5 || entry.notInstalledCount > 5;
    if (entry.confidence >= 95 && entry.brokenImportCount === 0 && !entry.isArchived) {
      classification = 'use_as_reference';
    } else if (majorBreakage) {
      classification = 'skip_or_archive';
    }
    return {
      testFilePath: entry.testFilePath,
      classification,
      codexPillar: entry.codexPillar,
      confidence: entry.confidence,
      flags: entry.flags,
    };
  });
  await fs.writeFile(outPath, JSON.stringify(map, null, 2), 'utf8');
  console.log(`DreamState test sourcing map saved to ${outPath}`);
}

// Pattern Resurrection Protocol: Correct sourcing map per Codex directive
async function patternResurrectionProtocol() {
  const fsPath = path.join(__dirname, 'cursor', 'reports', 'dreamstate-test-sourcing-map.json');
  const outPath = path.join(__dirname, 'cursor', 'reports', 'dreamstate-test-sourcing-map-v2.json');
  let sourcingMap;
  try {
    sourcingMap = JSON.parse(await fs.readFile(fsPath, 'utf8'));
  } catch (e) {
    console.error('Failed to read dreamstate-test-sourcing-map.json:', e.message);
    return;
  }
  // Helper: Check for pattern mining signals in a test file
  async function hasPatternMiningSignals(testFilePath) {
    try {
      const absPath = path.join(__dirname, testFilePath);
      const content = await fs.readFile(absPath, 'utf8');
      const signals = [
        /describe\s*\(/,
        /it\s*\(/,
        /test\s*\(/,
        /expect\s*\(/,
        /assert\s*\(/,
        /mock/i,
        /emotion/i,
        /snapshot/i,
        /codex/i
      ];
      return signals.some(r => r.test(content));
    } catch {
      return false;
    }
  }
  let totalPatternMining = 0, totalReference = 0, totalSkip = 0;
  const corrected = [];
  for (const entry of sourcingMap) {
    let newEntry = { ...entry };
    if (entry.classification === 'skip_or_archive' && entry.flags.includes('broken')) {
      const patternSignal = await hasPatternMiningSignals(entry.testFilePath);
      if (patternSignal) {
        newEntry.classification = 'requires_refactor';
        newEntry.patternMining = true;
        totalPatternMining++;
      } else {
        totalSkip++;
      }
    } else if (entry.classification === 'use_as_reference') {
      totalReference++;
    } else if (entry.classification === 'requires_refactor') {
      totalPatternMining++;
    }
    corrected.push(newEntry);
  }
  await fs.writeFile(outPath, JSON.stringify(corrected, null, 2), 'utf8');
  // Log summary and decision logic
  const logPath = path.join(__dirname, 'cursor', 'auto-actions.log.md');
  const logEntry = `\n### [${new Date().toISOString()}] Pattern Resurrection Protocol Executed\n- **Action**: Reprocessed DreamState sourcing map per Codex override.\n- **Why**: Prevented discard of high-intent, structurally valuable tests with broken imports.\n- **How**:\n  - For each test classified as skip_or_archive with hasBroken: true, checked for describe/it/assert/expect/mock/emotion/snapshot/Codex path signals.\n  - If found, reclassified as requires_refactor and flagged patternMining: true.\n  - Only truly empty/outdated tests remain skip_or_archive.\n- **Summary Stats**:\n  - Total requires_refactor (patternMining true): ${totalPatternMining}\n  - Total use_as_reference: ${totalReference}\n  - Total truly valid skip_or_archive: ${totalSkip}\n- **Outcome**: Sourcing map v2 ready at /cursor/reports/dreamstate-test-sourcing-map-v2.json.\n- **Codex Impact**: Cursor now mines all reusable test logic, maximizing DreamState resurrection potential.\n`;
  await fs.appendFile(logPath, logEntry, 'utf8');
  console.log(`Pattern Resurrection Protocol complete. Sourcing map v2 saved to ${outPath}`);
}

// Entry point: parse CLI/config for excludeDirs and concurrencyLimit
async function main() {
  try {
    const { excludeDirs, concurrencyLimit } = parseCliConfig();
    const reportPath = await generateReport(excludeDirs, concurrencyLimit);
    if (reportPath) {
      console.log(`Dependency index generated successfully at ${reportPath}`);
    }
    // After main report, generate summary
    await generateSummaryFromDetails();
    // After summary, generate DreamState sourcing map
    await generateDreamStateSourcingMap();
    // After sourcing map, run Pattern Resurrection Protocol
    await patternResurrectionProtocol();
  } catch (error) {
    console.error('Error generating dependency index:', error.message);
    process.exit(1);
  }
}

main();