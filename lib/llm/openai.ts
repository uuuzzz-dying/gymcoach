import {
  LlmError,
  type LlmCompletionRequest,
  type LlmCompletionResult,
  type LlmProvider,
} from './types';
import { extractCodexLbDelta, extractCodexLbText } from './codex-lb';

const RESPONSES_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-6-luna';
const DEFAULT_MAX_TOKENS = 8000;
const REQUEST_TIMEOUT_MS = 120_000;

interface OpenAiResponse {
  model?: string;
  output_text?: string;
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  error?: { message?: string };
}

export class OpenAiProvider implements LlmProvider {
  readonly id = 'openai' as const;
  readonly label = 'OpenAI';
  readonly apiKeyEnvVar = 'OPENAI_API_KEY';
  readonly model: string;
  private readonly apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY?.trim();
    this.model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  private async request(req: LlmCompletionRequest, stream: boolean): Promise<Response> {
    if (!this.apiKey) throw new LlmError(503, 'OPENAI_API_KEY is not configured.');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(RESPONSES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          instructions: req.system,
          input: req.messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          reasoning: { effort: 'low' },
          max_output_tokens: req.maxTokens ?? DEFAULT_MAX_TOKENS,
          store: false,
          stream,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new LlmError(response.status, `OpenAI ${response.status}: ${text.slice(0, 500)}`);
      }
      return response;
    } catch (error) {
      if (error instanceof LlmError) throw error;
      if (controller.signal.aborted) {
        throw new LlmError(504, 'OpenAI request timed out after 120 seconds.');
      }
      throw new LlmError(
        502,
        `Network failure to OpenAI: ${error instanceof Error ? error.message : 'unknown'}`,
      );
    } finally {
      clearTimeout(timer);
    }
  }

  async complete(req: LlmCompletionRequest): Promise<LlmCompletionResult> {
    const response = await this.request(req, false);
    const json = (await response.json()) as OpenAiResponse;
    if (json.error) throw new LlmError(502, `OpenAI: ${json.error.message ?? 'unknown error'}`);
    const text = extractCodexLbText(json);
    if (!text) throw new LlmError(502, 'OpenAI returned an empty response.');
    return { text, modelUsed: json.model ?? this.model };
  }

  async *stream(req: LlmCompletionRequest): AsyncIterable<string> {
    const response = await this.request(req, true);
    if (!response.body) throw new LlmError(502, 'OpenAI returned no response body.');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const delta = extractCodexLbDelta(line);
        if (delta) yield delta;
      }
    }
    const tail = extractCodexLbDelta(buffer + decoder.decode());
    if (tail) yield tail;
  }
}
