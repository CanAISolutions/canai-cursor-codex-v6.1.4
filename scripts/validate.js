const fs = require('fs');
const path = require('path');

function validateScaffold() {
  const logDir = path.join('.canai-context');
  const requiredFiles = ['fix.log', 'learning.log', 'metrics.log', 'knowledge-base.json', 'tasks.json'];
  const errors = [];

  // Create .canai-context directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Create required files in .canai-context
  requiredFiles.forEach(file => {
    const filePath = path.join(logDir, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.endsWith('.json') ? '[]' : '');
      console.log(`Created ${file} in .canai-context`);
    }
  });

  // Check for required directories
  const requiredDirs = [
    'cursor/agents',
    'cursor/docs',
    'cursor/context',
    'cursor/utils',
    'cursor/engines',
    'cursor/plugins'
  ];

  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      errors.push(`Missing directory: ${dir}`);
    }
  });

  // Check for manifest file
  const manifestPath = path.join('cursor', 'agents', '_manifest.json');
  if (!fs.existsSync(manifestPath)) {
    errors.push('Missing _manifest.json');
  } else {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      const expectedAgents = [
        'learning-orchestrator',
        'predictive-analytics',
        'code-regenerator',
        'cli-dashboard',
        'ethics-checker',
        'event-bus',
        'tutorial',
        'trust-scorer',
        'pattern-analyzer',
        'trust-signal',
        'agent-linker',
        'personalization-orchestrator'
      ];
      const missingAgents = expectedAgents.filter(agent => 
        !manifest.some(m => m.name === agent)
      );
      if (missingAgents.length) {
        errors.push(`Missing agents: ${missingAgents.join(', ')}`);
      }
    } catch (error) {
      errors.push(`Error reading manifest: ${error.message}`);
    }
  }

  // Check for plugin registry
  const registryPath = path.join('cursor', 'plugins', 'registry.json');
  if (!fs.existsSync(registryPath)) {
    errors.push('Missing registry.json');
  }

  if (errors.length) {
    console.error('Validation failed:', errors.join('\n'));
    process.exit(1);
  } else {
    console.log('Scaffold validation passed.');
  }
}

validateScaffold(); 