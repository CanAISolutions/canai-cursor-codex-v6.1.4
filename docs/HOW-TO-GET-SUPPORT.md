# 🤖 How to Get AI Support with the Prompt Generator

## Overview

This system automates the creation of structured, high-quality prompts for AI pair programming support. It's designed to integrate with CanAI's emotional sovereignty and test-first truth principles while providing you with expert-level assistance.

## 🚀 Quick Start

### 1. Basic Usage
```bash
node scripts/prompt-generator.js --file=src/components/Button.jsx --start=15 --end=35 --goal="Fix click handler bug"
```

### 2. Advanced Usage
```bash
node scripts/prompt-generator.js \
  --file=api/users/route.ts \
  --start=10 \
  --end=50 \
  --domain=typescript \
  --type=debug \
  --goal="Fix authentication middleware" \
  --env="Next.js API" \
  --context="User reports 401 errors on valid tokens"
```

## 📋 Support Types Available

### 🐛 Debug Support (`--type=debug`)
**Best for:** Fixing bugs, resolving errors, troubleshooting issues
```bash
node scripts/prompt-generator.js \
  --file=src/auth/login.ts \
  --start=20 \
  --end=40 \
  --type=debug \
  --goal="Fix token validation failing"
```

**Output Format:**
- Issue Analysis: Root cause identification
- Fixed code with line references
- Prevention strategies

### ⚡ Feature Development (`--type=feature`)
**Best for:** Adding new functionality, implementing requirements
```bash
node scripts/prompt-generator.js \
  --file=src/components/Dashboard.jsx \
  --start=1 \
  --end=30 \
  --type=feature \
  --goal="Add user profile dropdown menu"
```

**Output Format:**
- Intent summary
- New/changed code only
- Integration guidance

### 🔧 Code Refactoring (`--type=refactor`)
**Best for:** Improving code quality, performance optimization
```bash
node scripts/prompt-generator.js \
  --file=src/utils/dataProcessor.js \
  --start=5 \
  --end=60 \
  --type=refactor \
  --goal="Optimize array processing performance"
```

**Output Format:**
- Improvement description
- Refactored code
- Benefits explanation

### 🧪 Test Creation (`--type=test`)
**Best for:** Writing tests, improving coverage
```bash
node scripts/prompt-generator.js \
  --file=src/services/api.ts \
  --start=1 \
  --end=50 \
  --type=test \
  --goal="Create comprehensive test suite"
```

**Output Format:**
- Test strategy
- Complete test code
- Coverage analysis

## 🎯 How It Works

### 1. **Code Analysis**
The script automatically:
- Reads your specified code snippet
- Detects the framework/technology (React, Vue, Express, etc.)
- Identifies potential issues (debug logs, TODO comments, missing error handling)
- Determines the programming language

### 2. **Context Generation**
Creates rich context including:
- File path and line numbers
- Detected framework and environment
- Potential issues found in the code
- Support type and goals

### 3. **Structured Prompt Creation**
Generates a professional prompt with:
- **Role specification** (Senior debugging specialist, pair programmer, etc.)
- **Mission statement** tailored to your support type
- **Current state** with syntax-highlighted code
- **Desired outcome** based on your goals
- **Quality requirements** including emotional sovereignty and test-first principles

### 4. **AI-Ready Output**
Creates a `.mcp` file that you can:
- Copy and paste into Cursor Chat
- Use with Claude or other AI assistants
- Share with team members for collaboration

## 💡 Real-World Examples

### Example 1: Fixing a React Hook Bug
```bash
# You have a useEffect that's causing infinite re-renders
node scripts/prompt-generator.js \
  --file=src/hooks/useUserData.js \
  --start=12 \
  --end=28 \
  --type=debug \
  --goal="Fix infinite re-render in useEffect" \
  --context="Component re-renders constantly after user login"
```

**Generated Prompt Preview:**
```markdown
# AI Pair Programming Support Request

**ROLE**: Senior debugging specialist specializing in javascript
**MISSION**: Identify and fix critical issues with minimal changes

**CURRENT STATE**:
```javascript
useEffect(() => {
  if (user) {
    fetchUserData(user.id).then(setUserData);
  }
}, [user, fetchUserData]); // Problem: fetchUserData dependency
```

**DESIRED OUTCOME**: Fix infinite re-render in useEffect
**RESPONSE FORMAT**:
1. Issue Analysis: [root cause in ≤15 words]
2. [line_start:line_end:filename] [fixed code only]
3. Prevention: [how to avoid this issue]
```

### Example 2: Adding a New Feature
```bash
# You need to add pagination to a data table
node scripts/prompt-generator.js \
  --file=src/components/DataTable.jsx \
  --start=1 \
  --end=80 \
  --type=feature \
  --goal="Add pagination with 10 items per page" \
  --domain=react \
  --env="React 18 with TypeScript"
```

### Example 3: Performance Optimization
```bash
# Slow database queries need optimization
node scripts/prompt-generator.js \
  --file=api/analytics/route.ts \
  --start=25 \
  --end=75 \
  --type=refactor \
  --goal="Optimize slow aggregation queries" \
  --context="Queries taking 5+ seconds with large datasets"
```

