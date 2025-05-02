import fs from 'fs';
import path from 'path';
import stripJsonComments from 'strip-json-comments';
import { ConversionPredictorConfigSchema } from '../../../schemas/accelerators/conversion-predictor-lite.schema';

describe('[DreamState] conversion-predictor-lite config schema', () => {
  it('validates the JSONC config with Zod', () => {
    const file = path.resolve(__dirname,
      '../../../config/accelerators/conversion-predictor-lite-config.jsonc'
    );
    const raw  = fs.readFileSync(file, 'utf8');
    const clean = stripJsonComments(raw);
    const cfg  = JSON.parse(clean);
    expect(() => ConversionPredictorConfigSchema.parse(cfg)).not.toThrow();
  });
});
