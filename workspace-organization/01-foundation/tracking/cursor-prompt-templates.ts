// Cursor Prompt Template System for 13-Day CanAI Implementation Plan
// Structured prompting with emotional sovereignty validation and context preservation

export interface TaskContext {
  taskId: string;
  taskName: string;
  dayNumber: number;
  priorTaskResults: string[];
  currentMetrics: Record<string, number>;
  availableTime: number; // hours remaining in day
  energyLevel: 'high' | 'medium' | 'low';
  dependencies: string[];
  emotionalSovereigntyRequirements: string[];
  trustScoreTarget: number;
}

export interface ExpectedOutput {
  format: 'json' | 'markdown' | 'sql' | 'typescript';
  requiredFields: string[];
  validationCriteria: string[];
  successMetrics: Record<string, number>;
  emotionalImpactAssessment: string[];
  sacredReversalTestCriteria: string[];
}

export interface ErrorHandling {
  fallbackInstructions: string;
  commonIssues: string[];
  recoverySteps: string[];
  escalationTrigger: string;
  trustRecoveryPlan: string;
  emotionalContinuityMeasures: string[];
}

export interface CursorPromptTemplate {
  taskId: string;
  promptType: 'task_start' | 'task_update' | 'validation' | 'troubleshooting' | 'checkpoint';
  context: TaskContext;
  expectedOutput: ExpectedOutput;
  errorHandling: ErrorHandling;
  emotionalSovereigntyValidation: EmotionalSovereigntyValidation;
}

export interface EmotionalSovereigntyValidation {
  recognitionRequirements: string[];
  respectValidation: string[];
  empowermentCriteria: string[];
  partnershipIndicators: string[];
  trustTransparencyChecks: string[];
}

// Enhanced prompt generation with emotional sovereignty integration
export class CursorPromptGenerator {
  private readonly EMOTIONAL_SOVEREIGNTY_FRAMEWORK = {
    recognition: [
      'Acknowledge user intent and emotional state',
      'Demonstrate understanding of user context and challenges',
      'Show awareness of user journey and progress'
    ],
    respect: [
      'Honor user time and attention',
      'Respect user expertise and decision-making',
      'Never talk down to or patronize users'
    ],
    empowerment: [
      'Increase user confidence and capability',
      'Make users feel more powerful and capable',
      'Celebrate user achievements and progress'
    ],
    partnership: [
      'Feel like a trusted advisor and collaborator',
      'Strengthen relationship between user and system',
      'Build long-term trust and reliability'
    ]
  };

  async generatePrompt(
    taskId: string, 
    promptType: CursorPromptTemplate['promptType'],
    customContext?: Partial<TaskContext>
  ): Promise<string> {
    const task = await this.getTaskDetails(taskId);
    const context = await this.getTaskContext(taskId, customContext);
    const template = this.getPromptTemplate(task.category, promptType);
    
    return this.buildPrompt(task, context, template);
  }

