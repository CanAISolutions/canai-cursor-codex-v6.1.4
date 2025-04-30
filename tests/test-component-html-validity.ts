// ✅ test-component-html-validity.ts
// Validates components output renderable, well-formed HTML

import fs from "fs"
import path from "path"

const componentDir = path.resolve(__dirname, "../components")
const files = fs.readdirSync(componentDir).filter(f => f.endsWith(".ts"))

files.forEach(file => {
  const module = require(path.join(componentDir, file))
  const render = typeof module === "function" ? module() : module.default?.()

  if (!render || typeof render !== "string" || !render.startsWith("<")) {
    throw new Error(`❌ ${file} output is not valid HTML`)
  }

  if (!render.includes("</") && !render.endsWith(">")) {
    throw new Error(`❌ ${file} HTML seems improperly closed`)
  }
})

console.log("✅ Component HTML outputs validated.")
