import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

interface OpenRouterOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

const MODEL_MAP: Record<string, string> = {
  'claude-3.5-sonnet': 'anthropic/claude-3.5-sonnet',
  'gpt-4': 'openai/gpt-4',
  'gpt-4o': 'openai/gpt-4o',
  'gpt-4o-mini': 'openai/gpt-4o-mini',
  'claude-3-opus': 'anthropic/claude-3-opus',
  'mixtral-8x7b': 'mistralai/mixtral-8x7b-instruct',
  'llama-3-70b': 'meta-llama/llama-3-70b-instruct',
};

export async function generateWithOpenRouter(
  prompt: string,
  options: OpenRouterOptions = {}
): Promise<string> {
  const model = options.model || 'mistralai/mixtral-8x7b-instruct';
  const resolvedModel = MODEL_MAP[model] || model;

  try {
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: resolvedModel,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000,
        top_p: options.top_p || 1,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'HydraSkript',
        },
      }
    );

    return response.data.choices?.[0]?.message?.content || '';
  } catch (error: any) {
    console.error('OpenRouter generation failed:', error?.response?.data || error.message);
    throw new Error(`OpenRouter generation failed: ${error.message}`);
  }
}

export async function analyzeWithOpenRouter(
  prompt: string,
  options: OpenRouterOptions = {}
): Promise<any> {
  const text = await generateWithOpenRouter(prompt, {
    ...options,
    model: options.model || 'gpt-4o-mini',
    temperature: 0.3,
  });

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}
