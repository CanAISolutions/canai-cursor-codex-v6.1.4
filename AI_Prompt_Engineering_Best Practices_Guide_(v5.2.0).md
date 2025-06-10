# AI Prompt Engineering Best Practices Guide (v5.2.0)

```yaml
metadata:
  version: "5.2.0"
  codename: "Precision Clarity"
  purpose: "Production-ready framework for AI-driven coding optimization"
  compatible_tools: ["Cursor", "Claude", "VS Code Continue", "GitHub Copilot"]
  status: "production-ready"
  date: "2025-06-08T08:37:00-06:00"
  target_audience: ["solo developers", "development teams"]
```

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Instant Success Protocol](#2-instant-success-protocol)
3. [The 4 Core Success Pillars](#3-the-4-core-success-pillars)
4. [Live Examples](#4-live-examples)
5. [Master Prompt Template](#5-master-prompt-template)
6. [Implementation Toolkit](#6-implementation-toolkit)
7. [Quality Assurance Checklist](#7-quality-assurance-checklist)
8. [Troubleshooting & Diagnostics](#8-troubleshooting--diagnostics)
9. [Success Metrics](#9-success-metrics)
10. [Pro Tips](#10-pro-tips)
11. [Advanced Extensions](#11-advanced-extensions)

---

## 1. Executive Summary

```yaml
objectives:
  primary: "Precise, predictable AI-driven code collaboration"
  target_users: ["solo developers", "development teams"]

key_metrics:
  first_try_success_rate: ">90%"
  code_diff_precision: "surgical/minimal"
  hallucination_rate: "0%"
  
capabilities:
  - structured_prompts
  - minimal_code_diffs
  - zero_hallucinated_code
  - scalable_workflows
  - cross_platform_adaptability

domains_supported: ["web", "backend", "devops", "data_science"]
platforms_supported: ["Cursor", "VS Code", "GitHub Copilot"]

value_proposition: "Fast, reliable AI interactions with minimal setup, enterprise-scalable"
```

---

## 2. Instant Success Protocol

```yaml
quick_start:
  immediate_actions:
    duration: "3 minutes"
    steps:
      1: "Copy Master Template (Section 5) to clipboard"
      2: "Test query using Precision Stack (Context + Intent + Output)"
      3: "Validate with Quality Checklist (Section 7)"
  
  project_setup:
    duration: "10 minutes" 
    steps:
      1: "Create /prompts folder structure"
      2: "Configure IDE rules (.cursorrules or ~/.continue/config.json)"
      3: "Run diagnostic self-test (Section 8)"
```

---

## 3. The 4 Core Success Pillars

```yaml
pillars:
  context_anchoring:
    purpose: "Grounds AI in your codebase"
    format: "[code snippet, file path, errors]"
    power_level: 5
    priority: "critical"
    
  intent_declaration:
    purpose: "Clarifies your exact goal"
    format: "Add null check for item.price"
    power_level: 4
    priority: "high"
    
  precision_output:
    purpose: "Ensures minimal diffs"
    format: "// ... existing code unchanged ..."
    power_level: 4
    priority: "high"
    
  constraint_enforcement:
    purpose: "Enforces format and behavior"
    format: "Use line_start:line_end:filename"
    power_level: 5
    priority: "critical"
```

| Pillar | Purpose | Format/Example | Power Level |
|--------|---------|----------------|-------------|
| **Context Anchoring** | Grounds AI in your codebase | `[code snippet, file path, errors]` | ⭐⭐⭐⭐⭐ |
| **Intent Declaration** | Clarifies your exact goal | `"Add null check for item.price"` | ⭐⭐⭐⭐ |
| **Precision Output** | Ensures minimal diffs | `// ... existing code unchanged ...` | ⭐⭐⭐⭐ |
| **Constraint Enforcement** | Enforces format and behavior | `"Use line_start:line_end:filename"` | ⭐⭐⭐⭐⭐ |

### Deep Dive: The Pillars

#### Context Anchoring
```yaml
definition: "Provides precise codebase details (file path, line numbers, environment, errors)"
components:
  - file_path
  - line_numbers  
  - environment_details
  - error_messages
  - tech_stack
pro_tips:
  - "Include exact error messages"
  - "Mention recent changes"
  - "Use @filename in Cursor for file references"
```

**Example:**
```python
def calculate_price(items):
    total = 0
    for item in items:
        total += item.price
    return total
```
- **File:** `src/billing/calculator.py`
- **Lines:** 15:20
- **Environment:** Python 3.11 + FastAPI
- **Error:** `AttributeError: 'NoneType' object has no attribute 'price'`

#### Intent Declaration
```yaml
definition: "States the goal in clear, specific terms (Action + Target + Constraint)"
format: "Action + Target + Constraint"
example: "Add null check for item.price without changing function signature"
anti_patterns:
  - "fix this bug"
  - "make it work"
  - "improve performance"
best_practices:
  - "Be surgical in description"
  - "Replace hardcoded API key with environment variable"
```

#### Precision Output
```yaml
definition: "Returns only changed code, collapsing unchanged sections"
format: "line_start:line_end:filename"
requirements:
  - show_only_changed_code
  - collapse_unchanged_sections
  - use_continuation_markers
markers:
  javascript: "// ... existing code unchanged ..."
  python: "# ... existing code unchanged ..."
  other: "<!-- ... existing code unchanged ... -->"
```

#### Constraint Enforcement
```yaml
definition: "Enforces format and behavior constraints"
critical_constraints:
  - "ALWAYS use line_start:line_end:filename"
  - "NEVER return full files unless requested"
  - "MUST preserve existing props"
examples:
  - "Use line_start:line_end:filename"
  - "No full file rewrites"
  - "Preserve existing function signatures"
```

### Precision Stack

```yaml
precision_stack:
  definition: "Combine all 4 pillars for optimal results"
  best_for:
    - precise_edits
    - bug_fixes
    - feature_additions
  use_cases:
    - "Fixing null errors"
    - "Optimizing components"
    - "Replacing hardcoded values"
  success_rate: ">95%"
```

---

## 4. Live Examples

```yaml
examples_overview:
  total_count: 4
  categories:
    - frontend_react
    - backend_python
    - security_nodejs
    - performance_graphql
  success_rate: ">95%"
  avg_response_time: "<30 seconds"
```

### Example 1: React Loading State

```yaml
example_1:
  title: "React Loading State"
  category: "frontend_react"
  scenario: "Add loading state to React component"
  complexity: "basic"
  tech_stack: ["React 18", "TypeScript"]
  estimated_time: "2 minutes"
```

**Scenario:** Add loading state to a React component.

**Query:**
```markdown
# AI Pair Programmer Prompt
**ROLE**: Senior React developer  
**CURRENT STATE**:  
```jsx
function UserProfile({ user }) {
    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}
```

**File:** `components/UserProfile.jsx`  
**Lines:** 1:8  
**Environment:** React 18 + TypeScript  
**Error:** None  

**DESIRED OUTCOME:** Add loading state when user is undefined  

**CONSTRAINTS:**
- Use `line_start:line_end:filename`
- Show only changed code with `// ... existing code unchanged ...`
- Echo intent in ≤10 words
```

**Response:**
```yaml
response_metadata:
  intent: "Add loading state for undefined user"
  lines_changed: "1:10"
  file: "components/UserProfile.jsx"
  approach: "early_return_pattern"
```

```javascript
Intent: Add loading state for undefined user.

1:10:components/UserProfile.jsx
function UserProfile({ user }) {
    if (!user) return <div>Loading...</div>;
    return (
        // ... existing code unchanged ...
    );
}

Rationale: Early return with loading div prevents null access errors.
```

### Example 2: Python Null Safety

```yaml
example_2:
  title: "Python Null Safety"
  category: "backend_python"
  scenario: "Fix null error in Python function"
  complexity: "basic"
  tech_stack: ["Python 3.11"]
  estimated_time: "1 minute"
```

**Scenario:** Fix null error in a Python function.

**Query:**
```markdown
# AI Pair Programmer Prompt
**ROLE**: Senior Python developer  
**CURRENT STATE**:  
```python
def process_data(data):
    return data.upper()
```

**File:** `utils/processor.py`  
**Lines:** 1:2  
**Environment:** Python 3.11  
**Error:** `AttributeError: 'NoneType' object has no attribute 'upper'`  

**DESIRED OUTCOME:** Add null safety without changing function signature  

**CONSTRAINTS:**
- Use `line_start:line_end:filename`
- Show only changed code with `# ... existing code unchanged ...`
- Echo intent in ≤10 words
```

**Response:**
```yaml
response_metadata:
  intent: "Add null safety to process_data function"
  lines_changed: "1:2"
  file: "utils/processor.py"
  approach: "conditional_expression"
```

```python
Intent: Add null safety to process_data function.

1:2:utils/processor.py
def process_data(data):
    return data.upper() if data else ""

Rationale: Conditional expression ensures safe handling of None input.
```

### Example 3: Backend API Security

```yaml
example_3:
  title: "Backend API Security"
  category: "security_nodejs"
  scenario: "Replace hardcoded API key with environment variable"
  complexity: "intermediate"
  tech_stack: ["Node.js 18", "Express"]
  estimated_time: "1 minute"
```

**Scenario:** Replace hardcoded API key with environment variable.

**Query:**
```markdown
# AI Pair Programmer Prompt
**ROLE**: Senior backend developer  
**CURRENT STATE**:  
```javascript
const API_KEY = "hardcoded-key-123";
```

**File:** `config/api.js`  
**Lines:** 1:1  
**Environment:** Node.js 18 + Express  
**Error:** None  

**DESIRED OUTCOME:** Replace hardcoded key with environment variable  

**CONSTRAINTS:**
- Use `line_start:line_end:filename`
- Show only changed code with `// ... existing code unchanged ...`
- Echo intent in ≤10 words
```

**Response:**
```yaml
response_metadata:
  intent: "Replace hardcoded API key with environment variable"
  lines_changed: "1:1"
  file: "config/api.js"
  approach: "environment_variable_pattern"
```

```javascript
Intent: Replace hardcoded API key with environment variable.

1:1:config/api.js
const API_KEY = process.env.API_KEY || "default-key";

Rationale: Environment variable enables secure key management.
```

### Example 4: GraphQL Optimization

```yaml
example_4:
  title: "GraphQL Optimization"
  category: "performance_graphql"
  scenario: "Optimize GraphQL resolver for large datasets"
  complexity: "intermediate"
  tech_stack: ["Node.js 18", "Apollo Server", "Sequelize"]
  estimated_time: "3 minutes"
```

**Scenario:** Optimize a GraphQL resolver for large datasets.

**Query:**
```markdown
# AI Pair Programmer Prompt
**ROLE**: Senior GraphQL developer  
**CURRENT STATE**:  
```javascript
async function getUser(_, { id }, { db }) {
    return db.User.findByPk(id);
}
```

**File:** `src/resolvers/user.js`  
**Lines:** 10:12  
**Environment:** Node.js 18 + Apollo Server + Sequelize  
**Error:** Slow query for large datasets  

**DESIRED OUTCOME:** Optimize getUser resolver for large datasets  

**CONSTRAINTS:**
- Use `line_start:line_end:filename`
- Show only changed code with `// ... existing code unchanged ...`
- Echo intent in ≤10 words
```

**Response:**
```yaml
response_metadata:
  intent: "Optimize getUser resolver for large datasets"
  lines_changed: "10:12"
  file: "src/resolvers/user.js"
  approach: "attribute_limiting"
```

```javascript
Intent: Optimize getUser resolver for large datasets.

10:12:src/resolvers/user.js
async function getUser(_, { id }, { db }) {
    return db.User.findByPk(id, { attributes: ['id', 'name', 'email'] });
}

Rationale: Limiting attributes reduces database query overhead.
```

---

## 5. Master Prompt Template

```yaml
template_system:
  universal_template: "pair-programmer.mcp"
  domain_specific_count: 4
  emergency_template: "emergency-rescue.mcp"
  snippet_count: 2
  
template_categories:
  universal:
    file: "pair-programmer.mcp"
    purpose: "General-purpose AI pair programming"
    compatibility: ["all domains", "all IDEs"]
    
  domain_specific:
    frontend:
      file: "frontend.mcp"
      technologies: ["React", "Vue", "Angular", "TypeScript"]
      focus: ["performance", "accessibility", "modern CSS"]
      
    backend:
      file: "backend.mcp"
      technologies: ["APIs", "databases", "microservices"]
      focus: ["security", "scalability", "error handling"]
      
    devops:
      file: "devops.mcp"
      technologies: ["containers", "CI/CD", "monitoring"]
      focus: ["infrastructure", "automation", "security"]
      
    data_science:
      file: "data-science.mcp"
      technologies: ["Python", "ML models", "data pipelines"]
      focus: ["optimization", "visualization", "large datasets"]
      
  emergency:
    file: "emergency-rescue.mcp"
    purpose: "Critical bug fixes with minimal changes"
    response_time: "<5 minutes"
```

### Universal Template (`pair-programmer.mcp`)

```yaml
template_structure:
  sections:
    - role_definition
    - mission_statement
    - critical_constraints
    - current_state
    - desired_outcome
    - response_format
    
constraints:
  line_format: "line_start:line_end:filename"
  code_display: "changed_code_only"
  intent_limit: "10_words_max"
  full_files: "never_unless_requested"
  questions: "one_specific_max"
  preservation: ["code_style", "props", "signatures"]
```

```markdown
# AI Pair Programmer Prompt

**ROLE**: Senior pair programmer specializing in [DOMAIN, e.g., React]

**MISSION**: Deliver surgical code edits with zero hallucination

**CRITICAL CONSTRAINTS**:
- ALWAYS use `line_start:line_end:filename` for code references
- ONLY show changed code with `// ... existing code unchanged ...` (or equivalent, e.g., `# ...` for Python)
- Echo intent in ≤10 words before responding
- NEVER return full files unless I say "show entire file"
- If uncertain, ask ONE specific question
- Maintain existing code style, props, and signatures

**CURRENT STATE**:
[CODE_SNIPPET]

**File:** [EXACT_FILENAME_WITH_PATH]  
**Lines:** [START_LINE]:[END_LINE]  
**Environment:** [TECH_STACK]  
**Last change:** [WHAT_YOU_JUST_MODIFIED]  
**Error (if any):** [EXACT_ERROR_MESSAGE]  

**DESIRED OUTCOME**:
[YOUR_SPECIFIC_GOAL]

**RESPONSE FORMAT**:
1. Intent: [≤10-word summary]
2. [line_start:line_end:filename]
   [changed code only]
3. Rationale: [one sentence explaining why]
```

### Domain-Specific Templates

#### Frontend (`frontend.mcp`)
```yaml
frontend_template:
  specialization: ["React", "Vue", "Angular"]
  expertise_areas: ["performance", "accessibility", "modern_css"]
  constraints:
    - "preserve_existing_props_and_state"
    - "use_typescript_interfaces"
    - "implement_error_boundaries"
    - "prioritize_react_18_patterns"
  testing_focus: ["Jest", "Vitest", "accessibility_testing"]
```

```markdown
**ROLE**: Senior frontend developer specializing in React/Vue/Angular  
**EXPERTISE**: Performance, accessibility, modern CSS  
**CONSTRAINTS**:  
- Preserve existing props and state  
- Use TypeScript interfaces, error boundaries, React 18+ patterns  
- Prioritize accessibility, performance, Jest/Vitest testing  
[REST OF UNIVERSAL TEMPLATE...]
```

#### Backend (`backend.mcp`)
```yaml
backend_template:
  specialization: ["APIs", "databases", "microservices"]
  expertise_areas: ["security", "scalability", "error_handling"]
  constraints:
    - "maintain_backward_compatibility"
    - "use_jwt_oauth_authentication"
    - "implement_rate_limiting"
    - "structured_logging"
    - "connection_pooling"
    - "async_error_handling"
  security_focus: ["authentication", "authorization", "data_validation"]
```

```markdown
**ROLE**: Senior backend engineer specializing in APIs/databases  
**EXPERTISE**: Security, scalability, error handling  
**CONSTRAINTS**:  
- Maintain backward compatibility  
- Use JWT/OAuth, rate limiting, structured logging  
- Implement connection pooling, migrations, async error handling  
[REST OF UNIVERSAL TEMPLATE...]
```

#### DevOps (`devops.mcp`)
```yaml
devops_template:
  specialization: ["containers", "infrastructure", "automation"]
  expertise_areas: ["CI/CD", "monitoring", "security"]
  constraints:
    - "use_environment_variables_for_secrets"
    - "implement_prometheus_monitoring"
    - "least_privilege_policies"
    - "container_optimization"
  monitoring_focus: ["Prometheus", "Grafana", "alerting"]
```

```markdown
**ROLE**: Senior DevOps engineer specializing in infrastructure  
**EXPERTISE**: Containers, CI/CD, monitoring  
**CONSTRAINTS**:  
- Use environment variables for secrets  
- Implement Prometheus monitoring, least privilege policies  
[REST OF UNIVERSAL TEMPLATE...]
```

#### Data Science (`data-science.mcp`)
```yaml
data_science_template:
  specialization: ["data_pipelines", "ml_models", "analytics"]
  expertise_areas: ["large_datasets", "visualization", "optimization"]
  constraints:
    - "use_type_hints_pep8"
    - "optimize_for_large_datasets"
    - "implement_chunking_strategies"
    - "include_visualizations"
  tools_focus: ["Matplotlib", "Pandas", "Scikit-learn", "TensorFlow"]
```

```markdown
**ROLE**: Senior data science specialist  
**EXPERTISE**: Data pipelines, ML models  
**CONSTRAINTS**:  
- Use type hints, PEP 8 for Python  
- Optimize for large datasets (e.g., chunking)  
- Include visualizations (e.g., Matplotlib) when relevant  
[REST OF UNIVERSAL TEMPLATE...]
```

### Emergency Rescue Template (`emergency-rescue.mcp`)

```yaml
emergency_template:
  purpose: "critical_bug_fixes"
  constraints:
    - "minimal_changes_only"
    - "preserve_existing_functionality"
    - "quick_response_required"
  response_time: "<5_minutes"
  change_scope: "surgical_precision"
```

```markdown
# EMERGENCY AI FIX TEMPLATE

**ROLE**: Senior pair programmer specializing in [DOMAIN]

**MISSION**: Fix critical bugs with minimal changes

**CRITICAL CONSTRAINTS**:
- Show only changed code with `// ... existing code unchanged ...` (or equivalent)
- Use `line_start:line_end:filename`
- Echo intent in ≤10 words
- Ask ONE clarifying question if uncertain
- Maintain existing code style, props, and signatures

**CURRENT STATE**:
[SNIPPET]

**File:** [EXACT_FILENAME_WITH_PATH]  
**Environment:** [TECH_STACK]  
**Error:** [EXACT_ERROR_MESSAGE]  

**DESIRED OUTCOME**:
[PROBLEM_TO_FIX]

**RESPONSE FORMAT**:
1. Intent: [≤10-word summary]
2. [line_start:line_end:filename]
   [changed code only]
3. Rationale: [one sentence explaining why]
```

### Prompt Snippets (Stored in `/prompts/snippets`)

```yaml
snippet_library:
  emergency_fix:
    file: "emergency-fix.mcp"
    purpose: "critical_issue_resolution"
    response_time: "<2_minutes"
    
  feature_addition:
    file: "feature-addition.mcp"
    purpose: "new_functionality_with_existing_patterns"
    response_time: "<5_minutes"
```

#### Emergency Fix (`emergency-fix.mcp`)
```yaml
emergency_fix_snippet:
  trigger_conditions: ["critical_errors", "production_issues", "blocking_bugs"]
  constraints: ["minimal_changes", "preserve_patterns", "quick_resolution"]
```

```markdown
// Emergency Fix
# AI Pair Programmer Prompt
**ROLE**: Senior [domain] developer
**MISSION**: Fix critical issue with minimal changes
**CURRENT STATE**: [file:line] - [exact error]
**DESIRED OUTCOME**: [specific fix in <10 words]
**RESPONSE FORMAT**:
1. Intent: [≤10-word summary]
2. [line_start:line_end:filename]
   [changed code only]
3. Rationale: [one sentence]
```

#### Feature Addition (`feature-addition.mcp`)
```yaml
feature_addition_snippet:
  trigger_conditions: ["new_functionality", "enhancement_requests", "capability_expansion"]
  constraints: ["maintain_patterns", "preserve_architecture", "consistent_style"]
```

```markdown
// Feature Addition
# AI Pair Programmer Prompt
**ROLE**: Senior [domain] developer
**MISSION**: Add feature maintaining existing patterns
**CURRENT STATE**: [file:line] - [current implementation]
**DESIRED OUTCOME**: [specific addition in <10 words]
**RESPONSE FORMAT**:
1. Intent: [≤10-word summary]
2. [line_start:line_end:filename]
   [changed code only]
3. Rationale: [one sentence]
```

---

## 6. Implementation Toolkit

### Folder Structure

```
/prompts/
├── pair-programmer.mcp      # Universal template
├── frontend.mcp             # Frontend template
├── backend.mcp              # Backend template
├── devops.mcp               # DevOps template
├── data-science.mcp         # Data science template
├── emergency-rescue.mcp     # Emergency fixes
├── snippets/                # Prompt snippets
│   ├── emergency-fix.mcp
│   └── feature-addition.mcp
└── examples/                # Case studies
    ├── react-loading.md
    ├── python-null-safety.md
    └── ...
```

### IDE Configuration

#### Cursor (`.cursorrules`)
```yaml
# Core AI Pair Programming Rules
output_format:
  - use: "line_start:line_end:filename"
  - show: "only changed code with // ... existing code unchanged ..."
  - echo: "intent in ≤10 words"
  - avoid: "full files unless requested"

context:
  - include: "file paths, line numbers, tech stack, errors"

quality:
  - maintain: "existing style, props, signatures"
  - enforce: "max 1 clarifying question"
```

#### Stack-Specific Rules (e.g., `react.cursorrules`)
```yaml
# React-Specific Rules
frontend:
  - use: "TypeScript interfaces over types"
  - implement: "error boundaries, React 18+ patterns"
  - prioritize: "accessibility, performance, Jest/Vitest testing"

# Python/Data Science
data_science:
  - follow: "PEP 8, type hints"
  - optimize: "large datasets with chunking"
  - include: "visualizations when relevant"

# DevOps
devops:
  - use: "environment variables for secrets"
  - enforce: "least privilege policies"
  - monitor: "Prometheus integration"
```

#### VS Code (Continue)
Store prompts in `~/.continue/config.json`:
```json
{
  "prompts": {
    "pair-programmer": "/prompts/pair-programmer.mcp",
    "frontend": "/prompts/frontend.mcp",
    "backend": "/prompts/backend.mcp"
  }
}
```

### CI/CD Rules (Optional for Teams)

#### Fail Build If:
- No intent declaration
- Missing `line_start:line_end:filename`
- Full-file rewrite without explicit request

#### Warn If:
- Output >20 lines without "rewrite file" tag
- Context (e.g., environment) ignored

### Cursor-Specific Optimizations

#### Composer vs. Chat:
- **Use Composer for:** Structured prompts (edits, fixes, features) using the master template
- **Use Chat for:** Exploratory questions (e.g., "Why is my component re-rendering?")

#### Context Management:
- Keep relevant files open in Cursor tabs
- Use `@filename` to reference specific files or `@Codebase` for pattern search
- Copy error messages from Cursor's integrated terminal and file paths via `Cmd+Shift+P` → "Copy Relative Path"

---

## 7. Quality Assurance Checklist

### Pre-Query Checklist

- [ ] Include exact code snippet, file path, line numbers, environment, and errors
- [ ] Use `@filename` in Cursor for specific file references
- [ ] State goal clearly (e.g., "Add null check for item.price")
- [ ] Specify constraints (e.g., "Use `line_start:line_end:filename`", "No full file rewrites")

### Post-Response Validation

- [ ] Intent echoed in ≤10 words
- [ ] Changes cited as `line_start:line_end:filename`
- [ ] Only changed code shown with `// ... existing code unchanged ...`
- [ ] Context respected (e.g., tech stack, environment)
- [ ] No hallucinated files, functions, or imports

---

## 8. Troubleshooting & Diagnostics

### Common Issues

| Problem | Symptoms | Fix | Example |
|---------|----------|-----|---------|
| **Verbose Responses** | Full file rewrites, extra text | Enforce Precision Output | "ONLY show changed lines" |
| **Vague Understanding** | Generic or incorrect solutions | Strengthen Context Anchoring | Include file path, lines, exact errors, @filename |
| **Wrong Code Location** | Edits in wrong file/lines | Use Constraint Enforcement | "Use `line_start:line_end:filename`" |
| **Ignored Constraints** | Violates specified rules | Restate constraints clearly | "MUST preserve existing props" |
| **Ignored Context** | Ignores @filename or environment | Restate context with @filename | "Use only @src/auth.js" |

### Emergency Rescue Protocols

#### Full File Returned:
```
STOP. You returned a full file.  
Show ONLY changed lines in this format:  
line_start:line_end:filename  
[changed code only]
```

#### Context Ignored:
```
CORRECTION: You missed these requirements:  
- Environment: [restate tech stack]  
- Constraint: [restate constraint]  
- File: [@filename]  
Retry with surgical precision.
```

#### Hallucinated Code:
```
VALIDATION ERROR: You referenced [non-existent item].  
ONLY use provided CURRENT STATE or @filename.  
Retry with zero assumptions.
```

### Self-Test Prompt

```markdown
# Self-Test Diagnostic

**ROLE**: Diagnostic assistant  
**MISSION**: Validate prompt compliance  

**CURRENT STATE**:  
[PASTE_YOUR_PROMPT]  

**DESIRED OUTCOME**:  
Check prompt for all 4 pillars and suggest fixes  

**RESPONSE FORMAT**:  
1. List used pillars
2. Identify missing pillars and suggest fixes
3. Score compliance (0–100%)
```

---

## 9. Success Metrics

### Individual Developer

- **First-Try Success Rate:** >90%
- **Clarification Requests:** <10%
- **Code Hallucinations:** 0%
- **Full File Rewrites:** <5%

### Team (Optional)

- Standardized prompt templates across developers
- Reduced onboarding time for AI workflows
- Improved code review efficiency

### Monitoring

Log metrics in an Airtable table with fields: `query_id`, `first_try_success`, `clarification_needed`, `hallucinations`, `time_saved`.

Alternatively, use a JSON log:
```json
{
  "query_id": "2025-06-08-001",
  "first_try_success": true,
  "clarification_needed": false,
  "hallucinations": 0,
  "time_saved_minutes": 10
}
```

Alert if `first_try_success < 85%` or `clarification_rate > 10%`.

### Visualization

Track prompt performance over time:

```json
{
  "type": "line",
  "data": {
    "labels": ["2025-06-01", "2025-06-02", "2025-06-03", "2025-06-04", "2025-06-05"],
    "datasets": [
      {
        "label": "First-Try Success Rate",
        "data": [0.85, 0.88, 0.90, 0.92, 0.95],
        "borderColor": "#4CAF50",
        "backgroundColor": "rgba(76, 175, 80, 0.2)",
        "fill": true
      },
      {
        "label": "Clarification Rate",
        "data": [0.15, 0.12, 0.10, 0.08, 0.05],
        "borderColor": "#F44336",
        "backgroundColor": "rgba(244, 67, 54, 0.2)",
        "fill": true
      }
    ]
  },
  "options": {
    "scales": {
      "y": {
        "beginAtZero": true,
        "max": 1
      }
    },
    "plugins": {
      "title": {
        "display": true,
        "text": "Prompt Performance Over Time"
      }
    }
  }
}
```

---

## 10. Pro Tips

1. **Be Specific:** "Fix login" → "Add null check for user.token at line 23"
2. **Use Line Numbers:** Always include `line_start:line_end:filename` or `@filename`
3. **Copy-Paste Errors:** Provide exact error messages from Cursor's terminal
4. **State Tech Stack:** Specify environment (e.g., Node 18, React 18)
5. **Start Simple:** Use minimal context, add details only if needed
6. **Validate Responses:** Check every response against the Quality Checklist
7. **Modular Prompting:** Break complex tasks into smaller, focused prompts
8. **Architecture Awareness:** Mention your architecture (e.g., microservices, monolith)
9. **Prompt Versioning:** Save successful prompts in `/prompts/archives` with metadata (date, project, outcome)

---

## 11. Advanced Extensions

### Prompt Generator Script
Automate prompt creation:

```javascript
const fs = require('fs');
const snippet = fs.readFileSync('{file_path}', 'utf-8')
  .split('\n')
  .slice(startLine-1, endLine)
  .join('\n');

const prompt = `
# AI Pair Programmer Prompt
**ROLE**: Senior pair programmer specializing in {domain}
**CURRENT STATE**:
${snippet}
**File:** {file_path}
**Environment:** {environment}
**DESIRED OUTCOME**:
${goal}
**RESPONSE FORMAT**:
1. Intent: [≤10-word summary]
2. [line_start:line_end:filename]
   [changed code only]
3. Rationale: [one sentence]
`;

fs.writeFileSync('prompt.mcp', prompt);
```

### Additional Extensions

- **Prompt Snippet Library:** Store snippets in `/prompts/snippets` and insert via Cursor's `Cmd+Shift+P` → "Insert Prompt Snippet"
- **Domain Specialization:** Add templates for blockchain, IoT, or ML in `/prompts`
- **Cross-Platform Support:** Abstract variables (e.g., `{activeFile}`) for VS Code, Copilot, JetBrains
- **Analytics Dashboard:** Log metrics in Airtable for team monitoring
- **Cursor Context Awareness:** Use `@Codebase` for pattern search and `@filename` for specific file references

---

**End of Guide**

*This guide represents a comprehensive framework for AI-driven development. Regular updates ensure compatibility with evolving AI tools and development practices.*




