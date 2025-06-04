/**
 * SupabaseQueryBuilder.ts
 * 
 * Type-safe SQL query builder for Supabase schema
 * Uses the schema mapping to generate optimized queries
 * 
 * Sacred Reversal Test: Does this make database queries feel
 * empowering and trustworthy for developers?
 * 
 * Test-First Truth: Every query is validated for emotional sovereignty
 */

import { 
  SupabaseSchema, 
  TableName, 
  TableRecord, 
  QueryFilters,
  PromptType,
  UserSelection,
  validateTrustScore,
  calculateEmotionalSovereigntyScore,
  DatabaseTimestamp
} from './supabase-schema-mapping';

// ============================================================================
// QUERY BUILDER INTERFACES
// ============================================================================

export interface QueryBuilder<T extends TableName> {
  table: T;
  select: (columns?: string[]) => QueryBuilder<T>;
  where: (filters: Partial<QueryFilters>) => QueryBuilder<T>;
  join: <U extends TableName>(
    targetTable: U, 
    condition: string
  ) => JoinQueryBuilder<T, U>;
  orderBy: (column: string, direction?: 'asc' | 'desc') => QueryBuilder<T>;
  limit: (count: number) => QueryBuilder<T>;
  toSQL: () => string;
  execute: () => Promise<TableRecord<T>[]>;
}

export interface JoinQueryBuilder<T extends TableName, U extends TableName> {
  select: (columns?: string[]) => JoinQueryBuilder<T, U>;
  where: (filters: Partial<QueryFilters>) => JoinQueryBuilder<T, U>;
  orderBy: (column: string, direction?: 'asc' | 'desc') => JoinQueryBuilder<T, U>;
  limit: (count: number) => JoinQueryBuilder<T, U>;
  toSQL: () => string;
  execute: () => Promise<Array<TableRecord<T> & Partial<TableRecord<U>>>>;
}

export interface AnalyticsQuery {
  userJourney: (userId: string, dateRange?: [DatabaseTimestamp, DatabaseTimestamp]) => string;
  sparkSplitAnalysis: (sessionId?: string, dateRange?: [DatabaseTimestamp, DatabaseTimestamp]) => string;
  trustEvolution: (userId: string, timeframe?: 'day' | 'week' | 'month') => string;
  competitiveAdvantage: (timeframe?: 'day' | 'week' | 'month') => string;
  emotionalSovereigntyReport: (dateRange?: [DatabaseTimestamp, DatabaseTimestamp]) => string;
  userEmpowermentMetrics: (userId?: string, cohort?: string) => string;
}

// ============================================================================
// QUERY BUILDER IMPLEMENTATION
// ============================================================================

class SupabaseQueryBuilder<T extends TableName> implements QueryBuilder<T> {
  private query: {
    table: T;
    columns: string[];
    conditions: string[];
    joins: string[];
    orderClauses: string[];
    limitClause?: number;
  };

  constructor(public table: T) {
    this.query = {
      table,
      columns: ['*'],
      conditions: [],
      joins: [],
      orderClauses: [],
    };
  }

  select(columns?: string[]): QueryBuilder<T> {
    if (columns) {
      this.query.columns = columns;
    }
    return this;
  }

  where(filters: Partial<QueryFilters>): QueryBuilder<T> {
    const conditions = this.buildConditions(filters);
    this.query.conditions.push(...conditions);
    return this;
  }

  join<U extends TableName>(
    targetTable: U, 
    condition: string
  ): JoinQueryBuilder<T, U> {
    this.query.joins.push(`JOIN ${targetTable} ON ${condition}`);
    return this as any; // Type assertion for simplicity
  }

