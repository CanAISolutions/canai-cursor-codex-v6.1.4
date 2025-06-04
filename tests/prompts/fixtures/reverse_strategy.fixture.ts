/**
 * tests/prompts/fixtures/reverse_strategy.fixture.ts
 * 
 * Test fixtures for reverse strategy MCP testing
 */

export const validReverseStrategyInput = {
  promptType: 'reverse_strategy',
  targetOutcome: 'Increase revenue by 30% within 6 months',
  currentState: 'Small business with flat growth over the past year',
  constraints: [
    'Limited marketing budget of $5000 per month', 
    'Team of 5 people', 
    'No existing digital marketing infrastructure'
  ],
  timeline: '6 months',
  tone: 'professional'
};

export const invalidReverseStrategyInput = {
  promptType: 'reverse_strategy',
  // Missing required fields
  tone: 'professional'
};

export const partialReverseStrategyInput = {
  promptType: 'reverse_strategy',
  targetOutcome: 'Increase revenue by 30% within 6 months',
  // Missing other fields that should be inferred
};

export const expectedReverseStrategyOutput = {
  strategy: {
    steps: [
      'Conduct market analysis to identify high-potential customer segments',
      'Develop targeted digital marketing campaign focused on identified segments',
      'Implement CRM system to track customer interactions and sales pipeline',
      'Create referral program for existing customers',
      'Optimize pricing strategy based on competitor analysis'
    ],
    milestones: [
      'Month 1: Complete market analysis and segment identification',
      'Month 2: Launch initial digital marketing campaign',
      'Month 3: Implement CRM system and begin tracking metrics',
      'Month 4: Launch customer referral program',
      'Month 5: Adjust marketing and sales strategy based on data',
      'Month 6: Achieve 30% revenue increase target'
    ],
    dependencies: [
      'Market analysis must precede marketing campaign',
      'CRM implementation requires sales team training',
      'Referral program needs existing customer engagement strategy'
    ],
    risks: [
      'Market conditions may shift during implementation',
      'Limited team bandwidth could delay implementation',
      'Competitors may respond with counteroffers'
    ],
    mitigations: [
      'Regular market monitoring and agile strategy adjustments',
      'Prioritize tasks based on revenue impact',
      'Differentiate offering based on unique value proposition'
    ]
  },
  timeline: [
    'Weeks 1-2: Market research and analysis',
    'Weeks 3-4: Strategy development and resource allocation',
    'Weeks 5-8: Initial implementation of marketing campaigns',
    'Weeks 9-12: CRM implementation and training',
    'Weeks 13-16: Launch of referral program and monitoring',
    'Weeks 17-20: Strategy refinement based on initial results',
    'Weeks 21-24: Final push and goal achievement'
  ],
  resources: [
    'Marketing budget: $5,000/month',
    'Team time allocation: 25% to new initiatives',
    'CRM software implementation: $2,000 one-time cost',
    'Digital marketing tools: $500/month',
    'Analytics and reporting tools: $300/month'
  ],
  success: [
    '30% increase in monthly revenue',
    'Increase in customer acquisition rate by 25%',
    'Reduction in customer acquisition cost by 15%',
    'Improved customer retention rate by 10%',
    'Established digital marketing presence with measurable ROI'
  ]
};

export const mockValidationResult = {
  isValid: true,
  errors: [],
  warnings: []
};

export const mockInvalidValidationResult = {
  isValid: false,
  errors: ['Missing required field: targetOutcome', 'Missing required field: currentState', 'Missing required field: constraints'],
  warnings: []
};

export const mockScoreResult = {
  overall: 8.5,
  breakdown: {
    clarity: 8.7,
    structure: 8.5,
    completeness: 8.3,
    toneMatch: 8.6,
    emotionalDepth: 8.4
  },
  feedback: 'Reverse strategy effectively maps the path from desired outcome to current state.'
};

export const mockSchema = {
  requiredFields: ['targetOutcome', 'currentState', 'constraints', 'timeline', 'tone'],
  fieldTypes: {
    targetOutcome: 'string',
    currentState: 'string',
    constraints: 'array',
    timeline: 'string',
    tone: 'string'
  },
  validTones: ['professional', 'conversational', 'urgent', 'friendly', 'authoritative']
}; 