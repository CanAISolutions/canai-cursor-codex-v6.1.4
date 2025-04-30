/**
 * @codex-purpose: CI/CD safe validator for Dream-State configuration JSON against schema compliance.
 * @codex-system: Dream-State CI/CD Validation Layer
 * @codex-critical: Prevents emotionally unsafe or structurally brittle config mutations from reaching production.
 * @codex-verified: v1.0.0
 */

import fs from "fs";
import path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

function loadJsonFile(filePath: string) {
  const absolutePath = path.resolve(filePath);
  const raw = fs.readFileSync(absolutePath, "utf-8");
  return JSON.parse(raw);
}

function main() {
  try {
    const schema = loadJsonFile("./tools/dreamstate-config-schema.json");
    const config = loadJsonFile("./tools/.dreamstate-config.json");

    const validate = ajv.compile(schema);
    const valid = validate(config);

    if (!valid) {
      console.error("\n❌ Dream-State Config Validation Failed ❌\n");

      for (const error of validate.errors || []) {
        console.error(`- [${error.instancePath}] ${error.message}`);
      }

      console.error("\nPlease fix the above issues in /tools/.dreamstate-config.json before merging.\n");
      process.exit(1); // Fail the CI run
    }

    console.log("✅ Dream-State Config Validation Passed — Emotional UX and System Resilience Protected.");
    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Critical Error During Dream-State Config Validation ❌");
    console.error(error.message);
    process.exit(1);
  }
}

main();
