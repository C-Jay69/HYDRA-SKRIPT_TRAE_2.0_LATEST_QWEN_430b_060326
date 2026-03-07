import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { getCreditContext } from '@/lib/services/creditService';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = await getCreditContext(session.user.id);

    // Add estimated costs for common operations
    const extendedContext = {
      ...context,
      estimatedCosts: {
        chapterGeneration: (wordCount: number) => 10 + Math.ceil(wordCount / 500),
        styleTraining: 15,
        continuityScan: 3,
        audiobookGeneration: (wordCount: number) => 50 + Math.ceil(wordCount / 1000)
      }
    };

    return NextResponse.json(extendedContext);
  } catch (error) {
    console.error('Get credit context error:', error);
    return NextResponse.json({ error: 'Failed to fetch credit context' }, { status: 500 });
  }
}
