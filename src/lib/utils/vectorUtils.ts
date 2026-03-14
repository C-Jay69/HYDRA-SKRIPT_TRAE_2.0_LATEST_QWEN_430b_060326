/**
 * Vector/Embedding Utilities
 * Uses Google AI (Gemini) embedding API instead of local ONNX models
 * to keep the build Vercel-compatible and avoid native binary issues.
 * Falls back to a simple hash-based pseudo-embedding if the API is unavailable.
 */

const EMBEDDING_DIM = 768; // text-embedding-004 dimension

/**
 * Generate an embedding vector using Google AI Studio embedding API.
 * Returns a Buffer of float32 values (for storage in Prisma Bytes column / pgvector).
 */
export async function generateEmbedding(text: string): Promise<Buffer> {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_STUDIO_KEY;
    if (!apiKey) {
      console.warn('No Google AI API key found – using fallback hash embedding');
      return hashEmbedding(text);
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: { parts: [{ text }] },
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      console.warn('Embedding API returned non-OK:', res.status, errBody);
      return hashEmbedding(text);
    }

    const data = await res.json();
    const values: number[] = data?.embedding?.values ?? [];

    if (values.length === 0) {
      return hashEmbedding(text);
    }

    // Pack float32 array into a Node Buffer
    const buffer = Buffer.alloc(values.length * 4);
    for (let i = 0; i < values.length; i++) {
      buffer.writeFloatLE(values[i], i * 4);
    }
    return buffer;
  } catch (err) {
    console.warn('generateEmbedding failed, using fallback:', err);
    return hashEmbedding(text);
  }
}

/**
 * Deterministic hash-based pseudo-embedding (fallback when API is unavailable).
 * NOT semantically meaningful – only useful so the rest of the pipeline doesn't break.
 */
function hashEmbedding(text: string): Buffer {
  const buffer = Buffer.alloc(EMBEDDING_DIM * 4);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  const rng = mulberry32(hash >>> 0);
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    buffer.writeFloatLE((rng() - 0.5) * 2, i * 4);
  }
  return buffer;
}

/** Simple seeded PRNG */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Search for similar vectors via pgvector.
 * In production, runs a raw SQL query against Supabase with the <=> operator.
 */
export async function findSimilarVectors(
  queryEmbedding: Buffer,
  collection: string,
  limit: number = 10
): Promise<any[]> {
  // TODO: implement actual pgvector cosine-distance query via Supabase
  console.log(`[vectorUtils] Searching similar vectors in "${collection}" (limit ${limit})`);
  return [];
}