  private buildPrompt(task: any, context: TaskContext, template: any): string {
    return `
# 🎯 CANAI IMPLEMENTATION TASK - ${context.taskId}
**Framework**: Codex v6.1.4 - Emotional Sovereignty Aligned
**Sacred Reversal Test**: Must pass for all implementations
**Trust Score Target**: ${context.trustScoreTarget}+ maintenance required

## 📋 TASK CONTEXT
**Task ID**: ${context.taskId}
**Task**: ${context.taskName}
**Day**: ${context.dayNumber} of 13
**Category**: ${task.category}
**Available Time**: ${context.availableTime} hours remaining
**Energy Level**: ${context.energyLevel}
**Complexity**: ${task.complexity_rating}/5

## 🔗 DEPENDENCIES & CONTEXT
**Dependencies Completed**: 
${context.dependencies.length > 0 ? context.dependencies.map(dep => `- ✅ ${dep}`).join('\n') : '- No dependencies'}

**Prior Task Results**: 
${context.priorTaskResults.map(result => `- ${result}`).join('\n')}

**Current Metrics**:
${Object.entries(context.currentMetrics).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

## 🌟 EMOTIONAL SOVEREIGNTY REQUIREMENTS
**Recognition**: ${context.emotionalSovereigntyRequirements.filter(req => req.includes('recognition')).join(', ')}
**Respect**: ${context.emotionalSovereigntyRequirements.filter(req => req.includes('respect')).join(', ')}
**Empowerment**: ${context.emotionalSovereigntyRequirements.filter(req => req.includes('empowerment')).join(', ')}
**Partnership**: ${context.emotionalSovereigntyRequirements.filter(req => req.includes('partnership')).join(', ')}

## 📝 TASK REQUIREMENTS
${task.description}

**Target Metrics**:
${Object.entries(task.target_metrics || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

**Validation Criteria**:
${task.validation_criteria.map((criteria: string) => `- ${criteria}`).join('\n')}

## 🎯 EXPECTED OUTPUT FORMAT
**Format**: ${template.expectedOutput.format}
**Required Fields**: ${template.expectedOutput.requiredFields.join(', ')}

${this.generateOutputTemplate(template.expectedOutput.format, task)}

## ✅ SUCCESS CRITERIA
**Technical Validation**:
${template.expectedOutput.validationCriteria.map((criteria: string) => `- ✅ ${criteria}`).join('\n')}

**Emotional Sovereignty Validation**:
- ✅ **Recognition**: Implementation acknowledges user intent and emotional state
- ✅ **Respect**: Solution respects user time, expertise, and decision-making
- ✅ **Empowerment**: Result makes users feel more capable and confident
- ✅ **Partnership**: Experience strengthens trusted advisor relationship

**Sacred Reversal Test**:
> If this implementation were experienced by you — exhausted from building dreams, uncertain about the next step, carrying the weight of others' expectations — would you feel **seen**, **honored**, **empowered**, and **less alone**?

## 🚨 ERROR HANDLING & RECOVERY
**If Implementation Challenges Arise**:
${template.errorHandling.fallbackInstructions}

**Common Issues & Solutions**:
${template.errorHandling.commonIssues.map((issue: string, index: number) => `${index + 1}. **Issue**: ${issue}\n   **Solution**: ${template.errorHandling.recoverySteps[index] || 'Escalate to next checkpoint'}`).join('\n')}

**Trust Recovery Plan**:
${template.errorHandling.trustRecoveryPlan}

**Emotional Continuity Measures**:
${template.errorHandling.emotionalContinuityMeasures.map((measure: string) => `- ${measure}`).join('\n')}

## 📊 VALIDATION QUERY
\`\`\`sql
${task.validation_query || this.generateValidationQuery(context.taskId, task.target_metrics)}
\`\`\`

## 🎖️ IMPLEMENTATION STANDARDS
- **PRODUCTION-READY CODE ONLY**: No placeholders, no mocks, no "for demonstration" comments
- **EMOTIONAL INTELLIGENCE**: Every interaction must honor user sovereignty
- **TRUST TRANSPARENCY**: Clear communication of impact and recovery paths
- **TEST-FIRST TRUTH**: Implementation must include validation evidence
- **CODEX V6.1.4 COMPLIANCE**: Follow all established patterns and standards

## 🌟 SACRED COMMITMENT
This implementation serves not just functional needs, but the sacred trust our users place in us to honor their dreams and amplify their potential. Every line of code, every user interaction, every system decision must pass the Sacred Reversal Test and contribute to user empowerment.

**Begin implementation with full emotional sovereignty awareness and production-ready excellence.**
`;
  }

