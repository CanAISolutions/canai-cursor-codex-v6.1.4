import { readFileSync, writeFileSync } from "fs";

const srcPath = "docs/codex-handover.md";
const outPath = "cursor/system-intel/codex-handover-index.json";

const raw = readFileSync(srcPath, "utf-8");
const lines = raw.split("\n");

const normalize = (str: string) =>
  str
    .toLowerCase()
    .replace(/’/g, "'")                        // fix smart apostrophe
    .replace(/[^a-z0-9\s-]+/g, "")             // remove punctuation
    .replace(/\s+/g, "-")                      // space → dash
    .replace(/^-+|-+$/g, "");                  // trim leading/trailing dashes

const index = lines
  .map((line, i) => {
    const match = line.match(/^## (.+)$/);
    if (!match) return null;
    const heading = match[1].trim();
    const anchor = normalize(heading);
    return { heading, anchor, lineStart: i + 1 };
  })
  .filter(Boolean);

writeFileSync(outPath, JSON.stringify(index, null, 2));
console.log(`✅ Indexed ${index.length} anchors → ${outPath}`);
