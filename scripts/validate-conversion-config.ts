#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';
import { ConversionPredictorConfigSchema } from '../schemas/accelerators/conversion-predictor-lite.schema';

const file = path.join(__dirname, '../config/accelerators/conversion-predictor-lite-config.jsonc');
const raw  = fs.readFileSync(file, 'utf8');
const cfg  = JSON.parse(raw);

try {
  ConversionPredictorConfigSchema.parse(cfg);
  console.log('✅ conversion-predictor-lite config is valid');
} catch (err) {
  console.error('❌ config validation failed:', err);
  process.exit(1);
}
