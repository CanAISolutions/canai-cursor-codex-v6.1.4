# CanAI Cursor Codex - Metric Calculator

## Overview
The Metric Calculator is a core component of the CanAI Cursor Codex system, responsible for analyzing and calculating comprehensive metrics from prompt logs. It provides insights into user interactions, system performance, and areas for improvement.

## Features

### Core Metrics
- Session-level metrics (trust score, emotional depth, risk assessment)
- Time series analysis for trend detection
- Cohort comparison for user segmentation
- Prompt-specific metrics (confirmation rates, revision rates)
- Touchpoint effectiveness analysis
- Feature impact correlations
- Feedback heatmap generation
- Real-time dashboard state calculation

### Key Components

#### Session Metrics
- Trust score calculation
- Emotional depth analysis
- Risk level assessment
- Drop-off signal detection
- Override pattern tracking

#### Time Series Analysis
- Historical trend tracking
- Performance pattern identification
- Anomaly detection
- Seasonal variation analysis

#### Cohort Analysis
- User segmentation
- Behavior pattern comparison
- Success rate tracking
- Feature adoption metrics

#### Prompt Metrics
- Confirmation rate tracking
- Revision rate monitoring
- Tone conflict detection
- Confidence delta calculation

#### Touchpoint Analysis
- Feature usage tracking
- Effectiveness calculation
- User journey mapping
- Bottleneck identification

#### Feedback Analysis
- Field-level edit tracking
- Confidence gap analysis
- Tone distribution mapping
- Tuning requirement detection

## Usage

### Basic Usage
```typescript
import { MetricCalculator } from '../services/metric-calculator';
import { PromptLogs } from '../types/prompt-logs';

const calculator = new MetricCalculator();
const metrics = calculator.calculateMetrics(promptLogs);
```

### Running Tests
```bash
npm run test:metrics
```

## Configuration

### Thresholds
- Trust Score Threshold: 4.2
- Emotional Depth Threshold: 0.7
- Confirmation Rate Threshold: 0.85
- Override Rate Threshold: 0.15
- Tone Conflict Threshold: 0.1

### Risk Levels
- Low: Trust Score >= 4.2 && Emotional Depth >= 0.7
- Medium: Trust Score >= 3.36 && Emotional Depth >= 0.56
- High: Trust Score < 3.36 || Emotional Depth < 0.56

## Best Practices

1. **Regular Monitoring**
   - Run metrics calculation at regular intervals
   - Monitor trend changes
   - Set up alerts for threshold breaches

2. **Data Quality**
   - Ensure complete prompt logs
   - Validate data consistency
   - Handle missing data appropriately

3. **Performance Optimization**
   - Batch process large log sets
   - Cache frequently accessed metrics
   - Implement incremental updates

4. **Error Handling**
   - Implement graceful degradation
   - Log calculation errors
   - Provide fallback values

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Add tests
5. Submit a pull request

## License
Proprietary - CanAI Solutions

## Support
For support, please contact the CanAI Solutions team. 