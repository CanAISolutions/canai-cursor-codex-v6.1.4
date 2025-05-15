### 📘 log-rotation-protocol.md

**Purpose:**
Prevent memory overload in Cursor due to excessive log length, while preserving full historical visibility and audit integrity.

---

**Rotation Rules:**

1. Keep only the **two most recent SchemaEvents** in `auto-actions.log.md`.
2. Move all prior entries to `/cursor/system-intel/archived-schema-events.md`.
3. At the bottom of `auto-actions.log.md`, include a pointer:

   > 🔁 For earlier entries, see `/cursor/system-intel/archived-schema-events.md`

4. Never delete entries — only relocate with headers and timestamps.

---

**Archive Format (in archived-schema-events.md):**

```
## Archived Events — Timestamp: [YYYY-MM-DD]
- ReferralTriggers scaffolded
- DeliveryCostLogs scaffolded
...
```

---

**Why This Works:**
- Cursor stays in memory-safe range
- You keep a full permanent log (just not in active RAM)
- We get the best of both: *execution flow + traceability*