## 🔧 Configuration Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `--file` | Path to file to analyze | *Required* | `src/app.js` |
| `--start` | Starting line number | `1` | `10` |
| `--end` | Ending line number | `50` | `25` |
| `--domain` | Technology domain | `javascript` | `react`, `typescript`, `python` |
| `--type` | Support type | `debug` | `feature`, `refactor`, `test` |
| `--goal` | What you want to achieve | `Analyze and improve this code` | `Fix validation bug` |
| `--env` | Environment context | `Node.js` | `React 18`, `Next.js API` |
| `--context` | Additional context | `""` | `User reports slow loading` |

## 🌟 Advanced Features

### Smart Framework Detection
The script automatically detects:
- **React** - Hooks, JSX, React imports
- **Vue** - Vue composition API, template syntax
- **Angular** - Angular decorators, services
- **Express** - Express middleware, routes
- **Next.js** - Next.js specific imports
- **TypeScript** - Interfaces, type definitions

### Issue Detection
Automatically flags:
- **Debug logging** - `console.log`, `console.error`
- **Technical debt** - `TODO`, `FIXME`, `HACK` comments
- **Incomplete error handling** - Try/catch without finally
- **Missing tests** - Functions without test coverage

### Emotional Sovereignty Integration
Every prompt includes:
- **Trust Score requirements** (4.2+)
- **Emotional intelligence** guidelines
- **User empowerment** focus
- **Supportive communication** standards

## 📱 Integration with Your Workflow

### Step 1: Generate Prompt
```bash
node scripts/prompt-generator.js --file=src/bug.js --goal="Fix memory leak"
```

### Step 2: Copy Generated Prompt
```bash
✅ Prompt generated successfully!
📁 Saved to: prompt-debug-1643123456789.mcp
📋 Next steps:
1. Copy the prompt from prompt-debug-1643123456789.mcp
2. Paste into Cursor Chat or Claude
3. Get structured, actionable support
```

### Step 3: Use with AI Assistant
- **Cursor Chat**: Paste the prompt and get inline code suggestions
- **Claude**: Get detailed analysis and step-by-step solutions
- **Team Collaboration**: Share the `.mcp` file for consistent support requests

### Step 4: Apply Solutions
The AI will respond with:
- Precise line-by-line changes
- Explanation of the solution
- Prevention strategies
- Integration guidance

## 🎉 Success Stories

### Bug Fix Example
**Problem**: Authentication middleware failing randomly
**Generated Prompt**: 43-line structured request with context
**AI Response**: Identified race condition in token validation
**Result**: 2-line fix that solved the issue completely

### Feature Addition Example
**Problem**: Need to add real-time notifications
**Generated Prompt**: Feature request with existing component analysis
**AI Response**: WebSocket integration following existing patterns
**Result**: 80 lines of production-ready code with tests

### Performance Optimization Example
**Problem**: Database queries taking 8+ seconds
**Generated Prompt**: Performance analysis with profiling context
**AI Response**: Query optimization and caching strategy
**Result**: 95% performance improvement (8s → 400ms)

## 🚀 Pro Tips

### 1. **Be Specific with Goals**
❌ `--goal="Fix this"`
✅ `--goal="Fix infinite loop in data fetching"`

### 2. **Include Relevant Context**
❌ `--context=""`
✅ `--context="Happens only on mobile Safari after user logs in"`

### 3. **Choose Appropriate Support Type**
- `debug` for fixing existing issues
- `feature` for adding new functionality
- `refactor` for improving existing code
- `test` for creating test coverage

### 4. **Set Realistic Line Ranges**
- Include enough context (10-30 lines around the issue)
- Don't include the entire file unless necessary
- Focus on the specific problem area

### 5. **Use Domain-Specific Language**
- `--domain=react` for React components
- `--domain=typescript` for TypeScript files
- `--domain=api` for backend API code

## 🔍 Troubleshooting

### Common Issues

**Issue**: "File not found"
**Solution**: Check file path is relative to project root
```bash
# Wrong
--file=/absolute/path/to/file.js
# Right  
--file=src/components/file.js
```

**Issue**: Generated prompt is too generic
**Solution**: Add more specific context and goals
```bash
--goal="Fix memory leak in WebSocket connection cleanup"
--context="Memory usage grows 10MB every minute in production"
```

**Issue**: AI response doesn't understand the codebase
**Solution**: Include more surrounding context lines
```bash
--start=5 --end=45  # Include more context around the issue
```

## 🎯 Best Practices

### 1. **Emotional Sovereignty Alignment**
- Always frame requests as learning opportunities
- Ask for explanations, not just fixes
- Request prevention strategies
- Focus on empowerment over quick fixes

### 2. **Test-First Truth Integration**
- Include existing tests in your analysis range
- Request test updates with code changes
- Ask for test coverage validation
- Prioritize reliability over speed

### 3. **Production Quality Standards**
- Specify production environment constraints
- Request performance considerations
- Ask for security implications
- Include scalability requirements

### 4. **Continuous Learning**
- Save successful prompts for reuse
- Document patterns that work well
- Build a personal prompt library
- Share effective prompts with your team

## 🚀 Next Steps

1. **Try the basic example** with one of your current files
2. **Experiment with different support types** to see what works best
3. **Build your own prompt library** for common scenarios
4. **Integrate into your daily workflow** for faster development
5. **Share with your team** to standardize AI assistance quality

---

*This system is designed to make you more productive while maintaining the highest standards of code quality, emotional intelligence, and user empowerment. Every prompt generated helps you learn and grow as a developer while solving immediate problems.* 