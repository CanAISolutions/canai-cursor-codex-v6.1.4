// /cursor/config/loadConfig.ts
// Responsible for loading and validating agent config from `.cursorrules` and `.env`

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  trustScoreThreshold: z.number().min(0).max(10),
  githubConfig: z.object({
    token: z.string().nonempty("Missing GitHub token."),
    owner: z.string().nonempty("Missing GitHub repo owner."),
    repo: z.string().nonempty("Missing GitHub repo name."),
    baseBranch: z.string().nonempty("Missing base branch name."),
  }),
  eslintConfig: z.object({
    enabled: z.boolean(),
    configFile: z.string().default(".eslintrc.json"),
    maxErrors: z.number().min(0),
    errorPenalty: z.number().min(0),
  }),
  aiProviderConfig: z.object({
    apiKey: z.string().optional(),
    model: z.string().default("gpt-4"),
  }),
});

export type PipelineConfig = z.infer<typeof configSchema>;

export function loadConfig(): PipelineConfig {
  const configPath = path.resolve(process.cwd(), ".cursorrules");

  if (!fs.existsSync(configPath)) {
    throw new Error("❌ Missing .cursorrules file at project root.");
  }

  const raw = fs.readFileSync(configPath, "utf8");

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error("❌ Failed to parse .cursorrules — must be valid JSON.");
  }

  const injected = {
    ...parsed,
    githubConfig: {
      ...parsed.githubConfig,
      token: process.env.GITHUB_TOKEN || parsed.githubConfig?.token,
    },
    aiProviderConfig: {
      ...parsed.aiProviderConfig,
      apiKey: process.env.OPENAI_API_KEY || parsed.aiProviderConfig?.apiKey,
    },
  };

  return configSchema.parse(injected);
}
