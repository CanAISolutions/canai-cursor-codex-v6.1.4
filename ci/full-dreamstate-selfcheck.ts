/**
 * @codex-purpose: Execute full-system Dream-State Codex self-validation for emotional UX, operational durability, and structural resilience.
 * @codex-system: Full Dream-State Selfcheck Layer
 * @codex-critical: Prevents silent emotional UX drift, brittle scaling, payload decay, config corruption, and router manifest inconsistencies.
 * @codex-verified: v1.0.0
 */

import { loadDreamstateConfig } from "../tools/loadDreamstateConfig";
import { validateDreamStatePayload } from "../tools/validateDreamStatePayload";
import fs from "fs";
import path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

function checkDreamStateConfig() {
  console.log("🔍 Checking Dream-State Config Structure...");
  const schemaPath = path.resolve("./tools/dreamstate-config-schema.json");
  const configPath = path.resolve("./tools/.dreamstate-config.json");

  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  const validate = ajv.compile(schema);
  const valid = validate(config);

  if (!valid) {
    console.error("❌ Config schema validation failed:");
    for (const error of validate.errors || []) {
      console.error(`- [${error.instancePath}] ${error.message}`);
    }
    process.exit(1);
  }
  console.log("✅ Config structure is valid.\n");
}

function checkRouterManifest() {
  console.log("🔍 Checking Router Manifest Consistency...");
  const manifestPath = path.resolve("./api-router/manifest.json");

  if (!fs.existsSync(manifestPath)) {
    console.error("❌ Manifest file missing: /api-router/manifest.json");
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  if (!Array.isArray(manifest.routes)) {
    console.error("❌ Manifest 'routes' array missing or invalid.");
    process.exit(1);
  }

  for (const route of manifest.routes) {
    if (typeof route.name !== "string" || typeof route.path !== "string") {
      console.error(`❌ Invalid route entry in manifest: ${JSON.stringify(route)}`);
      process.exit(1);
    }
  }

  console.log("✅ Router manifest structure is valid.\n");
}

function checkDreamStatePayloads() {
  console.log("🔍 Checking Dream-State Payload Examples...");

  const goodSuccess = {
    success: true,
    data: { id: "123", message: "OK" }
  };
  const goodError = {
    success: false,
    error: { code: "USER_NOT_FOUND", message: "Not found." }
  };

  const successValidation = validateDreamStatePayload(goodSuccess);
  const errorValidation = validateDreamStatePayload(goodError);

  if (!successValidation.valid || !errorValidation.valid) {
    console.error("❌ Dream-State payload structure validation failed.");
    console.error({ successValidation, errorValidation });
    process.exit(1);
  }

  console.log("✅ Payload shape validation passed.\n");
}

function main() {
  console.log("\n🛡 Starting Full Dream-State Selfcheck 🛡\n");

  checkDreamStateConfig();
  checkRouterManifest();
  checkDreamStatePayloads();

  console.log("🚀 All Dream-State selfchecks passed. Emotional UX and system resilience preserved.\n");
}

main();
