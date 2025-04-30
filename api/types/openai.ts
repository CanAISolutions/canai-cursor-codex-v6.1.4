/**
 * @file openai.ts
 * @description Types and interfaces for OpenAI prompt fulfillment operations.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

/**
 * Supported OpenAI model types.
 */
export type OpenAIModel =
  | "gpt-3.5-turbo"
  | "gpt-4"
  | "gpt-4-turbo";

/**
 * Payload for sending a prompt to OpenAI.
 */
export interface OpenAIRequestPayload {
  model: OpenAIModel;
  prompt: string;
  temperature?: number; // Optional creativity control (default 0.7)
  maxTokens?: number;   // Optional output length control
}

/**
 * Structured output from OpenAI after fulfillment.
 */
export interface OpenAIResponsePayload {
  id: string;
  object: string;
  created: number;
  model: OpenAIModel;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
}