  orderBy(column: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder<T> {
    this.query.orderClauses.push(`${column} ${direction.toUpperCase()}`);
    return this;
  }

  limit(count: number): QueryBuilder<T> {
    this.query.limitClause = count;
    return this;
  }

  toSQL(): string {
    const {
      table,
      columns,
      conditions,
      joins,
      orderClauses,
      limitClause,
    } = this.query;

    let sql = `SELECT ${columns.join(', ')} FROM ${table}`;
    
    if (joins.length > 0) {
      sql += ` ${joins.join(' ')}`;
    }
    
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    if (orderClauses.length > 0) {
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }
    
    if (limitClause) {
      sql += ` LIMIT ${limitClause}`;
    }

    return sql;
  }

  async execute(): Promise<TableRecord<T>[]> {
    // In real implementation, this would use Supabase client
    const sql = this.toSQL();
    console.log('Executing Query:', sql);
    
    // Placeholder for actual Supabase execution
    return [] as TableRecord<T>[];
  }

  private buildConditions(filters: Partial<QueryFilters>): string[] {
    const conditions: string[] = [];

    if (filters.user_id) {
      conditions.push(`user_id = '${filters.user_id}'`);
    }

    if (filters.session_id) {
      conditions.push(`session_id = '${filters.session_id}'`);
    }

    if (filters.prompt_type) {
      conditions.push(`prompt_type = '${filters.prompt_type}'`);
    }

    if (filters.trust_score_min !== undefined) {
      conditions.push(`trust_score >= ${filters.trust_score_min}`);
    }

    if (filters.trust_score_max !== undefined) {
      conditions.push(`trust_score <= ${filters.trust_score_max}`);
    }

    if (filters.date_from) {
      conditions.push(`created_at >= '${filters.date_from}'`);
    }

    if (filters.date_to) {
      conditions.push(`created_at <= '${filters.date_to}'`);
    }

    if (filters.emotional_threshold !== undefined) {
      conditions.push(`(awe_score + ownership_score + wonder_score + calm_score + power_score) / 5 >= ${filters.emotional_threshold}`);
    }

    if (filters.competitive_advantage_min !== undefined) {
      conditions.push(`competitive_advantage >= ${filters.competitive_advantage_min}`);
    }

    return conditions;
  }
}

// ============================================================================
// ANALYTICS QUERY GENERATOR
// ============================================================================

class SupabaseAnalytics implements AnalyticsQuery {
  
  /**
   * Sacred User Journey Analysis
   * Tracks complete user empowerment journey
   */
  userJourney(userId: string, dateRange?: [DatabaseTimestamp, DatabaseTimestamp]): string {
    let sql = `
      SELECT 
        uc.user_id,
        uc.name,
        uc.trust_score_current,
        uc.personalization_score,
        uc.churn_risk,
        sa.session_id,
        sa.start_time,
        sa.duration,
        sa.trust_delta,
        sa.emotional_depth,
        sa.awe_score,
        sa.ownership_score,
        sa.wonder_score,
        sa.calm_score,
        sa.power_score,
        ei.emotional_state,
        ei.confidence_level,
        tm.trust_score,
        tm.trust_trend
      FROM user_context uc
      LEFT JOIN session_analytics sa ON uc.user_id = sa.user_id
      LEFT JOIN emotional_intelligence ei ON sa.session_id = ei.session_id
      LEFT JOIN trust_metrics tm ON sa.session_id = tm.session_id
      WHERE uc.user_id = '${userId}'
    `;

    if (dateRange) {
      sql += ` AND sa.start_time BETWEEN '${dateRange[0]}' AND '${dateRange[1]}'`;
    }

    sql += ` ORDER BY sa.start_time DESC`;

    return sql;
  }

