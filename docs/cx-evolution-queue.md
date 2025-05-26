# CanAI CX Evolution Queue  
**Path:** /docs/cx-evolution-queue.md  
**Purpose:** Tracks all planned, active, and completed enhancements to the CanAI Customer Experience System.  
**Governance:** Reviewed quarterly. Synced with GitHub Issues, Make triggers, and `/cursor/self-evolve.ts`.  

---

| ID | Feature | Status | Owner | File(s) | Notes |
|----|---------|--------|--------|---------|-------|
| CX-001 | Spark Resonance Feedback Layer | ✅ Complete | System | `/cursor/spark-feedback-widget.tsx`, `/cursor/concept-spark.ts` | Logged via `SparkResonanceLog[]` |
| CX-002 | Spark Save + Memory Recall | ✅ Complete | System | `/cursor/spark-save-trigger.ts` | Triggers lifecycle nudge if unused |
| CX-003 | Spark Flavor Learning | ✅ Complete | System | `/cursor/concept-spark.ts` | Adds `sparkFlavor[]` signal |
| CX-004 | Spark Library Page | ⏳ In Design | UI Lead | `/site/sparks-preview-gallery.md` | Needs dynamic CMS render logic |
| CX-005 | Spark Share + Attribution | ✅ Complete | System | `/cursor/spark-share.ts`, Web integration | Supports referrals |
| CX-006 | Spark Quality Benchmark | ✅ Complete | System | `/cursor/spark-quality-index.ts` | Internal performance grading |
| CX-007 | Spark Monetization (Microoffer) | ✅ Complete | System | `/cursor/spark-conversion-trigger.ts`, `/site/spark-microoffer-banner.tsx` | Uses `spark_mini_bundle` in Stripe |
| CX-008 | Spark Ownership Layer (NFT) | Planned | Research | `/cursor/spark-ip-registry.ts` | Not active yet |
| CX-009 | Visual Spark Enhancements | In Progress | Frontend | `/site/ux/spark-visual-cues.md` | Animate spark reveal |
| CX-010 | Emotional Escalation + Calm Mode | ✅ Complete | System | `/cursor/transition-mapper.ts` | `escalationRiskScore[]` logic |
| CX-011 | Contextual Awareness Engine | ✅ Complete | System | `/cursor/context-engine.ts` | Time + trend-sensitive spark tuning |
| CX-012 | Multi-Modal Input Parser | ✅ Complete | System | `/cursor/multimodal-parser.ts` | Accepts voice/image/video inputs |
| CX-013 | Community Preview Leaderboards | Phase 2 | CX Lead | `/site/community-previews.md` | Gamified spark badges |
| CX-014 | Lifecycle Follow-ups (Spark reuse) | ✅ Complete | System | `/automations/klaviyo-triggers.json` | Spark-based upsell flows |
| CX-015 | Living Document Compliance | ✅ Complete | System | `/docs/cx-review-log.md` | Auto-creates GitHub Issue via Make |

---

## Usage
- Every new CX idea gets a row, an ID, and a `Status`.
- Developers use this file to align code branches.
- Cursor copilots use it to preload relevant logic during prompt-assisted dev.

> If you're working on any output, refinement, feedback, lifecycle, or spark logic — check this file first.

