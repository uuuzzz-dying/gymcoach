import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenAiProvider } from './openai';

const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const key of ['OPENAI_API_KEY', 'OPENAI_MODEL']) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of ['OPENAI_API_KEY', 'OPENAI_MODEL']) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  vi.unstubAllGlobals();
});

describe('OpenAiProvider', () => {
  it('requires a server-side API key', async () => {
    const provider = new OpenAiProvider();
    expect(provider.isConfigured()).toBe(false);
    await expect(
      provider.complete({ system: 'coach', messages: [{ role: 'user', content: 'plan' }] }),
    ).rejects.toMatchObject({ status: 503 });
  });

  it('uses the Responses API without server-side response storage', async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.OPENAI_MODEL = 'gpt-test';
    const fetchMock = vi.fn(
      async (_url: string, _init: RequestInit) =>
        new Response(JSON.stringify({ model: 'gpt-test', output_text: ' plan ' }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await new OpenAiProvider().complete({
      system: 'coach',
      messages: [{ role: 'user', content: 'make a plan' }],
      maxTokens: 1234,
    });

    expect(result).toEqual({ text: 'plan', modelUsed: 'gpt-test' });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://api.openai.com/v1/responses');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer test-key');
    expect(JSON.parse(init.body as string)).toMatchObject({
      model: 'gpt-test',
      store: false,
      stream: false,
      max_output_tokens: 1234,
      reasoning: { effort: 'low' },
    });
  });
});