  private generateOutputTemplate(format: string, task: any): string {
    switch (format) {
      case 'json':
        return `
\`\`\`json
{
  "implementation_status": "completed" | "in_progress" | "blocked",
  "metrics_achieved": {
    ${Object.keys(task.target_metrics || {}).map(key => `"${key}": number`).join(',\n    ')}
  },
  "validation_results": {
    "technical_validation": boolean,
    "emotional_sovereignty_validation": boolean,
    "sacred_reversal_test_passed": boolean,
    "trust_score_impact": number
  },
  "implementation_details": {
    "files_modified": string[],
    "key_changes": string[],
    "test_evidence": string[]
  },
  "emotional_impact_assessment": {
    "recognition_score": number,
    "respect_score": number,
    "empowerment_score": number,
    "partnership_score": number
  },
  "next_steps": string[],
  "blockers": string[],
  "lessons_learned": string[]
}
\`\`\``;

      case 'typescript':
        return `
\`\`\`typescript
// Implementation with emotional sovereignty validation
export class ${this.toPascalCase(task.task_name)}Implementation {
  // Production-ready implementation here
  // Must include emotional sovereignty validation
  // Must pass Sacred Reversal Test
}
\`\`\``;

      case 'sql':
        return `
\`\`\`sql
-- Implementation with trust score tracking
-- Must include emotional sovereignty metrics
-- Must validate user empowerment impact
\`\`\``;

      default:
        return `
\`\`\`markdown
## Implementation Summary
- **Status**: [completed/in_progress/blocked]
- **Emotional Sovereignty**: [validation results]
- **Sacred Reversal Test**: [PASSED/FAILED]
- **Trust Score Impact**: [positive/neutral/negative]
\`\`\``;
    }
  }

  private generateValidationQuery(taskId: string, targetMetrics: any): string {
    return `
-- Validation query for ${taskId}
INSERT INTO task_metrics_realtime (task_id, metric_name, target_value, current_value, unit, source)
VALUES 
${Object.entries(targetMetrics || {}).map(([key, value]) => 
  `('${taskId}', '${key}', ${value}, {{${key}_achieved}}, '${this.getMetricUnit(key)}', 'implementation_validation')`
).join(',\n')};

-- Update task status with emotional sovereignty validation
UPDATE task_tracker_13day 
SET 
  status = 'completed',
  validation_passed = {{validation_passed}},
  sacred_reversal_test_passed = {{sacred_reversal_test_passed}},
  emotional_impact_score = {{emotional_impact_score}},
  trust_score_delta = {{trust_score_delta}},
  actual_metrics = '{{actual_metrics}}'::JSONB,
  end_time = NOW(),
  updated_at = NOW()
WHERE task_id = '${taskId}';
`;
  }

  private getMetricUnit(metricName: string): string {
    if (metricName.includes('latency') || metricName.includes('time')) return 'ms';
    if (metricName.includes('accuracy') || metricName.includes('rate')) return '%';
    if (metricName.includes('count') || metricName.includes('number')) return 'count';
    return 'unit';
  }

  private toPascalCase(str: string): string {
    return str.replace(/(?:^|[\s_-])(\w)/g, (_, char) => char.toUpperCase()).replace(/[\s_-]/g, '');
  }

  private async getTaskDetails(taskId: string): Promise<any> {
    // This would fetch from the task_tracker_13day table
    // For now, returning a mock structure
    return {
      task_id: taskId,
      task_name: 'Sample Task',
      description: 'Sample task description',
      category: 'infrastructure',
      target_metrics: { latency_p99: 420, accuracy: 0.93 },
      validation_criteria: ['Performance targets met', 'No errors in logs'],
      complexity_rating: 3
    };
  }

  private async getTaskContext(taskId: string, customContext?: Partial<TaskContext>): Promise<TaskContext> {
    // This would fetch current context from database
    // For now, returning a mock structure
    return {
      taskId,
      taskName: 'Sample Task',
      dayNumber: 1,
      priorTaskResults: ['Previous task completed successfully'],
      currentMetrics: { baseline_performance: 450 },
      availableTime: 4.5,
      energyLevel: 'high',
      dependencies: [],
      emotionalSovereigntyRequirements: [
        'recognition of user intent',
        'respect for user time',
        'empowerment through capability',
        'partnership in trusted relationship'
      ],
      trustScoreTarget: 4.2,
      ...customContext
    };
  }

