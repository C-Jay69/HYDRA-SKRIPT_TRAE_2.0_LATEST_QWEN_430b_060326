import { prisma } from '@/lib/database/prismaClient';
import { analyzeTextWithOllama } from '@/lib/ai/ollamaClient';
import { generateEmbedding } from '@/lib/utils/vectorUtils';
import logger from '@/lib/utils/logger';

interface StyleAnalysisResult {
  sentencePatterns: any[];
  vocabularyProfile: any;
  pacingMetrics: any;
  povConsistency: string;
  tenseUsage: string;
  dialogueCharacteristics: any;
  favoritePhrases: string[];
  paragraphStructure: any;
  sentenceLengthAvg: number;
  complexityScore: number;
  vocabularyRichness: number;
  dialogueRatio: number;
  paragraphLengthAvg: number;
  pacingProfile: any;
  povPreference: string;
  tensePreference: string;
  genreSpecialization: string;
}

export class StyleTrainingEngine {
  static async analyzeAuthorStyle(
    ownerId: string,
    styleId: string,
    sampleTextPaths: string[],
    progressCallback?: (progress: number, message: string) => void
  ): Promise<StyleAnalysisResult> {
    progressCallback?.(10, "Loading your writing samples...");

    // Load sample texts from storage
    const sampleTexts = await this.loadSampleTexts(sampleTextPaths);

    progressCallback?.(20, "Analyzing sentence structures...");

    // Analyze with Ollama model (using mixtral:8x7b or similar)
    const analysisResults = await Promise.all(
      sampleTexts.map(async (text, index) => {
        progressCallback?.(20 + (index * 20 / sampleTexts.length),
          `Analyzing sample ${index + 1} of ${sampleTexts.length}...`);
        return await analyzeTextWithOllama(text);
      })
    );

    progressCallback?.(60, "Extracting linguistic patterns...");

    // Consolidate results
    const consolidatedAnalysis = this.consolidateAnalysisResults(analysisResults);

    progressCallback?.(80, "Creating your unique voice profile...");

    // Generate style embedding
    const styleEmbedding = await generateEmbedding(JSON.stringify(consolidatedAnalysis));

    // Save to database
    await prisma.style.update({
      where: { id: styleId },
      data: {
        training_status: 'ready',
        training_completed_at: new Date(),
        sentence_length_avg: consolidatedAnalysis.sentenceLengthAvg,
        complexity_score: consolidatedAnalysis.complexityScore,
        vocabulary_richness: consolidatedAnalysis.vocabularyRichness,
        dialogue_ratio: consolidatedAnalysis.dialogueRatio,
        paragraph_length_avg: consolidatedAnalysis.paragraphLengthAvg,
        favorite_phrases: consolidatedAnalysis.favoritePhrases,
        pacing_profile: consolidatedAnalysis.pacingProfile,
        pov_preference: consolidatedAnalysis.povPreference,
        tense_preference: consolidatedAnalysis.tensePreference,
        style_embedding: styleEmbedding,
        genre_specialization: consolidatedAnalysis.genreSpecialization
      }
    });

    progressCallback?.(100, "Style training complete! Your voice profile is ready.");

    return consolidatedAnalysis;
  }

  static async generateValidationSample(
    styleId: string,
    wordCount: number = 500
  ): Promise<string> {
    const style = await prisma.style.findUnique({
      where: { id: styleId }
    });

    if (!style) throw new Error('Style not found');

    // Use Ollama to generate sample text matching the style
    const prompt = `
      Write a ${wordCount}-word passage in the style described by these characteristics:

      Sentence Length Average: ${style.sentence_length_avg}
      Complexity Score: ${style.complexity_score}
      Vocabulary Richness: ${style.vocabulary_richness}
      Dialogue Ratio: ${style.dialogue_ratio}
      Favorite Phrases: ${style.favorite_phrases?.join(', ')}
      POV Preference: ${style.pov_preference}
      Tense Preference: ${style.tense_preference}

      Genre: ${style.genre_specialization}

      Begin with: "The morning mist clung to the ancient stones..."
    `;

    // Generate with appropriate model
    const generatedText = await analyzeTextWithOllama(prompt, {
      model: 'llama3:8b', // Cost-effective model for generation
      temperature: 0.7,
      max_tokens: wordCount * 5 // Approximate token count
    });

    return generatedText.response;
  }

  private static async loadSampleTexts(paths: string[]): Promise<string[]> {
    // In production, this would load from Cloudflare R2
    // For now, returning mock implementation
    return paths.map(path => `Sample text content from ${path}`);
  }

  private static consolidateAnalysisResults(results: any[]): StyleAnalysisResult {
    // Simplified consolidation logic
    const combined: StyleAnalysisResult = {
      sentencePatterns: [],
      vocabularyProfile: {},
      pacingMetrics: {},
      povConsistency: '',
      tenseUsage: '',
      dialogueCharacteristics: {},
      favoritePhrases: [],
      paragraphStructure: {},
      sentenceLengthAvg: 15.5,
      complexityScore: 0.75,
      vocabularyRichness: 0.8,
      dialogueRatio: 0.3,
      paragraphLengthAvg: 4.2,
      pacingProfile: {},
      povPreference: 'third_limited',
      tensePreference: 'past',
      genreSpecialization: 'fantasy'
    };

    // Combine all results (simplified)
    results.forEach(result => {
      combined.sentencePatterns.push(...(result.sentencePatterns || []));
      combined.favoritePhrases.push(...(result.favoritePhrases || []));
      // Merge other properties...
    });

    return combined;
  }
}

export async function analyzeAuthorStyle(
  ownerId: string,
  styleId: string,
  sampleTextPaths: string[],
  progressCallback?: (progress: number, message: string) => void
): Promise<StyleAnalysisResult> {
  return StyleTrainingEngine.analyzeAuthorStyle(ownerId, styleId, sampleTextPaths, progressCallback);
}

export async function generateValidationSample(
  styleId: string,
  wordCount?: number
): Promise<string> {
  return StyleTrainingEngine.generateValidationSample(styleId, wordCount);
}
