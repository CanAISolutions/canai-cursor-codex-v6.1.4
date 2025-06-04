# 🚀 Reusable DreamState Task Executor Prompt

**Use this prompt to maintain systematic progress through DreamState enhancement tasks with Test-First Truth enforcement.**

---

## 📋 **EXECUTION COMMAND**

```
Run the DreamState task runner to identify the next sequential task. Follow the generated execution plan with absolute adherence to Test-First Truth principles. Implement production-ready code with zero mocks, placeholders, or TODO comments. Ensure 100% test pass rate before marking any task complete. Update the task list with ✅ COMPLETE status and run the task runner again for the next task.

Command: npm run dreamstate:task-runner
```

---

## 🎯 **SYSTEMATIC WORKFLOW**

### **Step 1: Run Task Analysis**
```bash
npm run dreamstate:task-runner
```
This will:
- ✅ Check current progress and test status
- 🎯 Identify next sequential task
- 📋 Generate detailed execution plan
- 🛡️ Enforce quality gates
- 🚀 Display specific next steps

### **Step 2: Fix Any Blocking Issues**
If the runner shows:
- ❌ **Failed Tests**: Fix all failing tests first
- ⚠️ **Prohibited Patterns**: Remove mocks, placeholders, TODOs
- 🚨 **Missing Files**: Create required infrastructure

**DO NOT PROCEED** until 100% test pass rate achieved.

### **Step 3: Follow Generated Execution Plan**
The runner outputs a specific plan like:
```
## TASK: [Specific Task Name]
**Phase**: [Phase Number] - [Phase Name] | **Milestone**: [Task Number]

### IMPLEMENTATION PLAN
1. Write comprehensive tests that define expected behavior
2. Implement production-ready functionality (NO placeholders)
3. Ensure all tests pass with 100% success rate
4. Validate performance requirements (<50ms response times)
5. Update task list with ✅ COMPLETE status
```

### **Step 4: Implement with Test-First Truth**
- 🧪 **Write tests FIRST** - Define expected behavior
- 💻 **Implement REAL code** - No mocks, placeholders, or TODOs
- ✅ **Validate 100% pass rate** - All tests must pass
- ⚡ **Check performance** - <50ms response times
- 📊 **Update progress** - Mark task as ✅ COMPLETE

### **Step 5: Validate Completion**
```bash
# Ensure all tests pass
npm run dreamstate:test

# Check for prohibited patterns
grep -r "TODO\|placeholder\|mock" src/ tests/

# Validate integration
npm run test:integration
```

### **Step 6: Update and Continue**
- ✅ Mark task as **COMPLETE** in `docs/dreamstate-enhancement-implementation-tasks.md`
- 📊 Update phase completion percentage
- 🔄 Run task runner again: `npm run dreamstate:task-runner`

---

## 🚫 **ABSOLUTE PROHIBITIONS**

### **Never Use These:**
- ❌ **Mocks** - All functionality must be real and production-ready
- ❌ **Placeholders** - Every function must be fully implemented
- ❌ **TODO code** - No "implement later" or temporary comments
- ❌ **console.log** - Use proper logging infrastructure
- ❌ **Stub implementations** - Every method must work completely

### **Quality Gates (Non-Negotiable):**
- 🧪 **100% Test Pass Rate** - No exceptions allowed
- 🚀 **Production Ready** - Code must be deployable immediately
- ⚡ **Performance Validated** - Sub-50ms response times maintained
- 🛡️ **Error Handling** - Complete edge case coverage
- 📊 **Documentation Updated** - Task list reflects reality

---

## 🛡️ **ENFORCEMENT CHECKLIST**

Before claiming any task complete:
- [ ] **All tests passing** (100% pass rate)
- [ ] **Zero prohibited patterns** found in codebase
- [ ] **Real implementations** only (no mocks/placeholders)
- [ ] **Performance requirements** met (<50ms)
- [ ] **Error handling** comprehensive
- [ ] **Task list updated** with ✅ COMPLETE
- [ ] **Integration validated** with existing system

---

## 📚 **AVAILABLE COMMANDS**

### **Primary Commands:**
```bash
npm run dreamstate:task-runner    # Run task analysis and planning
npm run dreamstate:test           # Run DreamState test suite
npm run test:integration          # Run integration tests
npm run test-first-truth:validate # Validate test-first principles
```

### **Progress Tracking:**
```bash
npm run integration:status        # Quick integration status
npm run validate:integration      # Full integration validation
```

---

## 🚨 **TROUBLESHOOTING**

### **If Tests Are Failing:**
1. 🔧 **Fix failing tests immediately**
2. 🚫 **Do not proceed with new tasks**
3. ✅ **Achieve 100% pass rate first**
4. 🔄 **Re-run task runner to continue**

### **If Prohibited Patterns Found:**
1. 🔍 **Scan for issues**: `grep -r "TODO\|placeholder\|mock" src/ tests/`
2. 🛠️ **Replace with real implementations**
3. ✅ **Validate clean codebase**
4. 🔄 **Continue with task execution**

---

## 🎯 **SUCCESS METRICS**

Track these for each task:
- ✅ **Test Pass Rate**: 100% (no exceptions)
- 🚀 **Implementation Completeness**: 100% (zero placeholders)
- ⚡ **Performance**: <50ms response times
- 🔗 **Integration**: Works with existing system
- 📊 **Documentation**: Task list reflects reality

---

## 💡 **QUICK REFERENCE**

**Single Command to Start:**
```bash
npm run dreamstate:task-runner
```

**Core Principle:**
> Test-First Truth - Nothing is complete until tests prove it works in production conditions.

**Quality Standard:**
> Production-ready emotional intelligence, not prototypes. Every line of code must be deployable.

---

**Use this prompt repeatedly to maintain systematic progress through all 99 DreamState enhancement tasks while ensuring absolute adherence to Test-First Truth principles and zero tolerance for incomplete implementations.** 