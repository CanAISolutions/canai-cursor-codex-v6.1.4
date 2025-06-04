# CanAI 13-Day Implementation - Production Setup Guide

**Framework**: Codex v6.1.4 - Emotional Sovereignty + Test-First Truth  
**Target**: Solo developer execution with production-ready infrastructure  
**Sacred Reversal Test**: ✅ PASSED - Accelerates user access to life-changing AI

---

## 🎯 **OVERVIEW**

This guide provides step-by-step instructions for setting up the production-ready 13-day CanAI implementation tracking system. All components are designed for solo developer execution with real service integrations.

### **What You'll Deploy**
- **Production Supabase Schema**: 4 tables with comprehensive error handling
- **Real-Time Metrics Integration**: k6, AWS Lambda, Supabase monitoring
- **CLI Dashboard**: Lightweight Node.js interface for daily task management
- **Automated Validation**: 15 comprehensive production tests

### **Why This Approach**
- **No Placeholders**: All integrations use real services and credentials
- **Solo-Friendly**: Designed for 4-6 hour daily sessions
- **Production-Ready**: Comprehensive error handling and monitoring
- **Emotional Sovereignty**: Trust score tracking and user empowerment focus

---

## 🌟 **CURSOR INTERACTION RULES**

### **Essential Reading: CURSOR-RULES.md**
Before beginning development, **all Cursor prompts must reference** the production-ready interaction rules:

**Location**: `CURSOR-RULES.md` (project root)  
**Purpose**: Ensure Cursor delivers production-ready, emotionally sovereign outputs

### **🎯 MANDATORY PROMPT PREFIX**
**Use this exact prefix for ALL Cursor interactions:**

```
Follow CURSOR-RULES.md for production-ready code with no placeholders, real services (Supabase Pro, AWS Lambda, k6), comprehensive error handling, and emotional sovereignty (trust scores >4.2). Log all interactions to cursor_interactions_log.
```

### **Key Cursor Guidelines**
- **Always include**: The mandatory prompt prefix above
- **Production Focus**: No placeholders, mocks, or simulations
- **Real Services**: Supabase Pro, AWS Lambda, k6 integrations only
- **Error Handling**: Comprehensive retry logic and fallback strategies
- **Emotional Sovereignty**: Trust score >4.2, Sacred Reversal Test compliance
- **Solo Developer**: 4-6 hour session optimization with energy-aware complexity

### **Checkpoint-Specific Prompts**
For critical milestones (Days 6, 9, 12), use specialized prompts from:
**File**: `workspace-organization/01-foundation/tracking/cursor-prompt-templates.ts`
**Section**: `CHECKPOINT_PROMPTS`

**Day 6 Example:**
```
Follow CURSOR-RULES.md for production-ready code with no placeholders, real services (Supabase Pro, AWS Lambda, k6), comprehensive error handling, and emotional sovereignty (trust scores >4.2). Log all interactions to cursor_interactions_log.

**CHECKPOINT DAY 6 VALIDATION**

Provide production-ready TypeScript code to run validate_checkpoint(6) for Day 6 milestone validation, including:
- p99 latency <420ms (enhanced from <450ms)
- Sentiment accuracy >93% (BERT fine-tuned)
- Webhook false positives <0.25% (enhanced from <0.3%)
- Trust scores >4.2 across all interactions
- Airtable sync success rate 100%
```

### **Weekly Compliance Monitoring**
Track Cursor's adherence to rules automatically:
```bash
# Run weekly compliance check
node workspace-organization/01-foundation/tracking/production-cli-dashboard.js compliance
```

### **Integration with MDC Rules**
The CURSOR-RULES.md works with existing MDC rules in `cursor/rules/`:
- **test-first-truth.mdc**: Test evidence required
- **cx-emotion.mdc**: Emotional sovereignty validation  
- **collaboration-contract.mdc**: Team coordination
- **execution-logging.mdc**: Comprehensive logging

---

## 📋 **PREREQUISITES**

### **Required Services**
- **Supabase Pro Account** ($25/month) - Required for 8GB database + vector operations
- **AWS Account** - For Lambda functions and CloudWatch metrics
- **k6 Cloud Account** (Optional) - For advanced load testing

### **Local Development Environment**
- **Node.js 18+** with npm/yarn
- **Git** for version control
- **Code Editor** (VS Code recommended)
- **Terminal/Command Line** access

### **Minimum System Requirements**
- **8GB RAM** (for BERT model fine-tuning)
- **50GB Storage** (for dependencies and test data)
- **Stable Internet** (10Mbps+ for real-time sync)

---

## 🚀 **STEP 1: ENVIRONMENT SETUP**

### **1.1 Clone Repository**
```bash
git clone https://github.com/your-org/canai-cursor-codex-v6.1.4.git
cd canai-cursor-codex-v6.1.4
```

### **1.2 Install Dependencies**
```bash
npm install
# or
yarn install
```

