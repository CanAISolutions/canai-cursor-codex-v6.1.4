# Supabase Schema Deployment Guide v1.2

## Overview
This guide deploys the CanAI Emotional Sovereignty Database (v6.1.4) on Supabase, resolving the `ERROR: 42P17: "prompt_logs" is not partitioned` issue and ensuring compliance with **Emotional Sovereignty** (trust scores >4.2, query latency <200ms), **production velocity**, and **test-first truth**. It uses a phased SQL Editor approach for 18 tables, 47 relationships (36 FK + 11 rollups), and full compatibility with Supabase Free/Pro tiers.

## Prerequisites
- Supabase project created at [app.supabase.com](https://app.supabase.com).
- Access to SQL Editor in your project.
- Copies of `complete-supabase-schema-setup-v1.1.sql`, `sparksplit-trust-transparency-schema.sql`, and `gin-indexes-deployment.sql`.
- CLI dashboard setup for task validation (if applicable).

## Why This Approach?
- **Error Resolution**: Removes invalid `prompt_logs` partitioning statements.
- **Simplicity**: No partitioning for initial deployment, deferring complexity.
- **Safety**: Includes backups and validation to prevent data loss.
- **Compliance**: Meets Sacred Reversal Test (trust, clarity, empowerment).

## Deployment Phases

### Phase 0: Backup and Preparation
1. **Backup Database** (even if empty, for safety):
   ```bash
   pg_dump -h <supabase-host> -U postgres -d postgres > supabase_backup_$(date +%F).sql
   ```
   Replace `<supabase-host>` with your Supabase project’s database host (from Settings > Database).

2. **Verify Scripts**:
   - Ensure you have `complete-supabase-schema-setup-v1.1.sql` (corrected version below).
   - Check `sparksplit-trust-transparency-schema.sql` and `gin-indexes-deployment.sql` for references to `prompt_logs` partitions. If present, remove them or consult for assistance.

3. **Clear Existing Migrations** (if any):
   In the SQL Editor, check for stray migrations:
   ```sql
   SELECT * FROM supabase_migrations.schema_migrations;
   ```
   If migrations exist, consult Supabase support to reset or proceed cautiously.

### Phase 1: Foundation Schema (18 Tables)
1. **Deploy Schema**:
   - Go to [app.supabase.com](https://app.supabase.com) > Your Project > SQL Editor.
   - Paste the contents of `complete-supabase-schema-setup-v1.1.sql` (from my previous response, artifact ID `8c3f9e7b-5d2a-4b1d-9e3c-7f1b8c6e7f5c`).
   - Click **Run**.
   - **Expected Time**: ~3–4 minutes.

2. **Validation**:
   - Go to **Table Editor** and confirm **18 tables**, including:
     - `session_analytics`
     - `prompt_logs`
     - `user_context`
     - `sparksplit_analytics`
   - Run validation queries in the SQL Editor:
     ```sql
     SELECT * FROM validate_schema_integrity();
     SELECT * FROM check_performance_health();
     ```
     - **Expect**: 18 tables, 47 relationships, vector extension enabled.
   - Check table count:
     ```sql
     SELECT COUNT(*) FROM information_schema.tables 
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
     ```

3. **Error Handling**:
   - If an error occurs, note the line number and run only the preceding block.
   - Ensure the script ends with a semicolon (`;`) for each statement.
   - If `prompt_logs` partitioning errors persist, confirm you’re using `complete-supabase-schema-setup-v1.1.sql`.

### Phase 2: SparkSplit Trust Transparency Schema
1. **Deploy Schema**:
   - In the SQL Editor, paste the contents of `sparksplit-trust-transparency-schema.sql`.
   - Click **Run**.
   - **Expected Time**: ~2–3 minutes.

2. **Validation**:
   - Check **Table Editor** for tables like:
     - `sparksplit_comparisons`
     - `sparksplit_analytics`
     - `trust_transparency_metrics`
     - `competitive_advantage_metrics`
   - Run:
     ```sql
     SELECT * FROM information_schema.tables 
     WHERE table_schema = 'public' AND table_name LIKE 'sparksplit%';
     ```

3. **Error Handling**:
   - If errors occur, check for references to `prompt_logs` partitions and remove them.
   - Run failed blocks individually and verify semicolons.

### Phase 3: GIN Index Optimization for JSONB
1. **Deploy Indexes**:
   - In the SQL Editor, paste the contents of `gin-indexes-deployment.sql`.
   - Click **Run**.
   - **Expected Time**: ~1–2 minutes.

2. **Validation**:
   - Check for index creation:
     ```sql
     SELECT indexname, tablename FROM pg_indexes 
     WHERE tablename = 'prompt_logs' AND indexname LIKE 'idx_prompt_logs%';
     ```
     - **Expect**: Indexes like `idx_prompt_logs_input_gin`, `idx_prompt_logs_output_gin`.
   - Confirm performance:
     ```sql
     EXPLAIN ANALYZE SELECT * FROM prompt_logs WHERE input_fields @> '{"key": "value"}';
     ```
     - **Expect**: Query latency <200ms.

3. **Error Handling**:
   - If index creation fails, ensure `prompt_logs` exists (from Phase 1).
   - Run `CREATE INDEX` statements individually if needed.

### Phase 4: Task-Level Validation
1. **Run CLI Tests**:
   If using the CLI dashboard, execute:
   ```bash
   npm run test:sparksplit-backend
   npm run test:comparison-engine
   npm run test:sparksplit-analytics
   node workspace-organization/01-foundation/tracking/production-cli-dashboard.js test-all
   ```

2. **Validate JSONB Performance**:
   ```bash
   npm run test:jsonb-performance
   npm run test:flattening-functions
   ```

3. **Check Performance Metrics**:
   In the SQL Editor:
   ```sql
   SELECT * FROM check_performance_health();
   ```
   - **Expect**: Trust score ≥4.9, spark resonance ≥97%, latency <200ms.

### Phase 5: Final Confirmation
1. **Confirm Schema**:
   - Verify 18+ tables (depending on `sparksplit-trust-transparency-schema.sql`).
   - Run:
     ```sql
     SELECT * FROM validate_schema_integrity();
     ```
     - **Expect**: All checks pass (airtable_base_id, relationship_count, table_count, vector_extension).

2. **Monitor Performance**:
   - Check query latency:
     ```sql
     EXPLAIN ANALYZE SELECT * FROM prompt_logs WHERE session_id = '<uuid>';
     ```
   - Monitor trust scores:
     ```sql
     SELECT AVG(trust_score) FROM prompt_logs;
     ```

3. **Go Live**:
   - Your schema is live with full **Emotional Sovereignty** compliance.
   - SparkSplit is ready for trust transparency scoring and analytics.

## Error Mitigation Tips
- **Partial Execution**: If a block fails, copy-paste only the failed section in the SQL Editor.
- **Check Semicolons**: Ensure all statements end with `;`.
- **Debug Indexes**:
   ```sql
   SELECT * FROM pg_indexes WHERE tablename = 'prompt_logs';
   ```
- **Check Logs**: View Supabase Logs (Dashboard > Reports > API) for errors.
- **Contact Support**: Share error messages or additional scripts for debugging.

## Future Partitioning (If Needed)
For 10,000+ `prompt_logs` records:
1. Backup:
   ```sql
   COPY (SELECT * FROM prompt_logs) TO '/tmp/prompt_logs_backup.csv' WITH CSV HEADER;
   ```
2. Drop and recreate `prompt_logs` with partitioning (see “Future Partitioning Plan” in previous guidance, artifact ID `b21cb67c-815c-48cd-85e1-b41894535fe7`).
3. Restore data and recreate indexes/triggers.

## Alignment with Project Rules
- **Production Velocity**: SQL Editor deployment is fast and visible.
- **Emotional Sovereignty**: Trust scores >4.9, latency <200ms.
- **Quantum Optimization**: GIN/IVFFLAT indexes ensure performance.
- **Test-First Truth**: CLI tests and validation functions confirm correctness.

## Next Steps
- Monitor `prompt_logs` growth to assess partitioning needs.
- Integrate with CLI dashboard for ongoing analytics.
- Update CI/CD to include validation queries.