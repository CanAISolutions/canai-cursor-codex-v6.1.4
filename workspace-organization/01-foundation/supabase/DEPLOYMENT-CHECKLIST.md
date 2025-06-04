# CanAI Supabase Deployment Checklist v6.1.4

## 🎯 **Pre-Deployment Setup**

### **Your Supabase Project Info**
- **Project URL**: `https://app.supabase.com/project/[your-project-id]`
- **Database Host**: `db.[your-project-id].supabase.co`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: [From Settings > Database]

---

## 📋 **PHASE 0: BACKUP & PREPARATION**

### **Step 0.1: Create Backup Directory**
```bash
# In your project root
mkdir -p workspace-organization/backups
```

### **Step 0.2: Backup Database (Optional but Safe)**

**How to find your Supabase connection details:**
1. Go to `app.supabase.com > Your Project > Settings > Database`
2. Look for "Connection string" section
3. Your host will be: `db.[your-project-id].supabase.co`
4. Copy the password from "Database password" section

**In VS Code terminal** (Terminal > New Terminal):
```bash
# Replace [your-project-id] and [your-password] with actual values
pg_dump -h db.[your-project-id].supabase.co -U postgres -d postgres -W > workspace-organization/backups/supabase_backup_2025-06-03.sql
```
**When prompted, enter your database password**

**If pg_dump not available**: Skip this step (database is empty anyway, this is just for safety)

### **Step 0.3: Check for Missing Tables**
**Go to**: `app.supabase.com > Your Project > SQL Editor`
**Run**:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('cursor_interactions_log', 'task_tracker_13day', 'task_state_backups', 'task_metrics_realtime');
```
**Expected Result**: No rows (tables don't exist yet)

---

## 📋 **PHASE 1: DEPLOY MAIN SCHEMA**

### **Step 1.1: Copy Main Schema**
**File**: `workspace-organization/Supabase Schema Setup Guide v1.1.md`
**Section**: Look for `complete-supabase-schema-setup-v1.1.sql`
**Action**: Copy the entire SQL content

### **Step 1.2: Execute in Supabase**
**Go to**: `app.supabase.com > Your Project > SQL Editor`
**Action**: 
1. Paste the SQL content
2. Click **Run**
3. **Expected Time**: 3-4 minutes
4. **Expected Result**: "Schema setup completed" message

### **Step 1.3: Validate Main Schema**
**Run in SQL Editor**:
```sql
-- Check table count
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
-- Expected: 18

-- Check schema integrity
SELECT * FROM validate_schema_integrity();
-- Expected: All status = TRUE

-- Check performance health
SELECT * FROM check_performance_health();
-- Expected: Various metrics initialized
```

---

## 📋 **PHASE 2: DEPLOY SPARKSPLIT SCHEMA**

### **Step 2.1: Deploy SparkSplit Tables**
**File**: Your `sparksplit-trust-transparency-schema.sql`
**Action**: 
1. Copy content and paste in SQL Editor
2. Click **Run**
3. **Expected**: 4 new tables created

### **Step 2.2: Add Foreign Key Constraints**
**File**: `workspace-organization/01-foundation/supabase/schema/sparksplit-foreign-keys.sql`
**Action**: 
1. Copy content and paste in SQL Editor
2. Click **Run**

### **Step 2.3: Validate SparkSplit Schema**
**Run in SQL Editor**:
```sql
-- Check SparkSplit tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'sparksplit%';
-- Expected: 4 tables

-- Check foreign keys
SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS referenced_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name LIKE 'sparksplit%' 
    AND tc.constraint_type = 'FOREIGN KEY';
-- Expected: 2 foreign key constraints
```

---

## 📋 **PHASE 3: DEPLOY GIN INDEXES**

### **Step 3.1: Deploy Safe GIN Indexes**
**File**: `workspace-organization/01-foundation/supabase/schema/gin-indexes-prompt-logs-only.sql`
**Action**: 
1. Copy content and paste in SQL Editor
2. Click **Run**
3. **Expected**: "SUCCESS: 3 GIN indexes created" message

### **Step 3.2: Validate Index Performance**
**Run in SQL Editor**:
```sql
-- Check indexes created
SELECT indexname FROM pg_indexes 
WHERE tablename = 'prompt_logs' AND indexname LIKE 'idx_prompt_logs%';
-- Expected: 3 new GIN indexes