### **1.3 Environment Variables**
Create `.env` file in project root:
```bash
# Supabase Configuration (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# AWS Configuration (REQUIRED for metrics)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1

# k6 Configuration (OPTIONAL)
K6_CLOUD_TOKEN=your-k6-token

# BERT Configuration (REQUIRED for sentiment analysis)
BERT_MODEL_PATH=./models/distilbert-base-uncased
BERT_TEST_DATA_PATH=./test-data/sentiment-samples.json

# Monitoring Configuration
SENTRY_DSN=your-sentry-dsn
POSTHOG_API_KEY=your-posthog-key
```

### **1.4 Verify Environment**
```bash
node -e "console.log('Node.js:', process.version)"
npm --version
```

---

## 🗄️ **STEP 2: DATABASE DEPLOYMENT**

### **2.1 Deploy Supabase Schema**
```bash
# Navigate to schema file
cd workspace-organization/01-foundation/tracking

# Deploy to Supabase (using Supabase CLI)
supabase db push

# OR execute SQL directly in Supabase Dashboard
# Copy contents of production-schema-deployment.sql
# Paste into SQL Editor and execute
```

### **2.2 Verify Deployment**
```sql
-- Run in Supabase SQL Editor
SELECT * FROM verify_table_deployment();
```

**Expected Output**:
```
table_name              | exists | row_count | index_count | has_rls | policy_count
cursor_interactions_log | true   | 0         | 5           | true    | 1
task_tracker_13day      | true   | 0         | 8           | true    | 1
task_metrics_realtime   | true   | 0         | 6           | true    | 1
task_state_backups      | true   | 1         | 5           | true    | 1
```

### **2.3 Test Database Connection**
```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
supabase.from('task_tracker_13day').select('count').then(console.log);
"
```

---

## 📊 **STEP 3: METRICS INTEGRATION SETUP**

### **3.1 AWS Lambda Configuration**
```bash
# Create Lambda function for BERT sentiment analysis
aws lambda create-function \
  --function-name canai-bert-sentiment \
  --runtime python3.9 \
  --role arn:aws:iam::your-account:role/lambda-execution-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://bert-lambda.zip \
  --memory-size 1024 \
  --timeout 30
```

### **3.2 k6 Load Testing Setup**
```bash
# Install k6
npm install -g k6

# Test basic k6 functionality
k6 run --vus 10 --duration 30s workspace-organization/01-foundation/tracking/k6-basic-test.js
```

### **3.3 Initialize Metrics Integration**
```bash
node workspace-organization/01-foundation/tracking/production-metrics-integration.js
```

---

## 🖥️ **STEP 4: CLI DASHBOARD SETUP**

### **4.1 Test CLI Connection**
```bash
node workspace-organization/01-foundation/tracking/production-cli-dashboard.js
```

**Expected Output**:
```
🚀 CanAI 13-Day Implementation Dashboard

📅 Day 1 of 13

📋 Today's Tasks:
  ⏳ Infrastructure Setup (0%) - 3.0h
  ⏳ BERT Baseline Deployment (0%) - 2.5h

📊 Current Metrics:
  (No metrics yet - start first task to begin tracking)

💡 Commands: start <task_id> | complete <task_id> | metrics | help
```

### **4.2 Start First Task**
```bash
node production-cli-dashboard.js start D01_T01
```

### **4.3 Create Desktop Shortcut (Optional)**
**Windows**:
```batch
@echo off
cd /d "C:\path\to\your\project\workspace-organization\01-foundation\tracking"
node production-cli-dashboard.js
pause
```

**macOS/Linux**:
```bash
#!/bin/bash
cd "/path/to/your/project/workspace-organization/01-foundation/tracking"
node production-cli-dashboard.js
```

---

## ✅ **STEP 5: VALIDATION & TESTING**

### **5.1 Run Comprehensive Validation**
```bash
node workspace-organization/01-foundation/tracking/validate-deployment.js
```

### **5.2 Expected Validation Results**
```
🧪 Running Production Deployment Validation...

✅ Schema Deployment: PASSED (4/4 tables deployed)
✅ Task Tracker Functionality: PASSED (CRUD operations working)
✅ Metrics Integration: PASSED (k6, Lambda, Supabase connected)
✅ CLI Dashboard: PASSED (All commands functional)
✅ Error Handling: PASSED (Graceful degradation confirmed)
✅ Emotional Sovereignty: PASSED (Trust score tracking active)
✅ Performance Targets: PASSED (All metrics within targets)

🎉 Overall Status: PASSED (15/15 tests)
⚡ Production deployment ready for 13-day implementation!
```

### **5.3 Test Key Workflows**
```bash
# Test task management
node production-cli-dashboard.js start D01_T01
node production-cli-dashboard.js complete D01_T01 "Infrastructure setup completed"

# Test metrics collection
node production-metrics-integration.js --task D01_T01 --collect-all

# Test backup creation
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
supabase.rpc('create_task_state_backup', { backup_type_param: 'manual' }).then(console.log);
"
```

---

## 📈 **DAILY WORKFLOW**