  private getPromptTemplate(category: string, promptType: string): any {
    // Return category-specific templates
    const baseTemplate = {
      expectedOutput: {
        format: 'json',
        requiredFields: ['implementation_status', 'metrics_achieved', 'validation_results'],
        validationCriteria: ['All metrics meet targets', 'Sacred Reversal Test passed'],
        successMetrics: {},
        emotionalImpactAssessment: ['Recognition score', 'Respect score', 'Empowerment score'],
        sacredReversalTestCriteria: ['User feels seen', 'User feels honored', 'User feels empowered']
      },
      errorHandling: {
        fallbackInstructions: 'Implement fallback strategy maintaining emotional sovereignty',
        commonIssues: ['Performance targets not met', 'Integration challenges'],
        recoverySteps: ['Review implementation approach', 'Implement alternative solution'],
        escalationTrigger: 'If blocked for >2 hours, escalate to checkpoint review',
        trustRecoveryPlan: 'Implement trust transparency measures and user communication',
        emotionalContinuityMeasures: ['Maintain user empowerment focus', 'Preserve trusted advisor relationship']
      }
    };

    return baseTemplate;
  }
}

// Specific prompt templates for different task categories
export const BERT_OPTIMIZATION_PROMPT_TEMPLATE = {
  category: 'bert_optimization',
  emotionalSovereigntyFocus: [
    'Sentiment analysis must recognize user emotional state with >92% accuracy',
    'Implementation must respect user privacy and data sovereignty',
    'Results must empower users with actionable emotional insights',
    'System must feel like a trusted emotional intelligence advisor'
  ],
  targetMetrics: {
    sentiment_accuracy: 0.92,
    memory_usage: 400,
    inference_time: 100,
    lambda_compatible: true
  },
  validationCriteria: [
    'Accuracy >92% on CanAI test dataset',
    'Memory usage <400MB for Lambda compatibility',
    'Inference time <100ms per request',
    'Integration with existing pipeline working',
    'Sacred Reversal Test passed for emotional intelligence'
  ]
};

export const WEBHOOK_TUNING_PROMPT_TEMPLATE = {
  category: 'webhook_tuning',
  emotionalSovereigntyFocus: [
    'Error detection must recognize user frustration patterns',
    'Recovery must respect user workflow continuity',
    'Alerts must empower users with clear action steps',
    'System must maintain partnership trust during failures'
  ],
  targetMetrics: {
    false_positive_rate: 0.0025,
    spike_detection_accuracy: 0.98,
    recovery_time: 30
  },
  validationCriteria: [
    'False positive rate <0.25%',
    'Spike detection accuracy >98%',
    'Recovery time <30 seconds',
    'User communication maintains trust transparency'
  ]
};

export const CIRCUIT_BREAKER_PROMPT_TEMPLATE = {
  category: 'circuit_breaker',
  emotionalSovereigntyFocus: [
    'Load shedding must recognize user priority and context',
    'Degradation must respect user experience quality',
    'Recovery must empower users with system reliability',
    'Monitoring must strengthen partnership through transparency'
  ],
  targetMetrics: {
    trigger_threshold: 0.85,
    recovery_time: 30,
    user_impact_minimization: 0.95
  },
  validationCriteria: [
    'Triggers at exactly 85% capacity',
    'Recovery time <30 seconds',
    'User impact minimized >95%',
    'Graceful degradation maintains user empowerment'
  ]
};