-- Test JSONB query performance
EXPLAIN ANALYZE SELECT * FROM prompt_logs 
WHERE input_fields @> '{"key": "value"}';
-- Expected: Query plan showing GIN index usage
```

---

## 📋 **PHASE 4: FINAL VALIDATION**

### **Step 4.1: Complete Schema Check**
**Run in SQL Editor**:
```sql
-- Final integrity check
SELECT * FROM validate_schema_integrity();

-- Final performance check  
SELECT * FROM check_performance_health();

-- Total table count
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
-- Expected: 22 (18 main + 4 SparkSplit)
```

### **Step 4.2: Test Sample Data Insert**
**Run in SQL Editor**:
```sql
-- Test session creation
INSERT INTO session_analytics (session_id, user_id, primary_product) 
VALUES ('test-session-001', 'test-user-001', 'spark_split');

-- Test prompt log creation
INSERT INTO prompt_logs (session_id, user_id, prompt_type, input_fields, trust_score) 
VALUES ('test-session-001', 'test-user-001', 'spark_split', '{"test": "data"}', 4.5);

-- Verify data
SELECT COUNT(*) FROM session_analytics; -- Expected: 1
SELECT COUNT(*) FROM prompt_logs; -- Expected: 1

-- Test JSONB query
SELECT * FROM prompt_logs WHERE input_fields @> '{"test": "data"}';
-- Expected: 1 row returned quickly
```

---

## 📋 **PHASE 5: CLI TESTS (If Available)**

### **Step 5.1: Run Available Tests**
**In VS Code Terminal** (Terminal > New Terminal):
```bash
# Test SparkSplit backend
npm run test:sparksplit-backend 2>/dev/null || echo "SparkSplit backend tests not found"

# Test comparison engine
npm run test:comparison-engine 2>/dev/null || echo "Comparison engine tests not found"

# Test SparkSplit analytics
npm run test:sparksplit-analytics 2>/dev/null || echo "SparkSplit analytics tests not found"

# Test JSONB performance
npm run test:jsonb-performance 2>/dev/null || echo "JSONB performance tests not found"

# Test flattening functions
npm run test:flattening-functions 2>/dev/null || echo "Flattening functions tests not found"

# Test CLI dashboard
node workspace-organization/01-foundation/tracking/production-cli-dashboard.js test-all 2>/dev/null || echo "CLI dashboard not found"
```

### **Step 5.2: Trust Score and Spark Resonance Validation**
**Run in SQL Editor**:
```sql
-- Test trust score calculation (after inserting sample data)
SELECT AVG(trust_score) FROM prompt_logs; 
-- Expected: ≥4.2 (Emotional Sovereignty threshold)

-- Test spark resonance calculation (after data)
SELECT calculate_spark_resonance(); 
-- Expected: ≥97% (Sacred metric target)

-- Test system health
SELECT * FROM check_performance_health();
-- Expected: All metrics PASS
```

---

## ✅ **SUCCESS CRITERIA**

### **✅ Schema Deployment Complete When:**
- ✅ 22 total tables created (18 main + 4 SparkSplit)
- ✅ All validation functions return TRUE/PASS
- ✅ GIN indexes operational for JSONB queries
- ✅ Foreign key constraints properly linked
- ✅ Sample data inserts and queries work
- ✅ Query performance < 200ms for JSONB operations

### **✅ Ready for Production When:**
- ✅ Trust score functions operational
- ✅ SparkSplit analytics tables ready
- ✅ GIN indexes optimized for JSONB performance
- ✅ Emotional sovereignty metrics active
- ✅ Performance monitoring active

---

## 🚨 **TROUBLESHOOTING**

### **If Errors Occur:**
1. **Note the error message and line number**
2. **Check for missing semicolons**
3. **Verify table names match exactly**
4. **Ensure you're running scripts in correct order**

### **Common Issues:**
- **Extension errors**: Supabase should auto-enable extensions
- **Permission errors**: Use default postgres user
- **Timeout errors**: Break large scripts into smaller chunks

### **Recovery Steps:**
1. **Check what was created**: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
2. **Drop problematic tables**: `DROP TABLE table_name CASCADE;`
3. **Re-run scripts individually**

---

## 📞 **Support Information**

**If you encounter issues during deployment:**
1. **Copy the exact error message**
2. **Note which phase/step failed**
3. **Check what tables were created successfully**
4. **Share validation query results**

**Deployment Status**: 🟡 **PENDING USER EXECUTION** 