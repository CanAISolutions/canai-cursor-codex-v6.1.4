# Copilot Feedback Agent

## Purpose
The Copilot Feedback Agent monitors user interaction patterns and triggers suggestions or feedback to improve user engagement based on emotional resonance and output revisions.

### Key Features
- **Emotion Monitoring**: Detects when emotional tone is misaligned and suggests corrective action.
- **Revision Fatigue Detection**: Alerts users when high revisions indicate session stagnation.
- **Adaptive Feedback**: Tailored feedback suggestions to enhance session flow.

### Integration
The feedback system operates based on session data and triggers feedback suggestions automatically when thresholds are met.

---

## File Breakdown
- `copilot-feedback-engine.ts`: Main logic for evaluating session data and triggering feedback.
- `copilot-feedback-engine.spec.ts`: Unit tests for validating the feedback trigger conditions.
- `copilot-feedback-rules.jsonc`: Configuration file defining the conditions for triggering feedback.
- `behavior-contract.md`: Defines safe invocation and usage behavior for the feedback agent.
- `self-check-blocks.md`: Internal validation checklist to ensure correctness and consistency.
