import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/database/prismaClient';
import { generateTextWithOllama } from '@/lib/ai/ollamaClient';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: 'Please sign in to continue' }, { status: 401 });
    }

    const chapterId = params.id;
    const {
      selectionStart,
      selectionEnd,
      assistType,
      selectionText,
      styleId
    } = await request.json();

    // Verify chapter ownership
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { book: { include: { universe: true } } }
    });

    if (!chapter || chapter.book?.universe?.owner_id !== user.id) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    // Get style profile if provided
    let styleProfile = null;
    if (styleId) {
      styleProfile = await prisma.style.findUnique({
        where: { id: styleId }
      });
    }

    // Generate AI assistance based on type
    let prompt = "";

    switch (assistType) {
      case 'expand':
        prompt = `Expand this passage in the author's style:\n\n${selectionText}\n\nContinue naturally:`;
        break;
      case 'rephrase':
        prompt = `Rephrase this passage while maintaining meaning:\n\n${selectionText}`;
        break;
      case 'continue':
        prompt = `Continue this story from this point:\n\n${selectionText}\n\nNext paragraph:`;
        break;
      case 'add_dialogue':
        prompt = `Add natural dialogue to this scene:\n\n${selectionText}\n\nInclude character voices:`;
        break;
      case 'deepen_description':
        prompt = `Enhance the descriptive details in this passage:\n\n${selectionText}\n\nRicher description:`;
        break;
      default:
        prompt = `Assist with this text:\n\n${selectionText}`;
    }

    // Add style guidance if available
    if (styleProfile && styleProfile.training_status === 'ready') {
      prompt = `
        Style Guide:
        - POV: ${styleProfile.pov_preference}
        - Tense: ${styleProfile.tense_preference}
        - Dialogue Ratio: ${Math.round((styleProfile.dialogue_ratio || 0) * 100)}%

        ${prompt}
      `;
    }

    // Generate assistance with Ollama
    const assistance = await generateTextWithOllama(prompt, {
      model: 'llama3:8b',
      temperature: 0.7,
      max_tokens: 300
    });

    return NextResponse.json({
      suggestedText: assistance,
      assistType: assistType
    });
  } catch (error) {
    console.error('AI assistance error:', error);
    return NextResponse.json({ message: 'Failed to generate AI assistance' }, { status: 500 });
  }
}
