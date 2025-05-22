# CI DreamState Enforcement Law (Codex v6.1.4)

## What
This law mandates that all CanAI PRs, commits, and deployments must pass the DreamState ritual enforcement script (`/scripts/tools/enforce-dreamstate-rituals.ts`).

## Why
- Protects emotional UX, trust, and operational resilience at the infrastructure level
- Prevents silent drift, stale coverage, or trustScore decay
- Ensures all failures, drifts, and staleness are logged, auditable, and emotionally safe

## How
- All DreamState tests listed in `/cursor/intelligence/coverage/trust-dashboard.md` must:
  - Pass (status: COMPLETE)
  - Be free of drift/stale flags
  - Have a last pass timestamp within 7 days
- Any failure, drift, or staleness triggers:
  - CI failure (no merge, no deploy)
  - Log entry in `/logs/dreamstate-failures.log.md` (CodexMarkdownV2.1)
  - Emotional fallback and audit per Codex standards
- No bypass or disabling is permitted without explicit Codex Override and audit log

## Ritual Failure Log Format
See `/logs/dreamstate-failures.log.md` for canonical format and audit requirements.

## Codex Safeguards
- All enforcement is emotionally auditable, operator-voiced, and Codex-aligned
- Any attempt to bypass, silence, or degrade enforcement is a critical breach and must be logged
- This law is referenced by all CI, Sentinel, and operator review processes

_Empowerment Through Ease. — CanAI Codex v6.1.4_ 