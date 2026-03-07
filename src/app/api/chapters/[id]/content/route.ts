import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';
import { checkAndAwardCredits } from '@/lib/services/creditService';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chapterId = params.id;
    const { content } = await request.json();

    // Verify chapter ownership
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { book: { include: { universe: true } } }
    });

    if (!chapter || chapter.book?.universe?.owner_id !== session.user.id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Calculate word count
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const aiContributionPercent = chapter.generation_source?.includes('ai')
      ? chapter.ai_contribution_percent || 50
      : 0;

    // Update chapter
    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        content,
        word_count: wordCount,
        ai_contribution_percent: aiContributionPercent
      }
    });

    // Check for daily writing credit eligibility
    const earnedCredits = await checkAndAwardCredits(session.user.id, 'daily_writing');

    return NextResponse.json({
      success: true,
      chapter: updatedChapter,
      creditsEarned: earnedCredits
    });
  } catch (error) {
    console.error('Update chapter content error:', error);
    return NextResponse.json({ error: 'Failed to update chapter content' }, { status: 500 });
  }
}
