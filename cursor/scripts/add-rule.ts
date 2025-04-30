#!/usr/bin/env node
import fs from 'fs';
const layerPath = process.argv[2] || 'rules/layer-3-quality.mdc';
const bullet = process.argv.slice(3).join(' ');
if(!bullet) { console.error('Provide bullet text'); process.exit(1); }
const data = fs.readFileSync(layerPath,'utf8');
const lastNum = Math.max(...data.split('\n').filter(l=>/^\d+\./.test(l)).map(l=>parseInt(l)));
const newNum = lastNum+1;
fs.appendFileSync(layerPath, `\n${newNum}. ${bullet}\n`);
console.log(`Added rule #${newNum}`);
