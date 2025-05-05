/**
 * @file ai-provider.ts
 * @description Codex Edition v4.2.1 — Multi-provider AI engine for bug detection and patch generation.
 * Supports OpenAI by default. Claude-compatible scaffolding included.
 */

import { DebugConfig } from '../config';
import { appendToFixContextAsync } from '../fix-context-utils';
import OpenAI from 'openai';

// Future: import { ClaudeProvider } from './claude-provider';

/** Message format for chat-based AI models */
type AIMessage = { role: 'system' | 'user' | 'assistant'; content: string };

/** Represents an AI service implementation */
export interface AIProvider {
  ping(): Promise<boolean>;
  detectBug(log: string, traceId: string): Promise<BugContext>;
  proposeFix(bug: BugContext, traceId: string): Promise<FixProposal>;
  generateEscalationTicket(input: {
    summary: string;
    sourceFile?: string;
    priority?: 'low' | 'medium' | 'high';
    traceId?: string;
  }): Promise<void>;
}

export interface BugContext {
  message: string;
  type: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: string[];
  retryAttempts?: number;
}

export interface FixProposal {
  patch: string;
  filepath: string;
  reason: string;
  confidence?: number;
}

export const testOverrides = {
  aiProvider: null as AIProvider | null,
};

/**
 * OpenAI implementation of AIProvider interface.
 */
export class OpenAIProvider implements AIProvider {
  private config: DebugConfig;
  private openai: OpenAI;

  constructor(config: DebugConfig) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: this.config.aiProviderConfig?.apiKey,
    });
  }

  async ping(): Promise<boolean> {
    try {
      const models = await this.openai.models.list();
      return models.data.some(m => m.id === this.config.aiProviderConfig?.model);
    } catch (err: any) {
      await appendToFixContextAsync(`[ai-provider] Ping failed: ${err.message}`);
      return false;
    }
  }

  async detectBug(log: string, traceId: string): Promise<BugContext> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are a debugging assistant. Extract the most likely bug description, type, likelihood, and impacted files from this stack trace. Respond in JSON only.`,
      },
      {
        role: 'user',
        content: `Here is the log:\n\n${log}`,
      },
    ];

    try {
      const json = await this.callOpenAI(messages, traceId);
      const parsed = JSON.parse(json) as BugContext;

      if (!parsed.message || !parsed.type || !parsed.impact || !parsed.likelihood) {
        throw new Error('Invalid BugContext schema');
      }

      return parsed;
    } catch (err: any) {
      await appendToFixContextAsync(`[${traceId}] Bug detection failed: ${err.message}`);
      throw Object.assign(new Error(`Bug detection failed: ${err.message}`), { name: 'AIProviderError' });
    }
  }

  async proposeFix(bug: BugContext, traceId: string): Promise<FixProposal> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are a code patch generator. Generate a valid Git diff patch for the bug below, include the target filepath and a short reason. Output valid JSON.`,
      },
      {
        role: 'user',
        content: `Bug: ${bug.message}\nType: ${bug.type}\nLikely files: ${bug.impact.join(', ')}`,
      },
    ];

    try {
      const json = await this.callOpenAI(messages, traceId);
      const parsed = JSON.parse(json) as FixProposal;

      if (!parsed.patch || !parsed.filepath || !parsed.reason) {
        throw new Error('Invalid FixProposal schema');
      }

      return parsed;
    } catch (err: any) {
      await appendToFixContextAsync(`[${traceId}] Fix proposal failed: ${err.message}`);
      throw Object.assign(new Error(`Fix proposal failed: ${err.message}`), { name: 'AIProviderError' });
    }
  }

  async generateEscalationTicket({ summary, sourceFile, priority, traceId }: {
    summary: string;
    sourceFile?: string;
    priority?: 'low' | 'medium' | 'high';
    traceId?: string;
  }): Promise<void> {
    await appendToFixContextAsync(`[${
      traceId || 'ticket'
    }] [Escalation] Priority: ${priority ?? 'medium'}\nSummary: ${summary}\nSource: ${sourceFile ?? 'N/A'}`);
  }

  private async callOpenAI(messages: AIMessage[], traceId: string): Promise<string> {
    try {
      const model = this.config.aiProviderConfig?.model || 'gpt-4o';
      const temperature = this.config.defaults?.temperature ?? 0;

      const response = await this.openai.chat.completions.create({
        model,
        messages,
        temperature,
        response_format: 'text',
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No content returned from OpenAI');
      return content.trim();
    } catch (err: any) {
      await appendToFixContextAsync(`[${traceId}] OpenAI API error: ${err.message}`);
      throw Object.assign(new Error(`OpenAI API error: ${err.message}`), { name: 'AIProviderError' });
    }
  }
}

/**
 * Factory function for loading AI providers.
 */
export function loadAIProvider(config: DebugConfig, providerName = 'openai'): AIProvider {
  if (testOverrides.aiProvider) return testOverrides.aiProvider;

  switch (providerName) {
    case 'openai':
      return new OpenAIProvider(config);
    // case 'anthropic':
    //   return new ClaudeProvider(config);
    default:
      throw Object.assign(new Error(`Unknown AI provider: ${providerName}`), {
        errorType: 'validation',
        errorCode: 'INVALID_AI_PROVIDER',
      });
  }
}
