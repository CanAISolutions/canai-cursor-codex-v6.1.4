#!/usr/bin/env node
/**
 * AI Pair Programming Prompt Generator
 * Automates creation of structured prompts for development support
 * 
 * Usage:
 * node prompt-generator-example.js --file=path/to/file.js --start=10 --end=25 --domain=react --goal="Fix validation bug"
 */

const fs = require('fs');
const path = require('path');

// Configuration for different support scenarios
const SUPPORT_TEMPLATES = {
  'debug': {
    role: 'Senior debugging specialist',
    mission: 'Identify and fix critical issues with minimal changes',
    responseFormat: [
      '1. Issue Analysis: [root cause in ≤15 words]',
      '2. [line_start:line_end:filename]',
      '   [fixed code only]', 
      '3. Prevention: [how to avoid this issue]'
    ]
  },
  'feature': {
    role: 'Senior pair programmer',
    mission: 'Add new functionality following existing patterns',
    responseFormat: [
      '1. Intent: [≤10-word summary]',
      '2. [line_start:line_end:filename]',
      '   [new/changed code only]',
      '3. Integration: [how this fits existing architecture]'
    ]
  },
  'refactor': {
    role: 'Code quality specialist',
    mission: 'Improve code maintainability without changing behavior',
    responseFormat: [
      '1. Improvement: [what\'s being optimized]',
      '2. [line_start:line_end:filename]',
      '   [refactored code only]',
      '3. Benefits: [specific improvements gained]'
    ]
  },
  'test': {
    role: 'Test automation expert',
    mission: 'Create comprehensive test coverage',
    responseFormat: [
      '1. Test Strategy: [what\'s being validated]',
      '2. [line_start:line_end:test-filename]',
      '   [test code only]',
      '3. Coverage: [edge cases addressed]'
    ]
  }
};

function generatePrompt(options) {
  const {
    filePath,
    startLine,
    endLine,
    domain = 'javascript',
    goal,
    supportType = 'debug',
    environment = 'Node.js',
    context = ''
  } = options;

  // Read file snippet
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');
  const snippet = lines.slice(startLine - 1, endLine).join('\n');

  // Get template for support type
  const template = SUPPORT_TEMPLATES[supportType] || SUPPORT_TEMPLATES['debug'];

  // Generate contextual information
  const fileExtension = path.extname(filePath);
  const detectedFramework = detectFramework(fileContent);
  const errorContext = detectPotentialIssues(snippet);

  const prompt = `# AI Pair Programming Support Request

**ROLE**: ${template.role} specializing in ${domain}

**MISSION**: ${template.mission}

**CURRENT STATE**:
\`\`\`${getLanguageFromExtension(fileExtension)}
${snippet}
\`\`\`

**Context Information**:
- **File**: ${filePath}
- **Lines**: ${startLine}-${endLine}
- **Environment**: ${environment}
- **Framework**: ${detectedFramework}
- **Support Type**: ${supportType.toUpperCase()}
${errorContext ? `- **Detected Issues**: ${errorContext}` : ''}
${context ? `- **Additional Context**: ${context}` : ''}

**DESIRED OUTCOME**:
${goal}

**RESPONSE FORMAT**:
${template.responseFormat.join('\n')}

**CONSTRAINTS**:
- Show ONLY changed code, use \`// ... existing code ...\` for unchanged sections
- Maintain existing code style and patterns
- Provide specific line references: \`[start:end:filename]\`
- Test-first approach for new features
- Emotional sovereignty: ensure changes empower the developer

**QUALITY REQUIREMENTS**:
- Trust Score: 4.2+ (code must be reliable and well-tested)
- Emotional Intelligence: Changes should feel supportive and educational
- Competitive Advantage: Leverage best practices that differentiate our approach

---

**Ready for AI assistance. Please analyze and provide structured response.**`;

  return prompt;
}

// Helper functions
function detectFramework(content) {
  const frameworks = {
    'React': /import.*react|from ['"]react['"]/i,
    'Vue': /import.*vue|from ['"]vue['"]/i,
    'Angular': /@angular|import.*@angular/i,
    'Express': /require\(['"]express['"]\)|import.*express/i,
    'Next.js': /next\/|from ['"]next['"]/i,
    'TypeScript': /interface\s+\w+|type\s+\w+\s*=/i
  };

  for (const [framework, pattern] of Object.entries(frameworks)) {
    if (pattern.test(content)) return framework;
  }
  return 'Vanilla JavaScript';
}

function detectPotentialIssues(snippet) {
  const issues = [];
  
  if (/console\.log|console\.error/i.test(snippet)) {
    issues.push('Debug logging detected');
  }
  if (/TODO|FIXME|HACK/i.test(snippet)) {
    issues.push('Technical debt markers found');
  }
  if (/try\s*\{[\s\S]*\}\s*catch/i.test(snippet) && !/finally/i.test(snippet)) {
    issues.push('Error handling may be incomplete');
  }
  if (!/test|spec|describe|it\(/i.test(snippet) && snippet.includes('function')) {
    issues.push('Functions may lack test coverage');
  }

  return issues.length > 0 ? issues.join(', ') : null;
}

function getLanguageFromExtension(ext) {
  const languages = {
    '.js': 'javascript',
    '.ts': 'typescript', 
    '.jsx': 'jsx',
    '.tsx': 'tsx',
    '.py': 'python',
    '.go': 'go',
    '.rs': 'rust',
    '.java': 'java',
    '.rb': 'ruby',
    '.php': 'php'
  };
  return languages[ext] || 'text';
}

// CLI Interface
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      options[key] = value;
    }
  });

  return {
    filePath: options.file,
    startLine: parseInt(options.start) || 1,
    endLine: parseInt(options.end) || 50,
    domain: options.domain || 'javascript',
    goal: options.goal || 'Analyze and improve this code',
    supportType: options.type || 'debug',
    environment: options.env || 'Node.js',
    context: options.context || ''
  };
}

// Main execution
function main() {
  try {
    const options = parseArgs();
    
    if (!options.filePath) {
      console.error('Usage: node prompt-generator.js --file=path/to/file --start=10 --end=25 --goal="Fix bug"');
      console.error('Options:');
      console.error('  --file=<path>        File to analyze (required)');
      console.error('  --start=<number>     Start line (default: 1)');
      console.error('  --end=<number>       End line (default: 50)');
      console.error('  --domain=<string>    Technology domain (default: javascript)');
      console.error('  --goal=<string>      What you want to achieve');
      console.error('  --type=<string>      Support type: debug|feature|refactor|test');
      console.error('  --env=<string>       Environment context');
      console.error('  --context=<string>   Additional context');
      process.exit(1);
    }

    if (!fs.existsSync(options.filePath)) {
      console.error(`Error: File ${options.filePath} does not exist`);
      process.exit(1);
    }

    const prompt = generatePrompt(options);
    const outputFile = `prompt-${options.supportType}-${Date.now()}.mcp`;
    
    fs.writeFileSync(outputFile, prompt);
    
    console.log(`✅ Prompt generated successfully!`);
    console.log(`📁 Saved to: ${outputFile}`);
    console.log(`🎯 Support Type: ${options.supportType.toUpperCase()}`);
    console.log(`📊 Lines analyzed: ${options.startLine}-${options.endLine}`);
    console.log(`\n📋 Next steps:`);
    console.log(`1. Copy the prompt from ${outputFile}`);
    console.log(`2. Paste into Cursor Chat or Claude`);
    console.log(`3. Get structured, actionable support`);
    
  } catch (error) {
    console.error('❌ Error generating prompt:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generatePrompt, SUPPORT_TEMPLATES }; 