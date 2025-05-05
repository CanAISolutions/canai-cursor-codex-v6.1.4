// inject-cursorrules.js
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const template = fs.readFileSync('.cursorrules.template', 'utf-8');
const output = template
  .replace('${OPENAI_API_KEY}', process.env.OPENAI_API_KEY)
  .replace('${GITHUB_PAT}', process.env.GITHUB_PAT);

fs.writeFileSync('.cursorrules', output);
console.log('✅ Secure .cursorrules generated from .env');
