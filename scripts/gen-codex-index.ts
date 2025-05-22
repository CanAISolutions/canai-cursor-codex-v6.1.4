import { readFileSync, writeFileSync } from "fs";

const source = readFileSync("docs/codex-handover.md", "utf-8");
const lines = source.split("\n");

const index = lines
  .map((line, i) => {
    const match = line.match(/^## (.+)$/);
    if (!match) return null;
    const heading = match[1].trim();
    const anchor = heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return { heading, anchor, lineStart: i + 1 };
  })
  .filter(Boolean);

writeFileSync(
  "cursor/system-intel/codex-handover-index.json",
  JSON.stringify(index, null, 2)
);

console.log("✅ Codex index generated");
