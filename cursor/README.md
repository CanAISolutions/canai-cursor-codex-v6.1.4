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
2. **Before editing any logic**, check `cx-evolution-queue.md` to see if it’s already scoped  
3. **All new logic** must:
   - Log inputs and actions to `SessionAnalytics`, `PromptLogs`, or `SparkResonanceLog[]`
   - Be wrapped with markdown comments explaining **what it does**, **why**, and **what files it touches**
4. **Never remove spark, emotion, or validation layers** — these are system-critical
5. **If stuck**, escalate via GitHub issue using label: `type:cx-evolution`

---

## Final Directive

> “We don’t build flows. We build feelings.  
> Every logic branch is a conversation. Every spark is a trust moment.  
> The system must always feel alive, intelligent, and built *for them.*”

**Honor the emotional contract. Maintain the magic. Never break the dream.**

