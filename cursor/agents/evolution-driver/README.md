# Evolution Driver Agent

The Evolution Driver Agent is a core component of CanAI's self-evolving architecture, designed to analyze code patterns, propose refactoring improvements, and track code quality metrics over time.

## Features

- **Pattern Recognition**: Identifies recurring code patterns and potential areas for improvement
- **Refactoring Proposals**: Generates intelligent refactoring suggestions based on impact and complexity
- **Quality Tracking**: Monitors code quality metrics and trends over time
- **Self-Improvement**: Learns from successful and unsuccessful refactoring attempts

## Installation

```bash
npm install @canai/evolution-driver
```

## Usage

```typescript
import { EvolutionDriver } from '@canai/evolution-driver';

// Configure the driver
const config = {
  patternRecognitionEnabled: true,
  refactoringEnabled: true,
  qualityTrackingEnabled: true,
  selfImprovementEnabled: true,
  minQualityThreshold: 0.7,
  maxRefactoringComplexity: 0.8,
  learningRate: 0.1,
  proposalFrequency: 'daily'
};

// Initialize the driver
const driver = new EvolutionDriver(config);

// Analyze the system
const codebase = ['path/to/file1.ts', 'path/to/file2.ts'];
const proposals = await driver.analyzeSystem(codebase);

// Get quality metrics
const metrics = driver.getMetrics();
const belowThreshold = driver.getMetricsBelowThreshold();
```

## Architecture

The Evolution Driver consists of three main components:

1. **Pattern Analyzer**: Identifies code patterns and calculates their impact
   - Pattern detection algorithms
   - Impact assessment
   - Pattern categorization

2. **Refactor Proposer**: Generates and prioritizes refactoring proposals
   - Proposal generation
   - Impact vs. complexity analysis
   - Priority scoring

3. **Quality Tracker**: Monitors and analyzes code quality trends
   - Metric collection
   - Trend analysis
   - Threshold monitoring

## Configuration

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `patternRecognitionEnabled` | boolean | Enable pattern recognition | `true` |
| `refactoringEnabled` | boolean | Enable refactoring proposals | `true` |
| `qualityTrackingEnabled` | boolean | Enable quality tracking | `true` |
| `selfImprovementEnabled` | boolean | Enable learning from results | `true` |
| `minQualityThreshold` | number | Minimum quality threshold | `0.7` |
| `maxRefactoringComplexity` | number | Maximum refactoring complexity | `0.8` |
| `learningRate` | number | Rate of learning from results | `0.1` |
| `proposalFrequency` | string | Frequency of proposals | `'daily'` |

## API Reference

### EvolutionDriver

#### `constructor(config: EvolutionDriverConfig)`
Creates a new Evolution Driver instance with the specified configuration.

#### `async analyzeSystem(codebase: string[]): Promise<ImprovementProposal[]>`
Analyzes the codebase and generates improvement proposals.

#### `getMetrics(): EvolutionMetrics`
Returns current evolution metrics.

#### `getMetricsBelowThreshold(): string[]`
Returns metrics that are below the quality threshold.

#### `updateConfig(config: Partial<EvolutionDriverConfig>): void`
Updates the driver configuration.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint

# Format code
npm run format
```

## Testing

The Evolution Driver includes comprehensive tests for all components:

- Unit tests for each component
- Integration tests for the complete system
- Performance tests for pattern analysis
- Quality metric validation tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the repository or contact the CanAI team. 