# Cursor Debugging Agent – Behavior Contract

**Version:** 4.1.3  
**Codex Type:** debug-agent  
**Maintainer:** CanAI Solutions  
**Purpose:** Automate detection, patching, auditing, and secure PR creation for code errors using AI + Git.

---

## 🔐 Execution Guarantees

- **Deterministic Configuration**  
  Loads values from `.cursorrules` and environment variables. Validates before runtime.

- **Safe Shell Execution**  
  All Git commands are sanitized (`sanitizeShellInput`) and timed out.

- **PII Protection**  
  Sensitive info (e.g. API keys, emails) is redacted before logs reach the AI layer (`maskSensitive.ts`).

- **Audit Trail**  
  All events are timestamped and written to `.canai-context/fix.log`.  
  Metrics are written to `.canai-context/metrics.json`.

- **Non-Destructive Merge Logic**  
  Automatically stashes current work and rolls back cleanly on failure (`git stash`, `git reset --hard`).

---

## 🛡 Guardrails

| Guardrail | Description |
|----------|-------------|
| **Trust Scoring** | Rejects fixes with score < `trustScoreThreshold` (default: 4.2). Factors: confidence, patch size/complexity, ESLint. |
| **Patch Size Limit** | Rejects patches over 1000 lines. |
| **Sensitive File Filter** | Blocks patches targeting `.env`, `package.json`, `secrets.json`, etc. |
| **PR Safety** | All patches are pushed to a branch and opened as a PR. Never merges directly to `main`. |
| **AI Failure Fallback** | If AI fails, uses regex-based detection (`blast-mapper.ts`). |
| **ESLint Penalty** | Static analysis failures lower the trust score (default penalty: `-1.0`). |

---

## 🧯 Fallback Logic

- If **AI detection fails** → fallback to regex (`fallbackMode=true`)
- If **merge fails** → full rollback (`git reset`, `git stash pop`)
- If **PR fails** → error returned with recovery instruction
- If **config invalid** → fallbacks to `DEFAULTS` in `config.ts`
- If **timeout or abort** → pipeline cancels with safe recovery metadata

---

## ✅ Validation Contract (No Assumptions)

The agent performs the following checks **before execution begins**:

| Check | Action if Failed |
|-------|------------------|
| `git rev-parse --is-inside-work-tree` | Exits with error: “Not a valid Git repository.” |
| `git status --porcelain` | If not clean: stashes and logs warning |
| `GITHUB_TOKEN` present | Fails with message: “GitHub token not found in environment.” |
| `.cursorrules` file exists | If missing: uses defaults and logs a CodexConfig warning |
| Node.js version ≥16 | Exits if invalid, logs current version |
| Git version ≥2.30 | Exits if invalid |
| TypeScript version ≥5.0 | Warns if invalid but continues |
| AI provider API key present | If missing: disables AI features and logs fallback mode |

This contract guarantees the agent always operates with verified context or falls back safely.

---

## ⚠️ Limitations

- Detects only known `BugType` enum values: `NullPointer`, `TypeError`, `SyntaxError`, etc.
- Only supports single-file patch application (multi-file support planned).
- OpenAI provider requires valid API key in `.cursorrules` → `aiProviderConfig.apiKey`.

---

## 🧠 Self-Awareness Mode

This agent will **log all failures**, **emit a recovery path**, and **escalate** unresolvable bugs via ticketing (`createEscalationTicket`). It will **never** silently fail.

---

_Last updated: 2025-05-04 • Codex v6.1.4 compliant • Maintained by CanAI_
