/**
 * @file generate-docs.ts
 * @description Generates agent documentation.
 */
import * as fs from 'fs';
import * as path from 'path';

async function generateDocs(): Promise<void> {
  const agentsDir = path.join('cursor', 'agents');
  const docsDir = path.join('cursor', 'docs');
  
  // Create docs directory if it doesn't exist
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Get all agent directories
  const agents = fs.readdirSync(agentsDir)
    .filter(dir => dir !== '_manifest.json' && fs.statSync(path.join(agentsDir, dir)).isDirectory());

  // Generate documentation content
  let docContent = '# CanAI Agent Documentation\n\n';
  
  for (const agent of agents) {
    const contractPath = path.join(agentsDir, agent, 'agent-contract.md');
    if (fs.existsSync(contractPath)) {
      const contract = fs.readFileSync(contractPath, 'utf-8');
      docContent += `## ${agent}\n${contract}\n\n`;
    } else {
      console.warn(`Warning: No contract found for agent ${agent}`);
    }
  }

  // Write documentation to file
  const docsPath = path.join(docsDir, 'agents.md');
  fs.writeFileSync(docsPath, docContent);
  console.log('Documentation generated at cursor/docs/agents.md');
}

generateDocs().catch(err => {
  console.error('Documentation generation failed:', err);
  process.exit(1);
}); 