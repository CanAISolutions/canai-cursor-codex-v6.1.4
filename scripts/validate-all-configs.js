#!/usr/bin/env node
// scripts/validate-all-configs.js

require('ts-node').register({
    transpileOnly: true,
    compilerOptions: { module: 'commonjs' },
  });
  
  const fs   = require('fs');
  const path = require('path');
  const { parse } = require('jsonc-parser');
  
  const configDir = path.resolve(__dirname, '../config/accelerators');
  const files     = fs.readdirSync(configDir).filter(f => f.endsWith('-config.jsonc'));
  
  let allGood = true;
  
  files.forEach(file => {
    const id         = file.replace('-config.jsonc','');       // e.g. "conversion-predictor-lite"
    const configPath = path.join(configDir, file);
    const raw        = fs.readFileSync(configPath, 'utf8');
    const cfg        = parse(raw);
  
    // Load the matching schema module
    const schemaPath = path.resolve(__dirname, `../schemas/accelerators/${id}.schema.ts`);
    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ Missing schema file for "${id}": ${schemaPath}`);
      allGood = false;
      return;
    }
    const mod = require(schemaPath);
    // Find the export ending in "ConfigSchema"
    const schemaExport = Object.keys(mod).find(k => k.endsWith('ConfigSchema'));
    if (!schemaExport) {
      console.error(`❌ No export ending in "ConfigSchema" in ${schemaPath}`);
      allGood = false;
      return;
    }
    const schema = mod[schemaExport];
  
    try {
      schema.parse(cfg);
      console.log(`✅ ${id} config is valid`);
    } catch (err) {
      console.error(`❌ ${id} config validation failed:`, err.errors || err.message);
      allGood = false;
    }
  });
  
  if (!allGood) process.exit(1);
  