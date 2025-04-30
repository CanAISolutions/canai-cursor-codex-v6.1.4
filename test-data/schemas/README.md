# 🧠 Schema Contracts (`/test-data/schemas/`)

## ✅ Purpose
This folder defines the **permanent structural rules** that govern:
- Prompt inputs
- Enhancer logic
- Feedback logging
- Session analytics
- Cost thresholds
- Snapshot validation

Every `.json` file here is a **system-critical contract**.  
Nothing is temporary. Every schema defines how the CanAI system operates, scales, recovers, and evolves.

---

## 📂 File Index

| File Name                     | Description                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| `copilot-snapshot-rules.json`| Defines snapshot assertions and pass/fail logic for Copilot + CI            |
| `enhancer-logic-schema.json` | Declares required inputs/outputs per enhancer module                        |
| `fallback-scenario-schema.json`| Standard structure for fallback event logs and recovery triggers         |
| `feedback-schema.json`       | Post-output user feedback structure (rating, revision reason, emotion tag) |
| `field-map-schema.json`      | Canonical list of allowed input fields across promptTypes and enhancers     |
| `prompt-output-shape-schema.json`| Output structure contract for every promptType                          |
| `prompt-type-rules.json`     | Required fields and enhancer paths per promptType                          |
| `session-metadata-schema.json`| Canonical structure for every fulfilled prompt session                    |
| `token-cost-thresholds.json` | Token and cost ceilings per promptType to prevent silent overages          |

---

## 🧪 Usage

### For QA / Copilot
- Autogenerates snapshot tests and input validators
- Helps Copilot know what makes a promptType valid
- Flags missing data or schema mismatches in real time

### For CI Pipelines
- Ensures no drift across promptType logic or cost safety
- Triggers fails early if schemas are broken or incomplete

---

## 🛡 Codex Principles

- **Every schema must be versioned and AI-readable**
- **All input/output/feedback must pass snapshot diff validation**
- **Nothing leaves this folder unless it protects system trust**

> _“Schema is not support logic. Schema is survival logic.”_

---

## 🔄 Version Sync

All files verified against:  
**Codex v1.4.2**

