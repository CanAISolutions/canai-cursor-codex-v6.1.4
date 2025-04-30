# 🔁 Smart Revision Loop (Codex-Enforced)

## Purpose  
A recursive, self-improving feedback system that detects drift, analyzes deltas, and initiates safe, emotionally-aware revisions of outputs or systems — with Copilot or AI agent support.

---

## 🔐 Entry Criteria (Triggers)

- `output-delta-analyzer.ts` detects `majorChangeDetected: true`
- `emotionalDriftPredictor.ts` returns `driftRiskLevel: high` or `critical`
- `dreamTrendAnalyzer.ts` shows negative momentum
- Codex directive evolution requires downstream adaptation
- Manual override or system QA flag is raised

---

## 🧠 Loop Stages

### 1. Detection  
Triggered by one or more entry signals.  
→ Log issue type: `emotional`, `semantic`, `modular`, `codex`.

### 2. Analysis  
Use:
- `output-delta-analyzer.ts`
- `dreamstate-utils.ts`
- `codexExpansionAgent.ts`  
→ Output structured diff + confidence score.

### 3. Suggestion  
Call:
- `promptReplay.ts` (if applicable)
- `recommendation-utils.ts`  
→ Suggest exact revision tactic (`prompt-tune`, `restructure`, `increase-warmth`, etc.)

### 4. Revision  
Run:
- `promptEvolutionEngine.ts`
- or Copilot/human to apply fix.  
→ Log changes in `selfRefineScore.ts` and `session-delta-tracker`.

### 5. Validation  
Post-revision:
- Re-run `output-delta-analyzer.ts`
- Score via `calculateEmotionalResonanceScore()`  
→ Accept if improvement ≥ threshold, else loop again.

---

## 🧪 Safety Guards

- Limit loop count per session (default: 3)
- Auto-abort if emotional score drops by >5 twice in a row
- Manual override always available
- All revision logs stored in `sessionRefactorLog.json`

---

## ✅ Goals

- Protect UX emotional resonance under change
- Evolve prompts safely
- Prevent silent quality regressions
- Codify system improvement as perpetual discipline

---

## 🧭 Copilot Design Note

Each stage emits structured data.  
Copilots can orchestrate or validate this loop with high reliability.  
LLMs should never revise blindly — always via delta-aware, emotionally-scored, and Codex-aligned flow.

---

# Codex is not just enforced — it is evolved. Revision is the ritual.