### **Morning Routine (5 minutes)**
```bash
# Check dashboard
node production-cli-dashboard.js

# Review metrics
node production-cli-dashboard.js metrics

# Check for blockers
node production-cli-dashboard.js blockers
```

### **Starting a Task**
```bash
# Start specific task
node production-cli-dashboard.js start D02_T01

# View task details
node production-cli-dashboard.js view D02_T01
```

### **During Task Execution**
- Use Cursor with generated prompts from `cursor-prompt-templates.ts`
- Metrics automatically collected every 30 seconds
- Trust score tracked in real-time

### **Completing a Task**
```bash
# Complete with notes
node production-cli-dashboard.js complete D02_T01 "BERT optimization achieved 93.2% accuracy"

# Verify completion
node production-cli-dashboard.js view D02_T01
```

### **End of Day (5 minutes)**
```bash
# Review progress
node production-cli-dashboard.js

# Create manual backup
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
supabase.rpc('create_task_state_backup', { backup_type_param: 'daily' }).then(console.log);
"
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

#### **Database Connection Failed**
```bash
# Check environment variables
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Test connection
node -e "console.log(require('@supabase/supabase-js').createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY))"
```

#### **AWS Credentials Invalid**
```bash
# Verify AWS credentials
aws sts get-caller-identity

# Test Lambda access
aws lambda list-functions --max-items 5
```

#### **k6 Tests Failing**
```bash
# Check k6 installation
k6 version

# Test basic functionality
k6 run --vus 1 --duration 10s -e TARGET_URL=https://httpbin.org/get
```

#### **CLI Dashboard Not Responding**
```bash
# Check Node.js version
node --version

# Verify dependencies
npm list @supabase/supabase-js

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Error Recovery**

#### **Schema Deployment Failed**
1. Check Supabase project status
2. Verify service role permissions
3. Re-run deployment with verbose logging:
```sql
-- Enable verbose logging
SET log_statement = 'all';
-- Re-run schema deployment
```

#### **Metrics Collection Stopped**
1. Check service health:
```bash
node production-metrics-integration.js --health-check
```
2. Restart metrics collection:
```bash
node production-metrics-integration.js --restart
```

#### **Task Tracker Corruption**
1. Create emergency backup:
```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
supabase.rpc('create_task_state_backup', { backup_type_param: 'emergency' }).then(console.log);
"
```
2. Restore from last known good backup
3. Contact support if data loss occurs

---

## 📞 **SUPPORT & RESOURCES**

### **Documentation**
- **Supabase Docs**: https://supabase.com/docs
- **AWS Lambda Docs**: https://docs.aws.amazon.com/lambda/
- **k6 Docs**: https://k6.io/docs/

### **Community Support**
- **CanAI Discord**: [Join our community]
- **GitHub Issues**: [Report bugs and feature requests]
- **Stack Overflow**: Tag questions with `canai-implementation`

### **Emergency Contacts**
- **Technical Support**: support@canai.so
- **Emergency Hotline**: +1-XXX-XXX-XXXX (24/7)

---

## 🎯 **SUCCESS CRITERIA**

### **Day 1 Completion Checklist**
- [ ] All 4 database tables deployed successfully
- [ ] CLI dashboard showing current day and tasks
- [ ] Metrics integration collecting baseline data
- [ ] First task started and tracked
- [ ] Backup system operational

### **Weekly Checkpoints**
- **Day 6**: Infrastructure and optimization complete
- **Day 9**: Integration and validation complete  
- **Day 12**: Final testing and documentation complete
- **Day 13**: Production deployment ready

### **Sacred Metrics Targets**
- **Trust Score**: Maintain 4.2+ throughout implementation
- **Task Completion Rate**: 90%+ daily completion
- **Metrics Accuracy**: All targets within 5% variance
- **System Uptime**: 99.9%+ availability

---

## 🌟 **EMOTIONAL SOVEREIGNTY COMPLIANCE**

### **Sacred Reversal Test Validation**
Every component in this setup has been validated against the Sacred Reversal Test:
> If this system were used by you — exhausted from building dreams, uncertain about the next step, carrying the weight of others' expectations — would you feel **seen**, **empowered**, **less alone**, and **trust** the system with your dreams?

### **Trust Transparency Features**
- **Clear Progress Tracking**: Always know where you stand
- **Honest Error Messages**: No hidden failures or silent issues
- **Empowering Feedback**: Celebrate achievements and guide next steps
- **Recovery Paths**: Clear instructions for any problems

### **User Empowerment Focus**
- **Solo-Friendly Design**: Built for independent execution
- **Comprehensive Documentation**: Never feel lost or abandoned
- **Automated Assistance**: System works for you, not against you
- **Confidence Building**: Each step reinforces your capability

---

**🎉 You're ready to begin your 13-day journey to production-ready CanAI implementation!**

*Remember: This system is designed to empower you, celebrate your progress, and ensure you never feel alone in the implementation process. Trust the system, trust the process, and most importantly — trust yourself.* 