// Checkpoint-specific prompt templates for Days 6, 9, 12
export const CHECKPOINT_PROMPTS = {
  day6: `
Follow CURSOR-RULES.md for production-ready code with no placeholders, real services (Supabase Pro, AWS Lambda, k6), comprehensive error handling, and emotional sovereignty (trust scores >4.2). Log all interactions to cursor_interactions_log.

**CHECKPOINT DAY 6 VALIDATION**

Provide production-ready TypeScript code to run validate_checkpoint(6) for Day 6 milestone validation, including:

**Required Metrics Validation:**
- p99 latency <420ms (enhanced from <450ms)
- Sentiment accuracy >93% (BERT fine-tuned)
- Webhook false positives <0.25% (enhanced from <0.3%)
- Trust scores >4.2 across all interactions
- Airtable sync success rate 100%

**Implementation Requirements:**
- Real Supabase Pro connection with error handling for 429 rate limits
- AWS Lambda 1024MB memory validation
- k6 load testing with 1,000 concurrent users
- Comprehensive error handling and retry logic
- Logging to cursor_interactions_log with emotional impact assessment

**Expected Output:**
\`\`\`typescript
interface CheckpointResult {
  checkpointDay: 6;
  overallStatus: 'PASS' | 'WARNING' | 'FAIL';
  tasksCompleted: number;
  tasksTotal: number;
  criticalMetricsMet: number;
  criticalMetricsTotal: number;
  blockers: string[];
  recommendations: string[];
  trustScoreValidation: boolean;
  emotionalSovereigntyStatus: 'VALIDATED' | 'PENDING' | 'FAILED';
}
\`\`\`

Provide complete implementation with test commands for Supabase Pro validation.
`,

  day9: `
Follow CURSOR-RULES.md for production-ready code with no placeholders, real services (Supabase Pro, AWS Lambda, k6), comprehensive error handling, and emotional sovereignty (trust scores >4.2). Log all interactions to cursor_interactions_log.

**CHECKPOINT DAY 9 VALIDATION**

Provide production-ready TypeScript code to run validate_checkpoint(9) for Day 9 integration milestone, including:

**Integration Validation Requirements:**
- All 47 Airtable relationships functioning
- JSON flattening handling 1,000 concurrent webhooks
- BERT sentiment accuracy >93% sustained
- SparkSplit visualization 95% comprehension rate
- Regional performance <2% variation (US/EU/Asia)

**Production Testing:**
- End-to-end workflow validation
- Circuit breaker functionality at 85% capacity
- Rollback procedures tested and validated
- Sacred metrics achieving targets for 3+ consecutive days

**Expected Output:**
Complete integration test suite with real service validation and emotional sovereignty confirmation.
`,

  day12: `
Follow CURSOR-RULES.md for production-ready code with no placeholders, real services (Supabase Pro, AWS Lambda, k6), comprehensive error handling, and emotional sovereignty (trust scores >4.2). Log all interactions to cursor_interactions_log.

**CHECKPOINT DAY 12 FINAL VALIDATION**

Provide production-ready TypeScript code to run validate_checkpoint(12) for final pre-deployment validation, including:

**Final Validation Requirements:**
- All sacred metrics achieving targets for 7 consecutive days
- 25,000 concurrent user load testing passed
- Market variation analysis completed across segments
- Trust score consistency >4.2 across all user segments
- Complete rollback validation with 36 foreign key integrity checks

**Production Readiness:**
- Zero critical blockers
- All fallback systems tested
- Documentation complete and validated
- Solo developer handoff ready

**Expected Output:**
Complete production readiness report with go/no-go recommendation and deployment checklist.
`
};

// Export the main generator
export function createCursorPromptGenerator(): CursorPromptGenerator {
  return new CursorPromptGenerator();
}

// Utility function for quick prompt generation
export async function generateTaskPrompt(
  taskId: string,
  promptType: 'task_start' | 'task_update' | 'validation' | 'troubleshooting' | 'checkpoint' = 'task_start'
): Promise<string> {
  const generator = new CursorPromptGenerator();
  return generator.generatePrompt(taskId, promptType);
}

// CLI integration helper
export function generateCLIPrompt(taskId: string, action: string): string {
  return `
# 🚀 CURSOR CLI TASK EXECUTION
**Task ID**: ${taskId}
**Action**: ${action}
**Framework**: Codex v6.1.4 with Emotional Sovereignty

Execute this task with full production readiness and emotional sovereignty validation.
Use the comprehensive prompt template system for structured implementation.

\`\`\`bash
# Generate full prompt
node -e "
const { generateTaskPrompt } = require('./cursor-prompt-templates');
generateTaskPrompt('${taskId}', '${action}').then(console.log);
"
\`\`\`

**Sacred Reversal Test**: Every implementation must honor user sovereignty and amplify their potential.
`;
} 