  /**
   * Revolutionary SparkSplit Analysis
   * Measures trust transparency and competitive advantage
   */
  sparkSplitAnalysis(sessionId?: string, dateRange?: [DatabaseTimestamp, DatabaseTimestamp]): string {
    let sql = `
      SELECT 
        sc.id,
        sc.session_id,
        sc.prompt_type,
        sc.trust_delta,
        sc.competitive_advantage,
        sc.trust_transparency_score,
        sc.emotional_education_score,
        sc.revolutionary_positioning,
        sc.sacred_reversal_passed,
        sc.user_empowerment_increased,
        sc.emotional_sovereignty_preserved,
        sc.user_selection,
        sc.time_to_selection,
        sc.would_refer,
        sc.viral_potential_score,
        cam.trust_transparency_advantage,
        cam.emotional_intelligence_advantage,
        cam.user_empowerment_advantage,
        cam.competitive_differentiation,
        cam.replication_difficulty,
        ttm.trust_impact_score,
        ttm.educational_value,
        ttm.makes_user_feel_seen,
        ttm.makes_user_feel_empowered,
        ttm.makes_user_feel_less_alone,
        ttm.builds_trust_with_dreams
      FROM sparksplit_comparisons sc
      LEFT JOIN competitive_advantage_metrics cam ON sc.id = cam.comparison_id
      LEFT JOIN trust_transparency_metrics ttm ON sc.id = ttm.comparison_id
    `;

    const conditions: string[] = [];

    if (sessionId) {
      conditions.push(`sc.session_id = '${sessionId}'`);
    }

    if (dateRange) {
      conditions.push(`sc.created_at BETWEEN '${dateRange[0]}' AND '${dateRange[1]}'`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` ORDER BY sc.created_at DESC`;

    return sql;
  }

  /**
   * Trust Evolution Analysis
   * Tracks trust score changes over time
   */
  trustEvolution(userId: string, timeframe: 'day' | 'week' | 'month' = 'week'): string {
    const dateFormat = {
      day: 'YYYY-MM-DD',
      week: 'YYYY-"W"WW',
      month: 'YYYY-MM'
    }[timeframe];

    return `
      SELECT 
        TO_CHAR(sa.start_time, '${dateFormat}') as period,
        COUNT(*) as session_count,
        AVG(sa.trust_score_before) as avg_trust_before,
        AVG(sa.trust_score_after) as avg_trust_after,
        AVG(sa.trust_delta) as avg_trust_delta,
        AVG(sa.emotional_depth) as avg_emotional_depth,
        AVG((sa.awe_score + sa.ownership_score + sa.wonder_score + sa.calm_score + sa.power_score) / 5) as avg_emotional_sovereignty,
        SUM(CASE WHEN sa.trust_delta > 0 THEN 1 ELSE 0 END) as positive_sessions,
        MAX(tm.trust_score) as peak_trust_score,
        STRING_AGG(DISTINCT tm.trust_trend, ', ') as trust_trends
      FROM session_analytics sa
      LEFT JOIN trust_metrics tm ON sa.session_id = tm.session_id
      WHERE sa.user_id = '${userId}'
        AND sa.start_time >= NOW() - INTERVAL '3 ${timeframe}s'
      GROUP BY period
      ORDER BY period ASC
    `;
  }

  /**
   * Competitive Advantage Report
   * Measures our revolutionary market position
   */
  competitiveAdvantage(timeframe: 'day' | 'week' | 'month' = 'week'): string {
    return `
      SELECT 
        TO_CHAR(sc.created_at, 'YYYY-MM-DD') as date,
        COUNT(*) as total_comparisons,
        AVG(sc.competitive_advantage) as avg_competitive_advantage,
        AVG(sc.trust_transparency_score) as avg_trust_transparency,
        AVG(sc.emotional_education_score) as avg_emotional_education,
        AVG(sc.revolutionary_positioning) as avg_revolutionary_positioning,
        SUM(CASE WHEN sc.user_selection = 'canai' THEN 1 ELSE 0 END) as canai_wins,
        SUM(CASE WHEN sc.user_selection = 'sterile' THEN 1 ELSE 0 END) as sterile_wins,
        SUM(CASE WHEN sc.would_refer = true THEN 1 ELSE 0 END) as referral_potential,
        AVG(sc.viral_potential_score) as avg_viral_potential,
        COUNT(CASE WHEN sc.sacred_reversal_passed = true THEN 1 END) as sacred_reversal_passes,
        COUNT(CASE WHEN sc.user_empowerment_increased = true THEN 1 END) as empowerment_increases,
        COUNT(CASE WHEN sc.emotional_sovereignty_preserved = true THEN 1 END) as sovereignty_preserved,
        AVG(cam.replication_difficulty) as avg_replication_difficulty,
        AVG(cam.competitive_moat_strength) as avg_moat_strength,
        AVG(cam.user_loyalty_impact) as avg_loyalty_impact
      FROM sparksplit_comparisons sc
      LEFT JOIN competitive_advantage_metrics cam ON sc.id = cam.comparison_id
      WHERE sc.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY date
      ORDER BY date DESC
    `;
  }

  /**
   * Emotional Sovereignty Report
   * Validates our commitment to user empowerment
   */
  emotionalSovereigntyReport(dateRange?: [DatabaseTimestamp, DatabaseTimestamp]): string {
    let sql = `
      SELECT 
        'trust_scores' as metric_category,
        COUNT(*) as total_records,
        AVG(trust_score) as average_score,
        COUNT(CASE WHEN trust_score >= 4.2 THEN 1 END) as threshold_met,
        ROUND(COUNT(CASE WHEN trust_score >= 4.2 THEN 1 END) * 100.0 / COUNT(*), 2) as threshold_percentage
      FROM (
        SELECT trust_score FROM session_analytics WHERE trust_score_after IS NOT NULL
        UNION ALL
        SELECT trust_score FROM trust_metrics WHERE trust_score IS NOT NULL
        UNION ALL
        SELECT trust_score_current as trust_score FROM user_context WHERE trust_score_current IS NOT NULL
      ) trust_data
      
      UNION ALL
      
      SELECT 
        'emotional_sovereignty' as metric_category,
        COUNT(*) as total_records,
        AVG((awe_score + ownership_score + wonder_score + calm_score + power_score) / 5) as average_score,
        COUNT(CASE WHEN (awe_score + ownership_score + wonder_score + calm_score + power_score) / 5 >= 0.7 THEN 1 END) as threshold_met,
        ROUND(COUNT(CASE WHEN (awe_score + ownership_score + wonder_score + calm_score + power_score) / 5 >= 0.7 THEN 1 END) * 100.0 / COUNT(*), 2) as threshold_percentage
      FROM session_analytics 
      WHERE awe_score IS NOT NULL AND ownership_score IS NOT NULL
      
      UNION ALL
      
      SELECT 
        'sacred_reversal_compliance' as metric_category,
        COUNT(*) as total_records,
        AVG(CASE WHEN sacred_reversal_passed THEN 1.0 ELSE 0.0 END) as average_score,
        COUNT(CASE WHEN sacred_reversal_passed = true THEN 1 END) as threshold_met,
        ROUND(COUNT(CASE WHEN sacred_reversal_passed = true THEN 1 END) * 100.0 / COUNT(*), 2) as threshold_percentage
      FROM sparksplit_comparisons
      
      UNION ALL
      
      SELECT 
        'user_empowerment' as metric_category,
        COUNT(*) as total_records,
        AVG(CASE WHEN user_empowerment_increased THEN 1.0 ELSE 0.0 END) as average_score,
        COUNT(CASE WHEN user_empowerment_increased = true THEN 1 END) as threshold_met,
        ROUND(COUNT(CASE WHEN user_empowerment_increased = true THEN 1 END) * 100.0 / COUNT(*), 2) as threshold_percentage
      FROM sparksplit_comparisons
    `;

    if (dateRange) {
      // Note: This would need more complex logic to apply date filters to all subqueries
      sql += ` -- Date range filter would be applied to each subquery`;
    }

    return sql;
  }

  /**
   * User Empowerment Metrics
   * Measures how well we're amplifying user potential
   */
  userEmpowermentMetrics(userId?: string, cohort?: string): string {
    let sql = `
      SELECT 
        uc.user_id,
        uc.name,
        uc.total_sessions,
        uc.trust_score_current,
        uc.personalization_score,
        uc.churn_risk,
        uc.engagement_trend,
        COUNT(sa.session_id) as actual_sessions,
        AVG(sa.emotional_depth) as avg_emotional_depth,
        AVG((sa.awe_score + sa.ownership_score + sa.wonder_score + sa.calm_score + sa.power_score) / 5) as avg_emotional_sovereignty,
        AVG(sa.trust_delta) as avg_trust_improvement,
        SUM(CASE WHEN sa.trust_delta > 0 THEN 1 ELSE 0 END) as trust_building_sessions,
        COUNT(CASE WHEN ei.confidence_level > 0.7 THEN 1 END) as high_confidence_sessions,
        AVG(ei.confidence_level) as avg_confidence_level,
        STRING_AGG(DISTINCT ei.emotional_state, ', ') as emotional_journey,
        COUNT(sc.id) as sparksplit_participations,
        SUM(CASE WHEN sc.user_selection = 'canai' THEN 1 ELSE 0 END) as canai_preferences,
        AVG(sc.competitive_advantage) as avg_competitive_advantage_exposure,
        COUNT(CASE WHEN sc.would_refer = true THEN 1 END) as referral_intentions
      FROM user_context uc
      LEFT JOIN session_analytics sa ON uc.user_id = sa.user_id
      LEFT JOIN emotional_intelligence ei ON sa.session_id = ei.session_id
      LEFT JOIN sparksplit_comparisons sc ON sa.session_id = sc.session_id
    `;

    const conditions: string[] = [];

    if (userId) {
      conditions.push(`uc.user_id = '${userId}'`);
    }

    if (cohort) {
      conditions.push(`sa.cohort = '${cohort}'`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += `
      GROUP BY uc.user_id, uc.name, uc.total_sessions, uc.trust_score_current, 
               uc.personalization_score, uc.churn_risk, uc.engagement_trend
      ORDER BY avg_emotional_sovereignty DESC, avg_trust_improvement DESC
    `;

    return sql;
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Creates a new query builder for the specified table
 * Sacred Reversal Test: Does this make database operations feel empowering?
 */
export function createQueryBuilder<T extends TableName>(table: T): QueryBuilder<T> {
  return new SupabaseQueryBuilder(table);
}

/**
 * Creates analytics query generator
 * Trust Building: Every query builds confidence in our data
 */
export function createAnalytics(): AnalyticsQuery {
  return new SupabaseAnalytics();
}

// ============================================================================
// COMMON QUERY PATTERNS
// ============================================================================

export const CommonQueries = {
  /**
   * Find users with high trust scores (emotional sovereignty compliant)
   */
  highTrustUsers: () => createQueryBuilder('user_context')
    .where({ trust_score_min: 4.2 })
    .orderBy('trust_score_current', 'desc'),

  /**
   * Recent SparkSplit comparisons showing our competitive advantage
   */
  recentSparkSplits: (days: number = 7) => createQueryBuilder('sparksplit_comparisons')
    .where({ 
      date_from: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
      competitive_advantage_min: 0.7
    })
    .orderBy('created_at', 'desc'),

  /**
   * Users at risk of churn (emotional sovereignty concern)
   */
  churnRiskUsers: () => createQueryBuilder('user_context')
    .where({ trust_score_max: 4.0 })
    .orderBy('churn_risk', 'desc'),

  /**
   * Sessions with high emotional sovereignty scores
   */
  empoweredSessions: () => createQueryBuilder('session_analytics')
    .where({ emotional_threshold: 0.7 })
    .orderBy('emotional_depth', 'desc'),

  /**
   * Revolutionary advantage demonstrators
   */
  revolutionaryWins: () => createQueryBuilder('sparksplit_comparisons')
    .where({ competitive_advantage_min: 0.8 })
    .orderBy('revolutionary_positioning', 'desc'),
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates query results for emotional sovereignty compliance
 */
export function validateQueryForEmotionalSovereignty(results: any[]): {
  compliant: boolean;
  trustScore: number;
  emotionalSovereignty: number;
  violations: string[];
} {
  const violations: string[] = [];
  let totalTrustScore = 0;
  let totalEmotionalScore = 0;
  let trustCount = 0;
  let emotionalCount = 0;

  for (const record of results) {
    // Validate trust scores
    if (record.trust_score !== undefined) {
      totalTrustScore += record.trust_score;
      trustCount++;
      
      if (!validateTrustScore(record.trust_score)) {
        violations.push(`Trust score ${record.trust_score} below threshold 4.2`);
      }
    }

    // Validate emotional sovereignty
    if (record.awe_score !== undefined) {
      const emotionalScore = calculateEmotionalSovereigntyScore(record);
      totalEmotionalScore += emotionalScore;
      emotionalCount++;
      
      if (emotionalScore < 0.7) {
        violations.push(`Emotional sovereignty score ${emotionalScore.toFixed(2)} below threshold 0.7`);
      }
    }

    // Validate sacred reversal test
    if (record.sacred_reversal_passed === false) {
      violations.push('Sacred reversal test failed');
    }

    if (record.user_empowerment_increased === false) {
      violations.push('User empowerment not increased');
    }

    if (record.emotional_sovereignty_preserved === false) {
      violations.push('Emotional sovereignty not preserved');
    }
  }

  return {
    compliant: violations.length === 0,
    trustScore: trustCount > 0 ? totalTrustScore / trustCount : 0,
    emotionalSovereignty: emotionalCount > 0 ? totalEmotionalScore / emotionalCount : 0,
    violations,
  };
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export {
  SupabaseQueryBuilder,
  SupabaseAnalytics,
}; 