import axios from 'axios';

interface OllamaOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/api';

export async function analyzeTextWithOllama(
  text: string,
  options: OllamaOptions = {}
): Promise<any> {
  const model = options.model || 'mistral:7b';

  try {
    const response = await axios.post(`${OLLAMA_BASE_URL}/generate`, {
      model: model,
      prompt: text,
      stream: false,
      options: {
        temperature: options.temperature || 0.7,
        num_predict: options.max_tokens || 1000
      }
    });

    return response.data;
  } catch (error) {
    console.error('Ollama analysis failed:', error);
    throw new Error('Failed to analyze text with Ollama');
  }
}

export async function generateTextWithOllama(
  prompt: string,
  options: OllamaOptions = {}
): Promise<string> {
  const model = options.model || 'llama3:8b';

  try {
    const response = await axios.post(`${OLLAMA_BASE_URL}/generate`, {
      model: model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: options.temperature || 0.8,
        num_predict: options.max_tokens || 500
      }
    });

    return response.data.response;
  } catch (error) {
    console.error('Ollama generation failed:', error);
    throw new Error('Failed to generate text with Ollama');
  }
}
