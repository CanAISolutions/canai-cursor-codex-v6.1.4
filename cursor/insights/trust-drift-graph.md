# TrustScore Drift Graph — Codex Phase 3.6.0

## What
This graph visualizes TrustScore drift, test pass/fail events, and emotional contract health across all DreamState enforcement layers.

## Why
- Enables proactive detection of trust decay, emotional drift, and operational risk
- Surfaces patterns by Codex Pillar and test type (core, validator, chaos, replay)
- Supports audit, remediation, and continuous improvement

## How
- Data sources: `/cursor/intelligence/coverage/trust-dashboard.md`, SessionAnalytics (mocked if live data unavailable)
- Updated weekly by CI or Make scenario (see Automation Hooks below)
- Grouped by:
  - Codex Pillar (Emotional UX, Trust, Fallback, etc.)
  - Test Type (core, validator, chaos, replay)
- Visual: Markdown table + placeholder for future chart/graph

---

## TrustScore Drift Table (Sample)

| Week       | Core Pass | Validator Pass | Chaos Pass | Replay Pass | TrustScore Mean | Drift Events | Notes |
|------------|-----------|---------------|------------|-------------|-----------------|-------------|-------|
| 2025-05-21 | 33/33     | 11/11         | 0/0        | 0/0         | 4.7             | 0           | All green |
| 2025-05-28 |           |               |            |             |                 |             |        |

---

## Automation Hooks (Planned)
- CI or Make scenario will auto-update this file weekly
- Future: Graphical chart, direct SessionAnalytics integration
- All updates must be Codex-auditable and emotionally safe

_Empowerment Through Ease. — CanAI Codex v6.1.4_ 