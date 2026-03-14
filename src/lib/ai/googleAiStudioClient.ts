import axios from 'axios';

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || '';
const GOOGLE_AI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

interface GoogleAIOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export async function generateWithGoogleAI(
  prompt: string,
  options: GoogleAIOptions = {}
): Promise<string> {
  const model = options.model || 'gemini-pro';

  try {
    const response = await axios.post(
      `${GOOGLE_AI_BASE_URL}/models/${model}:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxOutputTokens || 2000,
        }
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const candidates = response.data.candidates;
    if (candidates && candidates.length > 0) {
      return candidates[0].content?.parts?.[0]?.text || '';
    }
    return '';
  } catch (error: any) {
    console.error('Google AI generation failed:', error?.response?.data || error.message);
    throw new Error(`Google AI generation failed: ${error.message}`);
  }
}

export async function generateTTSPreview(
  text: string,
  voiceId: string = 'en-US-Standard-A'
): Promise<Buffer> {
  // Gemini TTS preview - returns audio buffer
  // For V1, we use Google Cloud TTS via REST
  try {
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_AI_API_KEY}`,
      {
        input: { text: text.substring(0, 200) },
        voice: {
          languageCode: 'en-US',
          name: voiceId,
        },
        audioConfig: {
          audioEncoding: 'MP3',
        },
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    return Buffer.from(response.data.audioContent, 'base64');
  } catch (error: any) {
    console.error('TTS preview generation failed:', error?.response?.data || error.message);
    throw new Error(`TTS preview failed: ${error.message}`);
  }
}
