---
title: Reality Check & Enforcement Crosswalk
version: 1.0.0
date: 2025-05-20
description: |
  Maps Codex pillars and enforcement layers to the corresponding folder 
  structure so auditors and agents know where to find or insert checks.
---

| Pillar / Aspect             | Folder Path                     | Enforcement Mechanism                            |
|-----------------------------|---------------------------------|--------------------------------------------------|
| Clarity                     | `/prompts/`                     | `.cursorrules` prompt-schema guardrails; tests.  |
| Privacy                     | `/utils/privacy/`               | PII redaction regex; privacy-compliance tests.   |
| Quality                     | `/tests/`                       | DreamState tests; coverage thresholds.           |
| Transparency                | `/docs/transparency/`           | Airtable cost/uptime dashboards.                 |
| Control                     | `/automations/`                 | Make scenarios; lifecycle triggers.              |
