export type AIModelType = 'ollama' | 'google' | 'openrouter';

export interface AIModelConfig {
  id: string;
  name: string;
  provider: AIModelType;
  model_id: string;
  context_window: number;
  cost_per_token?: number;
}

export interface GenerationParams {
  model: string;
  prompt: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}
