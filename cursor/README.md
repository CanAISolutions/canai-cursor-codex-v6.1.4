# /cursor/ Folder — CanAI Copilot & Developer Guide

**Purpose:**  
This folder is the intelligence core of CanAI. It contains all system logic for customer experience orchestration, prompt refinement, spark evolution, memory handoff, and analytics feedback loops.  
It is designed for **AI-first development** and **human-AI collaboration** using tools like Cursor, GitHub Copilot, and GPT copilots.

---

## Folder Philosophy

- **AI-readable, modular, and Markdown-commented**  
- **Zero ambiguity** — every file must explain its intent, logic, and evolution path  
- **Codex-compliant** — all logic honors the CanAI Customer Experience Map and Memory Protocol  
- **Testable + Versionable** — prompt outputs and decisions must be auditable over time

---

## Key Files

| File | Purpose |
|------|---------|
| `agent-executor.ts` | Routes memory + spark data into final agent execution |
| `concept-spark.ts` | Generates Spark concepts based on user intent |
| `spark-feedback-widget.tsx` | UI logic to capture spark resonance feedback |
| `spark-save-trigger.ts` | Logic to log and recall saved sparks |
| `spark-conversion-trigger.ts` | Detects spark activation → monetization offer |
| `spark-quality-index.ts` | Benchmarks spark performance using engagement signals |
| `trust-timeline.ts` | Visual data transparency (Trust layer UI logic) |
| `transition-mapper.ts` | Emotional stage transitions and fallback logic |
| `self-evolve.ts` | Learns from patterns (e.g., overwhelm, revise loops) and adjusts system rules |
| `multimodal-parser.ts` | Handles voice/image/video input preprocessing |
| `context-engine.ts` | Adds trend, season, or location-based tuning to sparks |
| `integration-hub.ts` | Slack, Notion, Google export logic |
| `collaboration-engine.ts` | Supports co-creation with other users |
| `offline-sync.ts` | Enables offline session storage + sync backflow |
| `feedback-adaptation.ts` | Emotional feedback tagging + session-specific UI variations |

---

## Key Support Files (outside /cursor)

| File | Location | Purpose |
|------|----------|---------|
| `canai-customer-experience-map-BIBLE-FINAL.md` | `/docs/` | The master CX logic system — all flows derive from here |
| `cx-evolution-queue.md` | `/docs/` | Tracker for all enhancements, current + future |
| `cx-review-log.md` | `/docs/` | Auto-created GitHub issue to enforce quarterly audits |
| `klaviyo-triggers.json` | `/automations/` | Lifecycle follow-ups mapped to spark/session data |

---

## Dev Protocol for Cursor Copilots

1. **Always open** `canai-customer-experience-map-BIBLE-FINAL.md` in a Notepad  
2. **Before editing any logic**, check `cx-evolution-queue.md` to see if it's already scoped  
3. **All new logic** must:
   - Log inputs and actions to `SessionAnalytics`, `PromptLogs`, or `SparkResonanceLog[]`
   - Be wrapped with markdown comments explaining **what it does**, **why**, and **what files it touches**
4. **Never remove spark, emotion, or validation layers** — these are system-critical
5. **If stuck**, escalate via GitHub issue using label: `type:cx-evolution`

---

## Final Directive

> "We don't build flows. We build feelings.  
> Every logic branch is a conversation. Every spark is a trust moment.  
> The system must always feel alive, intelligent, and built *for them.*"

**Honor the emotional contract. Maintain the magic. Never break the dream.**

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
import { MetricCalculator } from './services/metric-calculator';
import { PromptLogs } from './types/prompt-logs';

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

