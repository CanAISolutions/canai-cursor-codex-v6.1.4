# 📁 /cursor — Cursor Developer Cockpit

This folder powers:
- Codex-aligned AI coauthoring
- Prompt evolution & testing
- Fallback UX for reliability
- Cursor-native development workflows

---

## ✅ How to Use This Folder in Cursor

1. Open this folder in [Cursor](https://www.cursor.sh)
2. Use `Cmd+K` / `Ctrl+K` to run:
   - "Refactor this file"
   - "Explain this file"
   - "What changed between versions?"
3. Cursor will follow `.cursorrules` from project root
4. Run test diffs using `promptReplay.ts` or `deltaDiff.ts` (optional)

---

## 🔁 Core Files

| File                        | Purpose                                          |
|-----------------------------|--------------------------------------------------|
| `fallbackUX.ts`            | Graceful UX fallback messaging if GPT fails      |
| `promptEvolutionEngine.ts` | Compare, evolve, and regrade prompt logic        |
| `selfRefineScore.ts`       | Score an output for readability + alignment      |
| `promptReplay.ts`          | Re-run a stored input through new prompt logic   |
| `deltaDiff.ts`             | Text diffing tool for prompt versions            |

---

## 🧠 Dev Notes

- All files are markdown-commented, version-safe, and AI-editable
- Use this folder to **prototype, debug, and optimize prompt quality**
- Designed for single-dev, small team, or LLM copilots to evolve system logic

---

> Cursor is your AI-first coauthor. This folder makes it dangerous in the best way.
