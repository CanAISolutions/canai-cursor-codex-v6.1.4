import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import assert from 'assert';
import crypto from 'crypto';

// foundational checks
execSync('eslint --max-warnings=0 .');
execSync('tsc --noEmit');
execSync('npm test');

// rule count enforcement
const layers = [
  'rules/layer-1-core.mdc',
  'rules/layer-2-governance.mdc',
  'rules/layer-3-quality.mdc'
];
const totalRules = layers
  .map(p => readFileSync(p,'utf8')
    .split('\n')
    .filter(l=>/^\d+\./.test(l)).length)
  .reduce((a,b)=>a+b,0);

assert(totalRules>=46, 'Rule count drift: expected ≥46');

// hash rules for change detection
const hash = crypto.createHash('sha256').update(
  layers.map(p=>readFileSync(p)).join('\n')
).digest('hex');
console.log('RuleSet SHA:', hash);
