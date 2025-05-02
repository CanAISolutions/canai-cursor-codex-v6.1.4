// scripts/validate-conversion-config.js

// 1) Hook ts-node so we can require TS modules
require('ts-node').register({
    transpileOnly: true,
    compilerOptions: { module: 'commonjs' },
  });
  
  // 2) Imports
  const fs = require('fs');
  const path = require('path');
  const { parse } = require('jsonc-parser');
  const { ConversionPredictorConfigSchema } = require('../schemas/accelerators/conversion-predictor-lite.schema');
  
  // 3) Load & parse JSONC
  const file = path.join(__dirname, '../config/accelerators/conversion-predictor-lite-config.jsonc');
  const raw  = fs.readFileSync(file, 'utf8');
  const cfg  = parse(raw);
  
  // 4) Validate with Zod
  try {
    ConversionPredictorConfigSchema.parse(cfg);
    console.log('✅ conversion-predictor-lite config is valid');
  } catch (err) {
    console.error('❌ config validation failed:', err.errors || err.message);
    process.exit(1);
  }
  