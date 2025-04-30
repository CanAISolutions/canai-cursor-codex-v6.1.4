# 📚 Benchmark History Schema

> Defines the structure of stored benchmark snapshots inside /analytics/benchmark-history/

---

## 🔖 Snapshot File Naming Convention
benchmark-YYYY-MM-DD.json

yaml
Copy
Edit

Example: `benchmark-2025-04-29.json`

---

## 📐 Snapshot JSON Structure

```jsonc
{
  "timestamp": "2025-04-29T00:00:00.000Z",
  "averages": {
    "clarity": 8.2,
    "depth": 7.9,
    "emotion": 8.5,
    "facts": 8.1,
    "codex": 8.8
  },
  "driftDetected": false,
  "triggeredEvolution": false,
  "notes": "Strategic Depth flagged for close monitoring."
}