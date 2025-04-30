# 🧠 Prompt Input Registry (`/test-data/prompts/`)

## ✅ Purpose
This folder contains the **canonical input files** for every supported `promptType` in CanAI. Each input is snapshot-safe, regression-ready, and intentionally designed to:

- Validate full schema structure for its `promptType`
- Power automated prompt tests, Copilot previews, and fallback demos
- Ensure consistency across Make scenarios, GPT fulfillment, and UX presets

---

## 📂 File Index

| Prompt Type         | File Name                        | Status     |
|---------------------|----------------------------------|------------|
| `ai_blueprint`      | `ai-blueprint.input.json`        | ✅ LOCKED  |
| `ai_brand_identity` | `ai-brand-identity.input.json`   | ✅ LOCKED  |
| `business_plan`     | `business-plan.input.json`       | ✅ LOCKED  |
| `email_campaign`    | `email-campaign.input.json`      | ✅ LOCKED  |
| `reverse_strategy`  | `reverse-strategy.input.json`    | ✅ LOCKED  |
| `site_audit`        | `site-audit.input.json`          | ✅ LOCKED  |
| `social_content`    | `social-content.input.json`      | ✅ LOCKED  |

---

## 🧪 Usage

### For Snapshot Tests
These files power input-structure validation for:
- `prompt-engine.test.ts`
- PromptLogs schema matchers
- Regression testing of field usage and token costs

### For Copilot Tools
These inputs are used to:
- Generate previews for end users
- Validate tone, length, and content style
- Simulate Make and webhook fulfillment paths

---

## 🛡 Codex Safety Standards

Each input follows Codex Gold Standards:
- Flat JSON structure (no `inputShape` wrapping)
- Core Required Fields: `promptType`, `industry`, `audience`, `tone`, `goal`, `productOrService`, `brandName`, `founderName`, `promptInput`
- Optional Enhancer Fields for richer outputs
- Top-level `@codex-*` headers for audit and AI traceability
- `_meta` block for snapshot compatibility and system evolution tracking

> _If it’s in here, it’s safe to test, snapshot, evolve, and ship._

---

## 🔄 Version
All files verified against:  
**Codex v1.4.2**
