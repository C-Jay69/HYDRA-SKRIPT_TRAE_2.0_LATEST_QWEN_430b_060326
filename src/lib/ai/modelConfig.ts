import { AIModelConfig } from '@/types/aiModels';

export const AI_MODELS: AIModelConfig[] = [
  {
    id: 'ollama-mistral',
    name: 'Mistral 7B (Ollama)',
    provider: 'ollama',
    model_id: 'mistral:7b',
    context_window: 8192
  },
  {
    id: 'ollama-llama3',
    name: 'Llama 3 8B (Ollama)',
    provider: 'ollama',
    model_id: 'llama3:8b',
    context_window: 8192
  },
  {
    id: 'google-gemini-pro',
    name: 'Gemini Pro (Google AI Studio)',
    provider: 'google',
    model_id: 'gemini-pro',
    context_window: 32768
  },
  {
    id: 'openrouter-mixtral',
    name: 'Mixtral 8x7B (OpenRouter)',
    provider: 'openrouter',
    model_id: 'mistralai/mixtral-8x7b-instruct',
    context_window: 32768
  }
];

export function getModelConfig(modelId: string): AIModelConfig | undefined {
  return AI_MODELS.find(model => model.id === modelId);
}
